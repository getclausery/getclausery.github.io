import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv, toCsv, mapHeaders, rowsToAnswers, templateCsv, cellValue, uniqueNames, bulkFields } from '../../app/lib/bulk.js';
import { canonicalJson, fingerprint, recordHistory, HISTORY_MAX } from '../../app/lib/history.js';
import { inspectDocx } from '../../app/lib/render.js';
import { inferQuestionnaire, newTemplate, blankAnswers } from '../../app/lib/schema.js';
import { applySetup, setupFor } from '../../app/lib/setups.js';
import { evaluateForm } from '../../app/lib/logic.js';

const invoice = () => {
  const q = applySetup(inferQuestionnaire(inspectDocx(readFileSync('samples/invoice.docx'))), setupFor('invoice'));
  return newTemplate({ name: 'Invoice', sections: q.sections, fields: q.fields });
};

test('CSV parsing handles quotes, embedded separators and line breaks, BOMs, CRLF and semicolons', () => {
  assert.deepEqual(parseCsv('﻿a,b,c\r\n1,"two, 2","say ""hi"""\r\n\r\n'), [['a', 'b', 'c'], ['1', 'two, 2', 'say "hi"']]);
  assert.deepEqual(parseCsv('name;amount\nAcme;"1.200,50"\n'), [['name', 'amount'], ['Acme', '1.200,50']]);
  assert.deepEqual(parseCsv('note\n"line one\nline two"'), [['note'], ['line one\nline two']]);
  assert.deepEqual(parseCsv(toCsv([['a', 'b'], ['x,y', 'q"z']])), [['a', 'b'], ['x,y', 'q"z']]);
});

test('column headings match questions by tag name, label or readable name; calculated and list fields are left out', () => {
  const t = invoice();
  const keys = bulkFields(t).map((f) => f.key);
  assert.ok(keys.includes('client_name') && keys.includes('has_tax'));
  assert.ok(!keys.includes('invoice_total') && !keys.includes('line_items'));
  const { map, unknown, matched } = mapHeaders(['client_name', 'Client address', 'Invoice number', 'Shoe size'], t);
  assert.deepEqual(map, ['client_name', 'client_address', 'invoice_number', null]);
  assert.deepEqual(unknown, ['Shoe size']);
  assert.equal(matched.length, 3);
});

test('cells are read in the shape each question expects', () => {
  assert.equal(cellValue({ type: 'checkbox' }, 'Yes'), true);
  assert.equal(cellValue({ type: 'checkbox' }, 'no'), false);
  assert.ok(cellValue({ type: 'checkbox' }, 'maybe') instanceof Error);
  assert.equal(cellValue({ type: 'date' }, '2026-11-04'), '2026-11-04');
  assert.equal(cellValue({ type: 'date' }, '11/4/2026'), '2026-11-04');
  assert.ok(cellValue({ type: 'date' }, 'soon') instanceof Error);
  assert.equal(cellValue({ type: 'money' }, '$1,200.50'), 1200.5);
  assert.equal(cellValue({ type: 'select', options: [{ value: 'net30', label: 'Net 30' }] }, 'net 30'), 'net30');
  assert.equal(cellValue({ type: 'text' }, '  '), undefined);
});

test('each row starts from the draft, empty cells keep its answers, and calculations still run', () => {
  const t = invoice();
  const base = Object.assign(blankAnswers(t), { business_name: 'Northwind', line_items: [{ item_name: 'Design', item_quantity: 2, item_rate: 500 }], has_tax: true, tax_name: 'HST', tax_rate: 13 });
  const rows = [['Acme', '', 'INV-1'], ['Bolt Ltd', 'no', 'INV-2']];
  const { items, problems } = rowsToAnswers(t, base, rows, ['client_name', 'has_tax', 'invoice_number']);
  assert.deepEqual(problems, []);
  assert.equal(items.length, 2);
  assert.equal(items[0].answers.client_name, 'Acme');
  assert.equal(items[0].answers.has_tax, true);            // empty cell: the draft's answer
  assert.equal(items[1].answers.has_tax, false);
  assert.equal(items[1].answers.business_name, 'Northwind');
  assert.equal(base.client_name, '');                       // the draft itself is untouched
  assert.equal(evaluateForm(t, items[0].answers).values.invoice_total, 1130);
  assert.equal(evaluateForm(t, items[1].answers).values.invoice_total, 1000);
  const bad = rowsToAnswers(t, base, [['maybe']], ['has_tax']);
  assert.match(bad.problems[0], /^Row 2, Charge sales tax or VAT: "maybe" is not yes or no\.$/);
});

test('the spreadsheet template has one column per question and the draft as its first row', () => {
  const t = invoice();
  const rows = parseCsv(templateCsv(t, Object.assign(blankAnswers(t), { client_name: 'Acme, Inc.', has_tax: true })));
  assert.equal(rows.length, 2);
  assert.equal(rows[0].length, bulkFields(t).length);
  assert.equal(rows[1][rows[0].indexOf('client_name')], 'Acme, Inc.');
  assert.equal(rows[1][rows[0].indexOf('has_tax')], 'yes');
});

test('file names in a batch are safe and unique', () => {
  assert.deepEqual(uniqueNames(['Acme', 'acme', 'A/B: "C"', '', 'Acme']), ['Acme', 'acme (2)', 'A B C', 'Document', 'Acme (3)']);
});

test('history records the exact answers with a stable fingerprint, newest first, capped', async () => {
  assert.equal(canonicalJson({ b: 1, a: [{ d: 2, c: 3 }] }), canonicalJson({ a: [{ c: 3, d: 2 }], b: 1 }));
  assert.equal(await fingerprint({ b: 1, a: 2 }), await fingerprint({ a: 2, b: 1 }));
  assert.notEqual(await fingerprint({ a: 1 }), await fingerprint({ a: 2 }));
  assert.match(await fingerprint({}), /^[0-9a-f]{64}$/);
  const draft = { answers: { client_name: 'Acme' } };
  const e = await recordHistory(draft, { kind: 'download', file: 'x.docx' });
  draft.answers.client_name = 'Changed later';
  assert.equal(e.answers.client_name, 'Acme');               // a snapshot, not a reference
  assert.equal(draft.history[0], e);
  for (let i = 0; i < HISTORY_MAX + 5; i++) await recordHistory(draft, { kind: 'print' });
  assert.equal(draft.history.length, HISTORY_MAX);
  assert.equal(draft.history[0].kind, 'print');
});
