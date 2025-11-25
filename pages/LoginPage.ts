import BasePage from "./BasePage";
import { CURRENT_ENV } from "../support/env";

export default class LoginPage extends BasePage {

  private usernameField = "#email";
  private passwordField = "#password";
  private loginButton = "button[type='submit']";
  private url = `${CURRENT_ENV.BASE_URL}/login`;

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
    // Click the login button and wait for navigation to the dashboard
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }),
      this.click(this.loginButton),
    ]);
  }
}
