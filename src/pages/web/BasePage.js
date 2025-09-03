import { Env } from '../../config/env.js';
import { waitForVisible } from '../../utils/waits.js';

export class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) { this.page = page; }

  async goto(path = '/') { await this.page.goto(`${Env.baseUrl}${path}`); }
  async visible(locator) { await waitForVisible(locator); }
}
