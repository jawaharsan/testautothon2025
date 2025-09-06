FROM node:20-bullseye

WORKDIR /usr/src/app

# Only package files first to leverage Docker cache
COPY package*.json ./
RUN npm ci

# Install browsers once (cached layer)
RUN npx playwright install --with-deps

# Allure CLI (optional, global)
RUN npm install -g allure-commandline

# Now bring in the rest
COPY . .

ENV BASE_URL=https://www.saucedemo.com
ENV API_BASE_URL=https://reqres.in/api
ENV USERNAME=standard_user
ENV PASSWORD=secret_sauce
ENV APP_PATH=/usr/src/app/appium/apps/ApiDemos-debug.apk

CMD ["bash"]  # dev default; Compose will override with commands
