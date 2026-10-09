// Convert decimal amounts to integer cents before subtracting payments.
function cents(value) {
  const text = String(value).trim();
  if (!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(text)) return null;
  const [whole, fraction = ''] = text.split('.');
  const result = Number(whole || 0) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(result) && result <= 1e14 ? result : null;
}

export function calculatePaymentBalance(total, previous, current) {
  const invoice = cents(total), earlier = cents(previous), received = cents(current);
  if (invoice === null || earlier === null || received === null || invoice <= 0 || received <= 0 || earlier > invoice) return null;
  return { received: received / 100, totalPaid: (earlier + received) / 100, balance: (invoice - earlier - received) / 100 };
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('#receipt-calculator');
  if (form) {
    const total = form.querySelector('#receipt-total'), previous = form.querySelector('#receipt-previous'), current = form.querySelector('#receipt-current'), currency = form.querySelector('#receipt-currency');
    const result = form.querySelector('#receipt-result');
    const update = () => {
      const amounts = calculatePaymentBalance(total.value, previous.value, current.value);
      if (!amounts) {
        result.textContent = 'Enter a positive invoice total and current payment, and previous payments from zero up to the invoice total. Use at most two decimal places and amounts up to 1 trillion.';
        return;
      }
      const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.value });
      const received = `${money.format(amounts.received)} received now`;
      result.textContent = amounts.balance < 0
        ? `${received} · ${money.format(-amounts.balance)} overpaid. Reconcile the payments before issuing a paid-in-full receipt.`
        : amounts.balance === 0
          ? `${received} · ${money.format(0)} remaining — paid in full`
          : `${received} · ${money.format(amounts.balance)} remaining — partial payment`;
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', (event) => { event.preventDefault(); update(); });
    update();
  }
}
