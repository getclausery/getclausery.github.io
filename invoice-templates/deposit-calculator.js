/* A public billing-stage calculator. No storage, tracking or network calls; amounts never leave this page. */
export function calculateDeposit(amount, percentage) {
  if (amount === '' || percentage === '') return null;
  const total = Number(amount), percent = Number(percentage);
  if (!Number.isFinite(total) || !Number.isFinite(percent) || total < 0 || total > 1e12 || percent < 0 || percent > 100) return null;
  const cents = Math.round(total * 100);
  const depositCents = Math.round(cents * percent / 100);
  return { deposit: depositCents / 100, balance: (cents - depositCents) / 100 };
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('#deposit-calculator');
  if (form) {
    const output = document.querySelector('#deposit-result');
    const cta = document.querySelector('#deposit-open');
    const fmt = (n, c) => new Intl.NumberFormat('en', { style: 'currency', currency: c }).format(n);
    const update = () => {
      const result = calculateDeposit(form.elements.amount.value, form.elements.percentage.value);
      if (!result) { output.textContent = 'Enter a non-negative project amount and a deposit from 0% to 100%.'; return; }
      const currency = form.elements.currency.value;
      output.innerHTML = `<strong>${fmt(result.deposit, currency)} deposit · ${fmt(result.balance, currency)} remaining</strong>`;
      if (cta && result.deposit > 0) {
        const base = cta.getAttribute('data-href') || cta.getAttribute('href');
        if (!cta.getAttribute('data-href')) cta.setAttribute('data-href', base);
        cta.setAttribute('href', base + '?rate=' + result.deposit + '&hours=1&tax=0&currency=' + encodeURIComponent(currency));
      }
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', (event) => { event.preventDefault(); update(); });
    update();
  }
}
