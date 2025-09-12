import { Env } from '../config/env.js';

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

  async get(path, opts = {}) {
    return this.request.get(`${this.baseUrl}${path}`, opts);
  }
  async post(path, data, opts = {}) {
    return this.request.post(`${this.baseUrl}${path}`, { ...opts, data });
  }
  async put(path, data, opts = {}) {
    return this.request.put(`${this.baseUrl}${path}`, { ...opts, data });
  }
  async del(path, opts = {}) {
    return this.request.delete(`${this.baseUrl}${path}`, opts);
  }
}
