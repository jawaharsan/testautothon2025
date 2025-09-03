import { expect as chaiExpect } from 'chai';
import { LoginScreen } from '../pageobjects/LoginScreen.js';

describe('Mobile Login', () => {
  it('logs in successfully', async () => {
    const login = new LoginScreen(browser);
    await login.login('standard_user', 'secret_sauce');
    await login.waitFor(login.greeting);
    chaiExpect(await (await login.greeting).isDisplayed()).to.equal(true);
  });
});
