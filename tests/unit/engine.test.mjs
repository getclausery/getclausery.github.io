/* Engine behaviour on real (minimal) .docx files: inference of the questionnaire from tags in every part of the document,
   evaluation order (visibility before values, rows before totals), reserved keys, and paragraph tidying before rendering. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeDocx, partText, paragraphs } from './docx-helper.mjs';
import { inspectDocx, renderDocx, tidyLoneSectionTags } from '../../app/lib/render.js';
import { inferQuestionnaire, newTemplate, blankAnswers, makeField, normalizeTemplate, validateTemplate, inferFieldType, inferSectionRole, isReservedKey, KEY_RX } from '../../app/lib/schema.js';
import { evaluateForm, buildRenderData, formatValue, coerce } from '../../app/lib/logic.js';

const buf = async (blob) => Buffer.from(await blob.arrayBuffer());
const bodyText = async (bytes, data) => partText(await buf(renderDocx(bytes, data)), 'word/document.xml');
const shape = (q) => q.fields.map((f) => [f.key, f.type, (f.children || []).map((c) => c.key)]);
const US = { locale: 'en-US', currency: 'USD' };

test('F09: tags in headers, footers and footnotes become questions and are filled', async () => {
  const bytes = makeDocx({ body: ['Dear {client_name},'], header: ['Our ref: {matter_ref} {#hdr_cond}CONFIDENTIAL{/hdr_cond}'], footer: ['Footer {footer_tag}'], footnote: ['Note {note_tag}'] });
  const insp = inspectDocx(bytes);
  assert.deepEqual(insp.order.map((o) => [o.key, o.part]), [['client_name', 'body'], ['matter_ref', 'header'], ['hdr_cond', 'header'], ['footer_tag', 'footer'], ['note_tag', 'footnote']]);
  assert.equal(insp.order[1].file, 'word/header1.xml');
  assert.match(insp.text, /^Dear \{client_name\},/);
  assert.match(insp.text, /\[header\] Our ref: \{matter_ref\}/);
  assert.match(insp.text, /\[footer\] Footer \{footer_tag\}/);
  const q = inferQuestionnaire(insp);
  assert.deepEqual(q.fields.map((f) => f.key), ['client_name', 'matter_ref', 'hdr_cond', 'footer_tag', 'note_tag']);
  assert.equal(q.fields[2].type, 'checkbox');
  const t = newTemplate(q);
  const out = await buf(renderDocx(bytes, buildRenderData(t, { ...blankAnswers(t), client_name: 'Acme', matter_ref: 'M-1', hdr_cond: true, footer_tag: 'F', note_tag: 'N' }).data));
  assert.equal(partText(out, 'word/header1.xml'), 'Our ref: M-1 CONFIDENTIAL');
  assert.equal(partText(out, 'word/footer1.xml'), 'Footer F');
  assert.equal(partText(out, 'word/footnotes.xml'), 'Note N');
});

test('F05: an inverted {^group} block is the empty-list branch of a repeating group, not a yes/no', async () => {
  const bytes = makeDocx({ body: ['Attorneys:', '{#attorneys}- {name}, {rate} per hour{/attorneys}', '{^attorneys}No attorneys assigned.{/attorneys}'] });
  const q = inferQuestionnaire(inspectDocx(bytes));
  assert.deepEqual(shape(q), [['attorneys', 'repeat', ['name', 'rate']]]);
  assert.equal(q.warnings.length, 0);
  const t = newTemplate(q);
  assert.equal(await bodyText(bytes, buildRenderData(t, { attorneys: [] }).data), 'Attorneys:No attorneys assigned.');
  assert.equal(await bodyText(bytes, buildRenderData(t, { attorneys: [{ name: 'Ann', rate: 500 }, { name: 'Bob', rate: 300 }] }, US).data), 'Attorneys:- Ann, $500.00 per hour- Bob, $300.00 per hour');
  // tags inside the empty branch are ordinary questions shown when the list is empty
  const q2 = inferQuestionnaire(inspectDocx(makeDocx({ body: ['{#items}{name};{/items}{^items}Contact {fallback_contact}{/items}'] })));
  assert.deepEqual(shape(q2), [['items', 'repeat', ['name']], ['fallback_contact', 'text', []]]);
  assert.equal(q2.fields[1].showIf, 'not items');
  // inverted yes/no sections are still conditions
  assert.equal(inferQuestionnaire(inspectDocx(makeDocx({ body: ['{^has_spouse}Single{/has_spouse}'] }))).fields[0].type, 'checkbox');
});

test('F21/F22/F30: section roles and field types for tricky names', () => {
  assert.equal(inferSectionRole('bonus', { hasChildren: true, childKeys: ['bonus_amount'] }), 'condition');
  assert.equal(inferSectionRole('status', { hasChildren: true, childKeys: ['x'] }), 'condition');
  assert.equal(inferSectionRole('terms', { hasChildren: true, childKeys: ['terms_text', 'terms_days'] }), 'condition');
  assert.equal(inferSectionRole('attorneys', { hasChildren: true, childKeys: ['name'] }), 'repeat');
  assert.equal(inferSectionRole('parties', { hasChildren: true, childKeys: ['party_name'] }), 'repeat');
  assert.equal(inferSectionRole('items', { hasChildren: false }), 'condition');
  const q = inferQuestionnaire(inspectDocx(makeDocx({ body: ['{#bonus}You are eligible for a bonus of {bonus_amount}.{/bonus}'] })));
  assert.deepEqual(shape(q), [['bonus', 'checkbox', []], ['bonus_amount', 'money', []]]);
  assert.equal(q.fields[1].showIf, 'bonus');
  assert.deepEqual(['case_number', 'suite_number', 'invoice_no', 'tax_id', 'account_number'].map(inferFieldType), ['text', 'text', 'text', 'text', 'text']);
  assert.deepEqual(['number_of_employees', 'employee_count', 'phone_number', 'number', 'term_years'].map(inferFieldType), ['number', 'number', 'phone', 'number', 'number']);
  assert.deepEqual(['flat_fee_terms', 'fee_description', 'payment_terms', 'flat_fee', 'payment_days'].map(inferFieldType), ['textarea', 'textarea', 'textarea', 'money', 'number']);
  assert.equal(coerce(makeField('n', 'number'), 'ABC-123'), 'ABC-123');
  assert.equal(coerce(makeField('n', 'number'), '12abc'), '12abc');
  assert.equal(coerce(makeField('n', 'number'), ''), null);
  assert.equal(coerce(makeField('m', 'money'), '$1,200.50'), 1200.5);
  assert.equal(coerce(makeField('m', 'money'), 'USD 500'), 500);
  assert.equal(evaluateForm(newTemplate({ fields: [makeField('n', 'number')] }), { n: '12abc' }).errors.n, 'Enter a number.');
});

test('F08: engine built-ins are never questions and always win over stale children', async () => {
  const bytes = makeDocx({ body: ['{#parties}{name}{^_last}, {/_last}{/parties}', '{#parties}{_index} of {_count}: {name}{#_first} (lead){/_first}{/parties}', 'Dated {_today} by {_firm_name}'] });
  const q = inferQuestionnaire(inspectDocx(bytes));
  assert.deepEqual(shape(q), [['parties', 'repeat', ['name']]]);
  const t = newTemplate(q);
  const { data, evaluation } = buildRenderData(t, { parties: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] }, { firmName: 'ACME LLP', locale: 'en-US' });
  assert.deepEqual(evaluation.errors, {});
  assert.equal(await bodyText(bytes, data), `A, B, C1 of 3: A (lead)2 of 3: B3 of 3: CDated ${data._today} by ACME LLP`);
  // a template saved by an older version with a "_last" child: normalize drops it, and the render data keeps the built-in anyway
  const stale = newTemplate({ fields: [makeField('parties', 'repeat', { children: [makeField('name'), makeField('_last', 'checkbox', { role: 'condition' })] }), makeField('_today')] });
  assert.deepEqual(normalizeTemplate(stale).fields.map((f) => [f.key, (f.children || []).map((c) => c.key)]), [['parties', ['name']]]);
  assert.deepEqual(buildRenderData(stale, { parties: [{ name: 'A', _last: false }, { name: 'B', _last: false }] }).data.parties.map((r) => r._last), [false, true]);
  assert.ok(isReservedKey('_index') && !isReservedKey('index'));
  assert.ok(!KEY_RX.test('_mine') && KEY_RX.test('mine_1'));
  assert.ok(validateTemplate({ name: 'x', fields: [{ key: '_x', type: 'text' }] }).some((p) => /starting with a letter/.test(p)));
});

test('F20/F59/F31: a key used in two ways (value + loop, section + value, top level + row)', async () => {
  // plain tag before the loop with the same key: still a repeating group with its children, no crash
  let bytes = makeDocx({ body: ['There are {attorneys} attorneys.', '{#attorneys}- {name}{#is_partner} (partner){/is_partner}{/attorneys}'] });
  let q = inferQuestionnaire(inspectDocx(bytes));
  assert.deepEqual(shape(q), [['attorneys', 'repeat', ['name', 'is_partner']]]);
  assert.match(q.warnings[0], /"attorneys" is used both as a plain tag and as a repeating section/);
  assert.deepEqual(shape(inferQuestionnaire(inspectDocx(makeDocx({ body: ['{#attorneys}- {name}{/attorneys}', 'There are {attorneys} attorneys.'] })))), [['attorneys', 'repeat', ['name']]]);
  // "show only if filled": a section that is also a value is a text answer, and the section follows it
  bytes = makeDocx({ body: ['{#spouse_name}Spouse: {spouse_name}{/spouse_name}'] });
  q = inferQuestionnaire(inspectDocx(bytes));
  assert.deepEqual(q.fields.map((f) => [f.key, f.type, f.role, f.showIf]), [['spouse_name', 'text', 'value', '']]);
  assert.match(q.warnings[0], /used both as a section and as a value/);
  let t = newTemplate(q);
  assert.equal(await bodyText(bytes, buildRenderData(t, { spouse_name: 'Jo' }).data), 'Spouse: Jo');
  assert.equal(await bodyText(bytes, buildRenderData(t, { spouse_name: '' }).data), '');
  // a tag used outside and inside a group is asked once and reaches every row
  for (const body of [['Firm: {firm}', '{#attorneys}{name} at {firm}{/attorneys}'], ['{#attorneys}{name} at {firm}{/attorneys}', 'Firm: {firm}']]) {
    bytes = makeDocx({ body });
    q = inferQuestionnaire(inspectDocx(bytes));
    assert.deepEqual(shape(q).sort(), [['attorneys', 'repeat', ['name']], ['firm', 'text', []]]);
    assert.match(q.warnings[0], /"firm" appears both inside \{#attorneys\} and outside it/);
    t = newTemplate(q);
    const text = await bodyText(bytes, buildRenderData(t, { firm: 'ACME', attorneys: [{ name: 'A' }, { name: 'B' }] }).data);
    assert.ok(text.includes('A at ACME') && text.includes('B at ACME') && text.includes('Firm: ACME'), text);
  }
  // an older template that asks the same key in both places: a blank row value falls back to the top-level answer
  t = newTemplate({ fields: [makeField('firm'), makeField('attorneys', 'repeat', { children: [makeField('name'), makeField('firm')] })] });
  assert.equal(await bodyText(bytes, buildRenderData(t, { firm: 'ACME', attorneys: [{ name: 'A', firm: '' }, { name: 'B', firm: 'Other' }] }).data), 'A at ACMEB at OtherFirm: ACME');
});

test('F06: hidden answers are blank for calculations and later rules too', () => {
  const t = newTemplate({ fields: [
    makeField('has_retainer', 'checkbox', { role: 'condition' }), makeField('retainer_amount', 'money', { showIf: 'has_retainer' }), makeField('flat_fee', 'money'),
    makeField('total_due', 'computed', { expr: 'retainer_amount + flat_fee', format: 'money' }),
    makeField('big_retainer_terms', 'text', { showIf: 'retainer_amount > 1000' }), makeField('big_retainer', 'computed', { role: 'condition', expr: 'retainer_amount > 1000' }),
  ] });
  const off = buildRenderData(t, { has_retainer: false, retainer_amount: 5000, flat_fee: 100, big_retainer_terms: 'x' }, US);
  assert.equal(off.data.retainer_amount, '');
  assert.equal(off.data.total_due, '$100.00');
  assert.equal(off.data.big_retainer_terms, '');
  assert.equal(off.data.big_retainer, false);
  assert.equal(off.evaluation.visible.big_retainer_terms, false);
  const on = buildRenderData(t, { has_retainer: true, retainer_amount: 5000, flat_fee: 100, big_retainer_terms: 'x' }, US);
  assert.equal(on.data.total_due, '$5,100.00');
  assert.equal(on.data.big_retainer_terms, 'x');
  assert.equal(on.data.big_retainer, true);
  // a rule may refer to a computed field declared later
  const t2 = newTemplate({ fields: [makeField('note', 'text', { showIf: 'total > 100' }), makeField('a', 'money'), makeField('total', 'computed', { expr: 'a * 2' })] });
  assert.equal(evaluateForm(t2, { note: 'n', a: 100 }).visible.note, true);
  assert.equal(evaluateForm(t2, { note: 'n', a: 10 }).visible.note, false);
  // hidden computed fields are blank for others as well
  const t3 = newTemplate({ fields: [makeField('show', 'checkbox'), makeField('helper', 'computed', { expr: '10', showIf: 'show' }), makeField('total', 'computed', { expr: 'helper + 1' })] });
  assert.equal(evaluateForm(t3, { show: false }).computed.total, 1);
  assert.equal(evaluateForm(t3, { show: true }).computed.total, 11);
  // rows: a hidden child is blank for row calculations and top-level totals
  const t4 = newTemplate({ fields: [
    makeField('items', 'repeat', { children: [makeField('taxable', 'checkbox'), makeField('amount', 'money'), makeField('tax', 'money', { showIf: 'taxable' }), makeField('line_total', 'computed', { expr: 'amount + tax', format: 'money' })] }),
    makeField('grand_total', 'computed', { expr: 'sum(items.tax) + sum(items.amount)', format: 'money' }),
  ] });
  const rows = buildRenderData(t4, { items: [{ taxable: false, tax: 50, amount: 100 }, { taxable: true, tax: 20, amount: 100 }] }, US);
  assert.equal(rows.data.items[0].tax, '');
  assert.equal(rows.data.items[0].line_total, '$100.00');
  assert.equal(rows.data.items[1].line_total, '$120.00');
  assert.equal(rows.data.grand_total, '$220.00');
});

test('F07/F18: row computed children feed top-level totals, in dependency order, whatever the declaration order', () => {
  const items = () => makeField('items', 'repeat', { children: [makeField('qty', 'number'), makeField('price', 'money'), makeField('line_total', 'computed', { expr: 'qty * price', format: 'money' })] });
  const answers = { items: [{ qty: 2, price: 10 }, { qty: 3, price: 5 }] };
  for (const fields of [[items(), makeField('grand_total', 'computed', { expr: 'sum(items.line_total)', format: 'money' })], [makeField('grand_total', 'computed', { expr: 'sum(items.line_total)', format: 'money' }), items()]]) {
    const { data, evaluation } = buildRenderData(newTemplate({ fields }), answers, US);
    assert.deepEqual(evaluation.exprErrors, {});
    assert.deepEqual(data.items.map((r) => r.line_total), ['$20.00', '$15.00']);
    assert.equal(data.grand_total, '$35.00');
  }
  // a row child may use a top-level total that is itself a sum over another child
  const t = newTemplate({ fields: [items(), makeField('grand_total', 'computed', { expr: 'sum(items.line_total)' }), makeField('shares', 'computed', { expr: 'join(items.share, "; ")' })] });
  t.fields[0].children.push(makeField('share', 'computed', { expr: 'round(line_total / grand_total * 100)' }));
  const ev = evaluateForm(t, answers);
  assert.deepEqual(ev.exprErrors, {});
  assert.deepEqual(ev.values.items.map((r) => r.share), [57, 43]);
  assert.equal(ev.computed.shares, '57; 43');
  assert.equal(evaluateForm(newTemplate({ fields: [items(), makeField('g', 'computed', { expr: 'sum(items, "line_total")' })] }), answers).computed.g, 35);
  // forward references between row children resolve; a same-named top-level answer never leaks in
  const t2 = newTemplate({ fields: [makeField('subtotal', 'number'), makeField('items', 'repeat', { children: [makeField('qty', 'number'), makeField('with_tax', 'computed', { expr: 'subtotal * 1.2' }), makeField('subtotal', 'computed', { expr: 'qty * 10' })] })] });
  const row = evaluateForm(t2, { subtotal: 999, items: [{ qty: 2 }] }).values.items[0];
  assert.equal(row.subtotal, 20);
  assert.equal(row.with_tax, 24);
  // cycles between row children are reported per row
  const t3 = newTemplate({ fields: [makeField('items', 'repeat', { children: [makeField('a', 'computed', { expr: 'b + 1' }), makeField('b', 'computed', { expr: 'a + 1' }), makeField('c', 'computed', { expr: 'a + 1' })] })] });
  const ev3 = evaluateForm(t3, { items: [{}, {}] });
  assert.equal(ev3.exprErrors['items[0].a'], 'This computed field depends on itself.');
  assert.equal(ev3.exprErrors['items[1].b'], 'This computed field depends on itself.');
  assert.equal(ev3.exprErrors['items[0].c'], 'This computed field depends on a field that could not be calculated.');
  assert.deepEqual(ev3.values.items[0], { a: null, b: null, c: null, _index: 1 });
});

test('F46: only the fields in a cycle are "depends on itself"; their dependents are flagged, not silently computed', () => {
  const fields = { A: 'B', B: 'C', C: 'B', D: 'A + 1', E: '5' };
  for (const keys of [['A', 'B', 'C', 'D', 'E'], ['D', 'C', 'B', 'A', 'E'], ['E', 'D', 'A', 'C', 'B']]) {
    const ev = evaluateForm(newTemplate({ fields: keys.map((k) => makeField(k, 'computed', { expr: fields[k] })) }), {});
    assert.equal(ev.exprErrors.B, 'This computed field depends on itself.');
    assert.equal(ev.exprErrors.C, 'This computed field depends on itself.');
    assert.equal(ev.exprErrors.A, 'This computed field depends on a field that could not be calculated.');
    assert.equal(ev.exprErrors.D, 'This computed field depends on a field that could not be calculated.');
    assert.equal(ev.computed.D, null);
    assert.equal(ev.computed.E, 5);
  }
  assert.equal(evaluateForm(newTemplate({ fields: [makeField('me', 'computed', { expr: 'me + 1' })] }), {}).exprErrors.me, 'This computed field depends on itself.');
  // a loop through a "show only when" rule is not an expression cycle: no error, declaration order decides
  const ev = evaluateForm(newTemplate({ fields: [makeField('x', 'number', { showIf: 'total > 0' }), makeField('total', 'computed', { expr: 'x + 1' })] }), { x: 5 });
  assert.deepEqual(ev.exprErrors, {});
  assert.equal(ev.computed.total, 6);
  // a broken expression makes its dependents unavailable too
  const ev2 = evaluateForm(newTemplate({ fields: [makeField('bad', 'computed', { expr: '1 +' }), makeField('dep', 'computed', { expr: 'bad * 2' })] }), {});
  assert.match(ev2.exprErrors.bad, /Unexpected end/);
  assert.equal(ev2.exprErrors.dep, 'This computed field depends on a field that could not be calculated.');
});

test('F23/F47/F48: formatting of computed text as money, default date format, sections driven by computed rows', () => {
  const money = (extra = {}) => makeField('c', 'computed', { format: 'money', ...extra });
  assert.equal(formatValue(money(), '', US), '');
  assert.equal(formatValue(money(), null, US), '');
  assert.equal(formatValue(money(), '$1,234.50', US), '$1,234.50');
  assert.equal(formatValue(money(), '12', US), '$12.00');
  assert.equal(formatValue(money(), 12, US), '$12.00');
  assert.equal(formatValue(money(), '12abc', US), '12abc');
  assert.equal(formatValue(makeField('c', 'computed', { format: 'number' }), 'n/a', US), 'n/a');
  const t = newTemplate({ fields: [makeField('has_fee', 'checkbox'), makeField('fee', 'money'), makeField('fee_total', 'computed', { expr: 'if(has_fee, fee, "")', format: 'money' }), makeField('pretty', 'computed', { expr: 'format_money(fee, "USD", "en-US")', format: 'money' })] });
  assert.deepEqual(buildRenderData(t, { has_fee: false, fee: 12 }, US).data, { has_fee: false, fee: '$12.00', fee_total: '', pretty: '$12.00', _today: buildRenderData(t, {}, US).data._today });
  // new date fields follow the workspace default format
  assert.equal(makeField('d', 'date').format, '');
  assert.equal(formatValue(makeField('d', 'date'), '2026-09-24', { dateFormat: 'short', locale: 'en-US' }), '9/24/2026');
  assert.equal(formatValue(makeField('d', 'date'), '2026-09-24', { locale: 'en-US' }), 'September 24, 2026');
  assert.equal(formatValue(makeField('d', 'date', { format: 'iso' }), '2026-09-24', { dateFormat: 'short' }), '2026-09-24');
  // a computed condition in a row is a boolean for the renderer, never the text "0"
  const t2 = newTemplate({ fields: [makeField('items', 'repeat', { children: [makeField('rate', 'money'), makeField('senior', 'computed', { role: 'condition', expr: 'rate - 500', format: 'text' })] })] });
  assert.deepEqual(buildRenderData(t2, { items: [{ rate: 500 }, { rate: 900 }] }).data.items.map((r) => r.senior), [false, true]);
  // impossible dates are rejected by validation instead of rolling over
  const d = newTemplate({ fields: [makeField('d', 'date')] });
  assert.equal(evaluateForm(d, { d: '2026-02-30' }).errors.d, 'Enter a valid date.');
  assert.equal(evaluateForm(d, { d: '1' }).errors.d, 'Enter a valid date.');
  assert.equal(evaluateForm(d, { d: '2026-02-28' }).errors.d, undefined);
});

test('F61: whitespace after a section tag alone in its paragraph does not leave blank paragraphs', async () => {
  const plain = makeDocx({ body: ['A', '{#has_guarantor}', 'GUARANTEE text', '{/has_guarantor}', 'B'] });
  const spaced = makeDocx({ body: ['A', '{#has_guarantor} ', 'GUARANTEE text', ' {/has_guarantor}\t', 'B'] });
  for (const has_guarantor of [false, true]) {
    const want = paragraphs(await buf(renderDocx(plain, { has_guarantor })));
    assert.deepEqual(want, has_guarantor ? ['A', 'GUARANTEE text', 'B'] : ['A', 'B']);
    assert.deepEqual(paragraphs(await buf(renderDocx(spaced, { has_guarantor }))), want);
  }
  // whitespace split over several runs, and a tab element
  const split = makeDocx({ body: ['A', '<w:p><w:r><w:t xml:space="preserve"> </w:t></w:r><w:r><w:t>{#x}</w:t></w:r><w:r><w:tab/></w:r></w:p>', 'X', '<w:p><w:r><w:t>{/x}</w:t></w:r><w:r><w:t xml:space="preserve">  </w:t></w:r></w:p>', 'B'] });
  assert.deepEqual(paragraphs(await buf(renderDocx(split, { x: false }))), ['A', 'B']);
  assert.deepEqual(paragraphs(await buf(renderDocx(split, { x: true }))), ['A', 'X', 'B']);
  assert.deepEqual(inspectDocx(split).order.map((o) => o.key), ['x']);
  // only lone section tags are touched; ordinary text and inline tags keep their spacing
  const xml = '<w:p><w:r><w:t xml:space="preserve">Hello {name} </w:t></w:r></w:p><w:p w:rsidR="1"/><w:p><w:r><w:t xml:space="preserve"> {#a}</w:t></w:r></w:p><w:pPr/>';
  assert.equal(tidyLoneSectionTags(xml), '<w:p><w:r><w:t xml:space="preserve">Hello {name} </w:t></w:r></w:p><w:p w:rsidR="1"/><w:p><w:r><w:t xml:space="preserve">{#a}</w:t></w:r></w:p><w:pPr/>');
});

test('a tag in several branches is asked whenever any branch renders', async () => {
  const { combineChains } = await import('../../app/lib/schema.js');
  assert.equal(combineChains(['is_current', 'not is_current']), '');
  assert.equal(combineChains(['a and b', 'a and not b']), 'a');
  assert.equal(combineChains(['a', '']), '');
  assert.equal(combineChains(['a', 'a']), 'a');
  assert.equal(combineChains(['a', 'b']), 'a or b');
  assert.equal(combineChains(['a and b', 'c']), '(a and b) or c');
});

test('shipped samples infer sensible questionnaires', async () => {
  const { readFileSync } = await import('node:fs');
  const { inspectDocx } = await import('../../app/lib/render.js');
  const { inferQuestionnaire } = await import('../../app/lib/schema.js');
  const q = (f) => Object.fromEntries(inferQuestionnaire(inspectDocx(readFileSync(new URL(`../../samples/${f}.docx`, import.meta.url)))).fields.map((x) => [x.key, x]));
  const ver = q('employment-verification-letter');
  assert.equal(ver.start_date.showIf, '');
  assert.equal(ver.end_date.showIf, 'not is_current');
  const dem = q('payment-demand-letter');
  assert.equal(dem.payment_instructions.type, 'textarea');
  assert.equal(dem.interest_rate.type, 'text');
  assert.equal(dem.mention_next_steps.type, 'checkbox');
  const sow = q('statement-of-work');
  assert.equal(sow.deliverables.type, 'repeat');
  assert.deepEqual(sow.deliverables.children.map((c) => c.key), ['title', 'description', 'due_date']);
  assert.equal(sow.hourly_rate.showIf, 'not fixed_price');
  const cd = q('cease-and-desist-letter');
  assert.equal(cd.reserve_rights.type, 'checkbox');           // every tag inside is shared with the rest of the letter
  assert.equal(cd.demands.type, 'repeat');
  const svc = q('service-agreement');
  assert.equal(svc.auto_renews.type, 'checkbox');
  assert.equal(svc.service_items.type, 'repeat');
  assert.equal(q('resignation-letter').last_day.type, 'date');
  assert.equal(q('reference-letter').strengths.type, 'repeat');
  const web = q('web-design-contract');
  assert.deepEqual(web.pages.children.map((c) => c.key), ['page_name', 'page_notes']);
  assert.equal(web.maintenance_fee.showIf, 'include_maintenance');
  const gd = q('graphic-design-contract');
  assert.equal(gd.hourly_rate.showIf, 'not is_flat_fee');
  assert.equal(gd.licence_scope.showIf, 'not transfer_copyright');
  const photo = q('photography-contract');
  assert.equal(photo.prints.type, 'repeat');
  assert.equal(photo.prints.showIf, 'include_prints');
  assert.equal(photo.has_travel_fee.type, 'checkbox');
  assert.equal(q('social-media-management-contract').platforms.type, 'repeat');
  const fw = q('freelance-writing-contract');
  assert.deepEqual(fw.assignments.children.map((c) => c.key), ['piece_title', 'word_count', 'due_date', 'piece_fee']);
  assert.equal(fw.rights_granted.showIf, 'not transfer_rights');
  assert.equal(q('video-production-contract').footage_retention_months.showIf, 'not include_raw_footage');
  const va = q('virtual-assistant-agreement');
  assert.equal(va.tasks.type, 'repeat');
  assert.equal(va.invoice_frequency.showIf, 'not is_retainer');
  assert.equal(q('event-planning-contract').planning_fee.showIf, 'not is_percentage_fee');
  assert.equal(q('personal-training-agreement').session_price.showIf, 'not is_package');
  assert.equal(q('tutoring-agreement').session_location.showIf, 'not is_online');
  const rem = q('payment-reminder-letter');
  assert.equal(rem.is_final_notice.type, 'checkbox');
  assert.equal(rem.next_steps.showIf, 'is_final_notice');
  assert.equal(rem.earlier_reminder_dates.showIf, 'is_final_notice and has_earlier_reminders');
  assert.equal(rem.balance_due.type, 'money');
  const sub = q('subcontractor-agreement');
  assert.deepEqual(sub.deliverables.children.map((c) => c.key), ['deliverable_description', 'deliverable_due_date']);
  assert.equal(sub.max_hours.showIf, 'not is_fixed_fee');
  assert.equal(sub.longstop_days.showIf, 'pay_when_paid');
  assert.equal(sub.non_solicit_months.type, 'number');
  const ret = q('retainer-agreement');
  assert.equal(ret.services.type, 'repeat');
  assert.equal(ret.hours_roll_over.showIf, 'has_included_hours');
  assert.equal(ret.overage_rate.type, 'money');
  assert.equal(ret.minimum_term_months.showIf, 'has_minimum_term');
  const mou = q('memorandum-of-understanding');
  assert.deepEqual([mou.party_a_commitments.type, mou.party_b_commitments.type], ['repeat', 'repeat']);
  assert.equal(mou.cost_sharing_terms.showIf, 'has_shared_costs');
  assert.equal(mou.confidentiality_years.showIf, 'include_confidentiality');
  assert.equal(mou.is_binding.type, 'checkbox');
  assert.equal(mou.party_a_contact_email.type, 'email');
  const loi = q('letter-of-intent');
  assert.equal(loi.purchase_price.type, 'money');
  assert.equal(loi.payment_terms.showIf, 'not is_paid_at_closing');
  assert.deepEqual(loi.conditions.children.map((c) => c.key), ['condition']);
  assert.equal(loi.exclusivity_days.showIf, 'include_exclusivity');
  const bos = q('bill-of-sale');
  assert.equal(bos.vehicle_vin.showIf, 'is_vehicle');
  assert.equal(bos.odometer_note.showIf, 'is_vehicle and has_odometer_discrepancy');
  assert.equal(bos.how_paid.type, 'text');
  assert.equal(bos.balance_due_date.showIf, 'not is_paid_in_full');
  assert.equal(bos.warranty_terms.showIf, 'not is_as_is');
  const loan = q('loan-agreement');
  assert.equal(loan.loan_amount.type, 'money');
  assert.equal(loan.transfer_method.type, 'text');
  assert.equal(loan.interest_rate.showIf, 'charges_interest');
  assert.equal(loan.installment_amount.showIf, 'pay_in_installments');
  assert.equal(loan.collateral_description.showIf, 'is_secured');
  assert.equal(loan.guarantor_address.showIf, 'has_guarantor');
  const pa = q('partnership-agreement');
  assert.deepEqual(pa.partners.children.map((c) => [c.key, c.type]), [['partner_name', 'text'], ['partner_address', 'textarea'], ['contribution_description', 'textarea'], ['ownership_percent', 'number']]);
  assert.deepEqual(pa.major_decisions.children.map((c) => c.key), ['decision']);
  assert.equal(pa.monthly_draw_amount.showIf, 'has_drawings');
  assert.equal(pa.spending_limit_amount.type, 'money');
  assert.equal(pa.buyout_price_terms.showIf, 'has_buyout_formula');
  assert.equal(pa.withdrawal_notice_days.type, 'number');
  const sc = q('sales-commission-agreement');
  assert.equal(sc.commission_percent.type, 'number');
  assert.equal(sc.accelerator_threshold_amount.showIf, 'has_accelerator');
  assert.equal(sc.is_recoverable_draw.showIf, 'has_draw');
  assert.equal(sc.chargeback_days.showIf, 'include_chargebacks');
  assert.equal(sc.tail_days.showIf, 'has_tail_period');
  const pr = q('photo-release-form');
  assert.equal(pr.permitted_uses.showIf, 'not allow_commercial_use');
  assert.equal(pr.usage_years.type, 'number');
  assert.equal(pr.what_model_receives.showIf, 'not is_paid');
  assert.equal(pr.guardian_name.showIf, 'is_minor');
  const gr = q('general-release');
  assert.equal(gr.settlement_amount.type, 'money');
  assert.equal(gr.exchange_details.showIf, 'not has_settlement_payment');
  assert.equal(gr.dismissal_days.showIf, 'has_pending_case');
  assert.deepEqual([gr.is_general_release.type, gr.is_mutual.type, gr.include_unknown_claims.type], ['checkbox', 'checkbox', 'checkbox']);
  const ntv = q('notice-to-vacate');
  assert.equal(ntv.move_out_date.type, 'date');
  assert.equal(ntv.lease_end_date.showIf, 'is_end_of_lease');
  assert.equal(ntv.notice_days.showIf, 'not is_end_of_lease');
  assert.equal(ntv.co_tenant_names.showIf, 'has_co_tenants');
  assert.equal(ntv.forwarding_address.type, 'textarea');
  const ri = q('rent-increase-letter');
  assert.deepEqual([ri.current_rent.type, ri.new_rent.type, ri.notice_days.type], ['money', 'money', 'number']);
  assert.equal(ri.include_renewal_offer.showIf, 'not is_month_to_month');
  assert.equal(ri.increase_reason.showIf, 'has_reason');
  assert.equal(ri.reply_by_date.showIf, 'asks_for_reply');
  const dep = q('security-deposit-return-letter');
  assert.equal(dep.deductions.showIf, 'has_deductions');
  assert.deepEqual(dep.deductions.children.map((c) => [c.key, c.type]), [['deduction_description', 'textarea'], ['deduction_amount', 'money']]);
  assert.equal(dep.interest_amount.showIf, 'includes_interest');
  assert.equal(dep.refund_amount.type, 'money');
  assert.equal(dep.how_paid.type, 'text');
  const rm = q('roommate-agreement');
  assert.deepEqual(rm.roommates.children.map((c) => [c.key, c.type]), [['roommate_name', 'text'], ['rent_share', 'money']]);
  assert.equal(rm.collector_name.type, 'text');
  assert.equal(rm.collector_name.showIf, 'has_rent_collector');
  assert.equal(rm.move_out_notice_days.type, 'number');
  assert.equal(rm.pet_terms.showIf, 'allow_pets');
  assert.equal(rm.meeting_frequency.showIf, 'include_house_meetings');
  const lease = q('residential-lease-agreement');
  assert.deepEqual(lease.tenants.children.map((c) => c.key), ['tenant_name']);
  assert.equal(lease.end_date.showIf, 'not is_month_to_month');
  assert.equal(lease.termination_notice_days.showIf, 'is_month_to_month or (not is_month_to_month and becomes_month_to_month)');
  assert.deepEqual([lease.monthly_rent.type, lease.due_day_of_month.type, lease.how_paid.type], ['money', 'text', 'text']);
  assert.equal(lease.prorated_rent.showIf, 'has_prorated_first_month');
  assert.equal(lease.pet_deposit_amount.showIf, 'allow_pets and has_pet_deposit');
  assert.equal(lease.entry_notice_hours.type, 'number');
  assert.equal(lease.is_pre_1978.type, 'checkbox');
  const sbl = q('sublease-agreement');
  assert.equal(sbl.rooms_sublet.showIf, 'not is_whole_home');
  assert.equal(sbl.how_paid.showIf, 'not pay_landlord_directly');
  assert.equal(sbl.deposit_return_days.type, 'number');
  assert.equal(sbl.needs_landlord_consent.type, 'checkbox');
  const mic = q('move-in-checklist');
  assert.deepEqual(mic.rooms.children.map((c) => [c.key, c.type]), [['room_name', 'text'], ['move_in_condition', 'text'], ['move_out_condition', 'text']]);
  assert.equal(mic.move_out_inspection_date.showIf, 'is_move_out');
  assert.equal(mic.is_move_out.type, 'checkbox');
  const late = q('late-rent-notice');
  assert.equal(late.rent_due_date.type, 'date');
  assert.equal(late.amount_unpaid.showIf, 'is_partial_payment');
  assert.equal(late.late_fee_amount.showIf, 'charges_late_fee');
  assert.deepEqual([late.total_due.type, late.due_by_date.type], ['money', 'date']);
  const rr = q('rent-receipt');
  assert.deepEqual([rr.amount_received.type, rr.receipt_date.type, rr.period_start_date.type], ['money', 'date', 'date']);
  assert.equal(rr.balance_due.showIf, 'is_partial_payment');
  assert.equal(rr.late_fee_amount.showIf, 'includes_late_fee');
  assert.equal(rr.other_charges_description.showIf, 'has_other_charges');
  const app = q('rental-application');
  assert.deepEqual(app.occupants.children.map((c) => c.key), ['occupant_name']);
  assert.equal(app.occupants.showIf, 'has_other_occupants');
  assert.deepEqual([app.monthly_income_amount.type, app.current_address.type, app.lived_there_since.type], ['money', 'textarea', 'text']);
  assert.equal(app.previous_landlord_phone.showIf, 'has_previous_address');
  assert.equal(app.application_fee_amount.showIf, 'charges_application_fee');
  const ren = q('lease-renewal-letter');
  assert.equal(ren.current_rent.showIf, '');
  assert.equal(ren.new_rent.showIf, 'has_rent_change');
  assert.equal(ren.month_to_month_rent.showIf, 'offers_month_to_month');
  assert.equal(ren.reply_by_date.type, 'date');
  const pet = q('pet-addendum');
  assert.deepEqual(pet.pets.children.map((c) => [c.key, c.type]), [['pet_name', 'text'], ['pet_description', 'textarea']]);
  assert.equal(pet.max_hours_alone.showIf, 'limits_time_alone');
  assert.equal(pet.max_hours_alone.type, 'number');
  assert.equal(pet.pet_rent_amount.type, 'money');
  assert.equal(pet.cure_days.type, 'number');
});
