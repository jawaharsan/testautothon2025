import { request } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

export class ApiClient {
  /** @param {import('@playwright/test').BrowserContext.request} request */
 constructor(baseURL = process.env.API_BASE_URL) {
     if (!baseURL) {
       throw new Error('❌ BASE_URL is not defined in environment variables');
     }
     this.baseURL = baseURL;
   }

  async get(endpoint) {
    const requestContext = await request.newContext();
    const response = await requestContext.get(`${this.baseURL}${endpoint}`);
    return response;
  }

  async post(endpoint, data) {
    const requestContext = await request.newContext();
    const response = await requestContext.post(`${this.baseURL}${endpoint}`, {
      data,
    });
    return response;
  }

  async put(endpoint, data) {
    const requestContext = await request.newContext();
    const response = await requestContext.put(`${this.baseURL}${endpoint}`, {
      data,
    });
    return response;
  }

  async delete(endpoint) {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`${this.baseURL}${endpoint}`);
    return response;
  }
}

export default ApiClient;