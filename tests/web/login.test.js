import { test, expect } from '../../src/fixtures/test-fixtures.js';
import { Env } from '../../src/config/env.js';

// Example smoke for contest
test.describe('Login @LOGIN', () => {
  test('valid user lands on dashboard', async ({ page, auth, dashboardPage }) => {
    await auth.loginAs(Env.username, Env.password);
    await dashboardPage.assertLoaded(expect);
  });
});
