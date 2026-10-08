import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inspectDocx } from '../../app/lib/render.js';
import { inferQuestionnaire, newTemplate, newDraft } from '../../app/lib/schema.js';
import { applySetup, setupFor } from '../../app/lib/setups.js';
import { evaluateForm } from '../../app/lib/logic.js';
import { PRESETS, WORKFLOW_PRESETS, presetFor, applyPreset } from '../../app/lib/presets.js';

const invoice = () => {
  const q = applySetup(inferQuestionnaire(inspectDocx(readFileSync('samples/invoice.docx'))), setupFor('invoice'));
  return { ...newTemplate({ name: 'Invoice', sections: q.sections, fields: q.fields }), id: 't_inv', sample: 'invoice' };
};

test('every trade preset starts an invoice with its lines, quantities and empty prices, and the maths still runs', () => {
  const t = invoice();
  for (const [slug, p] of Object.entries(PRESETS.invoice)) {
    assert.ok(p.name && p.lines.length >= 3, slug);
    const base = { ...newDraft(t).answers, business_name: 'Northwind' };
    const a = applyPreset(t, base, p);
    assert.equal(a.line_items.length, p.lines.length, slug);
    assert.deepEqual(a.line_items.map((r) => [r.item_name, r.item_quantity]), p.lines, slug);
    assert.ok(a.line_items.every((r) => r.item_rate === ''), `${slug}: prices are never guessed`);
    assert.equal(a.business_name, 'Northwind');            // remembered details are kept
    a.line_items[0].item_rate = 10;
    assert.equal(evaluateForm(t, a).values.line_items[0].item_amount, p.lines[0][1] * 10, slug);
  }
  assert.equal(presetFor('invoice', 'cleaning').name, 'Cleaning');
  assert.equal(presetFor('invoice', 'nope'), null);
  assert.equal(presetFor('quote', 'cleaning'), null);
  const blank = newDraft(t).answers;
  assert.equal(applyPreset(t, blank, null), blank);
});

test('every country preset sets up the invoice tax, rate and tax number, keeps the items, and the tax works out', async () => {
  const { TAX_PRESETS, presetNote } = await import('../../app/lib/presets.js');
  const t = invoice();
  const keys = new Set(t.fields.map((f) => f.key));
  for (const [slug, p] of Object.entries(TAX_PRESETS.invoice)) {
    assert.ok(p.name && /^[A-Z]{3}$/.test(p.currency), slug);
    for (const k of Object.keys(p.answers)) assert.ok(keys.has(k), `${slug}: ${k} is an invoice question`);
    const base = { ...newDraft(t).answers, business_name: 'Northwind', tax_registration_number: 'GB123' };
    const a = applyPreset(t, base, p);
    assert.equal(a.has_tax, true, slug);
    assert.equal(a.tax_rate, p.answers.tax_rate, slug);
    assert.equal(a.tax_registration_number, 'GB123', `${slug}: a remembered tax number is kept`);
    assert.deepEqual(a.line_items, base.line_items, `${slug}: items untouched`);
    a.line_items = [{ ...a.line_items[0], item_name: 'Work', item_quantity: 2, item_rate: 50 }];
    const v = evaluateForm(t, a).values;
    assert.equal(v.tax_amount, Math.round(100 * p.answers.tax_rate) / 100, slug);
    assert.equal(presetFor('invoice', slug), p);
    assert.match(presetNote(p), new RegExp(`${p.answers.tax_rate}%`));
  }
  assert.equal(applyPreset(t, newDraft(t).answers, { name: 'X', answers: { not_a_question: 1 } }).not_a_question, undefined);
  assert.match(presetNote(PRESETS.invoice.cleaning), /cleaning business usually bills/);
});

test('a deposit requests only the deposit; a final invoice deducts received money from the full project price', () => {
  const t = invoice();
  const base = { ...newDraft(t).answers, business_name: 'Northwind', has_tax: false, has_amount_paid: true, amount_paid: 900 };
  const deposit = applyPreset(t, base, presetFor('invoice', 'deposit-invoice'));
  assert.equal(deposit.business_name, 'Northwind');
  assert.equal(deposit.has_amount_paid, false);
  assert.equal(deposit.amount_paid, 0, 'an old payment must not enter a new deposit request');
  assert.equal(deposit.line_items[0].item_rate, '', 'the starter never invents a deposit');
  deposit.line_items[0].item_rate = 600;
  assert.equal(evaluateForm(t, deposit).values.invoice_total, 600);
  const final = applyPreset(t, base, presetFor('invoice', 'final-invoice'));
  assert.equal(final.has_amount_paid, true);
  assert.equal(final.amount_paid, '', 'only the user supplies actual received payments');
  final.line_items[0].item_rate = 2000;
  final.amount_paid = 600;
  let v = evaluateForm(t, final).values;
  assert.equal(v.invoice_total, 2000);
  assert.equal(v.balance_due, 1400);
  final.amount_paid = 0;
  assert.equal(evaluateForm(t, final).values.balance_due, 2000, 'an unpaid deposit is not deducted');
});

test('hourly workflows support decimal hours and keep the business tax setup', () => {
  const t = invoice();
  const a = applyPreset(t, { ...newDraft(t).answers, has_tax: true, tax_name: 'VAT', tax_rate: 20 }, presetFor('invoice', 'hourly-invoice'));
  a.line_items[0].item_quantity = 3.5;
  a.line_items[0].item_rate = 80;
  const v = evaluateForm(t, a).values;
  assert.equal(v.line_items[0].item_amount, 280);
  assert.equal(v.tax_amount, 56);
  assert.equal(v.invoice_total, 336);
  assert.equal(a.tax_name, 'VAT');
  for (const [slug, p] of Object.entries(WORKFLOW_PRESETS.invoice)) assert.equal(presetFor('invoice', slug), p);
  assert.equal(presetFor('quote', 'deposit-invoice'), null);
});
