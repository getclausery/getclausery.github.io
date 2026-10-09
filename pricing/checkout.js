/* Pricing page: point the plan buttons at the configured checkout links, or at a key request email when none is set. */
import { CHECKOUT_URLS, keyRequestUrl } from '../app/config.js';

const PLAN = { pro: 'Pro monthly', proYearly: 'Pro yearly', team: 'Team' };
for (const a of document.querySelectorAll('[data-checkout]')) {
  const url = CHECKOUT_URLS[a.dataset.checkout];
  const name = PLAN[a.dataset.checkout] || a.dataset.checkout;
  if (url) { a.href = url; a.rel = 'noopener'; a.textContent = 'Get ' + name; }
  else { a.href = keyRequestUrl(name); a.removeAttribute('rel'); a.textContent = 'Request a ' + name + ' key'; }
}
// With no checkout configured, say how a key is issued instead of describing a payment page that does not exist.
if (!Object.values(CHECKOUT_URLS).some(Boolean)) {
  for (const el of document.querySelectorAll('[data-when-checkout]')) el.hidden = true;
  for (const el of document.querySelectorAll('[data-when-no-checkout]')) el.hidden = false;
}
