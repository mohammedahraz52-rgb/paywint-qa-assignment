import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly togglePasswordButton: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.togglePasswordButton = page.getByRole('button', { name: /Show|Hide/i });
    this.usernameError = page.getByTestId('username-error');
    this.passwordError = page.getByTestId('password-error');
    this.errorMessage = page.getByTestId('error-message');
  }

  async goto() {
    await this.page.goto('login.html');
  }

  async login(username?: string, password?: string) {
    if (username !== undefined) {
      await this.usernameInput.fill(username);
    }
    if (password !== undefined) {
      await this.passwordInput.fill(password);
    }
    await this.loginButton.click();
  }

  async togglePasswordVisibility() {
    await this.togglePasswordButton.click();
  }
}
