/* The Free plan's credit line, the free Pro trial and how the app offers Pro. */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { fill, docxText } from './helpers.mjs';

const CREDIT = 'Made with Clausery · free invoices and Word templates · getclausery.github.io';

/** Move the stored trial's end into the past, as if its days had run out. */
const expireTrial = (page) => page.evaluate(() => new Promise((resolve, reject) => {
  const open = indexedDB.open('clausery');
  open.onerror = () => reject(open.error);
  open.onsuccess = () => {
    const db = open.result;
    const tx = db.transaction('settings', 'readwrite');
    const st = tx.objectStore('settings');
    const get = st.get('trial');
    get.onsuccess = () => { const r = get.result; r.value.endsAt = new Date(Date.now() - 60000).toISOString(); st.put(r); };
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  };
}));

test('a Free document from a library template ends with the credit line, and the trial started from Review leaves it out', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('app/#/start/invoice');
  await page.waitForSelector('.stepper');
  await fill(page, 'business_name', 'Northwind Studio');
  await page.click('.stepper button:has-text("Review")');
  await expect(page.locator('#credit-note')).toContainText('documents from library templates end with a small “Made with Clausery” line');

  const [first] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Download .docx")')]);
  const before = await docxText(await first.path());
  expect(before).toContain('Northwind Studio');
  expect(before).toContain(CREDIT);
  expect(before.indexOf(CREDIT)).toBeGreaterThan(before.indexOf('Northwind Studio'));

  // the preview shows the same line, as a link that opens in a new tab instead of leaving the draft
  await page.click('.card button:has-text("Preview")');
  const link = page.locator('.preview-wrap a[href="https://getclausery.github.io/made-with/"]');
  await expect(link).toContainText('Made with Clausery');
  await expect(link).toHaveAttribute('target', '_blank');

  await page.click('#credit-note a:has-text("free 14-day Pro trial")');
  await expect(page.locator('.toast').last()).toContainText('Your free Pro trial has started');
  await expect(page.locator('#status .badge')).toHaveText('Pro trial · 14 days left');
  await expect(page.locator('#credit-note')).toHaveCount(0);
  const [second] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Download .docx")')]);
  const after = await docxText(await second.path());
  expect(after).toContain('Northwind Studio');
  expect(after).not.toContain('Made with Clausery');
  expect(errors, errors.join('\n')).toEqual([]);
});

test('a template of your own never gets the credit line on the Free plan', async ({ page }) => {
  await page.goto('app/');
  await page.waitForSelector('h1:has-text("Templates")');
  const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.locator('.dropzone').click()]);
  await chooser.setFiles('samples/mutual-nda.docx');
  await page.waitForSelector('input[aria-label="Template name"]');
  await page.click('button:has-text("New draft")');
  await page.waitForSelector('.stepper');
  await page.click('.stepper button:has-text("Review")');
  await expect(page.locator('#credit-note')).toHaveCount(0);
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Download .docx")')]);
  expect(await docxText(await download.path())).not.toContain('Made with Clausery');
  await expect(page.locator('#status .badge')).toHaveText('Free');
});

test('the trial link starts a 14-day Pro trial once, and Settings keeps checkout on offer', async ({ page }) => {
  await page.goto('app/#/trial');
  await expect(page.locator('h1')).toHaveText('Your 14-day Pro trial has started');
  await expect(page.locator('.card')).toContainText('No card and no account');
  await expect(page.locator('#status .badge')).toHaveText('Pro trial · 14 days left');

  await page.goto('app/#/settings');
  await expect(page.locator('#license .notice').first()).toContainText('Free Pro trial: 14 days left.');
  await expect(page.locator('#license button:has-text("Start 14-day free trial")')).toHaveCount(0);
  await expect(page.locator('#license a[data-checkout="pro"]')).toHaveText(/^Get Pro/);
  await expect(page.locator('#license')).toContainText('30-day money-back guarantee');
  await expect(page.locator('button:has-text("Remove from this browser")')).toHaveCount(0);
  await expect(page.locator('button:has-text("Check subscription")')).toHaveCount(0);

  // a second visit does not start it again
  await page.goto('app/#/trial');
  await expect(page.locator('h1')).toHaveText('Your Pro trial: 14 days left');
});

test('the upgrade dialog offers the trial first, and the feature works straight after', async ({ page }) => {
  await page.goto('app/#/settings');
  await page.click('button:has-text("Turn on encryption")');
  await expect(page.locator('.modal-title')).toHaveText('Available on Pro');
  await expect(page.locator('.modal')).toContainText('Try every Pro feature free for 14 days.');
  await page.click('.modal button:has-text("Start 14-day free trial")');
  await expect(page.locator('.modal')).toHaveCount(0);
  await expect(page.locator('#status .badge')).toHaveText('Pro trial · 14 days left');
  await page.click('button:has-text("Turn on encryption")');
  await expect(page.locator('.modal-title')).toHaveText('Turn on encryption');
});

test('when the trial runs out, the app says so once and is back on Free with everything kept', async ({ page }) => {
  await page.goto('app/#/trial');
  await expect(page.locator('#status .badge')).toHaveText(/^Pro trial/);
  await page.goto('app/#/start/invoice');
  await page.waitForSelector('.stepper');
  await expireTrial(page);
  await page.reload();
  await expect(page.locator('.modal-title')).toHaveText('Your free Pro trial has ended');
  await expect(page.locator('.modal')).toContainText('Everything you made is still here');
  await expect(page.locator('#status .badge')).toHaveText('Free');
  await page.click('.modal button:has-text("Stay on Free")');
  await page.goto('app/#/drafts');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await page.reload();
  await page.waitForSelector('h1:has-text("Drafts")');
  await expect(page.locator('.modal-title')).toHaveCount(0);   // said once
  await page.goto('app/#/trial');
  await expect(page.locator('h1')).toHaveText('Your free Pro trial has ended');
  await expect(page.locator('#status .badge')).toHaveText('Free');
  // the upgrade dialog no longer offers a trial
  await page.goto('app/#/settings');
  await page.click('button:has-text("Turn on encryption")');
  await expect(page.locator('.modal button.btn-primary')).toHaveText(/^Get Pro/);
});

test('the pricing page offers the trial and the guarantee, and the credit link lands on the made-with page', async ({ page }) => {
  await page.goto('pricing/');
  await expect(page.locator('.plan.featured .badge')).toHaveText('Free for 14 days');
  await expect(page.locator('.plan.featured a.trial-link')).toHaveAttribute('href', '../app/#/trial');
  await expect(page.locator('.assurances')).toContainText('30-day money-back guarantee');
  await page.goto('made-with/');
  await expect(page.locator('h1')).toHaveText('The document you received was made with Clausery');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
});

test('the credit notice, the upgrade dialog, the trial screen and the trial-ended dialog have no serious accessibility violations', async ({ page }) => {
  const check = async (step) => {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    expect(serious.map((v) => `${step} ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`), step).toEqual([]);
  };
  await page.emulateMedia({ reducedMotion: 'reduce' });   // dialogs fade in; check their final colours, not a frame of the fade
  await page.goto('app/#/start/invoice');
  await page.waitForSelector('.stepper');
  await page.click('.stepper button:has-text("Review")');
  await expect(page.locator('#credit-note')).toBeVisible();
  await page.click('.card button:has-text("Preview")');
  await expect(page.locator('.preview-wrap a[href*="made-with"]')).toBeVisible();
  await check('review with credit');
  await page.goto('app/#/settings');
  await page.waitForSelector('h1:has-text("Settings")');
  await check('settings, free');
  await page.click('button:has-text("Turn on encryption")');
  await expect(page.locator('.modal-title')).toHaveText('Available on Pro');
  await check('upgrade dialog');
  await page.goto('app/#/trial');
  await expect(page.locator('h1')).toHaveText('Your 14-day Pro trial has started');
  await check('trial screen');
  await expireTrial(page);
  await page.reload();
  await expect(page.locator('.modal-title')).toHaveText('Your free Pro trial has ended');
  await check('trial ended dialog');
});
