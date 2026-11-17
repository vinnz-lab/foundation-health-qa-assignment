import AxeBuilder from '@axe-core/playwright';
import { test, expect, backpack } from '../support/fixtures';

for (const screen of ['login', 'inventory', 'cart', 'checkout', 'checkout-errors']) {
  test(`A11Y-01 axe WCAG A/AA scan: ${screen}`, async ({
    page,
    login,
    shop,
    checkout,
  }, testInfo) => {
    if (screen === 'login') await login.open();
    else {
      await login.signIn();
      if (['cart', 'checkout', 'checkout-errors'].includes(screen)) {
        await shop.add(backpack);
        await shop.openCart();
      }
      if (screen.startsWith('checkout')) await checkout.start();
      if (screen === 'checkout-errors') {
        await checkout.continueButton.click();
        await expect(checkout.error).toBeVisible();
      }
    }
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    await testInfo.attach('axe-results', {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
        null,
        2,
      ),
    ).toEqual([]);
  });
}

test('A11Y-02 login fields work in keyboard order with accessible names', async ({
  page,
  login,
}) => {
  await login.open();
  await expect(login.username).toHaveAccessibleName(/username/i);
  await expect(login.password).toHaveAccessibleName(/password/i);
  await page.keyboard.press('Tab');
  await expect(login.username).toBeFocused();
  await page.keyboard.type('standard_user');
  await page.keyboard.press('Tab');
  await expect(login.password).toBeFocused();
  await page.keyboard.type('secret_sauce');
  await page.keyboard.press('Tab');
  await expect(login.submit).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('title')).toHaveText('Products');
});

test('A11Y-03 checkout keyboard order and focus evidence', async ({
  page,
  login,
  shop,
  checkout,
}, testInfo) => {
  await login.signIn();
  await shop.add(backpack);
  await shop.openCart();
  await checkout.start();
  await checkout.firstName.focus();
  await expect(checkout.firstName).toBeFocused();
  await page.keyboard.type('Alex');
  await page.keyboard.press('Tab');
  await expect(checkout.lastName).toBeFocused();
  await page.keyboard.type('Tester');
  await page.keyboard.press('Tab');
  await expect(checkout.postalCode).toBeFocused();
  await page.keyboard.type('02108');
  await testInfo.attach('postal-code-keyboard-focus', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(checkout.continueButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');
});
