/* Invoice due date calculator: turns payment terms as they are written on invoices (net 30, due on receipt, net 30 EOM,
   15 MFI, 2/10 net 30 ...) into a due date, the days left to pay and the value of any early payment discount. Runs locally. */
import { parseDate, formatDate } from '../app/lib/expr.js';

const DAY = 86400000;
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const utc = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
const TERMS_HELP = 'Enter terms such as "net 30", "2/10 net 30", "net 30 EOM" or "15 MFI".';

/** Reads payment terms as written on an invoice. Returns { net, eom, mfi, pct, discDays } or { error }. */
export function parseTerms(text) {
  const s = String(text || '').toLowerCase().replace(/,|\.(?!\d)/g, ' ').replace(/\s+/g, ' ').trim();
  if (!s) return { error: TERMS_HELP };
  let m;
  if (/^(due )?(on|upon) receipt$|^receipt$|^immediate(ly)?$|^net 0$/.test(s)) return { net: 0 };
  if ((m = /^(\d+(?:\.\d+)?) ?%? ?\/ ?(\d+) ?(?:days? )?n(?:et)? ?\/? ?(\d+)(?: days?)?( eom)?$/.exec(s))) {
    const [pct, discDays, net] = [Number(m[1]), Number(m[2]), Number(m[3])];
    if (!(pct > 0 && pct < 100)) return { error: 'The discount must be between 0% and 100%.' };
    if (net > 365) return { error: 'Payment terms longer than 365 days are not supported.' };
    if (discDays > net) return { error: 'The discount period must end before the invoice is due.' };
    return { net, eom: !!m[4], pct, discDays };
  }
  if ((m = /^(?:n(?:et)? ?\/? ?)?(\d+)(?: days?)?( eom)?$/.exec(s))) {
    const net = Number(m[1]);
    if (net > 365) return { error: 'Payment terms longer than 365 days are not supported.' };
    return { net, eom: !!m[2] };
  }
  if ((m = /^(?:net )?(?:eom|end of (?:the )?month)(?: ?(\d+))?$/.exec(s))) return { net: m[1] ? Number(m[1]) : 0, eom: true };
  if ((m = /^(\d{1,2})(?:st|nd|rd|th)? (?:mfi|prox(?:imo)?|of (?:the )?(?:following|next) month)$/.exec(s))) {
    const day = Number(m[1]);
    if (day < 1 || day > 31) return { error: 'Enter a day of the month from 1 to 31.' };
    return { mfi: day };
  }
  return { error: TERMS_HELP };
}

const shift = (d, weekends) => { const w = d.getDay(); if (weekends && (w === 0 || w === 6)) d.setDate(d.getDate() + (w === 6 ? 2 : 1)); return d; };

/** Due date, days left and early payment discount for an invoice. `today` (a Date or YYYY-MM-DD) is injectable for tests. */
export function invoiceDue({ invoiceDate, terms, amount, weekends = false, today = new Date() }) {
  const d = parseDate(invoiceDate); if (!d) return { error: 'Enter the invoice date.' };
  const t = typeof terms === 'string' ? parseTerms(terms) : terms;
  if (t.error) return { error: t.error };
  let a = null;
  if (amount !== undefined && String(amount).trim() !== '') {
    a = Number(String(amount).replace(/[,\s$£€]/g, ''));
    if (!Number.isFinite(a) || a <= 0) return { error: 'Enter the invoice amount as a number, or leave it blank.' };
  }
  const start = t.eom ? new Date(d.getFullYear(), d.getMonth() + 1, 0) : new Date(d);
  let due, basis;
  if (t.mfi) {
    const last = new Date(d.getFullYear(), d.getMonth() + 2, 0).getDate();
    due = new Date(d.getFullYear(), d.getMonth() + 1, Math.min(t.mfi, last));
    basis = `the ${ordinal(t.mfi)} of the month after the invoice date${t.mfi > last ? ' (the last day, as the month is shorter)' : ''}`;
  } else {
    due = new Date(start); due.setDate(due.getDate() + t.net);
    basis = t.net === 0 ? (t.eom ? 'the last day of the invoice month' : 'the invoice date') : `${t.net} day${t.net === 1 ? '' : 's'} after ${t.eom ? 'the end of the invoice month' : 'the invoice date'}`;
  }
  const unshifted = iso(due);
  shift(due, weekends);
  const out = { due: iso(due), basis, moved: iso(due) !== unshifted ? unshifted : null, daysLeft: Math.round((utc(due) - utc(parseDate(today) || new Date())) / DAY) };
  if (t.pct) {
    const by = new Date(start); by.setDate(by.getDate() + t.discDays); shift(by, weekends);
    out.discount = { pct: t.pct, by: iso(by), days: t.discDays };
    // Cost of passing up the discount, as a simple yearly rate: pct / (100 - pct) × 365 / (days between the two dates).
    if (t.net > t.discDays) out.discount.annualCost = Math.round((t.pct / (100 - t.pct)) * (365 / (t.net - t.discDays)) * 1000) / 10;
    if (a !== null) {
      const saving = Math.round(a * t.pct) / 100;
      Object.assign(out.discount, { amount: a, saving, pay: Math.round((a - saving) * 100) / 100 });
    }
  }
  return out;
}
function ordinal(n) { const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th'; return n + s; }

const $ = (id) => document.getElementById(id);
function run() {
  const custom = $('terms').value === 'other';
  $('custom-row').hidden = !custom;
  const r = invoiceDue({ invoiceDate: $('invoice').value, terms: custom ? $('custom').value : $('terms').value, amount: $('amount').value, weekends: $('weekends').checked });
  $('error').textContent = r.error || ''; $('error').hidden = !r.error;
  if (r.error) { for (const id of ['result', 'result-note', 'result-discount']) $(id).textContent = ''; return; }
  const long = (s) => formatDate(s, 'full', 'en-US');
  const money = (n) => new Intl.NumberFormat('en', { style: 'currency', currency: $('currency').value }).format(n);
  $('result').textContent = `Due ${long(r.due)}`;
  const when = r.daysLeft > 0 ? `That is ${r.daysLeft} day${r.daysLeft === 1 ? '' : 's'} from today.` : r.daysLeft === 0 ? 'That is today.' : `That was ${-r.daysLeft} day${r.daysLeft === -1 ? '' : 's'} ago, so the invoice is overdue.`;
  $('result-note').textContent = `${r.basis[0].toUpperCase()}${r.basis.slice(1)}. ${when}${r.moved ? ` Moved from ${formatDate(r.moved, 'full', 'en-US').split(',')[0]} because it falls on a weekend.` : ''}`;
  const disc = r.discount;
  $('result-discount').textContent = !disc ? '' : `Early payment: pay by ${long(disc.by)} to take ${disc.pct}% off${disc.pay !== undefined ? ` (${money(disc.pay)} instead of ${money(disc.amount)}, saving ${money(disc.saving)})` : ''}.${disc.annualCost ? ` Passing up the discount costs the equivalent of ${disc.annualCost}% a year.` : ''}`;
}
if (typeof document !== 'undefined' && $('invoice')) {
  $('invoice').value = iso(new Date());
  for (const id of ['invoice', 'terms', 'custom', 'amount', 'currency', 'weekends']) $(id).addEventListener('input', run);
  $('weekends').addEventListener('change', run);
  run();
}
