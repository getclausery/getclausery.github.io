/* Freelance rate calculator: works back from the income a freelancer wants to keep to the hourly and day rate they
   need to charge, allowing for tax, business costs, time off and non-billable hours. Runs locally. */
export function freelanceRate({ income, expenses, taxRate, weeksOff, hoursPerWeek, hoursPerDay = 8 }) {
  const n = (v) => Number(String(v).replace(/[,\s$£€]/g, ''));
  const [inc, exp, tax, off, hpw, hpd] = [n(income), n(expenses || 0), n(taxRate), n(weeksOff), n(hoursPerWeek), n(hoursPerDay)];
  if (!Number.isFinite(inc) || inc <= 0) return { error: 'Enter the yearly income you want to keep.' };
  if (!Number.isFinite(exp) || exp < 0) return { error: 'Enter your yearly business costs, or 0.' };
  if (!Number.isFinite(tax) || tax < 0 || tax >= 90) return { error: 'Enter an estimated tax rate between 0 and 90%.' };
  if (!Number.isFinite(off) || off < 0 || off > 51) return { error: 'Enter the weeks you will not work, between 0 and 51.' };
  if (!Number.isFinite(hpw) || hpw <= 0 || hpw > 80) return { error: 'Enter billable hours per week, between 1 and 80.' };
  if (!Number.isFinite(hpd) || hpd <= 0 || hpd > 16) return { error: 'Enter hours in a working day, between 1 and 16.' };
  const profit = inc / (1 - tax / 100);          // profit before tax that leaves `income` after tax
  const revenue = profit + exp;
  const hours = hpw * (52 - off);
  const hourly = revenue / hours;
  const r2 = (x) => Math.round(x * 100) / 100;
  return { revenue: r2(revenue), hours, hourly: r2(hourly), daily: r2(hourly * hpd), monthly: r2(revenue / 12) };
}

const $ = (id) => document.getElementById(id);
function run() {
  const r = freelanceRate({ income: $('income').value, expenses: $('expenses').value, taxRate: $('tax').value, weeksOff: $('off').value, hoursPerWeek: $('hpw').value, hoursPerDay: $('hpd').value });
  $('error').textContent = r.error || ''; $('error').hidden = !r.error;
  if (r.error) { $('result').textContent = ''; $('result-note').textContent = ''; return; }
  const money = (x) => new Intl.NumberFormat('en', { style: 'currency', currency: $('currency').value, maximumFractionDigits: 0 }).format(x);
  $('result').textContent = `${money(r.hourly)} an hour · ${money(r.daily)} a day`;
  $('result-note').textContent = `You need to bill ${money(r.revenue)} a year (about ${money(r.monthly)} a month) across ${r.hours.toLocaleString('en')} billable hours.`;
}
if (typeof document !== 'undefined' && $('income')) {
  for (const id of ['income', 'expenses', 'tax', 'off', 'hpw', 'hpd', 'currency']) $(id).addEventListener('input', run);
  run();
}
