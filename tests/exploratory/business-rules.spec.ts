import { test, expect, backpack } from '../../support/fixtures';

test('CHECK-06 proposed rule: prevent completing an empty order', async ({
  page,
  login,
  shop,
  checkout,
}) => {
  await login.signIn();
  await shop.openCart();
  await expect(shop.items).toHaveCount(0);
  const button = page.getByRole('button', { name: 'Checkout', exact: true });
  if (await button.isDisabled()) {
    await expect(button).toBeDisabled();
    return;
  }
  await checkout.start();
  await checkout.review();
  const finish = page.getByRole('button', { name: 'Finish', exact: true });
  if (await finish.isDisabled()) {
    await expect(finish).toBeDisabled();
    return;
  }
  await finish.click();
  // Wait for an observable outcome before negative assertions; avoid a false pass during navigation.
  await expect
    .poll(
      async () =>
        (await page.getByTestId('complete-header').isVisible()) ||
        (await checkout.error.isVisible()),
    )
    .toBe(true);
  await expect(page.getByTestId('complete-header')).toHaveCount(0);
  await expect(checkout.error).toBeVisible();
});

for (const username of ['problem_user', 'error_user']) {
  test(`PERSONA-01 ${username} sort Z-A and remove added item`, async ({
    page,
    login,
    shop,
  }, testInfo) => {
    await login.signIn(username);
    await expect(shop.items).toHaveCount(6);
    const initial = await shop.names.allTextContents();
    const expected = [...initial].sort((a, b) => b.localeCompare(a, 'en', { sensitivity: 'base' }));
    const dialogs: string[] = [];
    page.on('dialog', async (d) => {
      dialogs.push(d.message());
      await d.dismiss();
    });
    await shop.sort.selectOption('za');
    await testInfo.attach('persona-sort', {
      body: JSON.stringify(
        { username, initial, expected, actual: await shop.names.allTextContents(), dialogs },
        null,
        2,
      ),
      contentType: 'application/json',
    });
    await expect.soft(shop.names).toHaveText(expected);
    await shop.add(backpack);
    await shop.openCart();
    await expect(shop.names).toHaveText([backpack]);
    await shop.remove(backpack);
    await expect(shop.items).toHaveCount(0);
  });
}

test('CHECK-07 refresh and repeated Finish attempt - UI observation only', async ({
  page,
  login,
  shop,
  checkout,
}, testInfo) => {
  await login.signIn();
  await shop.add(backpack);
  await shop.openCart();
  await checkout.start();
  await checkout.review();
  // Two rapid pointer clicks, without forcing a removed element or changing application state.
  await page.getByRole('button', { name: 'Finish', exact: true }).click({ clickCount: 2 });
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  await page.reload();
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  await expect(shop.badge).toHaveCount(0);
  await testInfo.attach('completion-after-refresh', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});
