import { test, expect, backpack, bikeLight } from '../support/fixtures';

test.beforeEach(async ({ login }) => {
  await login.signIn();
});

test('CART-01 one product has correct price and quantity', async ({ page, shop }) => {
  const selected = (await shop.products()).find((p) => p.name === backpack)!;
  await shop.add(backpack);
  await expect(shop.badge).toHaveText('1');
  await shop.openCart();
  await expect(shop.names).toHaveText([backpack]);
  expect(await shop.products()).toEqual([selected]);
  await expect(page.getByTestId('item-quantity')).toHaveText('1');
});

test('CART-02 CART-04 @core multiple products persist through navigation and refresh', async ({
  page,
  shop,
}) => {
  const selected = (await shop.products()).filter((p) => [backpack, bikeLight].includes(p.name));
  await shop.add(backpack);
  await shop.add(bikeLight);
  await expect(shop.badge).toHaveText('2');
  await shop.openCart();
  await expect(shop.names).toHaveText([backpack, bikeLight]);
  await shop.continueShopping();
  await page.reload();
  await expect(shop.badge).toHaveText('2');
  await shop.openCart();
  expect(await shop.products()).toEqual(selected);
  await expect(page.getByTestId('item-quantity')).toHaveText(['1', '1']);
});

test('CART-03 remove from inventory and cart updates counts and empty state', async ({ shop }) => {
  await shop.add(backpack);
  await shop.add(bikeLight);
  await shop.remove(backpack);
  await expect(shop.badge).toHaveText('1');
  await shop.openCart();
  await expect(shop.names).toHaveText([bikeLight]);
  await shop.remove(bikeLight);
  await expect(shop.items).toHaveCount(0);
  await expect(shop.badge).toHaveCount(0);
  await shop.continueShopping();
  await expect(
    shop.item(bikeLight).getByRole('button', { name: 'Add to cart', exact: true }),
  ).toBeVisible();
});
