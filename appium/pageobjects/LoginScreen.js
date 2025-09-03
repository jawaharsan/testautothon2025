import { BaseScreen } from './BaseScreen.js';

export class LoginScreen extends BaseScreen {
  get username() { return $('~username'); }
  get password() { return $('~password'); }
  get loginBtn() { return $('~loginBtn'); }
  get greeting() { return $('~greeting'); }

  async login(user, pass) {
    await this.waitFor(this.username);
    await (await this.username).setValue(user);
    await (await this.password).setValue(pass);
    await (await this.loginBtn).click();
  }
}
