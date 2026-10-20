import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Login Flow & Authentication Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Valid login reaches the dashboard', async ({ page }) => {
    await loginPage.login('student', 'Password123');

    // Assert URL has navigated to /dashboard
    await expect(page).toHaveURL(/dashboard/);

    // Assert greeting "Welcome, student!" is visible
    await expect(page.getByText('Welcome, student!')).toBeVisible();
  });

  test('Empty fields show required validation errors and do not navigate', async ({ page }) => {
    // Click Log in without entering username and password
    await loginPage.login();

    // Assert the two required-field errors appear
    await expect(loginPage.usernameError).toBeVisible();
    await expect(loginPage.usernameError).toHaveText('Username is required');

    await expect(loginPage.passwordError).toBeVisible();
    await expect(loginPage.passwordError).toHaveText('Password is required');

    // Assert page did not navigate
    await expect(page).toHaveURL(/login\.html/);
  });

  test('Wrong password shows invalid credentials error and stays on login page', async ({ page }) => {
    await loginPage.login('student', 'IncorrectPassword');

    // Assert the "invalid" error is shown
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Your username or password is invalid!');

    // Assert page stays on login page
    await expect(page).toHaveURL(/login\.html/);
  });

  test('Account lockout occurs after 3 failed login attempts', async ({ page }) => {
    // Submit wrong password 3 times
    for (let attempt = 1; attempt <= 3; attempt++) {
      await loginPage.login('student', 'WrongPassword123');
    }

    // Assert the "locked" message is shown
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Your account is locked');

    // Assert the Log in button is disabled
    await expect(loginPage.loginButton).toBeDisabled();

    // Verify fields are also disabled
    await expect(loginPage.usernameInput).toBeDisabled();
    await expect(loginPage.passwordInput).toBeDisabled();
  });

  test('Show / Hide password toggle switches input type between password and text', async () => {
    await loginPage.passwordInput.fill('SecretPassword');

    // Initially type is password
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.togglePasswordButton).toHaveText('Show');

    // Click toggle to reveal password
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    await expect(loginPage.togglePasswordButton).toHaveText('Hide');

    // Click toggle again to hide password
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.togglePasswordButton).toHaveText('Show');
  });
});

test.describe('Dashboard & Products Management Tests', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Reusable login step for all dashboard tests
    await loginPage.goto();
    await loginPage.login('student', 'Password123');
    await expect(page).toHaveURL(/dashboard/);
    await expect(dashboardPage.welcomeHeading).toHaveText('Welcome, student!');
  });

  test('Products table displays exactly 5 initial rows', async () => {
    // Assert exactly 5 product rows exist
    await expect(dashboardPage.productRows).toHaveCount(5);

    // Assert the counter matches
    await expect(dashboardPage.productCountText).toHaveText('Showing 5 of 5 products');
  });

  test('Live search filters table and shows only matching product', async () => {
    await dashboardPage.searchProduct('keyboard');

    // Assert only 1 row remains
    await expect(dashboardPage.productRows).toHaveCount(1);

    // Assert the remaining row is "Mechanical Keyboard"
    const matchedRow = dashboardPage.getProductRowByName('Mechanical Keyboard');
    await expect(matchedRow).toBeVisible();
    await expect(dashboardPage.productCountText).toHaveText('Showing 1 of 5 products');
  });

  test('Add a product successfully adds row and updates count', async () => {
    await dashboardPage.addProduct('Webcam');

    // Assert table now has 6 rows
    await expect(dashboardPage.productRows).toHaveCount(6);

    // Assert the "Webcam" row is visible
    const newRow = dashboardPage.getProductRowByName('Webcam');
    await expect(newRow).toBeVisible();

    // Assert product count reflects 6 products
    await expect(dashboardPage.productCountText).toHaveText('Showing 6 of 6 products');
  });

  test('Logout returns user to the login page', async ({ page }) => {
    await dashboardPage.logout();

    // Assert redirected back to login page
    await expect(page).toHaveURL(/login\.html/);

    // Assert login button is visible on the login page
    const loginPage = new LoginPage(page);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
