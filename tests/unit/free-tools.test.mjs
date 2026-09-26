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

test('invoice due date: net, end-of-month, MFI and early payment discount terms', async () => {
  const { parseTerms, invoiceDue } = await import('../../free-tools/invoice-due-date.js');
  const due = (terms, extra = {}) => invoiceDue({ invoiceDate: '2026-03-12', terms, today: '2026-03-12', ...extra });
  assert.equal(due('net 30').due, '2026-04-11');
  assert.equal(due('net 30').daysLeft, 30);
  assert.equal(due('Net 30', { weekends: true }).due, '2026-04-13');                 // Saturday moves to Monday
  assert.equal(due('net 30', { weekends: true }).moved, '2026-04-11');
  assert.equal(due('due on receipt').due, '2026-03-12');
  assert.equal(due('EOM').due, '2026-03-31');
  assert.equal(due('net 30 EOM').due, '2026-04-30');
  assert.equal(due('15 MFI').due, '2026-04-15');
  assert.equal(invoiceDue({ invoiceDate: '2026-01-20', terms: '31 mfi' }).due, '2026-02-28'); // clamped to a short month
  const d = due('2/10 net 30', { amount: '4,800' });
  assert.deepEqual(d.discount, { pct: 2, by: '2026-03-22', days: 10, annualCost: 37.2, amount: 4800, saving: 96, pay: 4704 });
  assert.deepEqual(parseTerms('2/10, n/30'), { net: 30, eom: false, pct: 2, discDays: 10 });
  assert.deepEqual(parseTerms('1.5/10 net 45'), { net: 45, eom: false, pct: 1.5, discDays: 10 });
  assert.deepEqual(parseTerms('10th prox'), { mfi: 10 });
  assert.equal(invoiceDue({ invoiceDate: '2026-03-12', terms: 'net 30', today: '2026-04-20' }).daysLeft, -9);
  assert.match(parseTerms('2/40 net 30').error, /discount period/);
  assert.match(parseTerms('whenever').error, /net 30/);
  assert.match(due('net 30', { amount: 'lots' }).error, /amount/);
  assert.match(invoiceDue({ invoiceDate: '', terms: 'net 30' }).error, /invoice date/);
});

test('embed pages are kept out of the sitemap and llms.txt', async () => {
  const { readFileSync } = await import('node:fs');
  assert.doesNotMatch(readFileSync('sitemap.xml', 'utf8'), /free-tools\/embed/);
  assert.doesNotMatch(readFileSync('llms.txt', 'utf8'), /free-tools\/embed/);
  assert.match(readFileSync('sitemap.xml', 'utf8'), /free-tools\/invoice-due-date\.html/);
  const embed = readFileSync('free-tools/embed/invoice-due-date.html', 'utf8');
  assert.match(embed, /<meta name="robots" content="noindex, follow">/);
  assert.doesNotMatch(embed, /site-header|rel="canonical"/);
});

test('loan repayment: equal payments, rounding on the last one, and dated schedules', async () => {
  const { loanRepayment } = await import('../../free-tools/loan-repayment.js');
  const r = loanRepayment({ amount: '12,000', rate: '5', payments: 24, frequency: 'monthly', firstPayment: '2026-11-01' });
  assert.equal(r.payment, 526.46);                                         // 12,000 × i / (1 − (1 + i)^−24), i = 5% / 12
  assert.equal(r.rows[0].interest, 50);                                    // 12,000 × 5% / 12
  assert.equal(r.rows.at(-1).balance, 0);
  assert.equal(r.last, 526.35);
  assert.equal(r.totalInterest, 634.93);
  assert.equal(r.rows.at(-1).date, '2028-10-01');
  assert.deepEqual(loanRepayment({ amount: 1000, rate: 0, payments: 3 }).rows.map((x) => x.payment), [333.33, 333.33, 333.34]);
  assert.deepEqual(loanRepayment({ amount: 5000, rate: 8, payments: 3, firstPayment: '2026-01-31' }).rows.map((x) => x.date), ['2026-01-31', '2026-02-28', '2026-03-31']);
  assert.equal(loanRepayment({ amount: 5000, rate: 8, payments: 52, frequency: 'weekly', firstPayment: '2026-01-31' }).rows[1].date, '2026-02-07');
  assert.match(loanRepayment({ amount: 5000, rate: '', payments: 3 }).error, /interest rate/);
  assert.match(loanRepayment({ amount: 5000, rate: 5, payments: 2.5 }).error, /whole number/);
  assert.match(loanRepayment({ amount: 0, rate: 5, payments: 12 }).error, /loan amount/);
});

test('sales commission: flat, marginal and whole-amount tiers, and the balance after a draw', async () => {
  const { salesCommission } = await import('../../free-tools/sales-commission.js');
  const tiers = [{ above: 50000, rate: 8 }, { above: '', rate: '' }];
  const m = salesCommission({ sales: '80,000', rate: 5, tiers });
  assert.equal(m.commission, 4900);
  assert.equal(m.effectiveRate, 6.13);
  assert.deepEqual(m.rows.map((x) => [x.sales, x.commission]), [[50000, 2500], [30000, 2400]]);
  assert.equal(salesCommission({ sales: 80000, rate: 5, tiers: [] }).commission, 4000);
  const w = salesCommission({ sales: 80000, rate: 5, tiers, method: 'whole', draw: 6000 });
  assert.equal(w.commission, 6400);
  assert.deepEqual(w.draw, { amount: 6000, balance: 400 });
  // a tier applies only above its level, so sales exactly at the level stay on the base rate
  assert.equal(salesCommission({ sales: 50000, rate: 5, tiers, method: 'whole' }).commission, 2500);
  const three = salesCommission({ sales: 120000, rate: 5, tiers: [{ above: 50000, rate: 8 }, { above: 100000, rate: 10 }], draw: '9000' });
  assert.equal(three.commission, 8500);
  assert.equal(three.draw.balance, -500);
  assert.match(salesCommission({ sales: 1000, rate: 5, tiers: [{ above: 50000, rate: 8 }, { above: 40000, rate: 10 }] }).error, /higher sales level/);
  assert.match(salesCommission({ sales: '', rate: 5 }).error, /sales amount/);
  assert.match(salesCommission({ sales: 100, rate: 120 }).error, /percentage/);
  assert.match(salesCommission({ sales: 100, rate: 5, tiers: [{ above: 10, rate: '' }] }).error, /each tier/);
});

test('the download-all pack holds every library template in its category folder, with a README', async () => {
  const { readFileSync } = await import('node:fs');
  const { default: JSZip } = await import('jszip');
  const { LIB, CATEGORY_ORDER, PACK_FILE } = await import('../../site/library.mjs');
  const zip = await JSZip.loadAsync(readFileSync(`samples/${PACK_FILE}`));
  const docs = Object.keys(zip.files).filter((n) => n.endsWith('.docx'));
  assert.equal(docs.length, LIB.length);
  const label = Object.fromEntries(CATEGORY_ORDER);
  for (const t of LIB) {
    const entry = docs.find((n) => n === `${label[t.category]}/${t.name}.docx`);
    assert.ok(entry, `${t.slug} is in the pack`);
    assert.deepEqual(await zip.file(entry).async('nodebuffer'), readFileSync(`samples/${t.file}`));
  }
  const readme = await zip.file('README.txt').async('string');
  for (const t of LIB) assert.ok(readme.includes(`templates/${t.slug}.html`), `README links ${t.slug}`);
});
