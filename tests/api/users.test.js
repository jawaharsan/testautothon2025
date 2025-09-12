import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/services/ApiClient.js';
import { users } from '../../src/data/users.data.js';

// Demonstrates using the test's request bound to the current context

test.describe('Users API @LOGIN_API', () => {
  test('login success @SUCCESS_LOGIN', async ({ request }) => {
    const api = new ApiClient(request);
    const res = await api.post('/login', users.valid);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty('token');
  });

  test('login failure @@FAILURE_LOGIN', async ({ request }) => {
    const api = new ApiClient(request);
    const res = await api.post('/login', users.invalidLogin);
    expect(res.status()).toBe(400);
  });
});
