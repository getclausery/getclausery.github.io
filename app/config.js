/* Clausery <https://getclausery.github.io> — (C) 2026 Clausery. AGPL-3.0-or-later WITH Clausery-Trademark-Exception. Removing this notice is removal of copyright management information under 17 U.S.C. 1202. Source: https://github.com/getclausery/getclausery.github.io */
/* Clausery deployment configuration. Edit this file when you deploy your own copy. */
export const APP_NAME = 'Clausery';
export const APP_VERSION = '2.20.0';

/* Public site URL (no trailing slash). Used for links in exported files and the intake form footer. */
export const SITE_URL = 'https://getclausery.github.io';

/* Base64url Ed25519 public key that license keys are verified against. Generate a key pair with
   `npm run license -- keygen`; keep the private key offline and paste the public key here. */
export const LICENSE_PUBLIC_KEY = 'gRV3e8g0NYShNgtFnSrralyB_RVvOzaLwlSHSvjcFvo';

/* Keys bought through the Lemon Squeezy checkout (UUIDs) are activated, then re-checked about once a week, with Lemon
   Squeezy's public License API. Only the key and this browser's activation ID are sent. storeId limits which store's keys
   count; products maps published live product IDs to plans, excluding test-mode products. The portal is where buyers
   manage subscriptions. Set api to '' to accept only offline CLSY- keys. */
export const LICENSE_SERVICE = { api: 'https://api.lemonsqueezy.com/v1/licenses', storeId: 488876, portal: 'https://getclausery.lemonsqueezy.com/billing', products: { 1426177: 'pro', 1426183: 'team' } };

/* Hosted checkout links (Stripe Payment Links, Lemon Squeezy, Paddle...). Leave empty to show the key request form instead.
   lifetime is an optional one-time purchase of Pro. It stays hidden everywhere until a link is set. To offer it: create a
   single-payment product in Lemon Squeezy with license keys on (activation limit 5), point its confirmation and receipt
   buttons at app/activate.html?key=[license_key] like the other products, add its product ID to LICENSE_SERVICE.products
   as 'pro', set PRICES.lifetime to its price, paste its checkout link here and run npm run build. */
export const CHECKOUT_URLS = {
  pro: 'https://getclausery.lemonsqueezy.com/checkout/buy/33635620-0033-4ace-8193-b2eb734b51f2?enabled=2227470',
  proYearly: 'https://getclausery.lemonsqueezy.com/checkout/buy/c3012391-8a2f-47ba-807e-31877967b105?enabled=2227471',
  team: 'https://getclausery.lemonsqueezy.com/checkout/buy/0c7c74e8-7be4-4fe4-b869-1fa585bce7de',
  lifetime: '',
};
/* Prices in USD, shown on the website and in the app. They must match what the checkout links above charge. */
export const PRICES = { pro: 19, proYearly: 190, team: 49, teamSeat: 9, lifetime: 99 };
/** Months of Pro a yearly plan saves against paying monthly (2 at $19/$190). */
export const YEARLY_MONTHS_FREE = Math.round((PRICES.pro * 12 - PRICES.proYearly) / PRICES.pro);
/* The free Pro trial: one per browser, no card and no account. It starts and ends on the device and never renews. */
export const TRIAL_DAYS = 14;
/* Money-back guarantee on a first payment for a plan, in days. The terms of service and pricing page state it. */
export const REFUND_DAYS = 30;
/* The day the checkout links above went live (YYYY-MM-DD). The privacy policy's effective date follows it. */
export const CHECKOUT_SINCE = '2026-10-09';

/* Anonymous usage counts with GoatCounter (https://www.goatcounter.com), which sets no cookies and does not store IP
   addresses. The app reports only that something happened (the app opened, a draft started, a document was made) and,
   for a library template, which one; never answers, file names or your own templates. Leave endpoint empty to send
   nothing. Only the public site counts (host), so tests, previews and self-hosted copies never report. When endpoint
   is set, add its origin to img-src in app/index.html and set since to the day it went live (the privacy policy's date). */
export const USAGE_COUNTER = { endpoint: 'https://getclausery.goatcounter.com/count', host: 'getclausery.github.io', since: '2026-10-07' };

/* Where people reach the operator. Email works for everyone, with no account; GitHub stays available for public bug reports
   and for private security reports. */
export const REPO_URL = 'https://github.com/getclausery/getclausery.github.io';
export const CONTACT_EMAIL = 'getclausery@gmail.com';
/** A mailto: link that opens a new email to the operator with this subject line. */
export const mailto = (subject) => 'mailto:' + CONTACT_EMAIL + (subject ? '?subject=' + encodeURIComponent(subject) : '');
export const CONTACT_URL = mailto('Question about Clausery');
export const KEY_REQUEST_URL = mailto('Clausery key request');
/** The key request link for one plan ("Pro", "Team"). */
export const keyRequestUrl = (plan) => mailto(`Clausery ${plan} key request`);

/* Locale defaults for new workspaces. */
export const DEFAULT_SETTINGS = { locale: '', currency: 'USD', dateFormat: 'long', theme: 'system', firmName: '', autoLockMinutes: 15 };

/* In local development only, a public key can be overridden for end-to-end tests. Never applies on a real host. */
export function licensePublicKey() {
  try {
    const host = globalThis.location && globalThis.location.hostname;
    if ((host === 'localhost' || host === '127.0.0.1') && globalThis.localStorage) {
      const k = globalThis.localStorage.getItem('clausery.dev.publicKey');
      if (k) return k;
    }
  } catch { /* ignore */ }
  return LICENSE_PUBLIC_KEY;
}
