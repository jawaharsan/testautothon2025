import { request } from '@playwright/test';

export class ApiClient {
  /** @param {import('@playwright/test').BrowserContext.request} request */
  constructor(request, baseUrl = Env.apiBaseUrl) {
    this.request = request;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.header = {
        'headers': {
        'Content-Type': 'application/json',
        'x-api-key': Env.apiKey
      }
    }
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
