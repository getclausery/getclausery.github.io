/* Clausery deployment configuration. Edit this file when you deploy your own copy. */
export const APP_NAME = 'Clausery';
export const APP_VERSION = '1.19.0';

/* Public site URL (no trailing slash). Used for links in exported files and the intake form footer. */
export const SITE_URL = 'https://getclausery.github.io';

/* Base64url Ed25519 public key that license keys are verified against. Generate a key pair with
   `npm run license -- keygen`; keep the private key offline and paste the public key here. */
export const LICENSE_PUBLIC_KEY = 'gRV3e8g0NYShNgtFnSrralyB_RVvOzaLwlSHSvjcFvo';

/* Keys bought through the Lemon Squeezy checkout (UUIDs) are activated, then re-checked about once a week, with Lemon
   Squeezy's public License API. Only the key and this browser's activation ID are sent. storeId limits which store's keys
   count; portal is where buyers manage their subscription. Set api to '' to accept only offline CLSY- keys. */
export const LICENSE_SERVICE = { api: 'https://api.lemonsqueezy.com/v1/licenses', storeId: 488876, portal: 'https://getclausery.lemonsqueezy.com/billing' };

/* Hosted checkout links (Stripe Payment Links, Lemon Squeezy, Paddle...). Leave empty to show the key request form instead. */
export const CHECKOUT_URLS = { pro: '', team: '' };
/* The day the checkout links above went live (YYYY-MM-DD). The privacy policy's effective date follows it. */
export const CHECKOUT_SINCE = '';

/* Where people reach the operator. The public instance uses GitHub: issue forms for questions, key requests and template
   requests, and private vulnerability reporting for security. A deployment with its own inbox can point these at a mailto:. */
export const REPO_URL = 'https://github.com/getclausery/getclausery.github.io';
export const CONTACT_URL = REPO_URL + '/issues/new/choose';
export const KEY_REQUEST_URL = REPO_URL + '/issues/new?template=request-a-key.yml';

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
