import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = ['', 'pricing/', 'docs/', 'docs/templates.html', 'docs/security.html', 'legal/privacy.html', '404.html', 'templates/', 'templates/statement-of-work.html', 'compare/gavel-alternative.html', 'for/law-firms.html', 'guides/automate-word-templates.html', 'free-tools/amount-in-words.html', 'free-tools/deadline-calculator.html', 'free-tools/template-checker.html', 'free-tools/late-payment-interest.html', 'free-tools/freelance-rate.html', 'for/freelancers.html', 'press/', 'clauses/', 'clauses/indemnification-clause.html', 'guides/what-to-include-in-an-nda.html', 'guides/what-to-do-when-a-client-wont-pay.html', 'templates/payment-reminder-letter.html', 'compare/', 'compare/honeybook-alternative.html', 'free-tools/invoice-due-date.html', 'free-tools/embed/invoice-due-date.html', 'free-tools/embed/amount-in-words.html', 'free-tools/loan-repayment.html', 'free-tools/embed/loan-repayment.html', 'templates/memorandum-of-understanding.html', 'templates/bill-of-sale.html', 'guides/is-an-mou-legally-binding.html', 'compare/lawdepot-alternative.html', 'compare/eforms-alternative.html', 'templates/partnership-agreement.html', 'templates/general-release.html', 'guides/what-to-include-in-a-partnership-agreement.html', 'free-tools/sales-commission.html', 'free-tools/embed/sales-commission.html'];
for (const p of PAGES) {
  test(`site page ${p || 'home'} renders and has no serious accessibility violations`, async ({ page }) => {
    const res = await page.goto(p);
    expect(res.status()).toBeLessThan(400);
    await expect(page.locator('main')).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}

test('the app has no serious accessibility violations on its main screens', async ({ page }) => {
  await page.goto('app/');
  await page.waitForSelector('h1:has-text("Templates")');
  for (const step of ['templates', 'designer', 'interview', 'settings']) {
    if (step === 'designer') { await page.locator('button:has-text("Use this sample")').nth(1).click(); await page.waitForSelector('input[aria-label="Template name"]'); await page.click('.field-item[data-key="client_name"] .field-main'); }
    if (step === 'interview') { await page.click('button:has-text("New draft")'); await page.waitForSelector('.stepper'); }
    if (step === 'settings') { await page.goto('app/#/settings'); await page.waitForSelector('h1:has-text("Settings")'); }
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    expect(serious.map((v) => `${step} ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`), step).toEqual([]);
  }
});

// The service worker precache list is checked by tests/unit/release.test.mjs (completeness, existence, versions).

test('mobile menu opens under a strict script policy (no inline handlers)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('pricing/');
  const btn = page.locator('.menu-btn');
  await expect(page.locator('#site-nav')).toBeHidden();
  await btn.click();
  await expect(page.locator('#site-nav')).toBeVisible();
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  expect(await page.locator('[onclick]').count()).toBe(0);
  await expect(page.locator('[data-checkout="pro"]')).toHaveText(/Request a pro key|Get Pro/);
});

test('free tools work in the page', async ({ page }) => {
  await page.goto('free-tools/amount-in-words.html');
  await page.fill('#amount', '3500');
  await expect(page.locator('#result')).toHaveText('Three Thousand Five Hundred Dollars');
  await page.goto('free-tools/deadline-calculator.html');
  await page.fill('#start', '2026-01-31'); await page.selectOption('#unit', 'months'); await page.fill('#amount', '1');
  await expect(page.locator('#result')).toHaveText('Saturday, February 28, 2026');
  await page.goto('free-tools/template-checker.html');
  await page.setInputFiles('#file', 'samples/engagement-letter.docx');
  await expect(page.locator('#report')).toContainText('No problems found');
  await expect(page.locator('#report table tbody tr')).toHaveCount(15);
  await expect(page.locator('#report')).toContainText('For each item: Name, Role, Rate');
  await page.goto('free-tools/late-payment-interest.html');
  await page.fill('#amount', '10000'); await page.fill('#due', '2026-01-01'); await page.fill('#paid', '2026-04-11'); await page.fill('#rate', '10');
  await expect(page.locator('#result')).toHaveText('Interest: $273.97');
  await page.selectOption('#basis', 'uk'); await page.fill('#base', '4');
  await expect(page.locator('#result-note')).toContainText('Plus fixed compensation of £100.');
  await page.goto('free-tools/freelance-rate.html');
  await expect(page.locator('#result')).toHaveText('$75 an hour · $598 a day');
  await page.goto('free-tools/invoice-due-date.html');
  await page.fill('#invoice', '2026-03-12'); await page.selectOption('#terms', '2/10 net 30');
  await expect(page.locator('#result')).toHaveText('Due Saturday, April 11, 2026');
  await expect(page.locator('#result-discount')).toContainText('$4,704.00 instead of $4,800.00, saving $96.00');
  await page.check('#weekends');
  await expect(page.locator('#result')).toHaveText('Due Monday, April 13, 2026');
  await expect(page.locator('#result-note')).toContainText('Moved from Saturday');
  await page.selectOption('#terms', 'other'); await page.fill('#custom', '15 MFI');
  await expect(page.locator('#result')).toHaveText('Due Wednesday, April 15, 2026');
  await expect(page.locator('#result-discount')).toHaveText('');
  await page.goto('free-tools/loan-repayment.html');
  await expect(page.locator('#result')).toHaveText('$526.46 a month');
  await page.fill('#first', '2026-11-01');
  await expect(page.locator('#result-note')).toContainText('Final payment on October 1, 2028.');
  await page.click('#schedule-box summary');
  await expect(page.locator('#schedule tbody tr')).toHaveCount(24);
  await expect(page.locator('#schedule tbody tr').first()).toContainText('$50.00');
  await page.fill('#rate', 'x');
  await expect(page.locator('#error')).toBeVisible();
  await expect(page.locator('#schedule-box')).toBeHidden();
  await page.goto('free-tools/sales-commission.html');
  await expect(page.locator('#result')).toHaveText('$4,900.00 commission');
  await expect(page.locator('#result-note')).toHaveText('Effective rate 6.13% of sales. 5% on the first $50,000.00, 8% on the next $30,000.00.');
  await page.selectOption('#method', 'whole'); await page.fill('#draw', '6000');
  await expect(page.locator('#result')).toHaveText('$6,400.00 commission');
  await expect(page.locator('#result-draw')).toHaveText('After the draw of $6,000.00 already paid, $400.00 more is due.');
  await page.click('#breakdown-box summary');
  await expect(page.locator('#breakdown tbody tr')).toHaveCount(1);
  await page.fill('#t2-above', '10');
  await expect(page.locator('#error')).toBeVisible();
  await expect(page.locator('#breakdown-box')).toBeHidden();
});

test('calculators can be embedded on other sites with a credit link', async ({ page, context, baseURL }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('free-tools/late-payment-interest.html');
  const code = await page.locator('#embed-code').inputValue();
  expect(code).toContain('<iframe src="https://getclausery.github.io/free-tools/embed/late-payment-interest.html"');
  expect(code).toContain('by <a href="https://getclausery.github.io/free-tools/late-payment-interest.html">Clausery</a>');
  await page.click('.copy-btn[data-copy="embed-code"]');
  await expect(page.locator('.embed-tools .copy-status')).toHaveText('Copied to the clipboard.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(code);
  // The embed page itself: no site chrome, not indexed, working calculator, credit link opening the full tool page.
  await page.goto('free-tools/embed/late-payment-interest.html');
  await expect(page.locator('.site-header')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.fill('#amount', '10000'); await page.fill('#due', '2026-01-01'); await page.fill('#paid', '2026-04-11'); await page.fill('#rate', '10');
  await expect(page.locator('#result')).toHaveText('Interest: $273.97');
  const credit = page.locator('.embed-credit a');
  await expect(credit).toHaveAttribute('href', 'https://getclausery.github.io/free-tools/late-payment-interest.html');
  await expect(credit).toHaveAttribute('target', '_blank');
  await page.goto('free-tools/embed/late-payment-interest.html?theme=dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  // On another site: the embed code's script fits the iframe to the calculator at any width; without the script
  // (some sites strip it) the fixed height still fits the calculator in a column 520px wide or more.
  const origin = new URL(baseURL).origin;
  for (const slug of ['amount-in-words', 'deadline-calculator', 'invoice-due-date', 'late-payment-interest', 'loan-repayment', 'sales-commission', 'freelance-rate']) {
    await page.goto(`free-tools/${slug}.html`);
    const snippet = (await page.locator('#embed-code').inputValue()).replaceAll('https://getclausery.github.io/', baseURL).replace("'https://getclausery.github.io'", `'${origin}'`);
    for (const [width, script] of [[360, true], [760, true], [520, false]]) {
      await page.setViewportSize({ width: width + 40, height: 900 });
      await page.setContent(`<!doctype html><html><body style="margin:20px">${script ? snippet : snippet.replace(/<script>.*<\/script>/s, '')}</body></html>`);
      const frame = page.frameLocator('iframe');
      await expect(frame.locator('.embed-wrap .out').first()).not.toBeEmpty();
      const fits = async () => {
        const [inner, outer] = await Promise.all([frame.locator('body').evaluate((el) => Math.ceil(el.getBoundingClientRect().height)), page.locator('iframe').evaluate((el) => el.clientHeight)]);
        return inner <= outer && (!script || outer - inner < 12);
      };
      await expect.poll(fits, { message: `${slug} at ${width}px ${script ? 'with' : 'without'} the resize script` }).toBe(true);
    }
  }
});

test('clause pages copy the sample wording', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('clauses/force-majeure-clause.html');
  await page.click('.copy-btn');
  await expect(page.locator('.copy-status')).toHaveText('Copied to the clipboard.');
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toMatch(/^Neither party shall be in breach/);
  expect(text).toContain('\n\nThe affected party shall promptly notify');
  await expect(page.locator('a[href="../templates/service-agreement.html"]')).toBeVisible();
});

test('the not-found page keeps its styles and links at any depth', async ({ page }) => {
  const res = await page.goto('templates/no-such/page.html');
  expect(res.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('That page is not here.');
  expect(await page.evaluate(() => window.getComputedStyle(document.querySelector('.site-header')).position)).not.toBe('static');
  await page.click('.site-header .brand');
  await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/);
});
