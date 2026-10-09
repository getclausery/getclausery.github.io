/* Lemon Squeezy's button validator requires its documented query-string format. Also accept fragment
   links. Clear both before routing or activation; the License API still verifies the purchase. */
import { isOnlineKey, isOnlineRecord, activateOnline, validateOnline, deactivateOnline } from './onlinelicense.js';

export function consumePurchaseReturn(loc = globalThis.location, hist = globalThis.history) {
  const params = new URLSearchParams(String(loc?.hash || '').replace(/^#/, ''));
  const query = new URLSearchParams(String(loc?.search || '').replace(/^\?/, ''));
  const keys = [...params.getAll('key'), ...query.getAll('key')];
  hist.replaceState(null, '', loc.pathname);
  const key = String(keys[0] || '').trim();
  if (keys.length !== 1 || !isOnlineKey(key)) return { error: 'This purchase link is incomplete. Open Clausery using the button in your receipt email, or contact support.' };
  return { key };
}

/** Verify the purchase and save the browser activation before opening the app, including previously installed copies. */
export async function activatePurchase(key, cfg, store, options = {}) {
  const previous = await store.getSetting('license', null);
  const same = isOnlineRecord(previous) && previous.key.toLowerCase() === String(key).toLowerCase();
  const result = same ? await validateOnline(previous, cfg, options) : await activateOnline(key, cfg, options);
  if (same && result.ok !== null && result.record) await store.setSetting('license', result.record);
  if (result.ok !== true) return { ok: false, error: result.error || 'Could not reach the payment service. Check your connection and try again.' };
  if (!same) {
    try { await store.setSetting('license', result.record); }
    catch {
      await deactivateOnline(result.record, cfg, options);
      return { ok: false, error: 'This browser could not save your purchase activation. Enable local storage or open the receipt button in another browser, then try again.' };
    }
    if (isOnlineRecord(previous)) await deactivateOnline(previous, cfg, options);
  }
  return { ok: true, plan: result.plan };
}
