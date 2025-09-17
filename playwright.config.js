// playwright.config.js
import { defineConfig, devices } from '@playwright/test';
import { Env } from './src/config/env'

const isCI = !!Env.ci;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  expect: { timeout: 5_000 },
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
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  retries: isCI ? 2 : 1,            // a bit more tolerance in CI
  workers: isCI ? (Env.workers || 8) : 2
});
