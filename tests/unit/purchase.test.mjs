import { test } from 'node:test';
import assert from 'node:assert/strict';
import { consumePurchaseReturn, activatePurchase } from '../../app/lib/purchase.js';

const KEY = '38B1460A-5104-4067-A91D-77B872934D51';
function read(hash, search = '') {
  const calls = [];
  const result = consumePurchaseReturn({ hash, pathname: '/app/activate.html', search }, { replaceState: (...args) => calls.push(args) });
  return { result, calls };
}
test('the receipt credential is read from the fragment and immediately removed from the address', () => {
  const { result, calls } = read('#key=' + KEY);
  assert.deepEqual(result, { key: KEY });
  assert.deepEqual(calls, [[null, '', '/app/activate.html']]);
});
test('missing or malformed receipt links are cleared and cannot activate a plan', () => {
  for (const hash of ['', '#key=[license_key]', '#key=bad', '#plan=pro', '#key=%E0%A4%A']) {
    const { result, calls } = read(hash);
    assert.ok(result.error);
    assert.equal(result.key, undefined);
    assert.equal(calls[0][2], '/app/activate.html');
  }
});
test('ambiguous receipt credentials are rejected', () => {
  assert.ok(read('#key=' + KEY + '&key=' + KEY).result.error);
  assert.ok(read('', '?key=' + KEY + '&key=' + KEY).result.error);
  assert.ok(read('#key=' + KEY, '?key=' + KEY).result.error);
});
test('the merchant-compatible query credential is read and immediately removed from the address', () => {
  const { result, calls } = read('', '?key=' + KEY);
  assert.deepEqual(result, { key: KEY });
  assert.equal(calls[0][2], '/app/activate.html');
});
test('a failed local save releases the new activation instead of using an extra slot on retry', async () => {
  const actions = [];
  const fetchImpl = async url => {
    const action = url.split('/').pop(); actions.push(action);
    return { status: 200, json: async () => action === 'activate'
      ? { activated: true, license_key: { status: 'active' }, instance: { id: 'inst-1' }, meta: { store_id: 1, product_id: 2 } }
      : { deactivated: true } };
  };
  const store = { getSetting: async () => null, setSetting: async () => { throw new Error('Quota exceeded'); } };
  const result = await activatePurchase(KEY, { api: 'https://api.example.test/licenses', storeId: 1, products: { 2: 'pro' } }, store, { fetchImpl });
  assert.equal(result.ok, false);
  assert.match(result.error, /could not save/);
  assert.deepEqual(actions, ['activate', 'deactivate']);
});
