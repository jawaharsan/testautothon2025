import dotenv from 'dotenv';
dotenv.config();

export const Env = Object.freeze({
  baseUrl: process.env.BASE_URL || 'https://example.org',
  apiBaseUrl: process.env.API_BASE_URL || 'https://reqres.in/api',
  apiKey: process.env.API_KEY || '',
  ci: process.env.CI,
  workers: process.env.PW_WORKERS,
  // username: process.env.USERNAME || 'standard_user',
  // password: process.env.PASSWORD || 'secret_sauce'
});
