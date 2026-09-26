/* Prorated rent calculator: the rent for part of a month when a tenant moves in or out mid-month, by the days in that
   month, a 365-day year or a 30-day month. The move-in or move-out day counts as a day of the tenancy. Runs locally. */
const cents = (x) => Math.round(x * 100) / 100;
const num = (v) => Number(String(v ?? '').replace(/[,\s$£€]/g, ''));
export const METHODS = [['month', 'Days in that month'], ['year', '365-day year'], ['banker', '30-day month']];

/** direction: 'in' charges from the date to the end of its month; 'out' from the 1st to the date. */
export function proratedRent({ rent, date, direction = 'in', method = 'month' }) {
  const R = num(rent);
  if (String(rent ?? '').trim() === '' || !Number.isFinite(R) || R <= 0 || R > 1e9) return { error: 'Enter the monthly rent.' };
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date || ''));
  const dim = m ? new Date(Date.UTC(+m[1], +m[2], 0)).getUTCDate() : 0;
  if (!m || +m[2] < 1 || +m[2] > 12 || +m[3] < 1 || +m[3] > dim) return { error: 'Enter the move-in or move-out date.' };
  const d = +m[3];
  const days = direction === 'out' ? d : dim - d + 1;
  const daily = { month: R / dim, year: (R * 12) / 365, banker: R / 30 };
  if (!daily[method]) return { error: 'Choose a method.' };
  // a 30-day month would charge more than a month's rent for a full 31-day month, so it is capped at the rent
  const amountFor = (k) => cents(Math.min(R, daily[k] * days));
  return {
    amount: amountFor(method), daily: cents(daily[method]), days, daysInMonth: dim, full: days === dim,
    from: direction === 'out' ? `${m[1]}-${m[2]}-01` : date, to: direction === 'out' ? date : `${m[1]}-${m[2]}-${String(dim).padStart(2, '0')}`,
    compare: METHODS.map(([k, label]) => ({ method: k, label, daily: cents(daily[k]), amount: amountFor(k) })),
  };
}

const $ = (id) => document.getElementById(id);
function run() {
  const r = proratedRent({ rent: $('rent').value, date: $('date').value, direction: $('direction').value, method: $('method').value });
  $('error').textContent = r.error || ''; $('error').hidden = !r.error;
  const body = $('compare').tBodies[0];
  body.replaceChildren();
  $('compare-box').hidden = !!r.error;
  if (r.error) { $('result').textContent = ''; $('result-note').textContent = ''; return; }
  const money = (x) => new Intl.NumberFormat('en', { style: 'currency', currency: $('currency').value }).format(x);
  const day = (iso, opts) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', ...opts });
  $('result').textContent = `${money(r.amount)} for ${r.days} ${r.days === 1 ? 'day' : 'days'}`;
  const month = day(r.from, { month: 'long', year: 'numeric' });
  const rate = { month: `the monthly rent ÷ ${r.daysInMonth} days in ${month}`, year: 'the monthly rent × 12 ÷ 365 days', banker: 'the monthly rent ÷ 30 days' }[$('method').value];
  const span = `${day(r.from, { month: 'long', day: 'numeric' })} to ${day(r.to, { month: 'long', day: 'numeric' })}`;
  $('result-note').textContent = r.full
    ? `That is the whole of ${month}, so the full month's rent is due.`
    : `Daily rate ${money(r.daily)} (${rate}). Rent for ${span}, counting the ${$('direction').value === 'out' ? 'move-out' : 'move-in'} day.`;
  for (const x of r.compare) {
    const tr = document.createElement('tr');
    for (const c of [x.label, money(x.daily), money(x.amount)]) { const td = document.createElement('td'); td.textContent = c; tr.append(td); }
    body.append(tr);
  }
}
if (typeof document !== 'undefined' && $('rent')) {
  if (!$('date').value) { const t = new Date(); $('date').value = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`; }
  for (const id of ['rent', 'currency', 'date', 'direction', 'method']) $(id).addEventListener('input', run);
  run();
}
