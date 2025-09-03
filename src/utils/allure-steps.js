import { test } from '@playwright/test';

export async function step(name, fn) {
  // Minimal wrapper for semantic steps; Allure picks up steps from tests and attachments.
  return await test.step(name, fn);
}
