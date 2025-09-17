# Test Autothon 2025
For the Test Autothon 2025 contest

### Prereqs
- Node.js 18+
- Java 11+ (for Android tools)
- ANDROID_HOME set, emulator running (if using emulator)
- WSL2
- Docker desktop for Windows

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


### Docker setup
Enable/Install WSL2
    Open PowerShell (Admin) → run:
        wsl --install
        wsl --set-default-version 2
    Reboot when prompted. On first open, WSL will install Ubuntu (or choose your distro from Microsoft Store).
    Install Docker Desktop (WSL2 backend)
    Install Docker Desktop for Windows.
    Open Docker Desktop → Settings → General → check Use the WSL 2 based engine.
    Settings → Resources → WSL Integration → enable for your WSL distro (e.g., Ubuntu). Click Apply & Restart.
    Verify Docker in WSL
    Open Ubuntu (WSL) terminal and run:
        docker --version
        docker compose version

Project prep (in your repo)
Make sure these files exist
    .dockerignore with:
        node_modules
        reports
        test-results
        .git
        .vscode
        apps/*.apk

    Dockerfile (Node 20, installs Playwright browsers, copies app).
    docker-compose.yml (service tests with shm_size: 1g, named volumes for node_modules and pw-cache).
    Optional: .env with your BASE_URL, creds, etc.
Open your repo in WSL
    From Ubuntu (WSL) terminal, cd into your project folder (you can also work from Windows path; WSL will still run Docker Desktop).

Build & run inside Docker
Build the image (cache deps + browsers)
    docker compose build
Run the full Playwright suite inside the container
    docker compose up --remove-orphans --exit-code-from tests
This installs deps, runs tests, and generates Allure report (per the compose command).

View reports (on your host)
    Open the generated HTML
    Allure (static): open reports/allure-report/index.html in your browser.
    Playwright HTML: open playwright-report/index.html.

Useful variations
    Run only web tests (compose profile):
        docker compose --profile web up --remove-orphans --exit-code-from web

    Run only API tests:
        docker compose --profile api up --remove-orphans --exit-code-from api

    Hermetic CI-style (no source bind mount):
        docker compose --profile ci up --remove-orphans --exit-code-from ci

    One-off command (e.g., grep by tag) inside container:
        docker compose run --rm tests bash -lc "npm run test:pw -- --grep @SMOKE"

Common fixes
Rebuild clean (after package.json changes or flaky cache):
    docker compose down -v
    docker compose build --no-cache
    docker compose up --remove-orphans --exit-code-from tests

Chromium crashes/headless flakiness → ensure shm_size: 1g and ipc: host are present in docker-compose.yml (they are in the template I gave).    