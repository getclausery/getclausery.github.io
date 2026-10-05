import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inspectDocx } from '../../app/lib/render.js';
import { inferQuestionnaire, newTemplate, blankAnswers, validateTemplate } from '../../app/lib/schema.js';
import { SETUPS, applySetup, setupFor } from '../../app/lib/setups.js';
import { evaluateForm, buildRenderData, checkExpression } from '../../app/lib/logic.js';
import { SAMPLES } from '../../app/ui/views/templates.js';

const load = (slug) => {
  const base = inferQuestionnaire(inspectDocx(readFileSync(`samples/${slug}.docx`)));
  const q = applySetup(base, setupFor(slug));
  return { base, q, t: newTemplate({ name: slug, sections: q.sections, fields: q.fields }) };
};

test('every setup belongs to a library template and only names tags that template has', () => {
  for (const [slug, setup] of Object.entries(SETUPS)) {
    assert.ok(SAMPLES.some((s) => s.slug === slug), `${slug}: no such sample`);
    const { base } = load(slug);
    const keys = new Set(base.fields.map((f) => f.key));
    for (const [, , list] of setup.sections) for (const k of list) assert.ok(keys.has(k), `${slug}: section lists unknown tag ${k}`);
    for (const [k, o] of Object.entries(setup.fields)) {
      assert.ok(keys.has(k), `${slug}: setup for unknown tag ${k}`);
      const kids = new Set((base.fields.find((f) => f.key === k).children || []).map((c) => c.key));
      for (const c of Object.keys(o.children || {})) assert.ok(kids.has(c), `${slug}: ${k} has no child ${c}`);
    }
  }
});

test('a setup never drops a question, and the result is a valid template with valid expressions', () => {
  for (const slug of Object.keys(SETUPS)) {
    const { base, q, t } = load(slug);
    assert.deepEqual(q.fields.map((f) => f.key).sort(), base.fields.map((f) => f.key).sort(), `${slug}: questions changed`);
    assert.deepEqual(validateTemplate(t), [], `${slug}: invalid template`);
    const ids = new Set(q.sections.map((s) => s.id));
    for (const f of q.fields) {
      assert.ok(ids.has(f.sectionId), `${slug}: ${f.key} has no section`);
      for (const x of [f, ...(f.children || [])]) if (x.type === 'computed') assert.equal(checkExpression(x.expr), null, `${slug}: ${x.key}: ${x.expr}`);
    }
    assert.ok(!q.sections.some((s) => s.title === 'Other details'), `${slug}: some questions are not placed in a section`);
    const ev = evaluateForm(t, blankAnswers(t));
    assert.deepEqual(ev.exprErrors, {}, `${slug}: expression errors on a blank form`);
  }
});

test('the invoice works out line amounts, discount, tax, total and balance', () => {
  const { t } = load('invoice');
  const answers = Object.assign(blankAnswers(t), {
    line_items: [{ item_name: 'Design', item_quantity: 2, item_rate: 1200 }, { item_name: 'Hosting', item_quantity: 12, item_rate: 15 }],
    has_discount: true, discount_amount: 100, has_tax: true, tax_name: 'HST', tax_rate: 13, has_amount_paid: true, amount_paid: 802.4,
  });
  const ev = evaluateForm(t, answers);
  assert.deepEqual(ev.values.line_items.map((r) => r.item_amount), [2400, 180]);
  assert.equal(ev.values.subtotal_amount, 2580);
  assert.equal(ev.values.tax_amount, 322.4);
  assert.equal(ev.values.invoice_total, 2802.4);
  assert.equal(Math.round(ev.values.balance_due * 100) / 100, 2000);
  const { data } = buildRenderData(t, answers, { currency: 'USD', locale: 'en-US' });
  assert.equal(data.invoice_total, '$2,802.40');
  assert.equal(data.line_items[1].item_amount, '$180.00');
  // without the optional parts, the total is just the subtotal
  const plain = evaluateForm(t, Object.assign(blankAnswers(t), { line_items: [{ item_quantity: 3, item_rate: 50 }] }));
  assert.equal(plain.values.invoice_total, 150);
  assert.equal(plain.values.tax_amount, null);
});

test('a new line starts at quantity 1, and receipts write the amount in words', () => {
  const { t } = load('invoice');
  assert.equal(blankAnswers(t).line_items.length, 1);
  assert.equal(blankAnswers(t).line_items[0].item_quantity, 1);
  const r = load('payment-receipt').t;
  const ev = evaluateForm(r, Object.assign(blankAnswers(r), { amount_received: 1234.05, show_sum_in_words: true }));
  assert.equal(ev.values.sum_in_words, 'one thousand two hundred and thirty-four and 05/100');
});

test('without a setup the inferred questionnaire is returned unchanged', () => {
  const base = inferQuestionnaire(inspectDocx(readFileSync('samples/mutual-nda.docx')));
  assert.equal(applySetup(base, setupFor('mutual-nda')), base);
});
