import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = ['', 'pricing/', 'about/', 'contact/', 'templates/invoice.html', 'guides/how-to-write-an-invoice.html', 'guides/how-to-save-an-invoice-as-pdf.html', 'docs/', 'docs/templates.html', 'docs/security.html', 'legal/privacy.html', '404.html', 'templates/', 'templates/statement-of-work.html', 'compare/gavel-alternative.html', 'for/law-firms.html', 'guides/automate-word-templates.html', 'free-tools/amount-in-words.html', 'free-tools/deadline-calculator.html', 'free-tools/template-checker.html', 'free-tools/late-payment-interest.html', 'free-tools/freelance-rate.html', 'for/freelancers.html', 'press/', 'business-document-kit/', 'clauses/', 'clauses/indemnification-clause.html', 'guides/what-to-include-in-an-nda.html', 'guides/what-to-do-when-a-client-wont-pay.html', 'templates/payment-reminder-letter.html', 'compare/', 'compare/honeybook-alternative.html', 'free-tools/invoice-due-date.html', 'free-tools/embed/invoice-due-date.html', 'free-tools/embed/amount-in-words.html', 'free-tools/loan-repayment.html', 'free-tools/embed/loan-repayment.html', 'templates/memorandum-of-understanding.html', 'templates/bill-of-sale.html', 'guides/is-an-mou-legally-binding.html', 'compare/lawdepot-alternative.html', 'compare/eforms-alternative.html', 'templates/partnership-agreement.html', 'templates/general-release.html', 'guides/what-to-include-in-a-partnership-agreement.html', 'free-tools/sales-commission.html', 'free-tools/embed/sales-commission.html', 'guides/how-to-write-a-bill-of-sale.html', 'guides/how-to-lend-money-to-family.html', 'guides/do-i-need-a-model-release.html', 'templates/notice-to-vacate.html', 'templates/security-deposit-return-letter.html', 'for/landlords.html', 'guides/how-to-write-a-notice-to-vacate.html', 'templates/residential-lease-agreement.html', 'templates/move-in-checklist.html', 'free-tools/prorated-rent.html', 'free-tools/embed/prorated-rent.html', 'guides/what-to-include-in-a-lease-agreement.html', 'templates/rent-receipt.html', 'templates/rental-application.html', 'templates/lease-renewal-letter.html', 'templates/pet-addendum.html', 'nda-templates/', 'templates/employee-nda.html', 'templates/contractor-nda.html', 'templates/business-sale-nda.html', 'guides/mutual-vs-one-way-nda.html', 'guides/how-long-should-an-nda-last.html', 'templates/non-solicitation-agreement.html', 'guides/nda-vs-confidentiality-agreement.html', 'for/hr-teams.html', 'templates/employment-agreement.html', 'templates/employee-warning-letter.html', 'templates/promotion-letter.html', 'templates/liability-waiver.html', 'guides/how-to-write-an-employee-warning-letter.html', 'guides/are-liability-waivers-enforceable.html', 'guides/how-to-write-a-termination-letter.html', 'guides/how-to-return-a-security-deposit.html', 'guides/how-to-write-a-rent-increase-letter.html', 'guides/what-to-include-in-a-roommate-agreement.html', 'guides/non-compete-vs-non-solicitation.html', 'docs/faq.html', 'changelog.html', 'guides/'];
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

for (const slug of ['deposit-invoice', 'hourly-invoice', 'final-invoice']) {
  test(`billing page ${slug} is usable and accessible on a narrow screen`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`invoice-templates/${slug}.html`);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a:has-text("Start this invoice, free")')).toHaveAttribute('href', `../app/#/start/invoice/${slug}`);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => v.id)).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test('the deposit calculator updates locally and clearly handles invalid input', async ({ page }) => {
  await page.goto('invoice-templates/deposit-invoice.html');
  await expect(page.locator('#deposit-result')).toHaveText('$600.00 deposit · $1,400.00 remaining');
  await page.fill('#deposit-amount', '100.01');
  await page.fill('#deposit-percentage', '33.33');
  await expect(page.locator('#deposit-result')).toHaveText('$33.33 deposit · $66.68 remaining');
  await page.selectOption('#deposit-currency', 'GBP');
  await expect(page.locator('#deposit-result')).toContainText('£33.33');
  await page.fill('#deposit-percentage', '120');
  await expect(page.locator('#deposit-result')).toContainText('0% to 100%');
  await page.fill('#deposit-percentage', '0');
  await expect(page.locator('#deposit-result')).toContainText('£0.00 deposit');
});

test('the app has no serious accessibility violations on its main screens', async ({ page }) => {
  await page.goto('app/');
  await page.waitForSelector('h1:has-text("Templates")');
  for (const step of ['templates', 'designer', 'interview', 'settings']) {
    if (step === 'designer') { await page.locator('#all-samples button:has-text("Customise")').nth(1).click(); await page.waitForSelector('input[aria-label="Template name"]'); await page.click('.field-item[data-key="client_name"] .field-main'); }
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
  await expect(page.locator('[data-checkout="pro"]')).toHaveText(/Request a Pro key|Get Pro/);
  await expect(page.locator('[data-checkout="pro"]')).toHaveAttribute('href', /^mailto:getclausery@gmail\.com\?subject=Clausery%20Pro%20key%20request$|^https:\/\//);
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
  await page.goto('free-tools/prorated-rent.html');
  await expect(page.locator('#result')).not.toBeEmpty();
  await page.fill('#date', '2026-09-20');
  await expect(page.locator('#result')).toHaveText('$550.00 for 11 days');
  await expect(page.locator('#result-note')).toHaveText('Daily rate $50.00 (the monthly rent ÷ 30 days in September 2026). Rent for September 20 to September 30, counting the move-in day.');
  await page.selectOption('#direction', 'out'); await page.fill('#date', '2026-10-10');
  await expect(page.locator('#result')).toHaveText('$483.87 for 10 days');
  await page.click('#compare-box summary');
  await expect(page.locator('#compare tbody tr')).toHaveCount(3);
  await expect(page.locator('#compare tbody tr').nth(2)).toContainText('$500.00');
  await expect(page.locator('.small', { hasText: 'More free tools:' }).locator('a[href$="sales-commission.html"]')).toHaveCount(1);
  await page.fill('#rent', '');
  await expect(page.locator('#error')).toBeVisible();
  await expect(page.locator('#compare-box')).toBeHidden();
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
  for (const slug of ['amount-in-words', 'deadline-calculator', 'invoice-due-date', 'late-payment-interest', 'loan-repayment', 'sales-commission', 'prorated-rent', 'freelance-rate']) {
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

test('the templates page offers every template in one zip download', async ({ page, request }) => {
  await page.goto('templates/');
  const link = page.locator('a[download]:has-text("Download all")');
  await expect(link).toHaveText(/^Download all \d+ templates$/);
  const res = await request.get(new URL(await link.getAttribute('href'), page.url()).href);
  expect(res.status()).toBe(200);
  expect((await res.body()).subarray(0, 2).toString()).toBe('PK');
  await page.goto('templates/bill-of-sale.html');
  await expect(page.locator('a[download]:has-text("Download all")')).toHaveAttribute('href', '../samples/clausery-word-templates.zip');
});

test('the NDA page links every NDA template, and each one links back', async ({ page, request }) => {
  await page.goto('nda-templates/');
  const slugs = ['mutual-nda', 'one-way-nda', 'employee-nda', 'contractor-nda', 'business-sale-nda'];
  for (const s of slugs) {
    await expect(page.locator(`table a[href="../templates/${s}.html"]`)).toHaveCount(1);
    const file = page.locator(`table a[download][href="../samples/${s}.docx"]`);
    expect((await request.get(new URL(await file.getAttribute('href'), page.url()).href)).status()).toBe(200);
  }
  for (const s of slugs) {
    await page.goto(`templates/${s}.html`);
    await expect(page.getByRole('link', { name: 'which NDA do you need?' })).toHaveAttribute('href', '../nda-templates/');
  }
});

test('the HR page lists every HR letter template, and the new guides link their templates', async ({ page }) => {
  await page.goto('for/hr-teams.html');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Free HR letter templates you can fill in online');
  for (const s of ['offer-letter', 'employment-agreement', 'employee-warning-letter', 'promotion-letter', 'salary-increase-letter', 'employment-termination-letter', 'employment-verification-letter', 'reference-letter', 'internship-offer-letter', 'resignation-letter']) {
    await expect(page.locator(`main a[href="../templates/${s}.html"]`).first()).toBeVisible();
  }
  await page.goto('guides/how-to-write-an-employee-warning-letter.html');
  await expect(page.locator('main a[href="../templates/employee-warning-letter.html"]')).toHaveCount(1);
  await page.goto('guides/are-liability-waivers-enforceable.html');
  await expect(page.locator('main a[href="../templates/liability-waiver.html"]')).toHaveCount(1);
  await page.goto('templates/liability-waiver.html');
  await expect(page.getByRole('region', { name: 'Full text of the Liability waiver template' })).toContainText('INCLUDING LIABILITY CAUSED BY THE NEGLIGENCE');
});

test('round 16 guides link their templates, and those templates link back', async ({ page }) => {
  for (const [guide, tpl] of [['how-to-write-a-termination-letter', 'employment-termination-letter'], ['how-to-return-a-security-deposit', 'security-deposit-return-letter'], ['how-to-write-a-rent-increase-letter', 'rent-increase-letter'], ['what-to-include-in-a-roommate-agreement', 'roommate-agreement'], ['non-compete-vs-non-solicitation', 'non-solicitation-agreement']]) {
    await page.goto(`guides/${guide}.html`);
    await expect(page.locator(`main a[href="../templates/${tpl}.html"]`).first()).toBeVisible();
    await page.goto(`templates/${tpl}.html`);
    await expect(page.locator(`main a[href="../guides/${guide}.html"]`).first()).toBeVisible();
  }
});

test('the FAQ and pricing pages publish their questions as FAQPage data', async ({ page }) => {
  const types = async () => (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t)['@type']);
  await page.goto('docs/faq.html');
  expect(await types()).toEqual(expect.arrayContaining(['FAQPage', 'BreadcrumbList']));
  await page.goto('pricing/');
  expect(await types()).toEqual(expect.arrayContaining(['FAQPage', 'SoftwareApplication', 'BreadcrumbList']));
  const faq = JSON.parse((await page.locator('script[type="application/ld+json"]').allTextContents()).find((t) => t.includes('FAQPage')));
  await expect(page.locator('#faq summary')).toHaveCount(faq.mainEntity.length);
});

test('template pages show the full wording with placeholders instead of tags', async ({ page }) => {
  await page.goto('templates/mutual-nda.html');
  const doc = page.getByRole('region', { name: 'Full text of the Mutual NDA template' });
  await expect(doc).toContainText('MUTUAL NON-DISCLOSURE AGREEMENT');
  await expect(doc.locator('.tpl-ph').first()).toHaveText(/^\[.+\]$/);
  await expect(doc).not.toContainText('{');
});

test('round 17: the template finder filters the index, and template and guide pages link related pages', async ({ page }) => {
  await page.goto('templates/');
  const box = page.getByLabel('Find a template');
  await expect(box).toBeVisible();
  await box.fill('lease');
  await expect(page.locator('#tpl-groups a.feature:visible')).not.toHaveCount(0);
  await expect(page.locator('#tpl-groups a.feature[href="../templates/mutual-nda.html"]')).toBeHidden();
  await expect(page.locator('[data-filter-count]')).toHaveText(/^\d+ of \d+ templates match$/);
  await box.fill('zzzz no such template');
  await expect(page.locator('[data-filter-empty]')).toBeVisible();
  await page.goto('');
  await page.getByLabel('Find a template').fill('nda');
  await page.getByRole('search', { name: 'Find a free template' }).getByRole('button', { name: 'Search' }).click();
  await expect(page).toHaveURL(/templates\/\?q=nda$/);
  await expect(page.getByLabel('Find a template')).toHaveValue('nda');
  await expect(page.locator('#tpl-groups a.feature[href="../templates/mutual-nda.html"]')).toBeVisible();
  await page.goto('templates/mutual-nda.html');
  await expect(page.getByRole('heading', { name: 'What is in the mutual NDA' })).toBeVisible();
  await expect(page.locator('.related-cards a.feature[href="../templates/one-way-nda.html"]')).toHaveCount(1);
  await expect(page.locator('td', { hasText: 'If “Has jurisdiction” is yes' })).toHaveCount(1);
  await page.goto('guides/what-is-a-kill-fee.html');
  await expect(page.locator('.guide-meta time').first()).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
  await expect(page.getByRole('heading', { name: 'More on freelancing and getting paid' })).toBeVisible();
});
