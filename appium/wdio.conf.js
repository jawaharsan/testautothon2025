import { config as androidCaps } from './capabilities.android.emu.js';

export const config = {
  runner: 'local',
  specs: ['./tests/**/*.js'],
  maxInstances: 1,
  logLevel: 'warn',
  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 60000 },
  reporters: [
    'spec',
    ['allure', {
      outputDir: './reports/allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
    }],
  ],
  services: [ ['appium', { command: 'appium', args: { address: '0.0.0.0', port: 4723 } }] ],
  capabilities: [ androidCaps ],
  autoCompileOpts: { autoCompile: true }
};
