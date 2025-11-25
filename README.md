# Playwright + Cucumber Test Suite

A modern BDD (Behavior Driven Development) test automation framework combining **Playwright** for browser automation and **Cucumber** for readable test scenarios.

## Features

- 🎭 **Playwright** — Fast, reliable cross-browser testing
- 🥒 **Cucumber** — Human-readable Gherkin feature files
- 📊 **HTML Reports** — Beautiful test reports with screenshots
- 📹 **Video Recording** — Automatic video capture for test sessions
- 📸 **Screenshots** — Automatic screenshots on test failure
- ⚡ **Parallel Execution** — Run tests in parallel for faster feedback
- 🔧 **TypeScript** — Type-safe step definitions and page objects

## Project Structure

```
playwright-test/
├── features/                 # Cucumber feature files (Gherkin syntax)
│   └── login.feature
├── pages/                    # Page Object Model (POM) classes
│   ├── BasePage.ts          # Base class for all pages
│   └── LoginPage.ts         # Login page object
├── steps/                    # Step definitions matching Gherkin steps
│   └── login.steps.ts
├── support/                  # Test support and configuration
│   ├── api.ts               # API helper functions
│   ├── browserManager.ts    # Browser lifecycle management
│   ├── env.ts               # Environment configuration
│   ├── hooks.ts             # Cucumber hooks (Before/After)
│   └── report.ts            # HTML report generation
├── screenshots/             # Failed test screenshots (auto-generated)
├── test-videos/             # Test session recordings (auto-generated)
├── html-report/             # HTML test reports (auto-generated)
├── cucumber.ts              # Cucumber configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/julibiswas/playwright-test.git
   cd playwright-test
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory (or ensure environment variables are set):
   ```bash
   BASE_URL=https://frontend-dev.zoma.ai
   BROWSER=chromium  # Options: chromium, firefox, webkit
   ```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in parallel (4 workers)
```bash
npm run test:parallel
```

### Run with a specific browser
```bash
BROWSER=firefox npm test
BROWSER=webkit npm test
```

### Run headless mode
```bash
# Update browserManager.ts or pass headless flag
npx cucumber-js --require-module ts-node/register --require 'steps/**/*.ts' --require 'support/**/*.ts'
```

## Test Report

After test execution, an **HTML report** is automatically generated in the following location:
```
html-report/cucumber_report.html
```

**Key features of the report:**
- ✅ Summary of passed/failed scenarios
- ❌ Failed step details with error messages
- 📸 Screenshots of failed steps
- 🎯 Feature and scenario breakdowns
- ⏱️ Execution time metrics

### Opening the report
```bash
# On Linux/macOS
open html-report/cucumber_report.html

# On Windows
start html-report/cucumber_report.html
```

Or simply open the file in your browser.

## Writing Tests

### 1. Create a feature file (`.feature`)

```gherkin
# features/login.feature
Feature: User Login
  As a user
  I want to log in
  So that I can access the application

  Scenario: Successful login with valid credentials
    Given I open the login page
    When I enter username "user@example.com"
    And I enter password "password123"
    And I click the login button
    Then I should be redirected to the dashboard
```

### 2. Create step definitions (`.steps.ts`)

```typescript
// steps/login.steps.ts
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";

let loginPage: LoginPage;

Given("I open the login page", async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.open();
});

When("I enter username {string}", async function (email: string) {
  await loginPage.enterUsername(email);
});

Then("I should be redirected to the dashboard", async function () {
  await expect(this.page).toHaveURL(/(dashboard|main)/);
});
```

### 3. Create page objects

```typescript
// pages/LoginPage.ts
import BasePage from "./BasePage";

export default class LoginPage extends BasePage {
  private usernameField = "#email";
  private passwordField = "#password";
  private loginButton = "button[type='submit']";
  private url = "https://frontend-dev.zoma.ai/login";

  async open() {
    await this.navigate(this.url);
  }

  async enterUsername(email: string) {
    await this.fill(this.usernameField, email);
  }

  async enterPassword(password: string) {
    await this.fill(this.passwordField, password);
  }

  async clickLogin() {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }),
      this.click(this.loginButton),
    ]);
  }
}
```

## Configuration

### Browser Configuration (`support/browserManager.ts`)

- **Headless mode**: Set `headless: true` in `launch()` options
- **Browser selection**: Set via `BROWSER` environment variable (chromium, firefox, webkit)
- **Video recording**: Enabled by default in `recordVideo: { dir: "test-videos/" }`

### Timeout Configuration (`support/hooks.ts`)

Default timeout is **60 seconds**. Adjust with:
```typescript
setDefaultTimeout(120 * 1000); // 2 minutes
```

## Troubleshooting

### Tests run but no HTML report is generated

1. Verify `cucumber-report.json` is created:
   ```bash
   ls -la cucumber-report.json
   ```

2. If missing, check the Cucumber output format flag in your command:
   ```bash
   --format json:cucumber-report.json
   ```

3. If the JSON file exists but the HTML isn't generated, the report generator will create a **fallback report** based on available data. Check console output for errors.

### Browser doesn't launch

- Ensure Playwright browsers are installed:
  ```bash
  npx playwright install
  ```

- Check that the browser is available for your OS (chromium, firefox, webkit all support Linux/macOS/Windows).

### Tests timeout

- Increase the default timeout in `support/hooks.ts`:
  ```typescript
  setDefaultTimeout(120 * 1000); // Increase to 2 minutes
  ```

- Or increase timeout for specific steps:
  ```typescript
  this.page.waitForNavigation({ timeout: 60000 });
  ```

## GitHub Actions

This project includes a GitHub Actions workflow (`.github/workflows/tests.yml`) for CI/CD. Tests run automatically on:
- Push to the `test` branch
- Pull requests

### Workflow features:
- Runs on Ubuntu latest
- Installs dependencies
- Executes Cucumber tests
- Uploads HTML reports as artifacts
- Uploads video recordings as artifacts

## Debugging

### Enable verbose logging
```typescript
// In your step or page class
console.log("🔍 Debug info:", value);
```

### Take manual screenshots
```typescript
const screenshot = await this.page.screenshot({ path: "debug.png" });
```

### Inspect page state
```typescript
const url = this.page.url();
const title = await this.page.title();
console.log(`Current URL: ${url}, Title: ${title}`);
```

## Best Practices

1. **Use Page Object Model** — Keep selectors and actions in page classes
2. **Write descriptive steps** — Step names should clearly describe what they do
3. **Use data-driven scenarios** — Leverage Gherkin tables and scenario outlines for multiple test cases
4. **Keep steps simple** — Each step should do one logical thing
5. **Avoid hard-coded waits** — Use Playwright's built-in waiting mechanisms instead of `sleep()`
6. **Maintain test data** — Store test credentials in environment variables or secure vaults
7. **Clean up after tests** — Use `AfterAll` hooks to close resources

## Dependencies

- **@cucumber/cucumber** ^9.0.0 — BDD test framework
- **@playwright/test** — Playwright testing library
- **playwright** ^1.42.0 — Browser automation
- **cucumber-html-reporter** ^6.0.0 — HTML report generation
- **axios** ^1.6.0 — HTTP client for API testing
- **ts-node** ^10.9.2 — TypeScript runner
- **typescript** ^5.9.3 — TypeScript compiler

## Contributing

1. Create a feature branch: `git checkout -b feature/new-test`
2. Write tests following the project structure
3. Commit: `git commit -am "Add new test"`
4. Push: `git push origin feature/new-test`
5. Create a Pull Request

## License

MIT

## Contact

For issues or questions, contact: [julibiswas](https://github.com/julibiswas)

---

**Happy testing! 🚀**
