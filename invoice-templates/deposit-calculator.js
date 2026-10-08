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
    const update = () => {
      const result = calculateDeposit(form.elements.amount.value, form.elements.percentage.value);
      const output = document.querySelector('#deposit-result');
      if (!result) { output.textContent = 'Enter a non-negative project amount and a deposit from 0% to 100%.'; return; }
      const money = new Intl.NumberFormat('en', { style: 'currency', currency: form.elements.currency.value });
      output.textContent = `${money.format(result.deposit)} deposit · ${money.format(result.balance)} remaining`;
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', (event) => { event.preventDefault(); update(); });
    update();
  }
}
