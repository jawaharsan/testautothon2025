// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  forbidOnly: isCI,                 // harden CI runs
  fullyParallel: true,              // let PW shard work per file
  reporter: [
    ['html', { open: 'never' }],    // keep HTML report consistently
    ['allure-playwright', { outputFolder: 'reports/allure-results', detail: true }]
  ],
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
    // { name: 'webkit',  use: { ...devices['Desktop Safari'] } },
  ],
  retries: isCI ? 2 : 1,            // a bit more tolerance in CI
  workers: isCI ? (process.env.PW_WORKERS || 4) : 2
});
