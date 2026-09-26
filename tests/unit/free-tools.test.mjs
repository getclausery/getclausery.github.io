import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amountInWords } from '../../free-tools/amount-in-words.js';
import { addPeriod } from '../../free-tools/deadline-calculator.js';

test('amount in words: contract, cheque and plain styles', () => {
  assert.equal(amountInWords('1250.50', 'USD', 'legal').withFigure, 'One Thousand Two Hundred and Fifty Dollars and Fifty Cents ($1,250.50)');
  assert.equal(amountInWords('1,250.50', 'USD', 'cheque').text, 'One Thousand Two Hundred and Fifty Dollars and 50/100');
  assert.equal(amountInWords('1', 'GBP', 'legal').text, 'One Pound');
  assert.equal(amountInWords('2.01', 'GBP', 'legal').text, 'Two Pounds and One Penny');
  assert.equal(amountInWords('$5000', 'USD', 'legal', 'upper').text, 'FIVE THOUSAND DOLLARS');
  assert.match(amountInWords('12.345', 'USD').error, /two decimal places/);
  assert.match(amountInWords('abc', 'USD').error, /Enter a number/);
});

test('deadline calculator: month-end clamping, business days and holidays', () => {
  assert.equal(addPeriod('2026-01-31', 1, 'months').date, '2026-02-28');
  assert.equal(addPeriod('2024-02-29', 1, 'years').date, '2025-02-28');
  assert.equal(addPeriod('2026-09-25', 5, 'business').date, '2026-10-02');            // Friday + 5 business days
  assert.equal(addPeriod('2026-09-25', 5, 'business', 1, ['2026-09-28']).date, '2026-10-05');
  assert.equal(addPeriod('2026-10-05', 1, 'business', -1).date, '2026-10-02');         // Monday - 1 business day = Friday
  assert.equal(addPeriod('2026-09-25', 30, 'days', -1).date, '2026-08-26');
  assert.equal(addPeriod('2026-09-25', 2, 'weeks').date, '2026-10-09');
  assert.match(addPeriod('nope', 1, 'days').error, /valid start date/);
  assert.match(addPeriod('2026-09-25', -3, 'days').error, /whole number/);
});

test('late payment interest: contract rates and UK statutory interest', async () => {
  const { lateInterest, ukCompensation } = await import('../../free-tools/late-payment-interest.js');
  const r = lateInterest({ amount: '10,000', due: '2026-01-01', paid: '2026-04-11', rate: '10' });
  assert.equal(r.days, 100);
  assert.equal(r.interest, 273.97);                                        // 10,000 × 10% × 100/365
  assert.equal(lateInterest({ amount: 1200, due: '2026-03-01', paid: '2026-03-31', rate: 1.5, basis: 'month' }).annual, 18);
  const uk = lateInterest({ amount: 5000, due: '2026-06-01', paid: '2026-07-01', basis: 'uk', baseRate: 4 });
  assert.equal(uk.annual, 12);
  assert.equal(uk.compensation, 70);
  assert.equal(uk.interest, 49.32);                                        // 5,000 × 12% × 30/365
  assert.deepEqual([ukCompensation(999.99), ukCompensation(1000), ukCompensation(10000)], [40, 70, 100]);
  assert.match(lateInterest({ amount: 100, due: '2026-05-01', paid: '2026-04-01', rate: 5 }).error, /after the due date/);
});

test('freelance rate: works back from take-home income', async () => {
  const { freelanceRate } = await import('../../free-tools/freelance-rate.js');
  const r = freelanceRate({ income: 60000, expenses: 6000, taxRate: 25, weeksOff: 6, hoursPerWeek: 25 });
  assert.equal(r.revenue, 86000);                                          // 60,000 / 0.75 + 6,000
  assert.equal(r.hours, 1150);                                             // 25 × 46
  assert.equal(r.hourly, 74.78);
  assert.equal(r.daily, 598.26);
  assert.match(freelanceRate({ income: 50000, taxRate: 20, weeksOff: 52, hoursPerWeek: 20 }).error, /weeks/);
});
