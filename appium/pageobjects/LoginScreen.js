import { BaseScreen } from './BaseScreen.js';

export class LoginScreen extends BaseScreen {
  get username() { return this.driver.$('~username'); }
  get password() { return this.driver.$('~password'); }
  get loginBtn() { return this.driver.$('~loginBtn'); }
  get greeting() { return this.driver.$('~greeting'); }

  async login(user, pass) {
    await this.waitFor(this.username);
    await (await this.username).setValue(user);
    await (await this.password).setValue(pass);
    await (await this.loginBtn).click();
  }
}
