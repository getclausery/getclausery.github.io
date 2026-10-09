import { test, expect } from '@playwright/test';
import { openApp, openManualActivation } from './helpers.mjs';

// Keys bought through the Lemon Squeezy checkout. The License API is mocked: these tests check what the app sends,
// when it sends it, and what it does with each answer.
const KEY = '38B1460A-5104-4067-A91D-77B872934D51';
const META = { store_id: 488876, order_id: 1, product_id: 1426177, product_name: 'Clausery Pro', variant_id: 2227470, variant_name: 'Monthly', customer_name: 'E2E Buyer', customer_email: 'buyer@example.com' };

async function mockLicenseApi(page, answers = {}) {
  const sent = [];
  await page.route('https://api.lemonsqueezy.com/**', async (route) => {
    const req = route.request();
    const action = new URL(req.url()).pathname.split('/').pop();
    sent.push({ action, body: Object.fromEntries(new URLSearchParams(req.postData() || '')) });
    const defaults = {
      activate: { activated: true, error: null, license_key: { status: 'active', key: KEY, activation_limit: 5, activation_usage: 1, expires_at: null }, instance: { id: 'inst-e2e', name: 'Clausery in a browser' }, meta: META },
      validate: { valid: true, error: null, license_key: { status: 'active', key: KEY, expires_at: null }, instance: { id: 'inst-e2e' }, meta: META },
      deactivate: { deactivated: true, error: null },
    };
    const body = typeof answers[action] === 'function' ? answers[action]() : answers[action] || defaults[action];
    await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
  });
  return sent;
}

async function activate(page) {
  await page.goto('app/#/settings');
  await openManualActivation(page); await page.fill('#license-key', KEY);
  await page.click('button:has-text("Activate")');
  await expect(page.locator('.toast-ok').last()).toContainText('Pro plan activated');
  await expect(page.locator('#status .badge')).toContainText('Pro');
}

test('a key bought online is activated once; only the key and an instance name are sent', async ({ page }) => {
  const sent = await mockLicenseApi(page);
  await openApp(page);
  await activate(page);
  expect(sent).toEqual([{ action: 'activate', body: { license_key: KEY, instance_name: 'Clausery in a browser' } }]);
  await expect(page.locator('#license')).toContainText('Last checked with our payment provider');
  await expect(page.locator('#license a:has-text("Manage subscription")')).toHaveAttribute('href', /lemonsqueezy\.com\/billing/);
  // within a week a reload does not touch the network
  await page.reload();
  await page.waitForSelector('#status .badge:has-text("Pro")');
  expect(sent).toHaveLength(1);
});

test('a week later the key is re-checked, and an expired subscription returns the workspace to Free', async ({ page }) => {
  let validate = null;
  const sent = await mockLicenseApi(page, { validate: () => validate });
  await openApp(page);
  await activate(page);
  await page.evaluate(async () => { const s = window.__clausery.store; const rec = await s.getSetting('license'); rec.checkedAt = new Date(Date.now() - 8 * 86400000).toISOString(); await s.setSetting('license', rec); });
  validate = { valid: false, error: 'This license key is expired.', license_key: { status: 'expired', key: KEY }, meta: META };
  await page.reload();
  await expect(page.locator('.toast').last()).toContainText('expired');
  await expect(page.locator('#status .badge')).toContainText('Free');
  expect(sent.at(-1)).toEqual({ action: 'validate', body: { license_key: KEY, instance_id: 'inst-e2e' } });
  // renewing brings it back on the next check, with no new key
  validate = { valid: true, error: null, license_key: { status: 'active', key: KEY, expires_at: null }, instance: { id: 'inst-e2e' }, meta: META };
  await page.goto('app/#/settings');
  await page.reload();
  await expect(page.locator('.toast-ok').last()).toContainText('Pro plan restored');
  await expect(page.locator('#status .badge')).toContainText('Pro');
});

test('removing an online license frees its activation', async ({ page }) => {
  const sent = await mockLicenseApi(page);
  await openApp(page);
  await activate(page);
  await openManualActivation(page); await page.click('button:has-text("Remove from this browser")');
  await page.click('.modal button:has-text("Remove")');
  await expect(page.locator('#status .badge')).toContainText('Free');
  await expect.poll(() => sent.map((c) => c.action)).toEqual(['activate', 'deactivate']);
  expect(sent[1].body).toEqual({ license_key: KEY, instance_id: 'inst-e2e' });
});

test('a test-mode product key does not unlock the live paid app and its activation is released', async ({ page }) => {
  const sent = await mockLicenseApi(page, { activate: { activated: true, license_key: { status: 'active', key: KEY }, instance: { id: 'inst-e2e' }, meta: { ...META, product_id: 1408953 } } });
  await openApp(page);
  await page.goto('app/#/settings');
  await openManualActivation(page); await page.fill('#license-key', KEY);
  await page.click('button:has-text("Activate")');
  await expect(page.locator('.toast').last()).toContainText('not for a Clausery plan');
  await expect(page.locator('#status .badge')).toContainText('Free');
  expect(sent.map(c => c.action)).toEqual(['activate', 'deactivate']);
});

test('the live Team product activates Team features', async ({ page }) => {
  await mockLicenseApi(page, { activate: { activated: true, license_key: { status: 'active', key: KEY, activation_limit: 15 }, instance: { id: 'inst-e2e' }, meta: { ...META, product_id: 1426183, product_name: 'Clausery Team' } } });
  await openApp(page);
  await page.goto('app/#/settings');
  await openManualActivation(page); await page.fill('#license-key', KEY);
  await page.click('button:has-text("Activate")');
  await expect(page.locator('.toast-ok').last()).toContainText('Team plan activated');
  await expect(page.locator('#status .badge')).toContainText('Team');
});

for (const [name, productId] of [['Pro', 1426177], ['Team', 1426183]]) {
  test(`the receipt button automatically activates ${name} and opens the workspace without key entry`, async ({ page }) => {
    const sent = await mockLicenseApi(page, { activate: { activated: true, license_key: { status: 'active', key: KEY }, instance: { id: 'inst-e2e' }, meta: { ...META, product_id: productId } } });
    const urls = [];
    page.on('request', r => urls.push(r.url()));
    await page.goto('app/activate.html#key=' + KEY);
    await expect(page.locator('#status .badge')).toHaveText(name);
    await expect(page.locator('h1')).toHaveText('Templates');
    expect(page.url()).toMatch(/app\/#\/templates$/);
    expect(urls.some(u => u.includes(KEY))).toBe(false);
    expect(sent.map(c => c.action)).toEqual(['activate']);
    await page.goto('app/#/settings');
    await expect(page.locator('#license-key')).toBeHidden();
    await expect(page.locator('#license')).toContainText('Open Clausery button');
  });
}

test('opening the receipt again reuses the existing activation instead of consuming another slot', async ({ page }) => {
  const sent = await mockLicenseApi(page);
  await page.goto('app/activate.html#key=' + KEY);
  await expect(page.locator('#status .badge')).toHaveText('Pro');
  await page.goto('app/activate.html#key=' + KEY);
  await expect(page.locator('#status .badge')).toHaveText('Pro');
  expect(sent.map(c => c.action)).toEqual(['activate', 'validate']);
  expect(sent[1].body.instance_id).toBe('inst-e2e');
});

test('a temporary activation failure offers a retry without revealing or re-entering a key', async ({ page }) => {
  let online = false;
  await mockLicenseApi(page, { activate: () => online ? { activated: true, license_key: { status: 'active', key: KEY }, instance: { id: 'inst-e2e' }, meta: META } : null });
  await page.goto('app/activate.html#key=' + KEY);
  await expect(page.locator('#purchase-status')).toContainText('Could not reach');
  expect(page.url()).toMatch(/app\/activate\.html$/);
  await expect(page.locator('body')).not.toContainText(KEY);
  await expect(page.locator('input, textarea')).toHaveCount(0);
  online = true;
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.locator('#status .badge')).toHaveText('Pro');
});

test('a receipt for a test or unrelated product cannot unlock a paid plan', async ({ page }) => {
  const sent = await mockLicenseApi(page, { activate: { activated: true, license_key: { status: 'active', key: KEY }, instance: { id: 'inst-e2e' }, meta: { ...META, product_id: 1408953 } } });
  await page.goto('app/activate.html#key=' + KEY);
  await expect(page.locator('#purchase-status')).toContainText('not for a Clausery plan');
  expect(sent.map(c => c.action)).toEqual(['activate', 'deactivate']);
  await page.goto('app/');
  await expect(page.locator('#status .badge')).toHaveText('Free');
});

test('an incomplete receipt link is cleared and never treated as payment proof', async ({ page }) => {
  const sent = await mockLicenseApi(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('app/activate.html#key=[license_key]');
  await expect(page.locator('#purchase-status')).toContainText('incomplete');
  expect(page.url()).toMatch(/app\/activate\.html$/);
  expect(sent).toHaveLength(0);
  await expect(page.locator('#purchase-retry')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('two receipt tabs in one browser share one activation', async ({ page, context }) => {
  const second = await context.newPage();
  const firstSent = await mockLicenseApi(page);
  const secondSent = await mockLicenseApi(second);
  await Promise.all([page.goto('app/activate.html#key=' + KEY), second.goto('app/activate.html#key=' + KEY)]);
  await expect(page.locator('#status .badge')).toHaveText('Pro');
  await expect(second.locator('#status .badge')).toHaveText('Pro');
  expect([...firstSent, ...secondSent].map(c => c.action).sort()).toEqual(['activate', 'validate']);
});
