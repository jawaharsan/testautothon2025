# Test Autothan 2025
For the Test Autothan 2025 contest

### Prereqs
- Node.js 18+
- Java 11+ (for Android tools)
- ANDROID_HOME set, emulator running (if using emulator)

### Install
npm i
npm run pw:install

### Run Web + API (Playwright)
# All tests (web+api) or per suite
npm run test:pw
npm run test:web
npm run test:api

### Run Mobile (Appium)
# Make sure Appium server can start (service starts it automatically)
npm run test:mobile

### Allure
npm run allure:generate
npm run allure:open

### Environment
export BASE_URL=https://www.saucedemo.com
export API_BASE_URL=https://reqres.in/api
export USERNAME=standard_user
export PASSWORD=secret_sauce
export APP_PATH=./app-debug.apk
