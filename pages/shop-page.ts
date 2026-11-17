import { expect, type Page } from '@playwright/test';
import { cents } from '../support/money';

export type Product = { name: string; price: number };
export class ShopPage {
  constructor(readonly page: Page) {}
  get items() {
    return this.page.getByTestId('inventory-item');
  }
  get names() {
    return this.page.getByTestId('inventory-item-name');
  }
  get prices() {
    return this.page.getByTestId('inventory-item-price');
  }
  get sort() {
    return this.page.getByTestId('product-sort-container');
  }
  get badge() {
    return this.page.getByTestId('shopping-cart-badge');
  }

  item(name: string) {
    return this.items.filter({
      has: this.page
        .getByTestId('inventory-item-name')
        .filter({ hasText: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }),
    });
  }
  async products(): Promise<Product[]> {
    const names = await this.names.allTextContents();
    const prices = await this.prices.allTextContents();
    return names.map((name, i) => ({ name, price: cents(prices[i]) }));
  }
  async add(name: string) {
    await this.item(name).getByRole('button', { name: 'Add to cart', exact: true }).click();
    await expect(
      this.item(name).getByRole('button', { name: 'Remove', exact: true }),
    ).toBeVisible();
  }
  async remove(name: string) {
    await this.item(name).getByRole('button', { name: 'Remove', exact: true }).click();
  }
  async openCart() {
    await this.page.getByTestId('shopping-cart-link').click();
    await expect(this.page.getByTestId('title')).toHaveText('Your Cart');
  }
  async continueShopping() {
    await this.page.getByRole('button', { name: 'Continue Shopping', exact: true }).click();
    await expect(this.page.getByTestId('title')).toHaveText('Products');
  }
  async logout() {
    await this.page.getByRole('button', { name: 'Open Menu', exact: true }).click();
    await this.page.getByTestId('logout-sidebar-link').click();
    await expect(this.page.getByTestId('login-button')).toBeVisible();
  }
}
