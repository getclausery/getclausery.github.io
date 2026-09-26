/* Loan repayment calculator: the equal payment that repays a loan with interest over a number of instalments
   (an amortised loan), the total interest, and a full repayment schedule with optional dates. Runs locally. */
import { formatDate } from '../app/lib/expr.js';
import { addPeriod } from './deadline-calculator.js';

export const PER_YEAR = { weekly: 52, fortnightly: 26, monthly: 12, quarterly: 4, yearly: 1 };
const STEP = { weekly: [1, 'weeks'], fortnightly: [2, 'weeks'], monthly: [1, 'months'], quarterly: [3, 'months'], yearly: [1, 'years'] };
const cents = (x) => Math.round(x * 100) / 100;

export function loanRepayment({ amount, rate, payments, frequency = 'monthly', firstPayment = '' }) {
  const n = (v) => Number(String(v ?? '').replace(/[,\s$£€%]/g, ''));
  const [P, r, N] = [n(amount), n(rate), n(payments)];
  if (!Number.isFinite(P) || P <= 0 || P > 1e10) return { error: 'Enter the loan amount.' };
  if (String(rate ?? '').trim() === '' || !Number.isFinite(r) || r < 0 || r > 100) return { error: 'Enter the yearly interest rate as a percentage, or 0 for an interest-free loan.' };
  if (!Number.isInteger(N) || N < 1 || N > 1200) return { error: 'Enter the number of payments, a whole number from 1 to 1200.' };
  const k = PER_YEAR[frequency]; if (!k) return { error: 'Choose how often payments are made.' };
  const i = r / 100 / k;
  const payment = cents(i === 0 ? P / N : (P * i) / (1 - Math.pow(1 + i, -N)));
  const rows = []; let balance = P;
  for (let t = 1; t <= N; t++) {
    const interest = cents(balance * i);
    // every payment is the same except the last, which clears whatever rounding has left
    const principal = t === N ? cents(balance) : Math.min(cents(payment - interest), cents(balance));
    balance = cents(balance - principal);
    const row = { n: t, payment: cents(principal + interest), interest, principal, balance };
    if (firstPayment) {
      const [step, unit] = STEP[frequency];
      const d = addPeriod(firstPayment, step * (t - 1), unit);
      if (d.error) return { error: 'Enter a valid first payment date, or leave it blank.' };
      row.date = d.date;
    }
    rows.push(row);
  }
  const totalPaid = cents(rows.reduce((s, x) => s + x.payment, 0));
  return { payment, last: rows[N - 1].payment, totalPaid, totalInterest: cents(totalPaid - P), rows };
}

const $ = (id) => document.getElementById(id);
function run() {
  const r = loanRepayment({ amount: $('amount').value, rate: $('rate').value, payments: $('payments').value, frequency: $('frequency').value, firstPayment: $('first').value });
  $('error').textContent = r.error || ''; $('error').hidden = !r.error;
  const body = $('schedule').tBodies[0];
  body.replaceChildren();
  $('schedule-box').hidden = !!r.error;
  if (r.error) { $('result').textContent = ''; $('result-note').textContent = ''; return; }
  const money = (x) => new Intl.NumberFormat('en', { style: 'currency', currency: $('currency').value }).format(x);
  const per = { weekly: 'a week', fortnightly: 'every two weeks', monthly: 'a month', quarterly: 'a quarter', yearly: 'a year' }[$('frequency').value];
  const count = r.rows.length;
  $('result').textContent = `${money(r.payment)} ${per}`;
  const lastRow = r.rows[count - 1];
  $('result-note').textContent = `${count} payment${count === 1 ? '' : 's'}. Total repaid ${money(r.totalPaid)}, of which ${money(r.totalInterest)} is interest.${r.last !== r.payment ? ` The last payment is ${money(r.last)}.` : ''}${lastRow.date ? ` Final payment on ${formatDate(lastRow.date, 'long', 'en-US')}.` : ''}`;
  $('date-col').hidden = !lastRow.date;
  for (const row of r.rows) {
    const tr = document.createElement('tr');
    const cells = [String(row.n), ...(row.date ? [formatDate(row.date, 'medium', 'en-US')] : []), money(row.payment), money(row.interest), money(row.principal), money(row.balance)];
    for (const c of cells) { const td = document.createElement('td'); td.textContent = c; tr.append(td); }
    body.append(tr);
  }
}
if (typeof document !== 'undefined' && $('payments')) {
  for (const id of ['amount', 'rate', 'payments', 'frequency', 'first', 'currency']) $(id).addEventListener('input', run);
  run();
}
