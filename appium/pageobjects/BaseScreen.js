export class BaseScreen {
    /** @param {WebdriverIO.Browser} driver */
    constructor(driver) { this.driver = driver; }
    async waitFor(el, timeout = 10000) { await (await el).waitForDisplayed({ timeout }); }
  }
  