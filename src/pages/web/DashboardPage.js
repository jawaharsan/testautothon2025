import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
    constructor(page) {
      super(page);
      this.greeting = page.locator('.app_logo'); // visible on successful login
    }
    async assertLoaded(expect) {
      await expect(this.greeting).toBeVisible();
    }
  }
  