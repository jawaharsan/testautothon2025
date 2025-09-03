import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.username = page.locator('#user-name');
    this.password = page.locator('#password');
    this.submit = page.locator('#login-button');
  }

  async goto() { await super.goto('/login'); }
  async login(user, pass) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }
}
