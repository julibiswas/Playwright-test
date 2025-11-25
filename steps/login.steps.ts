import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";

let loginPage: LoginPage;

Given("I open the login page", async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.open();
 console.log("🔥 Step Loaded: I open the login page");

});

When("I enter username {string}", async function (email: string) {
  await loginPage.enterUsername(email);
});

When("I enter password {string}", async function (password: string) {
  await loginPage.enterPassword(password);
});

When("I click the login button", async function () {
  await loginPage.clickLogin();
});

Then("I should be redirected to the dashboard", async function () {
  await expect(this.page).toHaveURL(/main/);
});
