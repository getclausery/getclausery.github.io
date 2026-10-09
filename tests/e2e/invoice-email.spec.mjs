import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('invoice email generator handles partial payments, safe text and privacy on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('guides/invoice-email-template.html');
  await page.getByRole('button', { name: 'Generate email', exact: true }).click();
  await expect(page.locator('#email-client')).toBeFocused();
  await expect(page.locator('#email-status')).toContainText('Enter the client name');
  await page.getByRole('button', { name: 'Use an example', exact: true }).click();
  await expect(page.locator('#email-body')).toHaveValue(/USD 600\.00/);
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.fill('#email-client', '<img src=x onerror=alert(1)>');
  await expect(page.locator('#email-result')).toBeHidden();
  await page.selectOption('#email-mode', 'received');
  await page.fill('#email-amount', '200.10');
  await page.fill('#email-date', '2020-01-02');
  await page.getByRole('button', { name: 'Generate email', exact: true }).click();
  await expect(page.locator('#email-body')).toHaveValue(/USD 200\.10 on 2 January 2020 toward invoice/);
  await expect(page.locator('#email-body')).toHaveValue(/<img src=x onerror=alert\(1\)>/);
  await expect(page.locator('#email-body')).not.toHaveValue(/paid in full/);
  await expect(page.locator('#email-payment-row')).toBeHidden();
  expect(await page.locator('#email-result img').count()).toBe(0);
  expect(requests.some((url) => /200\.10|onerror|2020-01-02/.test(url))).toBe(false);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => v.id)).toEqual([]);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Clear details', exact: true }).click();
  await expect(page.locator('#email-body')).toHaveValue('');
  await expect(page.locator('#email-client')).toHaveValue('');
  await expect(page.locator('#email-result')).toBeHidden();
  await expect(page.locator('#email-amount-label')).toHaveText('Balance due');
});

test('copying uses plain text and a failed clipboard offers manual copying', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('guides/invoice-email-template.html');
  await page.getByRole('button', { name: 'Use an example', exact: true }).click();
  await page.getByRole('button', { name: 'Copy subject and message', exact: true }).click();
  await expect(page.locator('#email-status')).toContainText('Copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/^Subject: Invoice INV-0042[\s\S]*Hi Morgan,/);
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('denied'); } }, configurable: true }); });
  await page.getByRole('button', { name: 'Copy subject and message', exact: true }).click();
  await expect(page.locator('#email-status')).toContainText('message is selected');
  expect(await page.locator('#email-body').evaluate((el) => el.selectionEnd - el.selectionStart)).toBeGreaterThan(100);
});

test('email examples remain usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/guides/invoice-email-template.html');
  await expect(page.locator('#generator noscript p')).toBeVisible();
  await expect(page.locator('#email-client')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Generate email', exact: true })).toBeDisabled();
  await expect(page.locator('.email-sample')).toHaveCount(4);
  await expect(page.locator('.email-sample').last()).toContainText('USD 200.00');
  await context.close();
});
