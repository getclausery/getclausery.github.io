import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isOnlineKey, planFromMeta, activateOnline, validateOnline, deactivateOnline, evaluateOnline, RECHECK_DAYS, OFFLINE_GRACE_DAYS } from '../../app/lib/onlinelicense.js';
import { describeLicense } from '../../app/lib/license.js';

const CFG = { api: 'https://api.example.test/v1/licenses', storeId: 488876, products: { 1426177: 'pro', 1426183: 'team' } };
const KEY = '38B1460A-5104-4067-A91D-77B872934D51';
const META = { store_id: 488876, order_id: 7, product_id: 1426177, product_name: 'Clausery Pro', variant_id: 2227470, variant_name: 'Monthly', customer_name: 'Jane Doe', customer_email: 'jane@example.com' };
const NOW = new Date('2026-10-04T12:00:00Z');
const DAY = 86400000;

/** A fake fetch that records calls and answers from a table keyed by action. */
function fakeFetch(answers) {
  const calls = [];
  const fn = async (url, init) => {
    const action = url.split('/').pop();
    calls.push({ url, action, body: Object.fromEntries(new URLSearchParams(init.body)), init });
    const a = typeof answers[action] === 'function' ? answers[action]() : answers[action];
    if (a instanceof Error) throw a;
    return { status: a.status || 200, json: async () => a.body };
  };
  fn.calls = calls;
  return fn;
}
const activated = (meta = META, extra = {}) => ({ body: { activated: true, error: null, license_key: { status: 'active', key: KEY, activation_limit: 5, activation_usage: 1, expires_at: null }, instance: { id: 'inst-1', name: 'x' }, meta, ...extra } });

test('only UUID-shaped keys are treated as online keys', () => {
  assert.equal(isOnlineKey(KEY), true);
  assert.equal(isOnlineKey(' ' + KEY.toLowerCase() + '\n'), true);
  assert.equal(isOnlineKey('CLSY-abc.def'), false);
  assert.equal(isOnlineKey(''), false);
});

test('plans come from the product name, only for our store', () => {
  assert.equal(planFromMeta(META, 488876), 'pro');
  assert.equal(planFromMeta({ ...META, product_name: 'Clausery Team' }, 488876), 'team');
  assert.equal(planFromMeta({ ...META, store_id: 1 }, 488876), null);
  assert.equal(planFromMeta({ ...META, product_name: 'Template pack', variant_name: 'Default' }, 488876), null);
});

test('activation sends only the key and an instance name, and stores what the app needs', async () => {
  const f = fakeFetch({ activate: activated() });
  const res = await activateOnline(KEY, CFG, { fetchImpl: f, now: NOW });
  assert.equal(res.ok, true);
  assert.equal(res.plan, 'pro');
  assert.deepEqual(Object.keys(f.calls[0].body).sort(), ['instance_name', 'license_key']);
  assert.equal(f.calls[0].init.credentials, 'omit');
  assert.equal(res.record.instanceId, 'inst-1');
  assert.equal(res.record.checkedAt, NOW.toISOString());
  assert.equal(describeLicense(res.payload), 'Pro · for Jane Doe');
});

test('activation errors are explained, and keys from other products are released again', async () => {
  const limit = fakeFetch({ activate: { status: 400, body: { activated: false, error: 'This license key has reached the activation limit.', license_key: { status: 'active' }, meta: META } } });
  assert.match((await activateOnline(KEY, CFG, { fetchImpl: limit })).error, /maximum number of browsers/);
  const missing = fakeFetch({ activate: { status: 404, body: { activated: false, error: 'license_key not found.' } } });
  assert.match((await activateOnline(KEY, CFG, { fetchImpl: missing })).error, /not found/);
  const other = fakeFetch({ activate: activated({ ...META, product_id: 777, product_name: 'Some ebook', variant_name: 'Default' }), deactivate: { body: { deactivated: true } } });
  const res = await activateOnline(KEY, CFG, { fetchImpl: other });
  assert.equal(res.ok, false);
  assert.deepEqual(other.calls.map((c) => c.action), ['activate', 'deactivate']);
  const offline = fakeFetch({ activate: new TypeError('Failed to fetch') });
  assert.match((await activateOnline(KEY, CFG, { fetchImpl: offline })).error, /internet connection/);
  assert.match((await activateOnline(KEY, { api: '' })).error, /offline license keys/);
});

test('validation keeps, refreshes or ends a license; outages change nothing', async () => {
  const { record } = await activateOnline(KEY, CFG, { fetchImpl: fakeFetch({ activate: activated() }), now: NOW });
  const later = new Date(NOW.getTime() + 8 * DAY);
  const ok = await validateOnline(record, CFG, { fetchImpl: fakeFetch({ validate: { body: { valid: true, license_key: { status: 'active', expires_at: null }, instance: { id: 'inst-1' }, meta: META } } }), now: later });
  assert.equal(ok.ok, true);
  assert.equal(ok.record.checkedAt, later.toISOString());
  const f = fakeFetch({ validate: { status: 400, body: { valid: false, error: 'This license key is expired.', license_key: { status: 'expired' }, meta: META } } });
  const gone = await validateOnline(record, CFG, { fetchImpl: f, now: later });
  assert.equal(gone.ok, false);
  assert.equal(gone.record.status, 'expired');
  assert.deepEqual(f.calls[0].body, { license_key: KEY, instance_id: 'inst-1' });
  for (const answer of [new TypeError('offline'), { status: 503, body: {} }, { status: 429, body: { error: 'Too many' } }]) {
    const r = await validateOnline(record, CFG, { fetchImpl: fakeFetch({ validate: answer }), now: later });
    assert.equal(r.ok, null);
    assert.equal(r.record, record);
  }
});

test('the stored record alone decides between checks, with an offline grace period', async () => {
  const { record } = await activateOnline(KEY, CFG, { fetchImpl: fakeFetch({ activate: activated() }), now: NOW });
  const at = (days) => new Date(NOW.getTime() + days * DAY);
  assert.deepEqual([evaluateOnline(record, at(1)).ok, evaluateOnline(record, at(1)).due], [true, false]);
  assert.deepEqual([evaluateOnline(record, at(RECHECK_DAYS + 1)).ok, evaluateOnline(record, at(RECHECK_DAYS + 1)).due], [true, true]);
  const stale = evaluateOnline(record, at(OFFLINE_GRACE_DAYS + 1));
  assert.equal(stale.ok, false);
  assert.equal(stale.due, true);
  assert.match(stale.error, /could not check your license/);
  const expired = evaluateOnline({ ...record, status: 'expired' }, at(1));
  assert.equal(expired.ok, false);
  assert.equal(expired.due, true);
  assert.equal(evaluateOnline({ ...record, expires: '2026-10-01T00:00:00Z' }, at(1)).ok, false);
  assert.equal(evaluateOnline({ type: 'online', key: 'nope' }, NOW).ok, false);
});

test('deactivation is best effort', async () => {
  const { record } = await activateOnline(KEY, CFG, { fetchImpl: fakeFetch({ activate: activated() }), now: NOW });
  assert.equal(await deactivateOnline(record, CFG, { fetchImpl: fakeFetch({ deactivate: { body: { deactivated: true } } }) }), true);
  assert.equal(await deactivateOnline(record, CFG, { fetchImpl: fakeFetch({ deactivate: new TypeError('offline') }) }), false);
});

test('live product IDs determine the plan and exclude test or similarly named products', () => {
  assert.equal(planFromMeta(META, CFG.storeId, CFG.products), 'pro');
  assert.equal(planFromMeta({ ...META, product_name: 'Renamed product', variant_name: 'Yearly' }, CFG.storeId, CFG.products), 'pro');
  assert.equal(planFromMeta({ ...META, product_id: 1426183 }, CFG.storeId, CFG.products), 'team');
  assert.equal(planFromMeta({ ...META, product_id: 1408953 }, CFG.storeId, CFG.products), null);
  assert.equal(planFromMeta({ ...META, store_id: 1 }, CFG.storeId, CFG.products), null);
});

test('validation cannot preserve a paid plan when the server returns an unapproved product or no metadata', async () => {
  const { record } = await activateOnline(KEY, CFG, { fetchImpl: fakeFetch({ activate: activated() }), now: NOW });
  for (const meta of [{ ...META, product_id: 1408953 }, null]) {
    const f = fakeFetch({ validate: { body: { valid: true, license_key: { status: 'active' }, instance: { id: 'inst-1' }, meta } } });
    const res = await validateOnline(record, CFG, { fetchImpl: f, now: NOW });
    assert.equal(res.ok, false);
    assert.equal(res.record.status, 'invalid');
  }
});

test('legacy cached licenses require an online product check before unlocking a live plan', async () => {
  const { record } = await activateOnline(KEY, CFG, { fetchImpl: fakeFetch({ activate: activated() }), now: NOW });
  assert.equal(evaluateOnline(record, NOW, CFG).ok, true);
  for (const productId of [undefined, 1408953]) {
    const res = evaluateOnline({ ...record, productId }, NOW, CFG);
    assert.equal(res.ok, false);
    assert.equal(res.due, true);
  }
});
