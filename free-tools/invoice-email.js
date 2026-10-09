/* global FormData */
/* Plain-text invoice messages. No storage, network requests or email sending. */
const MODES = new Set(['send', 'reminder', 'overdue', 'received']);
const CURRENCIES = new Set(['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'ETB', 'INR']);
const oneLine = (value) => String(value ?? '').replace(/\p{Cc}/gu, ' ').replace(/\s+/g, ' ').trim();
const localDay = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number(value.slice(0, 4)) < 1900) return false;
  const d = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function invoiceEmail(input, today = localDay()) {
  const mode = input.mode;
  if (!MODES.has(mode)) return { error: 'Choose a message type.', field: 'mode' };
  const data = Object.fromEntries(['client', 'sender', 'reference', 'work', 'payment'].map((key) => [key, oneLine(input[key])]));
  for (const [field, label] of [['client', 'client name'], ['sender', 'your name or business'], ['reference', 'invoice number']]) {
    if (!data[field]) return { error: `Enter the ${label}.`, field };
  }
  for (const field of ['client', 'sender', 'reference', 'work', 'payment']) {
    if (data[field].length > (field === 'payment' ? 500 : 120)) return { error: `Shorten the ${field === 'payment' ? 'payment instructions' : field} entry.`, field };
  }
  const amount = String(input.amount ?? '').trim();
  if (!/^\d{1,12}(?:\.\d{1,2})?$/.test(amount) || Number(amount) <= 0) return { error: `Enter a positive ${mode === 'received' ? 'payment amount received' : 'balance due'}, with up to two decimal places and no currency symbol.`, field: 'amount' };
  if (!CURRENCIES.has(input.currency)) return { error: 'Choose a supported currency.', field: 'currency' };
  const date = String(input.date ?? '');
  if (!validDate(date)) return { error: `Enter a valid ${mode === 'received' ? 'payment' : 'due'} date.`, field: 'date' };
  if (!validDate(today)) return { error: 'Your device date could not be read. Check its date settings.', field: 'date' };
  if (mode === 'overdue' && date >= today) return { error: 'For an overdue follow-up, the due date must be before today. Use a due-date reminder otherwise.', field: 'date' };
  if (mode === 'received' && date > today) return { error: 'Record only money already received; the payment date cannot be in the future.', field: 'date' };
  const money = `${input.currency} ${new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(amount))}`;
  const dateText = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
  const { client, sender, reference, work, payment } = data;
  const about = work ? ` for ${work}` : '';
  const instructions = payment ? `Payment instructions: ${payment}` : 'Please use the payment details on the invoice.';
  let subject, paragraphs;
  if (mode === 'send') {
    subject = `Invoice ${reference} from ${sender} — due ${dateText}`;
    paragraphs = [`I've attached invoice ${reference}${about}. The balance due is ${money}, payable by ${dateText}.`, instructions, 'Please let me know if you need any details corrected or if the invoice should go to someone else on your team.', 'Thank you for your business.'];
  } else if (mode === 'reminder') {
    subject = `Payment reminder: invoice ${reference} — due ${dateText}`;
    paragraphs = [`A friendly reminder that invoice ${reference}${about} has a balance of ${money} due on ${dateText}.`, instructions, 'If you have already paid, thank you. Please send the payment date or reference so I can reconcile it. If there is a question about the invoice, please let me know.'];
  } else if (mode === 'overdue') {
    subject = `Follow-up on invoice ${reference} — payment update requested`;
    paragraphs = [`I'm following up on invoice ${reference}${about}. Our records show a balance of ${money} outstanding, with a due date of ${dateText}.`, 'Could you confirm when payment is expected, or let me know if something needs resolving?', instructions, 'If you have already paid, please send the payment date or reference so I can check our records. Thank you.'];
  } else {
    subject = `Payment received for invoice ${reference}`;
    paragraphs = [`Thank you. We received ${money} on ${dateText} toward invoice ${reference}${about}.`, 'I will update our payment records. If you need a payment receipt, please let me know.', 'Thank you for your business.'];
  }
  return { subject, body: [`Hi ${client},`, ...paragraphs, `Best regards,\n${sender}`].join('\n\n') };
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('#invoice-email-form');
  if (form) {
    document.querySelector('#email-fields').disabled = false;
    const field = (name) => form.elements.namedItem(name);
    const result = document.querySelector('#email-result');
    const status = document.querySelector('#email-status');
    const subject = document.querySelector('#email-subject');
    const body = document.querySelector('#email-body');
    const copy = document.querySelector('#email-copy');
    const invalidate = () => { result.hidden = true; subject.value = ''; body.value = ''; copy.disabled = true; status.textContent = ''; form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid')); };
    const setModeLabels = () => {
      const received = field('mode').value === 'received';
      document.querySelector('#email-amount-label').textContent = received ? 'Payment amount received' : 'Balance due';
      document.querySelector('#email-date-label').textContent = received ? 'Payment date' : 'Due date';
      document.querySelector('#email-amount-help').textContent = received ? 'Enter only this payment actually received. This message does not say the invoice is paid in full.' : 'Use the unpaid balance from your invoice, after payments actually received.';
      document.querySelector('#email-payment-row').hidden = received;
    };
    const generate = () => {
      invalidate();
      const out = invoiceEmail(Object.fromEntries(new FormData(form)));
      if (out.error) { status.textContent = out.error; field(out.field).setAttribute('aria-invalid', 'true'); field(out.field).focus(); return; }
      subject.value = out.subject; body.value = out.body; result.hidden = false; copy.disabled = false;
      status.textContent = 'Message ready. Check the details before copying and sending.';
    };
    form.addEventListener('submit', (event) => { event.preventDefault(); generate(); });
    form.addEventListener('input', invalidate);
    field('mode').addEventListener('change', () => { invalidate(); setModeLabels(); });
    form.addEventListener('reset', () => { invalidate(); setTimeout(setModeLabels, 0); });
    document.querySelector('#email-example').addEventListener('click', () => {
      const example = { mode: 'send', client: 'Morgan', sender: 'River Studio', reference: 'INV-0042', work: 'website design', amount: '600', currency: 'USD', date: localDay(), payment: 'Use the bank details shown on the attached invoice. Include INV-0042 as the payment reference.' };
      Object.entries(example).forEach(([key, value]) => { field(key).value = value; }); setModeLabels(); generate();
    });
    copy.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(`Subject: ${subject.value}\n\n${body.value}`);
        status.textContent = 'Copied. Paste the subject and message into your email app, then attach and check the invoice.';
      } catch {
        body.focus(); body.select(); status.textContent = 'Copy is unavailable in this browser. The message is selected: use your device’s Copy command, then copy the subject separately.';
      }
    });
    setModeLabels();
  }
}
