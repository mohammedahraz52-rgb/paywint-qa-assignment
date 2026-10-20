import { Locator, Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeHeading: Locator;
  readonly logoutButton: Locator;
  readonly searchInput: Locator;
  readonly newProductInput: Locator;
  readonly addProductButton: Locator;
  readonly productRows: Locator;
  readonly productCountText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeHeading = page.getByTestId('welcome');
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
    this.searchInput = page.getByPlaceholder('Search products by name…');
    this.newProductInput = page.getByPlaceholder('New product name');
    this.addProductButton = page.getByRole('button', { name: 'Add product' });
    this.productRows = page.getByTestId('product-row');
    this.productCountText = page.getByTestId('count');
  }

  async goto() {
    await this.page.goto('dashboard.html');
  }

  async searchProduct(name: string) {
    await this.searchInput.fill(name);
  }

  async addProduct(name: string) {
    await this.newProductInput.fill(name);
    await this.addProductButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }

  getProductRowByName(name: string): Locator {
    return this.productRows.filter({ hasText: name });
  }
}
