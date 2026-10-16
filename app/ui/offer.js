/* What Pro costs and how to get it, wherever the app offers an upgrade (the upgrade dialog, Settings, the trial screen),
   so every place shows the same prices as the pricing page. Prices and checkout links come from config.js. */
import { h } from './dom.js';
import { CHECKOUT_URLS, PRICES, YEARLY_MONTHS_FREE, REFUND_DAYS } from '../config.js';

const money = (n) => '$' + n;

/** "Pro is $19 a month, or $190 a year (2 months free). 30-day money-back guarantee." */
export function priceLine() {
  const lifetime = CHECKOUT_URLS.lifetime ? `, or ${money(PRICES.lifetime)} once for lifetime use` : '';
  return `Pro is ${money(PRICES.pro)} a month, or ${money(PRICES.proYearly)} a year (${YEARLY_MONTHS_FREE} months free)${lifetime}. ${REFUND_DAYS}-day money-back guarantee.`;
}

/** The label of the main buy button: "Get Pro — $19/month", or "See plans" when no checkout is configured. */
export const buyLabel = () => (CHECKOUT_URLS.pro ? `Get Pro — ${money(PRICES.pro)}/month` : 'See plans');

/** Buttons for the configured checkout links. A plain click goes through ctx.checkout, which counts it first; a click
    with a modifier key (new tab or window) is left to the browser. `primary` names the plan to highlight, if any. */
export function checkoutButtons(ctx, { team = true, primary = 'pro' } = {}) {
  const btn = (which, label) => (CHECKOUT_URLS[which] ? h('a.btn', {
    class: which === primary ? 'btn-primary' : '', href: CHECKOUT_URLS[which], rel: 'noopener', dataset: { checkout: which },
    onclick: (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); ctx.checkout(which); },
  }, label) : null);
  return [
    btn('pro', `Get Pro — ${money(PRICES.pro)}/month`),
    btn('proYearly', `Pro yearly — ${money(PRICES.proYearly)}/year (${YEARLY_MONTHS_FREE} months free)`),
    btn('lifetime', `Lifetime Pro — ${money(PRICES.lifetime)} once`),
    team ? btn('team', `Get Team — ${money(PRICES.team)}/month`) : null,
  ].filter(Boolean);
}
