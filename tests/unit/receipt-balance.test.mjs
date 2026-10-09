import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePaymentBalance } from '../../templates/receipt-balance-calculator.js';

test('a receipt separates the current payment from earlier payments and keeps cents exact', () => {
  assert.deepEqual(calculatePaymentBalance('1000', '200', '300'), { received: 300, totalPaid: 500, balance: 500 });
  assert.deepEqual(calculatePaymentBalance('0.30', '0.10', '0.20'), { received: 0.2, totalPaid: 0.3, balance: 0 });
  assert.deepEqual(calculatePaymentBalance('100.01', '33.33', '33.33'), { received: 33.33, totalPaid: 66.66, balance: 33.35 });
});

test('overpayments remain visible rather than appearing as a zero balance', () => {
  assert.deepEqual(calculatePaymentBalance('100', '90', '20'), { received: 20, totalPaid: 110, balance: -10 });
});

test('invalid or unreconciled receipt amounts cannot produce a plausible result', () => {
  for (const values of [['', 0, 10], [0, 0, 10], [100, '', 10], [100, 0, ''], [100, 0, 0], [100, 101, 1], [100, -1, 1], [100, 0, -1], [100, 0, '0.001'], [100, 0, '1e2'], [Infinity, 0, 1], [1e13, 0, 1], [100, 0, 'x']]) assert.equal(calculatePaymentBalance(...values), null);
});
