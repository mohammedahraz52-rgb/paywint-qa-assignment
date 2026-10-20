# Paywint QA Demo App — Playwright Automation Suite

This repository contains an automated end-to-end test suite for the [Paywint QA Demo App](https://paywint-qa.netlify.app/app/login.html) built with [Playwright](https://playwright.dev/) and TypeScript.

---

## 🚀 Features & Test Coverage

### Core Tests
- **Valid Login**: Authenticates with valid credentials (`student` / `Password123`), validates navigation to `/dashboard`, and verifies the personalized greeting (`Welcome, student!`).
- **Empty Field Validations**: Attempts login with empty fields and asserts inline validation messages appear without triggering page navigation.
- **Invalid Password**: Attempts login with invalid credentials and verifies the error alert is displayed while keeping the user on the login page.
- **Account Lockout**: Submits invalid credentials 3 consecutive times and asserts that the account lockout error is displayed and the login button and inputs become disabled.
- **Products Table Count**: Asserts the initial table displays exactly 5 product items with the summary counter `Showing 5 of 5 products`.
- **Live Search Filtering**: Filters the table by `"keyboard"`, asserting only 1 row remains and corresponds to `"Mechanical Keyboard"`.
- **Add Product**: Submits `"Webcam"` as a new product, asserting the product count increments to 6 and the new row is visible.
- **Logout Flow**: Clicks logout from the dashboard and asserts navigation back to the login page with login controls visible.

### Stretch Goals Implemented
- **Page Object Model (POM)**: Separates locators and interactions into `LoginPage` and `DashboardPage` classes, eliminating selector duplication and improving test maintainability.
- **`test.beforeEach` Fixture Hook**: Logs in once before each dashboard test to keep dashboard test scenarios DRY and independent.
- **Password Visibility Toggle**: Tests that clicking "Show" and "Hide" properly toggles the `<input>` type between `password` and `text`.
- **Organized Test Structure**: Categorized with `test.describe` blocks with descriptive names.

---

## 🛠️ Project Structure

```
paywint-demo-automation/
├── pages/
│   ├── LoginPage.ts         # POM for Login page elements & actions
│   └── DashboardPage.ts     # POM for Dashboard elements & actions
├── tests/
│   └── demo-app.spec.ts     # Complete Playwright test suite
├── package.json
├── playwright.config.ts     # Playwright configuration
└── README.md
```

---

## 📋 Prerequisites & Setup

1. **Node.js**: Ensure Node.js (v18+ or v22+) is installed.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Install Browser Binaries**:
   ```bash
   npx playwright install chromium
   ```

---

## ▶️ Running the Tests

- **Run all tests (headless)**:
  ```bash
  npx playwright test
  ```
- **Run tests in headed mode**:
  ```bash
  npx playwright test --headed
  ```
- **Run with Interactive UI mode**:
  ```bash
  npx playwright test --ui
  ```
- **View HTML Test Report**:
  ```bash
  npx playwright show-report
  ```

---

## 💡 Conceptual Questions & Answers

### (a) What is Playwright's auto-waiting, and why is it better than a fixed sleep?
Playwright's auto-waiting automatically performs a set of actionability checks (verifying that an element is attached to the DOM, visible, stable, enabled, and ready to receive events) before executing actions like `click()` or `fill()`. This is far superior to fixed sleeps (`waitForTimeout`) because fixed sleeps either waste test execution time by waiting longer than necessary or cause flaky failures when network/rendering conditions occasionally exceed the arbitrary delay.

### (b) Why are role/label/test-id locators preferred over long XPath selectors?
User-facing locators (such as `getByRole`, `getByLabel`, `getByText`) and explicit test IDs (`getByTestId`) mirror how real users and assistive technologies interact with the page, making tests resilient against underlying CSS/DOM layout refactors. In contrast, long XPath selectors rely heavily on rigid DOM tree hierarchies (e.g. `/html/body/div[2]/div/form/button`), which break easily with minor markup modifications and make test code difficult to read and maintain.
