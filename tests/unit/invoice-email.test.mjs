import { test } from 'node:test';
import assert from 'node:assert/strict';
import { invoiceEmail } from '../../free-tools/invoice-email.js';

const base = { mode: 'send', client: 'Morgan', sender: 'River Studio', reference: 'INV-0042', work: 'website design', amount: '600.01', currency: 'USD', date: '2026-10-09' };
const make = (changes = {}) => invoiceEmail({ ...base, ...changes }, '2026-10-09');

test('invoice messages reject invalid money and impossible or misleading dates', () => {
  for (const amount of ['', '0', '-1', '12.345', '1e3', '1,000', 'NaN', 'Infinity', '9999999999999']) assert.equal(make({ amount }).field, 'amount', amount);
  for (const date of ['', '2026-02-29', '2026-04-31', '2026-13-01', '26-10-09']) assert.equal(make({ date }).field, 'date', date);
  assert.equal(make({ date: '2024-02-29' }).body.includes('29 February 2024'), true);
  for (const date of ['2026-10-09', '2026-10-10']) assert.equal(make({ mode: 'overdue', date }).field, 'date');
  assert.equal(make({ mode: 'overdue', date: '2026-10-08' }).body.includes('outstanding'), true);
  assert.equal(make({ mode: 'received', date: '2026-10-10' }).field, 'date');
});

test('payment acknowledgement preserves cents and does not assert full settlement', () => {
  const out = make({ mode: 'received', amount: '0.10', currency: 'ETB', payment: 'Irrelevant bank details' });
  assert.match(out.body, /ETB 0\.10 on 9 October 2026 toward invoice INV-0042/);
  assert.doesNotMatch(out.body, /paid in full|settled|Irrelevant bank details|attached/);
  assert.match(make({ amount: '999999999999.99' }).body, /USD 999,999,999,999\.99/);
});

test('untrusted single-line fields cannot inject new email headers', () => {
  const out = make({ sender: 'River\r\nBcc: private@example.test', reference: 'INV-1\u0000\nCc: x' });
  assert.equal([...out.subject].some((char) => char.codePointAt(0) < 32), false);
  assert.match(out.subject, /River Bcc: private@example.test/);
  for (const field of ['client', 'sender', 'reference']) assert.equal(make({ [field]: ' \n ' }).field, field);
  assert.equal(make({ payment: 'x'.repeat(501) }).field, 'payment');
  assert.equal(make({ currency: 'INVALID' }).field, 'currency');
  assert.equal(make({ mode: 'INVALID' }).field, 'mode');
});
