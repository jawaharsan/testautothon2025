import { test, expect } from '@playwright/test';
import ApiClient from '../../src/services/ApiClient.js';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
let apiClient;

test.beforeAll(async () => {
  apiClient = new ApiClient(BASE_URL);
});


test('GET list of posts', async ({},testInfo) => {
  const response = await apiClient.get('/posts');
  expect(response.status()).toBe(200);

  const body = await response.json();

   console.log('GET /posts response:', body.slice(0, 2)); // only first 2 items

    // ✅ attach to report
     await testInfo.attach('GET /posts response', {
       body: JSON.stringify(body, null, 2),
       contentType: 'application/json',
     });

  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
});

test('POST create a new post', async ({}, testInfo) => {
  const response = await apiClient.post('/posts', {
    title: 'foo',
    body: 'bar',
    userId: 1,
  });

  expect(response.status()).toBe(201);

  const body = await response.json();

   // ✅ log to console
    console.log('POST /posts payload:', payload);
    console.log('POST /posts response:', body);

    // ✅ attach request + response to report
    await testInfo.attach('POST request payload', {
      body: JSON.stringify(payload, null, 2),
      contentType: 'application/json',
    });

    await testInfo.attach('POST response body', {
      body: JSON.stringify(body, null, 2),
      contentType: 'application/json',
    });

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
