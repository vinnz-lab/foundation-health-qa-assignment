import { expect, type Page } from '@playwright/test';

export class LoginPage {
  constructor(readonly page: Page) {}
  get username() {
    return this.page.getByTestId('username');
  }
  get password() {
    return this.page.getByTestId('password');
  }
  get submit() {
    return this.page.getByRole('button', { name: 'Login', exact: true });
  }
  get error() {
    return this.page.getByTestId('error');
  }

  async open() {
    await this.page.goto('/');
    await expect(this.submit).toBeVisible();
  }
  async enter(username: string, password = 'secret_sauce') {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }
  async signIn(username = 'standard_user') {
    await this.open();
    await this.enter(username);
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await expect(this.page.getByTestId('title')).toHaveText('Products');
  }
}
