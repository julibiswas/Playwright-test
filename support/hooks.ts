import { BeforeAll, Before, AfterAll, AfterStep, setDefaultTimeout } from "@cucumber/cucumber";
import BrowserManager from "./browserManager";
import fs from "fs";
import { generateReport } from "./report";

setDefaultTimeout(60 * 1000);

export const browserManager = new BrowserManager();

BeforeAll(async function () {
  console.log("🚀 Launching browser...");
  await browserManager.launch(process.env.BROWSER);
});

Before(async function (this: any) {
  // Attach the already-launched page to the scenario World
  this.page = browserManager.page;
});

AfterStep(async function (this: any, scenario: any) {
  if (String(scenario.result?.status).toLowerCase() === "failed") {
    const screenshot = await this.page.screenshot();
    const fileName = `./screenshots/${scenario.pickle.name}.png`;
    fs.writeFileSync(fileName, screenshot);
    console.log(`📸 Screenshot saved: ${fileName}`);
  }
});

AfterAll(async function (this: any) {
  console.log("🛑 Closing browser...");
  await browserManager.close();

  console.log("📊 Generating HTML report...");
  await generateReport();
});
