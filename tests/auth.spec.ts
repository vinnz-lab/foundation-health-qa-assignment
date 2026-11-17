import { test, expect } from '../support/fixtures';

test('AUTH-01 @core valid credentials open the catalogue', async ({ login, shop }) => {
  await login.signIn();
  await expect(shop.items).toHaveCount(6);
  await expect(shop.badge).toHaveCount(0);
});

for (const data of [
  {
    id: 'AUTH-02 @core',
    user: 'locked_out_user',
    password: 'secret_sauce',
    error: 'Sorry, this user has been locked out.',
  },
  {
    id: 'AUTH-03',
    user: 'standard_user',
    password: 'incorrect_password',
    error: 'Username and password do not match any user in this service',
  },
  { id: 'AUTH-04a', user: '', password: 'secret_sauce', error: 'Username is required' },
  { id: 'AUTH-04b', user: 'standard_user', password: '', error: 'Password is required' },
  { id: 'AUTH-04c', user: '', password: '', error: 'Username is required' },
]) {
  test(`${data.id} rejects invalid login`, async ({ page, login, shop }) => {
    await login.open();
    await login.enter(data.user, data.password);
    await expect(login.error).toContainText(data.error);
    await expect(login.submit).toBeVisible();
    await expect(shop.items).toHaveCount(0);
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
}

test('AUTH-05 @core logout prevents returning directly to inventory', async ({
  page,
  login,
  shop,
}) => {
  await login.signIn();
  await shop.logout();
  await page.goto('/inventory.html');
  await expect(login.submit).toBeVisible();
  await expect(shop.items).toHaveCount(0);
});

for (const route of [
  '/inventory.html',
  '/cart.html',
  '/checkout-step-one.html',
  '/checkout-step-two.html',
]) {
  test(`AUTH-06 logged-out direct access is denied: ${route}`, async ({ page, login, shop }) => {
    await page.goto(route);
    await expect(login.submit).toBeVisible();
    await expect(shop.items).toHaveCount(0);
    await expect(page).toHaveURL(/\/$/);
  });
}
