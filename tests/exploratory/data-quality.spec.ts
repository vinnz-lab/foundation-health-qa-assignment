import { test, expect, backpack } from '../../support/fixtures';
import { validCustomer } from '../../pages/checkout-page';

test.beforeEach(async ({ login, shop, checkout }) => {
  await login.signIn();
  await shop.add(backpack);
  await shop.openCart();
  await checkout.start();
});

for (const field of ['firstName', 'lastName', 'postalCode'] as const) {
  test(`DATA-01 proposed rule: whitespace-only ${field} must be rejected`, async ({
    page,
    checkout,
  }) => {
    await checkout.fill({ ...validCustomer, [field]: '   ' });
    await checkout.continueButton.click();
    await expect(checkout.error).toBeVisible();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
  });
}

const cases = [
  {
    id: 'DATA-02 surrounding spaces',
    customer: { firstName: ' Alex ', lastName: ' Tester ', postalCode: ' SW1A 1AA ' },
  },
  {
    id: 'DATA-05 numeric names',
    customer: { firstName: '12345', lastName: '67890', postalCode: '02108' },
  },
  {
    id: 'DATA-05 punctuation names',
    customer: { firstName: '!!!', lastName: '???', postalCode: '02108' },
  },
  {
    id: 'DATA-06 single-character names',
    customer: { firstName: 'A', lastName: 'B', postalCode: '1' },
  },
  {
    id: 'DATA-06 long values (256 characters)',
    customer: {
      firstName: 'A'.repeat(256),
      lastName: 'B'.repeat(256),
      postalCode: '1'.repeat(256),
    },
  },
  {
    id: 'DATA-08 punctuation postcode',
    customer: { firstName: 'Alex', lastName: 'Tester', postalCode: '!!!' },
  },
  {
    id: 'DATA-09 markup-like text',
    customer: { firstName: '<b>Alex</b>', lastName: '<em>Tester</em>', postalCode: '02108' },
  },
];
for (const { id, customer } of cases) {
  test(`${id} - observation, not acceptance certification`, async ({
    page,
    checkout,
  }, testInfo) => {
    await checkout.fill(customer);
    const retained = {
      firstName: await checkout.firstName.inputValue(),
      lastName: await checkout.lastName.inputValue(),
      postalCode: await checkout.postalCode.inputValue(),
    };
    const constraints = await page.locator('input').evaluateAll((es) =>
      es.map((element) => {
        const e = element as HTMLInputElement;
        return { name: e.name, maxLength: e.maxLength, required: e.required, pattern: e.pattern };
      }),
    );
    await checkout.continueButton.click();
    await expect
      .poll(
        async () =>
          (await checkout.error.isVisible()) ||
          (await page.getByTestId('title').textContent()) === 'Checkout: Overview',
      )
      .toBe(true);
    await testInfo.attach('input-observation', {
      body: JSON.stringify(
        {
          id,
          submitted: customer,
          retained,
          constraints,
          url: page.url(),
          error: await checkout.error.allTextContents(),
          title: await page.getByTestId('title').textContent(),
        },
        null,
        2,
      ),
      contentType: 'application/json',
    });
    await testInfo.attach('input-result', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
    if (id.startsWith('DATA-09')) {
      await expect(page.locator('b').filter({ hasText: 'Alex' })).toHaveCount(0);
      await expect(page.locator('em').filter({ hasText: 'Tester' })).toHaveCount(0);
    }
  });
}
