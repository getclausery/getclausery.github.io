import { test, expect } from '@playwright/test';
import { openApp, useSample, fill, docxText } from './helpers.mjs';

test.describe('core drafting flow', () => {
  test('imports a sample, edits the questionnaire, drafts and generates a .docx', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await openApp(page);
    await useSample(page, 1);   // engagement letter
    await expect(page.locator('input[aria-label="Template name"]')).toHaveValue('Engagement letter');
    await expect(page.locator('.field-item')).toHaveCount(18);
    await expect(page.locator('.field-item[data-key="attorneys"] .badge.type')).toHaveText('Repeating group');
    await expect(page.locator('.field-item[data-key="has_retainer"] .badge.type')).toHaveText('Condition');

    // rename a field and save
    await page.click('.field-item[data-key="client_name"] .field-main');
    await page.locator('.inspector label.field:has(.field-label:text-is("Label")) input').fill('Client full name');
    await page.click('button:has-text("Save")');
    await expect(page.locator('.toast')).toContainText('saved');

    // draft
    await page.click('button:has-text("New draft")');
    await page.waitForSelector('.stepper');
    await expect(page.locator('.stepper li')).toHaveCount(3);
    await fill(page, 'letter_date', '2026-10-01');
    await fill(page, 'firm_name', 'Doe & Partners');
    await fill(page, 'matter_description', 'a lease review');
    await page.click('button:has-text("Add attorney")');
    await fill(page, 'attorneys[0].name', 'Jane Doe'); await fill(page, 'attorneys[0].role', 'Partner'); await fill(page, 'attorneys[0].rate', '450');
    await fill(page, 'fee_hourly', true);
    await fill(page, 'has_retainer', true);
    await expect(page.locator('[data-path="retainer_amount"]')).toBeVisible();
    await fill(page, 'retainer_amount', '5000');
    await fill(page, 'payment_days', '30'); await fill(page, 'responsible_attorney', 'Jane Doe');
    await page.click('button:has-text("Next")');
    await expect(page.locator('.field-label:has-text("Client full name")')).toBeVisible();
    await fill(page, 'client_name', 'Acme Ltd'); await fill(page, 'client_address', '1 Main St\nSpringfield'); await fill(page, 'client_salutation', 'Ms Smith');
    await page.click('.interview-nav button:has-text("Review")');
    await expect(page.locator('.notice-ok')).toContainText('Everything is answered');

    const [download] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Download .docx")')]);
    expect(download.suggestedFilename()).toMatch(/\.docx$/);
    const text = await docxText(await download.path());
    expect(text).toContain('Acme Ltd');
    expect(text).toContain('Jane Doe, Partner');
    expect(text).toContain('$450.00 per hour');
    expect(text).toContain('retainer) of $5,000.00');
    expect(text).not.toContain('flat fee of');
    expect(text).not.toContain('No advance deposit');
    expect(text).toContain('October 1, 2026');

    await page.click('.card button:has-text("Preview")');
    await expect(page.locator('.preview-wrap section.docx').first()).toBeVisible();
    await page.goto('app/#/drafts');
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.locator('tbody tr .badge')).toHaveText('Generated');
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('library samples are unlimited on the free plan; three of your own templates, then it asks to upgrade', async ({ page }) => {
    await openApp(page);
    for (let i = 0; i < 4; i++) { await useSample(page, i); await page.goto('app/#/templates'); await page.waitForSelector('h1:has-text("Templates")'); }
    await expect(page.locator('.cards article[data-template-id]')).toHaveCount(4);
    await expect(page.locator('.modal-title')).toHaveCount(0);
    const upload = async () => {
      const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.locator('.dropzone').click()]);
      await chooser.setFiles('samples/mutual-nda.docx');
    };
    for (let i = 0; i < 3; i++) { await upload(); await page.waitForSelector('input[aria-label="Template name"]'); await page.goto('app/#/templates'); await page.waitForSelector('h1:has-text("Templates")'); }
    await expect(page.locator('.cards article[data-template-id]')).toHaveCount(7);
    await upload();
    await expect(page.locator('.modal-title')).toHaveText('Available on Pro');
    await expect(page.locator('.modal')).toContainText('Templates from the free library never count');
  });

  test('draft answers survive a reload and validation blocks skipping required fields on Next', async ({ page }) => {
    await openApp(page);
    await useSample(page, 0);   // NDA
    await page.click('button:has-text("New draft")');
    await page.waitForSelector('.stepper');
    await fill(page, 'effective_date', '2026-11-01');
    await fill(page, 'purpose', 'a joint venture');
    await page.waitForTimeout(700);   // autosave debounce
    await page.reload();
    await page.waitForSelector('.stepper');
    await expect(page.locator('[name="purpose"]')).toHaveValue('a joint venture');
    await page.click('button:has-text("Next")');
    await expect(page.locator('.field-error:visible').first()).toContainText('required');
    await expect(page.locator('.toast')).toContainText('Complete the highlighted');
  });
});

test('the newer templates open as drafts from their deep links', async ({ browser, baseURL }) => {
  // a fresh browser profile for each, so every deep link imports its sample from scratch
  for (const [slug, name] of [['memorandum-of-understanding', 'Memorandum of understanding (MOU)'], ['letter-of-intent', 'Letter of intent (business purchase)'], ['bill-of-sale', 'Bill of sale'], ['loan-agreement', 'Loan agreement'], ['partnership-agreement', 'Partnership agreement'], ['sales-commission-agreement', 'Sales commission agreement'], ['photo-release-form', 'Photo and model release'], ['general-release', 'General release'], ['notice-to-vacate', 'Notice to vacate (tenant)'], ['rent-increase-letter', 'Rent increase letter'], ['security-deposit-return-letter', 'Security deposit return letter'], ['roommate-agreement', 'Roommate agreement'], ['residential-lease-agreement', 'Residential lease agreement'], ['sublease-agreement', 'Sublease agreement'], ['move-in-checklist', 'Move-in and move-out checklist'], ['late-rent-notice', 'Late rent notice'], ['rent-receipt', 'Rent receipt'], ['rental-application', 'Rental application'], ['lease-renewal-letter', 'Lease renewal letter'], ['pet-addendum', 'Pet addendum'], ['employee-nda', 'Employee NDA'], ['contractor-nda', 'Contractor NDA'], ['business-sale-nda', 'NDA for selling a business'], ['non-solicitation-agreement', 'Non-solicitation agreement'], ['employment-agreement', 'Employment agreement'], ['employee-warning-letter', 'Employee warning letter'], ['promotion-letter', 'Promotion letter'], ['liability-waiver', 'Liability waiver'], ['invoice', 'Invoice'], ['quote', 'Price quote'], ['purchase-order', 'Purchase order'], ['payment-receipt', 'Payment receipt'], ['two-weeks-notice-letter', 'Two weeks notice letter'], ['hold-harmless-agreement', 'Hold harmless agreement'], ['equipment-rental-agreement', 'Equipment rental agreement'], ['cleaning-services-contract', 'Cleaning services contract'], ['meeting-minutes', 'Meeting minutes'], ['non-compete-agreement', 'Non-compete agreement'], ['nanny-contract', 'Nanny contract'], ['gift-letter', 'Gift letter for a mortgage'], ['lease-termination-agreement', 'Lease termination agreement'], ['severance-agreement', 'Severance agreement'], ['job-description', 'Job description'], ['catering-contract', 'Catering contract'], ['board-resolution', 'Board resolution']]) {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    await page.goto(`app/#/start/${slug}`);
    await page.waitForSelector('.stepper');
    await expect(page.locator('#main .badge').first()).toHaveText(name);
    await context.close();
  }
});

test('template library "Fill it in now" opens a ready draft, and reuses the template on a second visit', async ({ page }) => {
  await page.goto('templates/payment-demand-letter.html');
  await page.click('a:has-text("Fill it in now")');
  await page.waitForSelector('.stepper');
  await expect(page).toHaveURL(/#\/drafts\/d_/);
  await expect(page.locator('#main .badge').first()).toHaveText('Payment demand letter');
  await page.goto('app/#/start/payment-demand-letter');
  await page.waitForSelector('.stepper');
  await page.goto('app/#/templates');
  await expect(page.locator('.cards article[data-template-id]')).toHaveCount(1);
  await page.goto('app/#/drafts');
  await expect(page.locator('tbody tr')).toHaveCount(2);
});

test('the 1.19.0 templates open as drafts from their deep links', async ({ browser, baseURL }) => {
  const names = { 'room-rental-agreement': 'Room rental agreement', 'rent-payment-plan-agreement': 'Rent payment plan agreement', 'landlord-reference-letter': 'Landlord reference letter', 'performance-improvement-plan': 'Performance improvement plan', 'remote-work-agreement': 'Remote work agreement', 'expense-reimbursement-form': 'Expense reimbursement form', 'change-order-form': 'Change order form', 'consignment-agreement': 'Consignment agreement', 'pet-sitting-agreement': 'Pet sitting agreement', 'coaching-agreement': 'Coaching agreement', 'contract-termination-letter': 'Contract termination letter', 'credit-note': 'Credit note' };
  for (const [slug, name] of Object.entries(names)) {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    await page.goto(`app/#/start/${slug}`);
    await page.waitForSelector('.stepper');
    await expect(page.locator('#main .badge').first()).toHaveText(name);
    await context.close();
  }
});

test('questions inside a condition stay hidden until the condition is ticked', async ({ page }) => {
  await page.goto('app/#/start/invoice');
  await page.waitForSelector('.stepper');
  // jumping ahead from the section list is a skip, so the skipped section is not flagged
  await page.click('.stepper button:has-text("Invoice details")');
  const po = page.locator('.field[data-path="purchase_order_number"]');
  await expect(po).toBeHidden();
  await page.check('#f_has_purchase_order');
  await expect(po).toBeVisible();
  await page.uncheck('#f_has_purchase_order');
  await expect(po).toBeHidden();
  // missing answers read as "left" until the person tries to move on
  await expect(page.locator('.stepper li:has-text("Your business") .cnt')).toContainText('left');
  await expect(page.locator('.stepper li:has-text("Invoice details") .cnt')).toContainText('left');
  await page.click('.interview-nav button:has-text("Next")');
  await expect(page.locator('.stepper li:has-text("Invoice details") .cnt')).toContainText('to fix');
  await expect(page.locator('.stepper li:has-text("Your business") .cnt')).toContainText('left');
});

test('the invoice works out line amounts, tax and totals as you type', async ({ page }) => {
  await page.goto('app/#/start/invoice');
  await page.waitForSelector('.stepper');
  await page.click('.stepper button:has-text("Items and totals")');
  await page.fill('[data-path="line_items[0].item_name"] input', 'Website design');
  await page.fill('[data-path="line_items[0].item_quantity"] input', '2');
  await page.fill('[data-path="line_items[0].item_rate"] input', '1200');
  await page.click('button:has-text("Add line item")');
  await page.fill('[data-path="line_items[1].item_name"] input', 'Hosting');
  await page.fill('[data-path="line_items[1].item_quantity"] input', '12');
  await page.fill('[data-path="line_items[1].item_rate"] input', '15');
  await page.check('#f_has_discount');
  await page.fill('[data-path="discount_amount"] input', '100');
  await page.check('#f_has_tax');
  await page.fill('[data-path="tax_name"] input', 'HST');
  await page.fill('[data-path="tax_rate"] input', '13');
  await expect(page.locator('[data-path="line_items[0].item_amount"] .computed-value')).toHaveText('$2,400.00');
  await expect(page.locator('[data-path="line_items[1].item_amount"] .computed-value')).toHaveText('$180.00');
  await expect(page.locator('[data-path="subtotal_amount"] .computed-value')).toHaveText('$2,580.00');
  await expect(page.locator('[data-path="tax_amount"] .computed-value')).toHaveText('$322.40');   // 13% of 2,480
  await expect(page.locator('[data-path="invoice_total"] .computed-value')).toHaveText('$2,802.40');
  await page.check('#f_has_amount_paid');
  await page.fill('[data-path="amount_paid"] input', '802.40');
  await expect(page.locator('[data-path="balance_due"] .computed-value')).toHaveText('$2,000.00');
});

test('the live preview shows the document beside the questions and follows the answers', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('app/#/start/invoice');
  await page.waitForSelector('.stepper');
  const panel = page.locator('.live-preview');
  await expect(panel).toBeVisible();
  await expect(panel.locator('section.docx').first()).toContainText('[Business or trading name]');
  await page.fill('[name="business_name"]', 'Northwind Logistics');
  await expect(panel.locator('section.docx').first()).toContainText('Northwind Logistics');
  // the choice is remembered
  await page.click('button:has-text("Live preview")');
  await expect(panel).toBeHidden();
  await page.reload();
  await page.waitForSelector('.stepper');
  await expect(page.locator('.live-preview')).toBeHidden();
  await expect(page.locator('button:has-text("Live preview")')).toHaveAttribute('aria-pressed', 'false');
});

test('printing waits for an invoice preview that is still rendering', async ({ page }) => {
  await page.route('**/app/lib/render.js', async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace('export async function previewDocx(blobOrBytes, container, styleContainer) {', 'export async function previewDocx(blobOrBytes, container, styleContainer) {\n  if (container.classList.contains("print-area")) await new Promise((resolve) => { window.finishInvoicePreview = resolve; });');
    await route.fulfill({ response, body });
  });
  await page.addInitScript(() => { window.print = () => { window.printedInvoice = { pages: document.querySelectorAll('.print-area section.docx').length, text: document.querySelector('.print-area')?.textContent }; }; });
  await page.goto('app/#/start/invoice');
  await page.waitForSelector('.stepper');
  await fill(page, 'business_name', 'Northwind Studio');
  await page.click('.stepper button:has-text("Review")');
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect.poll(() => page.evaluate(() => typeof window.finishInvoicePreview)).toBe('function');
  await page.getByRole('button', { name: 'Print / Save as PDF', exact: true }).click();
  expect(await page.evaluate(() => window.printedInvoice)).toBeUndefined();
  await page.evaluate(() => window.finishInvoicePreview());
  await expect.poll(() => page.evaluate(() => window.printedInvoice?.pages)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.printedInvoice.text)).toContain('Northwind Studio');
  await expect(page.locator('.history-list li')).toHaveCount(1);
  await expect(page.locator('.history-list li')).toContainText('Printed or saved as PDF');
});

test('a failed invoice preview does not open printing or record a made document', async ({ page }) => {
  await page.route('**/app/lib/render.js', async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace('export async function previewDocx(blobOrBytes, container, styleContainer) {', 'export async function previewDocx(blobOrBytes, container, styleContainer) {\n  if (container.classList.contains("print-area")) throw new Error("Preview unavailable");');
    await route.fulfill({ response, body });
  });
  await page.addInitScript(() => { window.print = () => { window.invoicePrintOpened = true; }; });
  await page.goto('app/#/start/invoice');
  await page.waitForSelector('.stepper');
  await page.click('.stepper button:has-text("Review")');
  await page.getByRole('button', { name: 'Print / Save as PDF', exact: true }).click();
  await expect(page.locator('.toast')).toContainText('Preview unavailable');
  await expect(page.locator('.preview-wrap.print-area')).toBeHidden();
  expect(await page.evaluate(() => window.invoicePrintOpened)).toBeUndefined();
  await expect(page.locator('.history-list li')).toHaveCount(0);
});

test('a spreadsheet makes one invoice per row, and every document made is recorded in the history', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('app/#/start/invoice');
  await page.waitForSelector('.stepper');
  await fill(page, 'business_name', 'Northwind Studio');
  await page.click('.stepper button:has-text("Items and totals")');
  await page.fill('[data-path="line_items[0].item_name"] input', 'Monthly retainer');
  await page.fill('[data-path="line_items[0].item_rate"] input', '1000');
  await page.click('.stepper button:has-text("Review")');
  await expect(page.locator('.card h3:has-text("History")')).toBeVisible();
  await expect(page.locator('.history-list li')).toHaveCount(0);

  // one document: recorded with a fingerprint
  const [single] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Download .docx")')]);
  expect(single.suggestedFilename()).toMatch(/\.docx$/);
  await expect(page.locator('.history-list li')).toHaveCount(1);
  await expect(page.locator('.history-list li').first()).toContainText('Downloaded .docx');
  await expect(page.locator('.history-list li code').first()).toHaveText(/^[0-9a-f]{12}$/);

  // the spreadsheet template and a filled-in spreadsheet
  await page.click('button:has-text("From a spreadsheet")');
  const [csvDownload] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Download the spreadsheet template")')]);
  expect(csvDownload.suggestedFilename()).toMatch(/\.csv$/);
  const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.click('button:has-text("Choose the .csv file")')]);
  await chooser.setFiles({ name: 'clients.csv', mimeType: 'text/csv', buffer: Buffer.from('client_name,Client address,invoice_number,Shoe size\nAcme Ltd,1 Main St,INV-001,9\nBolt Inc,2 High St,INV-002,10\nCobalt LLC,3 Low Rd,INV-003,11\n') });
  await expect(page.locator('.modal')).toContainText('3 documents ready');
  await expect(page.locator('.modal')).toContainText('Ignored columns (no matching question): Shoe size');
  const [zip] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Generate 3 documents")')]);
  expect(zip.suggestedFilename()).toMatch(/\.zip$/);
  const { PizZip, Docxtemplater } = await import('../../vendor/docs.js');
  const { readFileSync } = await import('node:fs');
  const outer = new PizZip(readFileSync(await zip.path()));
  const names = Object.keys(outer.files).sort();
  expect(names).toEqual(['Acme Ltd - Invoice.docx', 'Bolt Inc - Invoice.docx', 'Cobalt LLC - Invoice.docx']);
  const text = new Docxtemplater(new PizZip(outer.file('Bolt Inc - Invoice.docx').asUint8Array()), { paragraphLoop: true }).getFullText();
  expect(text).toContain('Bolt Inc');
  expect(text).toContain('INV-002');
  expect(text).toContain('Northwind Studio');   // from the draft
  expect(text).toContain('$1,000.00');          // the draft's line item, calculated
  await expect(page.locator('.history-list li').first()).toContainText('Made from a spreadsheet (3 documents)');

  // restore puts earlier answers back and keeps the current ones in the history
  await page.click('.stepper button:has-text("Your business")');
  await fill(page, 'business_name', 'Renamed Ltd');
  await page.click('.stepper button:has-text("Review")');
  page.once('dialog', (d) => d.accept());
  await page.locator('.history-list li').last().locator('button:has-text("Restore these answers")').click();
  await page.locator('.modal button:has-text("Restore")').click();
  await page.click('.stepper button:has-text("Your business")');
  await expect(page.locator('[name="business_name"]')).toHaveValue('Northwind Studio');
  expect(errors).toEqual([]);
});

test('a new visitor sees the everyday documents first, can search all templates, and is one click from a draft', async ({ page }) => {
  await page.goto('app/');
  await expect(page.locator('.first-run h2')).toHaveText('Make your first document');
  await expect(page.locator('.first-run article h3')).toHaveText(['Invoice', 'Price quote', 'Payment receipt', 'Rent receipt', 'Purchase order', 'Credit note']);
  await page.fill('input[aria-label="Find a template"]', 'lease');
  const visible = page.locator('#all-samples article:visible');
  expect(await visible.count()).toBeGreaterThan(2);
  for (const t of await visible.locator('h3').allInnerTexts()) expect(t.toLowerCase() + (await page.locator(`#all-samples article:visible:has(h3:text-is("${t}")) .meta`).innerText()).toLowerCase()).toMatch(/lease/);
  await page.fill('input[aria-label="Find a template"]', 'zzzz');
  await expect(page.locator('#all-samples article:visible')).toHaveCount(0);
  await expect(page.locator('text=No template matches')).toBeVisible();
  await page.locator('.first-run article:has(h3:text-is("Invoice")) a:has-text("Fill it in")').click();
  await page.waitForSelector('.stepper');
  await expect(page).toHaveURL(/#\/drafts\/d_/);
});

test('the next invoice starts with your details, the next number and today\'s date, but not the client', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('app/#/start/invoice');
  await page.waitForSelector('.stepper');
  const today = await page.evaluate(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
  await fill(page, 'business_name', 'Northwind Studio');
  await fill(page, 'business_address', '1 High St');
  await fill(page, 'business_email', 'hi@northwind.test');
  await page.click('.stepper button:has-text("Invoice details")');
  await expect(page.locator('[name="invoice_date"]')).toHaveValue(today);
  await fill(page, 'invoice_number', 'INV-0041');
  await page.click('.stepper button:has-text("Bill to")');
  await fill(page, 'client_name', 'Acme Ltd');
  await page.click('.stepper button:has-text("Review")');
  await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Download .docx")')]);

  await page.goto('app/#/start/invoice');
  await page.waitForSelector('.stepper');
  await expect(page.locator('.toast:has-text("Filled in")')).toHaveText(/Filled in your details from your last invoice, number INV-0042 and today's date\. Check them before you send this invoice\./);
  await expect(page.locator('[name="business_name"]')).toHaveValue('Northwind Studio');
  await expect(page.locator('[name="business_email"]')).toHaveValue('hi@northwind.test');
  await page.click('.stepper button:has-text("Invoice details")');
  await expect(page.locator('[name="invoice_number"]')).toHaveValue('INV-0042');
  await expect(page.locator('[name="invoice_date"]')).toHaveValue(today);
  await page.click('.stepper button:has-text("Bill to")');
  await expect(page.locator('[name="client_name"]')).toHaveValue('');
  expect(errors).toEqual([]);
});

test('a trade invoice page opens an invoice with that trade\'s usual lines, quantities in and prices left to you', async ({ page }) => {
  await page.goto('invoice-templates/cleaning.html');
  await expect(page.locator('h1')).toHaveText('Cleaning invoice template');
  await page.click('a:has-text("Start this invoice, free")');
  await page.waitForSelector('.stepper');
  await expect(page.locator('.toast:has-text("cleaning business")')).toBeVisible();
  await page.click('.stepper button:has-text("Items and totals")');
  await expect(page.locator('[data-path="line_items[0].item_name"] input')).toHaveValue('Regular cleaning visit');
  await expect(page.locator('[data-path="line_items[0].item_quantity"] input')).toHaveValue('4');
  await expect(page.locator('[data-path="line_items[0].item_rate"] input')).toHaveValue('');
  await expect(page.locator('[data-path^="line_items["][data-path$="].item_name"]')).toHaveCount(4);
  await page.fill('[data-path="line_items[0].item_rate"] input', '120');
  await expect(page.locator('[data-path="line_items[0].item_amount"] .computed-value')).toHaveText('$480.00');
});

test('a country invoice page opens an invoice set up for that country\'s tax, rate, tax number and currency', async ({ page }) => {
  await page.goto('invoice-templates/uk-vat-invoice.html');
  await expect(page.locator('h1')).toHaveText('VAT invoice template (UK)');
  await page.click('a:has-text("Start this invoice, free")');
  await page.waitForSelector('.stepper');
  await expect(page.locator('.toast:has-text("Set up for UK VAT")')).toContainText('Amounts are in GBP');
  await expect(page.locator('[name="tax_registration_label"]')).toHaveValue('VAT registration number');
  await page.click('.stepper button:has-text("Items and totals")');
  await expect(page.locator('[name="tax_name"]')).toHaveValue('VAT');
  await expect(page.locator('[name="tax_rate"]')).toHaveValue('20');
  await page.fill('[data-path="line_items[0].item_name"] input', 'Bookkeeping');
  await page.fill('[data-path="line_items[0].item_quantity"] input', '2');
  await page.fill('[data-path="line_items[0].item_rate"] input', '50');
  await expect(page.locator('[data-path="tax_amount"] .computed-value')).toHaveText('£20.00');
  await page.goto('app/#/settings');
  await expect(page.locator('select:near(:text("Locale for dates and numbers"))').first()).toHaveValue('en-GB');
});

test('deposit and final invoice starters request the correct stage and deduct only received money', async ({ page }) => {
  await page.goto('invoice-templates/deposit-invoice.html');
  await page.click('a:has-text("Start this invoice, free")');
  await page.waitForSelector('.stepper');
  await page.click('.stepper button:has-text("Items and totals")');
  await expect(page.locator('[data-path="line_items[0].item_quantity"] input')).toHaveValue('1');
  await expect(page.locator('[data-path="line_items[0].item_rate"] input')).toHaveValue('');
  await expect(page.locator('[name="has_amount_paid"]')).not.toBeChecked();
  await page.fill('[data-path="line_items[0].item_rate"] input', '600');
  await expect(page.locator('[data-path="invoice_total"] .computed-value')).toHaveText('$600.00');
  await page.goto('invoice-templates/final-invoice.html');
  await page.click('a:has-text("Start this invoice, free")');
  await page.waitForSelector('.stepper');
  await page.click('.stepper button:has-text("Items and totals")');
  await expect(page.locator('[name="has_amount_paid"]')).toBeChecked();
  await page.fill('[data-path="line_items[0].item_rate"] input', '2000');
  await page.fill('[name="amount_paid"]', '600');
  await expect(page.locator('[data-path="balance_due"] .computed-value')).toHaveText('$1,400.00');
  await page.fill('[name="amount_paid"]', '0');
  await expect(page.locator('[data-path="balance_due"] .computed-value')).toHaveText('$2,000.00');
});

test('an hourly invoice starter calculates fractional hours', async ({ page }) => {
  await page.goto('invoice-templates/hourly-invoice.html');
  await page.click('a:has-text("Start this invoice, free")');
  await page.waitForSelector('.stepper');
  await page.click('.stepper button:has-text("Items and totals")');
  await page.fill('[data-path="line_items[0].item_quantity"] input', '3.5');
  await page.fill('[data-path="line_items[0].item_rate"] input', '80');
  await expect(page.locator('[data-path="invoice_total"] .computed-value')).toHaveText('$280.00');
});
