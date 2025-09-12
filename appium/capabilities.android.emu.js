export const androidCaps = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android Emulator',
  'appium:platformVersion': '13',
  'appium:app': process.env.APP_PATH || `${process.cwd()}/apps/ApiDemos-debug.apk`,
  'appium:autoGrantPermissions': true
  };