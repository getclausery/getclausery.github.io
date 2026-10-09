/* Clausery licensing, part two: keys sold through the Lemon Squeezy checkout.
   Lemon Squeezy emails the buyer a key (a UUID) and shows it on the receipt. The app activates it once with Lemon
   Squeezy's public License API and re-checks it about once a week, so renewals, cancellations and refunds apply on
   their own with no manual key issuing. Only the key and this browser's activation ID are sent: never templates,
   answers or documents. Offline `CLSY-` keys (license.js) keep working for air-gapped installs.
   Every function takes an injectable fetch and clock so it can be tested without a network. */

export const ONLINE_KEY_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Re-check an active key when the last successful check is older than this. */
export const RECHECK_DAYS = 7;
/** Keep a key working without any successful check for this long (laptops offline, flights, outages). */
export const OFFLINE_GRACE_DAYS = 30;
const DAY = 86400000;

export function isOnlineKey(key) { return ONLINE_KEY_RE.test(String(key || '').trim()); }
export function isOnlineRecord(rec) { return !!rec && typeof rec === 'object' && rec.type === 'online' && isOnlineKey(rec.key); }

/** Which Clausery plan a Lemon Squeezy order is for, or null when the key belongs to another store or product. */
export function planFromMeta(meta, storeId, products) {
  if (!meta || Number(meta.store_id) !== Number(storeId)) return null;
  // Live deployments use published product IDs, so test-mode keys and similarly named products cannot unlock a plan.
  if (products) {
    const plan = products[Number(meta.product_id)];
    return ['pro', 'team', 'enterprise'].includes(plan) ? plan : null;
  }
  const name = `${meta.product_name || ''} ${meta.variant_name || ''}`;
  if (/\benterprise\b/i.test(name)) return 'enterprise';
  if (/\bteam\b/i.test(name)) return 'team';
  if (/\bpro\b/i.test(name)) return 'pro';
  return null;
}

/** Turn Lemon Squeezy's error strings into advice the buyer can act on. */
export function friendlyError(msg, status) {
  const m = String(msg || '');
  if (/not found/i.test(m)) return 'That license key was not found. Copy the whole key from your receipt email and try again.';
  if (/activation limit/i.test(m)) return 'This key is already active in the maximum number of browsers. Remove it in a browser you no longer use (Settings → License → Remove license), or ask us to reset it.';
  if (/expired/i.test(m) || status === 'expired') return 'This license has expired. Renew your subscription to keep using Pro features.';
  if (/disabled/i.test(m) || status === 'disabled') return 'This license key has been disabled. Contact us if you think this is a mistake.';
  return m ? `The license could not be activated: ${m}` : 'The license could not be activated.';
}

async function call(cfg, action, params, fetchImpl) {
  let res;
  try {
    res = await fetchImpl(`${cfg.api}/${action}`, {
      method: 'POST', body: new URLSearchParams(params).toString(), credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  } catch {
    return { network: true };
  }
  let data = null;
  try { data = await res.json(); } catch { /* not JSON */ }
  // 429 and 5xx say nothing about the key: treat them like being offline
  if (res.status === 429 || res.status >= 500 || !data || typeof data !== 'object') return { network: true, status: res.status };
  return { status: res.status, data };
}

const day = (iso) => (iso ? String(iso).slice(0, 10) : undefined);

/** The license payload the rest of the app shows (same shape as an offline key's payload). */
export function onlinePayload(rec) {
  return { plan: rec.plan, name: rec.name || undefined, expires: day(rec.expires), source: 'online', checkedAt: rec.checkedAt };
}

function recordFrom(key, d, plan, now, instanceId) {
  return {
    type: 'online', key, instanceId, plan, productId: Number(d.meta?.product_id) || null,
    name: d.meta?.customer_name || '', product: d.meta?.product_name || '', variant: d.meta?.variant_name || '',
    status: d.license_key?.status || 'active', expires: d.license_key?.expires_at || null,
    limit: d.license_key?.activation_limit ?? null, checkedAt: now.toISOString(),
  };
}

/** Activate a key in this browser. Returns { ok, plan, record, payload } or { ok: false, error }. */
export async function activateOnline(key, cfg, { fetchImpl = globalThis.fetch, now = new Date(), instanceName = 'Clausery in a browser' } = {}) {
  key = String(key || '').trim();
  if (!cfg || !cfg.api) return { ok: false, error: 'This copy of Clausery only accepts offline license keys (CLSY-…).' };
  if (!isOnlineKey(key)) return { ok: false, error: 'This does not look like a Clausery license key.' };
  const r = await call(cfg, 'activate', { license_key: key, instance_name: instanceName }, fetchImpl);
  if (r.network) return { ok: false, error: 'Could not reach the license service. Check your internet connection and try again.' };
  const d = r.data;
  const plan = planFromMeta(d.meta, cfg.storeId, cfg.products);
  if (d.activated && d.instance && d.instance.id && !plan) {
    await call(cfg, 'deactivate', { license_key: key, instance_id: d.instance.id }, fetchImpl);
    return { ok: false, error: 'This key is not for a Clausery plan.' };
  }
  if (!d.activated || !d.instance || !d.instance.id) return { ok: false, error: friendlyError(d.error, d.license_key?.status) };
  if (!plan) return { ok: false, error: 'This key is not for a Clausery plan.' };
  const record = recordFrom(key, d, plan, now, d.instance.id);
  return { ok: true, plan, record, payload: onlinePayload(record) };
}

/** Re-check a stored record. ok: true (still valid), false (no longer valid) or null (could not tell: offline, outage). */
export async function validateOnline(rec, cfg, { fetchImpl = globalThis.fetch, now = new Date() } = {}) {
  if (!cfg || !cfg.api || !isOnlineRecord(rec)) return { ok: null, record: rec };
  const r = await call(cfg, 'validate', { license_key: rec.key, instance_id: rec.instanceId }, fetchImpl);
  if (r.network) return { ok: null, record: rec };
  const d = r.data;
  const plan = planFromMeta(d.meta, cfg.storeId, cfg.products) || (!cfg.products && d.valid ? rec.plan : null);
  if (d.valid && plan && ['active', 'inactive'].includes(d.license_key?.status || 'active')) {
    const record = { ...recordFrom(rec.key, d, plan, now, rec.instanceId), name: d.meta?.customer_name || rec.name };
    return { ok: true, record, plan, payload: onlinePayload(record) };
  }
  const status = d.license_key?.status || 'invalid';
  const record = { ...rec, status: status === 'active' ? 'invalid' : status, checkedAt: now.toISOString() };
  return { ok: false, record, error: friendlyError(d.error, status) };
}

/** Free this browser's activation slot. Best effort: never throws. */
export async function deactivateOnline(rec, cfg, { fetchImpl = globalThis.fetch } = {}) {
  if (!cfg || !cfg.api || !isOnlineRecord(rec)) return false;
  const r = await call(cfg, 'deactivate', { license_key: rec.key, instance_id: rec.instanceId }, fetchImpl);
  return !r.network && !!r.data.deactivated;
}

const DEAD = {
  expired: 'This license has expired. Renew your subscription to keep using Pro features.',
  disabled: 'This license key has been disabled. Contact us if you think this is a mistake.',
  invalid: 'This license is no longer valid.',
};

/** Decide from the stored record alone, with no network: { ok, plan, payload, due } or { ok: false, error, stale }. */
export function evaluateOnline(rec, now = new Date(), cfg) {
  if (!isOnlineRecord(rec)) return { ok: false, error: 'The stored license is not readable.' };
  if (cfg?.products && cfg.products[Number(rec.productId)] !== rec.plan) return { ok: false, due: true, error: 'Connect to the internet to verify this key for the current Clausery plans.' };
  // a dead key is still re-checked (due), so a renewed subscription comes back on its own
  if (DEAD[rec.status]) return { ok: false, expired: rec.status === 'expired', due: true, error: DEAD[rec.status] };
  if (rec.expires && new Date(rec.expires).getTime() < now.getTime()) return { ok: false, expired: true, due: true, error: 'This license has expired. Renew your subscription to keep using Pro features.' };
  const age = now.getTime() - new Date(rec.checkedAt || 0).getTime();
  if (!(age < OFFLINE_GRACE_DAYS * DAY)) return { ok: false, stale: true, due: true, error: `Clausery could not check your license for ${OFFLINE_GRACE_DAYS} days. Connect to the internet and open Settings → License to check it again.` };
  return { ok: true, plan: rec.plan, payload: onlinePayload(rec), due: age >= RECHECK_DAYS * DAY };
}
