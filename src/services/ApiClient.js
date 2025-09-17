import { request } from '@playwright/test';

export default class ApiClient {
  constructor(baseURL) {
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
