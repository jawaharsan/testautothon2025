import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  expect: { timeout: 5_000 },
  reporter: [['html'], ['allure-playwright']],
  outputDir: 'reports/allure-results', // Playwright Allure output
  use: {
    baseURL: process.env.BASE_URL || 'https://example.org',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  retries: 0,
  workers: process.env.CI ? 4 : 2,
});
