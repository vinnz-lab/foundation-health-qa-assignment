import { test, expect, backpack, bikeLight } from '../support/fixtures';
import { validCustomer } from '../pages/checkout-page';
import { cents } from '../support/money';

test.beforeEach(async ({ login, shop }) => {
  await login.signIn();
  await shop.add(backpack);
});

for (const [field, message] of [
  ['firstName', 'First Name is required'],
  ['lastName', 'Last Name is required'],
  ['postalCode', 'Postal Code is required'],
] as const) {
  test(`CHECK-01 @core missing ${field} blocks checkout and permits recovery`, async ({
    page,
    shop,
    checkout,
  }) => {
    await shop.openCart();
    await checkout.start();
    await checkout.fill({ ...validCustomer, [field]: '' });
    await checkout.continueButton.click();
    await expect(checkout.error).toContainText(message);
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    for (const other of ['firstName', 'lastName', 'postalCode'] as const) {
      if (other !== field) await expect(checkout[other]).toHaveValue(validCustomer[other]);
    }
    await checkout[field].fill(validCustomer[field]);
    await checkout.continueButton.click();
    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');
    await expect(checkout.error).toHaveCount(0);
  });
}

test('CHECK-02-04 @core multi-item checkout preserves products, calculates totals and completes', async ({
  page,
  shop,
  checkout,
}) => {
  const selected = (await shop.products()).filter((p) => [backpack, bikeLight].includes(p.name));
  await shop.add(bikeLight);
  await shop.openCart();
  await checkout.start();
  await checkout.review();
  await expect(shop.names).toHaveText([backpack, bikeLight]);
  expect(await shop.products()).toEqual(selected);
  await expect(page.getByTestId('item-quantity')).toHaveText(['1', '1']);
  const subtotal = cents(await page.getByTestId('subtotal-label').innerText());
  const tax = cents(await page.getByTestId('tax-label').innerText());
  const total = cents(await page.getByTestId('total-label').innerText());
  expect(subtotal).toBe(selected.reduce((sum, p) => sum + p.price, 0));
  expect(tax).toBeGreaterThanOrEqual(0);
  expect(total).toBe(subtotal + tax);
  await checkout.finish();
  await expect(shop.badge).toHaveCount(0);
  await page.getByRole('button', { name: 'Back Home', exact: true }).click();
  await expect(page.getByTestId('title')).toHaveText('Products');
  await shop.openCart();
  await expect(shop.items).toHaveCount(0);
});

for (const stage of ['information', 'overview']) {
  test(`CHECK-05 cancel at ${stage} retains cart`, async ({ page, shop, checkout }) => {
    await shop.openCart();
    await checkout.start();
    if (stage === 'overview') await checkout.review();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.getByTestId('title')).toHaveText(
      stage === 'overview' ? 'Products' : 'Your Cart',
    );
    await expect(page.getByTestId('complete-header')).toHaveCount(0);
    if (stage === 'overview') await shop.openCart();
    await expect(shop.names).toHaveText([backpack]);
    await expect(shop.badge).toHaveText('1');
  });
}

for (const customer of [
  { firstName: 'Anne-Marie', lastName: "O'Connor", postalCode: 'SW1A 1AA' },
  { firstName: 'Jos�', lastName: '?', postalCode: '02108' },
]) {
  test(`DATA-03/04/07 legitimate names and postcode preserved: ${customer.firstName}`, async ({
    shop,
    checkout,
  }) => {
    await shop.openCart();
    await checkout.start();
    await checkout.fill(customer);
    await expect(checkout.firstName).toHaveValue(customer.firstName);
    await expect(checkout.lastName).toHaveValue(customer.lastName);
    await expect(checkout.postalCode).toHaveValue(customer.postalCode);
    await checkout.review(customer);
    await expect(shop.names).toHaveText([backpack]);
  });
}
