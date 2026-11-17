import { test, expect, backpack } from '../support/fixtures';
import { cents } from '../support/money';

const alphabetic = (a: string, b: string) => a.localeCompare(b, 'en', { sensitivity: 'base' });

test.beforeEach(async ({ login, shop }) => {
  await login.signIn();
  await expect(shop.items).toHaveCount(6);
});

test('SORT-01 default A-Z matches displayed names', async ({ shop }) => {
  await expect(shop.sort).toHaveValue('az');
  const names = await shop.names.allTextContents();
  await expect(shop.names).toHaveText([...names].sort(alphabetic));
});

for (const option of ['az', 'za', 'lohi', 'hilo']) {
  test(`SORT-02-05 @core full sequence follows ${option}`, async ({ shop }, testInfo) => {
    const original = await shop.products();
    // Start from the opposite order so A-Z tests an actual change too.
    await shop.sort.selectOption(option === 'az' ? 'za' : 'az');
    await shop.sort.selectOption(option);
    await expect(shop.sort).toHaveValue(option);
    if (option === 'az' || option === 'za') {
      const expected = original.map((p) => p.name).sort(alphabetic);
      if (option === 'za') expected.reverse();
      await expect(shop.names).toHaveText(expected);
    } else {
      const expected = original
        .map((p) => p.price)
        .sort((a, b) => (option === 'lohi' ? a - b : b - a));
      await expect
        .poll(async () => (await shop.prices.allTextContents()).map(cents))
        .toEqual(expected);
    }
    const actual = await shop.products();
    expect([...actual].sort((a, b) => alphabetic(a.name, b.name))).toEqual(
      [...original].sort((a, b) => alphabetic(a.name, b.name)),
    );
    await testInfo.attach('sort-evidence', {
      body: JSON.stringify({ option, original, actual }, null, 2),
      contentType: 'application/json',
    });
  });
}

test('SORT-06 CART-05 repeated sorting preserves products and cart selection', async ({ shop }) => {
  const original = await shop.products();
  await shop.add(backpack);
  for (const option of ['hilo', 'za', 'lohi', 'az']) {
    await shop.sort.selectOption(option);
    await expect(shop.sort).toHaveValue(option);
    expect((await shop.products()).sort((a, b) => alphabetic(a.name, b.name))).toEqual(
      [...original].sort((a, b) => alphabetic(a.name, b.name)),
    );
    await expect(
      shop.item(backpack).getByRole('button', { name: 'Remove', exact: true }),
    ).toBeVisible();
    await expect(shop.badge).toHaveText('1');
  }
  await shop.openCart();
  await expect(shop.names).toHaveText([backpack]);
});

test('SORT-07 selected option and order remain consistent after cart navigation', async ({
  shop,
}) => {
  await shop.sort.selectOption('za');
  await shop.openCart();
  await shop.continueShopping();
  const option = await shop.sort.inputValue();
  const names = await shop.names.allTextContents();
  // Resetting the preference is allowed; a mismatch between label and results is not.
  expect(['az', 'za']).toContain(option);
  const expected = [...names].sort(alphabetic);
  await expect(shop.names).toHaveText(option === 'za' ? expected.reverse() : expected);
});
