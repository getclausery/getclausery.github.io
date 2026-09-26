/* Late payment interest calculator: simple interest on an overdue amount at a contract rate (per year or per month)
   or at the UK statutory rate (8% above the Bank of England base rate) with the fixed compensation sums. Runs locally. */
import { parseDate } from '../app/lib/expr.js';

const DAY = 86400000;
const utc = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
/** UK Late Payment of Commercial Debts (Interest) Act 1998 fixed sums, by size of debt. */
export const ukCompensation = (amount) => (amount < 1000 ? 40 : amount < 10000 ? 70 : 100);

export function lateInterest({ amount, due, paid, rate, basis = 'year', baseRate = 0 }) {
  const a = Number(String(amount).replace(/[,\s$£€]/g, ''));
  if (!Number.isFinite(a) || a <= 0) return { error: 'Enter the amount owed.' };
  const d1 = parseDate(due); const d2 = parseDate(paid);
  if (!d1 || !d2) return { error: 'Enter the due date and the payment date.' };
  const days = Math.round((utc(d2) - utc(d1)) / DAY);
  if (days <= 0) return { error: 'The payment date must be after the due date.' };
  let annual;
  if (basis === 'uk') {
    const b = Number(baseRate); if (!Number.isFinite(b) || b < 0 || b > 25) return { error: 'Enter the Bank of England base rate as a percentage.' };
    annual = b + 8;
  } else {
    const r = Number(rate); if (!Number.isFinite(r) || r < 0 || r > 100) return { error: 'Enter the interest rate as a percentage.' };
    annual = basis === 'month' ? r * 12 : r;
  }
  const interest = Math.round(a * (annual / 100) * (days / 365) * 100) / 100;
  const compensation = basis === 'uk' ? ukCompensation(a) : 0;
  return { days, annual, interest, compensation, daily: Math.round(a * (annual / 100) / 365 * 100) / 100, total: Math.round((a + interest + compensation) * 100) / 100 };
}

const $ = (id) => document.getElementById(id);
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
function run() {
  const basis = $('basis').value;
  $('rate-row').hidden = basis === 'uk'; $('base-row').hidden = basis !== 'uk';
  if (basis === 'uk') $('currency').value = 'GBP';
  const r = lateInterest({ amount: $('amount').value, due: $('due').value, paid: $('paid').value, rate: $('rate').value, basis, baseRate: $('base').value });
  $('error').textContent = r.error || ''; $('error').hidden = !r.error;
  const money = (n) => new Intl.NumberFormat('en', { style: 'currency', currency: $('currency').value }).format(n);
  if (r.error) { $('result').textContent = ''; $('result-note').textContent = ''; return; }
  $('result').textContent = `Interest: ${money(r.interest)}`;
  $('result-note').textContent = `${r.days} days late at ${r.annual.toFixed(2)}% a year (${money(r.daily)} a day).${r.compensation ? ` Plus fixed compensation of ${money(r.compensation)}.` : ''} Total now due: ${money(r.total)}.`;
}
if (typeof document !== 'undefined' && $('amount')) {
  const today = new Date(); $('paid').value = iso(today);
  const due = new Date(today); due.setDate(due.getDate() - 45); $('due').value = iso(due);
  for (const id of ['amount', 'due', 'paid', 'rate', 'basis', 'base', 'currency']) $(id).addEventListener('input', run);
  run();
}
