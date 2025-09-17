import { test, expect } from '@playwright/test';
import ApiClient from '../../src/services/ApiClient.js';

let api;

test.beforeAll(async () => {
  api = new ApiClient('https://reqres.in/api');
  await api.init();
});

test.afterAll(async () => {
  await api.close();
});

// GET
test('GET /users?page=2 - should fetch users list', async () => {
  const response = await api.get('/users?page=2');
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.data.length).toBeGreaterThan(0);
});

// POST
test('POST /users - should create a user', async () => {
  const newUser = { name: 'morpheus', job: 'leader' };
  const response = await api.post('/users', newUser);
  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.name).toBe('morpheus');
  expect(body).toHaveProperty('id');
});

// PUT
test('PUT /users/2 - should update a user', async () => {
  const updateData = { name: 'neo', job: 'the one' };
  const response = await api.put('/users/2', updateData);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.name).toBe('neo');
});

// DELETE
test('DELETE /users/2 - should delete a user', async () => {
  const response = await api.delete('/users/2');
  expect(response.status()).toBe(204); // ReqRes returns 204 for delete
});
