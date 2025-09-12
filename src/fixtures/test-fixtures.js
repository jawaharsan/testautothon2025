import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/web/LoginPage.js';
import { DashboardPage } from '../pages/web/DashboardPage.js';
import { step } from '../utils/allure-steps.js';

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await use(login);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    await use(dashboard);
  },

  // Reusable login flow
  auth: async ({ page }, use) => {
    await use({
      loginAs: async (userType) => {
        await step('Login as user', async () => {
          const lp = new LoginPage(page);
          await lp.goto();
          await lp.login(userType);
        });
      }
    });
  }
});

export const expect = base.expect;
