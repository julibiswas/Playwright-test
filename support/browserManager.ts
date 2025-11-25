import { chromium, firefox, webkit, Browser, BrowserContext, Page } from "playwright";

export default class BrowserManager {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  async launch(browserName: string = "chromium") {
    switch (browserName) {
      case "firefox":
        this.browser = await firefox.launch({ headless: false });
        break;
      case "webkit":
        this.browser = await webkit.launch({ headless: false });
        break;
      default:
        this.browser = await chromium.launch({ headless: false });
    }

    this.context = await this.browser.newContext({
      recordVideo: { dir: "test-videos/" }
    });

    this.page = await this.context.newPage();
    return this.page;
  }

  async close() {
    await this.context.close();
    await this.browser.close();
  }
}
