# Use Node.js LTS
FROM node:20-bullseye

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Playwright browsers
RUN npx playwright install --with-deps

# Install Appium globally
RUN npm install -g appium

# Install Allure CLI globally
RUN npm install -g allure-commandline --save-dev

# Copy the rest of the project
COPY . .

# Set default environment variables
ENV BASE_URL=https://www.saucedemo.com
ENV API_BASE_URL=https://reqres.in/api
ENV USERNAME=standard_user
ENV PASSWORD=secret_sauce
ENV APP_PATH=/usr/src/app/appium/apps/ApiDemos-debug.apk

# Default command (keep container interactive)
CMD ["bash"]
