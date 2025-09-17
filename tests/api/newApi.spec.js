import { test, expect } from '@playwright/test';
import ApiClient from '../../src/services/ApiClient.js';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
let apiClient;

test.beforeAll(async () => {
  apiClient = new ApiClient(BASE_URL);
});


test('GET list of posts', async () => {
  const response = await apiClient.get('/posts');
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
});

test('POST create a new post', async () => {
  const response = await apiClient.post('/posts', {
    title: 'foo',
    body: 'bar',
    userId: 1,
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.title).toBe('foo');
  expect(body.body).toBe('bar');
  expect(body.userId).toBe(1);
});

test('PUT update a post', async () => {
  const response = await apiClient.put('/posts/1', {
    id: 1,
    title: 'updated title',
    body: 'updated body',
    userId: 1,
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.title).toBe('updated title');
  expect(body.body).toBe('updated body');
});

test('DELETE a post', async () => {
  const response = await apiClient.delete('/posts/1');
  expect(response.status()).toBe(200);
});
