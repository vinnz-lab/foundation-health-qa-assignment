import { expect, type Page } from '@playwright/test';

export type Customer = { firstName: string; lastName: string; postalCode: string };
export const validCustomer: Customer = {
  firstName: 'Alex',
  lastName: 'Tester',
  postalCode: 'SW1A 1AA',
};

export class CheckoutPage {
  constructor(readonly page: Page) {}
  get firstName() {
    return this.page.getByTestId('firstName');
  }
  get lastName() {
    return this.page.getByTestId('lastName');
  }
  get postalCode() {
    return this.page.getByTestId('postalCode');
  }
  get error() {
    return this.page.getByTestId('error');
  }
  get continueButton() {
    return this.page.getByRole('button', { name: 'Continue', exact: true });
  }

  async start() {
    await this.page.getByRole('button', { name: 'Checkout', exact: true }).click();
    await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(this.firstName).toBeVisible();
  }
  async fill(customer: Customer = validCustomer) {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
  }
  async review(customer: Customer = validCustomer) {
    await this.fill(customer);
    await this.continueButton.click();
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(this.page.getByTestId('title')).toHaveText('Checkout: Overview');
  }
  async finish() {
    await this.page.getByRole('button', { name: 'Finish', exact: true }).click();
    await expect(this.page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(this.page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  }
}
