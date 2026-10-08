import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateDeposit } from '../../invoice-templates/deposit-calculator.js';

test('deposit and remaining balance reconcile to the agreed amount, including fractional cents', () => {
  assert.deepEqual(calculateDeposit(2000, 30), { deposit: 600, balance: 1400 });
  assert.deepEqual(calculateDeposit(100.01, 33.33), { deposit: 33.33, balance: 66.68 });
  assert.deepEqual(calculateDeposit('100.01', '100'), { deposit: 100.01, balance: 0 });
  assert.deepEqual(calculateDeposit(2000, 0), { deposit: 0, balance: 2000 });
  assert.deepEqual(calculateDeposit(0, 30), { deposit: 0, balance: 0 });
});

test('invalid deposit inputs do not produce a plausible money result', () => {
  for (const [amount, percent] of [['', 30], [2000, ''], ['x', 30], [2000, 'x'], [-1, 30], [2000, -1], [2000, 101], [Infinity, 30], [1e13, 30], [2000, NaN]]) assert.equal(calculateDeposit(amount, percent), null);
});
