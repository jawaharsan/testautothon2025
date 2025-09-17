import { test, expect } from '../../src/fixtures/test-fixtures.js';

// import { Env } from '../../src/config/env.js';

// Example smoke for contest
test.describe('Login @login', async () => {
  test('valid user lands on dashboard @valid_login', async ({ page, auth, dashboardPage }) => {
    await test.step('Login as a standard user', async () => {
      await auth.loginAs('standard');
    });
    await test.step('Verify if the user is logged in', async () => {
      await dashboardPage.assertLoaded(expect);
    });
  });

  test('valid locked out user not able to login @locked_login', async ({ page, auth, dashboardPage }) => {
    await test.step('Login as a standard user', async () => {
      await auth.loginAs('locked');
    });
    await test.step('Verify if the user is logged in', async () => {
      await dashboardPage.assertLockedUser(expect);
    });
  });
  test('valid invalid user not able to login @invalid_login', async ({ page, auth, dashboardPage }) => {
    await test.step('Login as a standard user', async () => {
      await auth.loginAs('invalidLogin');
    });
    await test.step('Verify if the user is logged in', async () => {
      await dashboardPage.assertInvalidUser(expect);
    });
  });
});
