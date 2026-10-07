import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inspectDocx } from '../../app/lib/render.js';
import { inferQuestionnaire, newTemplate, newDraft } from '../../app/lib/schema.js';
import { SETUPS, applySetup, setupFor } from '../../app/lib/setups.js';
import { prefillAnswers, prefillNote, nextInSequence, localToday } from '../../app/lib/prefill.js';

const lib = (slug, id = 't_' + slug) => {
  const q = applySetup(inferQuestionnaire(inspectDocx(readFileSync(`samples/${slug}.docx`))), setupFor(slug));
  return { ...newTemplate({ name: slug === 'invoice' ? 'Invoice' : slug, sections: q.sections, fields: q.fields }), id, sample: slug };
};
const draftOf = (t, answers, extra = {}) => ({ ...newDraft(t), ...extra, answers: { ...newDraft(t).answers, ...answers } });

test('every reuse list names questions its template asks, and never the other party or the amounts', () => {
  for (const [slug, setup] of Object.entries(SETUPS)) {
    if (!setup.reuse) continue;
    const t = lib(slug);
    const byKey = new Map(t.fields.map((f) => [f.key, f]));
    const { remember = [], sequence = [], today = [], keepGap = {} } = setup.reuse;
    for (const k of [...remember, ...sequence, ...today, ...Object.keys(keepGap), ...Object.values(keepGap)]) assert.ok(byKey.has(k), `${slug}: reuse names unknown tag ${k}`);
    for (const k of remember) {
      assert.ok(!['computed', 'repeat'].includes(byKey.get(k).type), `${slug}: ${k} is calculated or a list`);
      assert.doesNotMatch(k, /client|customer|vendor|tenant|payer|amount_paid|amount_received|items|total/, `${slug}: ${k} is about the other party or the money`);
    }
    for (const k of [...today, ...Object.keys(keepGap)]) assert.equal(byKey.get(k).type, 'date', `${slug}: ${k} is not a date question`);
  }
});

test('numbers continue from the highest one with the same prefix, keeping the padding', () => {
  assert.equal(nextInSequence(['INV-0042', 'INV-0041']), 'INV-0043');
  assert.equal(nextInSequence(['INV-0009', 'INV-0040']), 'INV-0041');      // an older, higher number is not reused
  assert.equal(nextInSequence(['INV-9']), 'INV-10');
  assert.equal(nextInSequence(['2026-099/A']), '2026-100/A');
  assert.equal(nextInSequence(['Q-7', 'INV-0050']), 'Q-8');                // the latest document sets the series
  assert.equal(nextInSequence(['draft', '']), '');
  assert.equal(nextInSequence([]), '');
});

test('a new invoice reuses your details, the next number, today and the usual payment terms, never the client or items', () => {
  const inv = lib('invoice');
  const quote = lib('quote');
  const old = draftOf(inv, { business_name: 'Old name Ltd', invoice_number: 'INV-0003', client_name: 'Acme' }, { updatedAt: '2026-01-01T00:00:00Z' });
  const last = draftOf(inv, {
    business_name: 'Northwind Studio', business_address: '1 High St', business_email: 'hi@northwind.test', has_tax: true, tax_name: 'HST', tax_rate: 13,
    has_bank_details: true, bank_details: 'Acct 123', warn_about_bank_changes: false, invoice_number: 'INV-0041', invoice_date: '2026-09-01', due_date: '2026-10-01',
    client_name: 'Bolt Ltd', client_address: '2 Low Rd', line_items: [{ item_name: 'Design', item_quantity: 2, item_rate: 500 }],
  }, { updatedAt: '2026-09-01T00:00:00Z', generatedAt: '2026-09-01T00:00:00Z' });
  const unsent = draftOf(inv, { business_name: '' }, { updatedAt: '2026-09-20T00:00:00Z' });   // started, never filled in
  const blank = newDraft(inv);
  const { answers, info } = prefillAnswers(inv, blank.answers, [unsent, last, old], [inv, quote], '2026-10-07');
  assert.equal(answers.business_name, 'Northwind Studio');
  assert.equal(answers.tax_rate, 13);
  assert.equal(answers.has_bank_details, true);
  assert.equal(answers.warn_about_bank_changes, false);       // a choice, kept as made
  assert.equal(answers.invoice_number, 'INV-0042');
  assert.equal(answers.invoice_date, '2026-10-07');
  assert.equal(answers.due_date, '2026-11-06');               // 30 days later, as last time
  assert.equal(answers.client_name, '');
  assert.deepEqual(answers.line_items, blank.answers.line_items);
  assert.equal(info.from, 'Invoice');
  assert.equal(blank.answers.business_name, '');              // the blank answers are not modified
  assert.match(prefillNote(info, inv), /^Filled in your details from your last invoice, number INV-0042 and the dates\. Check them before you send this invoice\.$/);
});

test('details carry across templates; a first document only gets today\'s date, and own templates nothing', () => {
  const inv = lib('invoice');
  const quote = lib('quote');
  const sentInvoice = draftOf(inv, { business_name: 'Northwind Studio', business_email: 'hi@northwind.test', invoice_number: 'INV-0041' }, { generatedAt: '2026-09-01T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z' });
  const q = prefillAnswers(quote, newDraft(quote).answers, [sentInvoice], [inv, quote], '2026-10-07');
  assert.equal(q.answers.business_name, 'Northwind Studio');
  assert.equal(q.answers.quote_number, '');                   // invoice numbers do not number quotes
  assert.equal(q.answers.quote_date, '2026-10-07');
  const first = prefillAnswers(inv, newDraft(inv).answers, [], [inv], '2026-10-07');
  assert.equal(first.answers.invoice_date, '2026-10-07');
  assert.deepEqual(first.info.remembered, []);
  assert.equal(prefillNote(first.info, inv), '');
  const own = { ...inv, id: 't_own', sample: undefined };
  const mine = prefillAnswers(own, newDraft(own).answers, [sentInvoice], [inv, own], '2026-10-07');
  assert.equal(mine.answers.business_name, '');
  assert.match(localToday(new Date(2026, 0, 5)), /^2026-01-05$/);
});
