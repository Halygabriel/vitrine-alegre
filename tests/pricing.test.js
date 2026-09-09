import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXCHANGE_RATE,
  getDiscountedUsdPrice,
  getFinalBrlPrice,
  getOriginalBrlPrice,
  shouldShowDiscount,
} from '../src/utils/pricing.js';
import { sortProducts } from '../src/utils/products.js';

test('discounted and BRL prices follow the assignment formula', () => {
  const product = { price: 100, discountPercentage: 10 };
  assert.equal(getDiscountedUsdPrice(product), 90);
  assert.equal(getOriginalBrlPrice(product), 100 * EXCHANGE_RATE);
  assert.equal(getFinalBrlPrice(product), 90 * EXCHANGE_RATE);
});

test('discount badge threshold is five percent', () => {
  assert.equal(shouldShowDiscount({ discountPercentage: 4.99 }), false);
  assert.equal(shouldShowDiscount({ discountPercentage: 5 }), true);
});

test('sorting does not mutate the original product array', () => {
  const original = [{ id: 1, price: 20 }, { id: 2, price: 10 }];
  const sorted = sortProducts(original, 'price-asc');
  assert.deepEqual(sorted.map((item) => item.id), [2, 1]);
  assert.deepEqual(original.map((item) => item.id), [1, 2]);
});
