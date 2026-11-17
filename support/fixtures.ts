import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ShopPage } from '../pages/shop-page';
import { CheckoutPage } from '../pages/checkout-page';

export const test = base.extend<{ login: LoginPage; shop: ShopPage; checkout: CheckoutPage }>({
  login: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  shop: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
  checkout: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});
export { expect };

export const backpack = 'Sauce Labs Backpack';
export const bikeLight = 'Sauce Labs Bike Light';
