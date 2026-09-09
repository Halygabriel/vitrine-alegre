import assert from 'node:assert/strict';
import test from 'node:test';
import { ApiError, getProduct, listCategories, listProducts } from '../src/services/api.js';

function jsonResponse(body, { ok = true, status = 200 } = {}) {
  return { ok, status, json: async () => body };
}

test('listProducts reads products and total from the DummyJSON response shape', async (t) => {
  const originalFetch = global.fetch;
  t.after(() => { global.fetch = originalFetch; });
  let requestedUrl = '';
  global.fetch = async (url) => {
    requestedUrl = String(url);
    return jsonResponse({ products: [{ id: 13, title: 'Item' }], total: 194, skip: 12, limit: 12 });
  };

  const data = await listProducts({ page: 2 });
  assert.equal(data.total, 194);
  assert.deepEqual(data.products, [{ id: 13, title: 'Item' }]);
  assert.match(requestedUrl, /limit=12/);
  assert.match(requestedUrl, /skip=12/);
});

test('listProducts combines search and category without scattering endpoint logic into components', async (t) => {
  const originalFetch = global.fetch;
  t.after(() => { global.fetch = originalFetch; });
  global.fetch = async () => jsonResponse({
    products: [
      { id: 1, title: 'Phone A', category: 'smartphones', price: 30, rating: 4 },
      { id: 2, title: 'Case', category: 'mobile-accessories', price: 10, rating: 5 },
      { id: 3, title: 'Phone B', category: 'smartphones', price: 20, rating: 3 },
    ],
    total: 3,
    skip: 0,
    limit: 0,
  });

  const data = await listProducts({ search: 'phone', category: 'smartphones', sort: 'price-asc', page: 1 });
  assert.equal(data.total, 2);
  assert.deepEqual(data.products.map((product) => product.id), [3, 1]);
});

test('API service rejects non-success HTTP responses with a controlled ApiError', async (t) => {
  const originalFetch = global.fetch;
  t.after(() => { global.fetch = originalFetch; });
  global.fetch = async () => jsonResponse({}, { ok: false, status: 503 });

  await assert.rejects(() => listProducts(), (error) => error instanceof ApiError && error.status === 503);
});

test('getProduct rejects invalid IDs before making a network request', async (t) => {
  const originalFetch = global.fetch;
  t.after(() => { global.fetch = originalFetch; });
  let calls = 0;
  global.fetch = async () => { calls += 1; return jsonResponse({}); };
  await assert.rejects(() => getProduct('not-a-number'), (error) => error instanceof ApiError && error.status === 404);
  assert.equal(calls, 0);
});

test('listCategories validates that every category is a string', async (t) => {
  const originalFetch = global.fetch;
  t.after(() => { global.fetch = originalFetch; });
  global.fetch = async () => jsonResponse(['smartphones', 42]);
  await assert.rejects(() => listCategories(), ApiError);
});
