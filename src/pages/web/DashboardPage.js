import { BasePage } from './BasePage';
import { loginLocators } from '../../locators/web/login.locators.js';
import { users } from '../../data/users.data.js';

export class DashboardPage extends BasePage {
    constructor(page) {
      super(page);
    }
    async assertLoaded(expect) {
      await expect(this.page.locator(loginLocators.greeting)).toBeVisible();
    }
    async assertLockedUser(expect) {
      await expect(this.page.locator(loginLocators.errorMessage)).toContainText(users.errormsgLocked);
    }    
    async assertInvalidUser(expect) {
      await expect(this.page.locator(loginLocators.errorMessage)).toContainText(users.errormsgInvalid);
    }
  }
  