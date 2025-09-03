export async function waitForVisible(locator, timeout = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }
  