/* Sales commission calculator: commission on a sales figure at a flat rate or with up to two higher tiers, applied to
   the sales in each band (marginal) or to all sales once a tier is reached (whole amount), and the balance after a
   draw. Runs locally. */
const cents = (x) => Math.round(x * 100) / 100;
const num = (v) => Number(String(v ?? '').replace(/[,\s$£€%]/g, ''));
const blank = (v) => String(v ?? '').trim() === '';

/** tiers: [{ above, rate }], blank tiers ignored. method: 'marginal' (each rate on its own band) or 'whole'. */
export function salesCommission({ sales, rate, tiers = [], method = 'marginal', draw = '' }) {
  const S = num(sales), r = num(rate);
  if (blank(sales) || !Number.isFinite(S) || S < 0 || S > 1e12) return { error: 'Enter the sales amount.' };
  if (blank(rate) || !Number.isFinite(r) || r < 0 || r > 100) return { error: 'Enter the commission rate as a percentage, from 0 to 100.' };
  const bands = [{ from: 0, rate: r }];
  for (const t of tiers) {
    if (blank(t.above) && blank(t.rate)) continue;
    const a = num(t.above), tr = num(t.rate);
    if (blank(t.above) || !Number.isFinite(a) || a <= 0) return { error: 'Enter the sales level where each higher rate starts.' };
    if (blank(t.rate) || !Number.isFinite(tr) || tr < 0 || tr > 100) return { error: 'Enter the rate for each tier as a percentage, from 0 to 100.' };
    if (a <= bands[bands.length - 1].from) return { error: 'Each tier must start at a higher sales level than the one before it.' };
    bands.push({ from: a, rate: tr });
  }
  let rows;
  if (method === 'whole') {
    // the rate of the highest tier the sales go above applies to every sale
    const band = [...bands].reverse().find((b) => S > b.from) || bands[0];
    rows = [{ from: 0, to: null, rate: band.rate, sales: cents(S), commission: cents((S * band.rate) / 100), tierFrom: band.from }];
  } else {
    rows = bands.map((b, i) => {
      const to = i + 1 < bands.length ? bands[i + 1].from : null;
      const part = Math.max(0, Math.min(S, to ?? Infinity) - b.from);
      return { from: b.from, to, rate: b.rate, sales: cents(part), commission: cents((part * b.rate) / 100) };
    });
  }
  const commission = cents(rows.reduce((s, x) => s + x.commission, 0));
  const out = { commission, effectiveRate: S > 0 ? Math.round((commission / S) * 10000) / 100 : 0, rows, tiered: bands.length > 1 };
  if (!blank(draw)) {
    const d = num(draw);
    if (!Number.isFinite(d) || d < 0) return { error: 'Enter the draw as an amount, or leave it blank.' };
    out.draw = { amount: cents(d), balance: cents(commission - d) };
  }
  return out;
}

const $ = (id) => document.getElementById(id);
function run() {
  const r = salesCommission({ sales: $('sales').value, rate: $('rate').value, method: $('method').value, draw: $('draw').value,
    tiers: [{ above: $('t1-above').value, rate: $('t1-rate').value }, { above: $('t2-above').value, rate: $('t2-rate').value }] });
  $('error').textContent = r.error || ''; $('error').hidden = !r.error;
  const body = $('breakdown').tBodies[0];
  body.replaceChildren();
  $('breakdown-box').hidden = !!r.error;
  if (r.error) { for (const id of ['result', 'result-note', 'result-draw']) $(id).textContent = ''; return; }
  const money = (x) => new Intl.NumberFormat('en', { style: 'currency', currency: $('currency').value }).format(x);
  const pct = (x) => `${Number(x.toFixed(2))}%`;
  $('result').textContent = `${money(r.commission)} commission`;
  const sales = r.rows.reduce((s, x) => s + x.sales, 0);
  let how;
  if (!r.tiered) how = `${pct(r.rows[0].rate)} of ${money(sales)}.`;
  else if (r.rows.length === 1) how = r.rows[0].tierFrom > 0 ? `${pct(r.rows[0].rate)} on all ${money(sales)} of sales, because they are above ${money(r.rows[0].tierFrom)}.` : `${pct(r.rows[0].rate)} on all ${money(sales)} of sales; no higher tier was reached.`;
  else {
    const used = r.rows.filter((x, i) => i === 0 || x.sales > 0);
    how = used.map((x, i) => `${pct(x.rate)} on ${i === 0 ? 'the first' : 'the next'} ${money(x.sales)}`).join(', ') + '.';
  }
  $('result-note').textContent = `Effective rate ${pct(r.effectiveRate)} of sales. ${how}`;
  const d = r.draw;
  $('result-draw').textContent = !d || d.amount === 0 ? '' : d.balance >= 0
    ? `After the draw of ${money(d.amount)} already paid, ${money(d.balance)} more is due.`
    : `The draw of ${money(d.amount)} is ${money(-d.balance)} more than the commission earned. With a recoverable draw that shortfall is carried forward to later commission; with a non-recoverable draw it is not repaid.`;
  for (const x of r.rows) {
    const tr = document.createElement('tr');
    const band = x.to === null ? (x.from === 0 ? 'All sales' : `Above ${money(x.from)}`) : `${money(x.from)} to ${money(x.to)}`;
    for (const c of [band, pct(x.rate), money(x.sales), money(x.commission)]) { const td = document.createElement('td'); td.textContent = c; tr.append(td); }
    body.append(tr);
  }
}
if (typeof document !== 'undefined' && $('sales')) {
  for (const id of ['sales', 'currency', 'rate', 't1-above', 't1-rate', 't2-above', 't2-rate', 'method', 'draw']) $(id).addEventListener('input', run);
  run();
}
