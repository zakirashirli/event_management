import test from 'node:test';
import assert from 'node:assert/strict';
import { seats, zones } from '../venue.js';
import { validateCart, loadCart, saveCart, STORAGE_KEY } from '../storage.js';
test('venue has unique identifiers and all three price categories', () => {
  assert.equal(seats.length, 132);
  assert.equal(new Set(seats.map(s => s.id)).size, 132);
  assert.deepEqual([...new Set(seats.map(s => s.price))], zones.map(z => z.price));
});
test('untrusted saved carts reject unavailable, unknown, duplicate and malformed entries', () => {
  assert.deepEqual(validateCart(['A-1', 'A-1', 'A-3', 'missing', null, {}, 'L-1']), ['A-1', 'L-1']);
  for (const value of [null, {}, 'A-1', 42]) assert.deepEqual(validateCart(value), []);
});
test('storage round trip and corruption handling', () => {
  const data = new Map(); const storage = { getItem: key => data.get(key), setItem: (k, v) => data.set(k, v) };
  assert.equal(saveCart(storage, new Set(['D-1', 'L-1'])), true);
  assert.deepEqual(loadCart(storage), ['D-1', 'L-1']);
  data.set(STORAGE_KEY, '{broken'); assert.deepEqual(loadCart(storage), []);
  assert.deepEqual(loadCart(undefined), []); assert.equal(saveCart(undefined, new Set()), false);
});
