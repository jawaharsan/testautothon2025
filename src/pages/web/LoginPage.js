import { BasePage } from '../web/BasePage.js';
import { loginLocators } from '../../locators/web/login.locators.js';
import { users } from '../../data/users.data.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async goto() {
    await super.goto();
  }

  async login(userKey = 'standard') {
    const user = users[userKey];
    await this.page.fill(loginLocators.usernameInput, user.username);
    await this.page.fill(loginLocators.passwordInput, user.password);
    await this.page.click(loginLocators.loginButton);
  }
}
