import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from 'parse5';
import { COUNTRIES } from '../../site/countries.mjs';

test('country invoice examples show correct finite totals and only applicable tax', () => {
  for (const country of COUNTRIES) {
    const html = readFileSync(`invoice-templates/${country.slug}.html`, 'utf8');
    const doc = parse(html);
    let tables = [];
    function visit(node) {
      if (node.tagName === 'table') tables.push(node);
      for (const child of node.childNodes || []) visit(child);
    }
    const text = (node) => (node.value || '') + (node.childNodes || []).map(text).join('');
    visit(doc);
    const table = tables.find((node) => text(node).includes('Example prices for illustration only'));
    assert.ok(table, `${country.slug}: example exists`);
    const example = text(table);
    assert.doesNotMatch(example, /NaN|undefined/, country.slug);
    const subtotal = country.lines.reduce((sum, [, qty, price]) => sum + qty * price, 0);
    const taxable = country.preset.answers.has_tax === true;
    const tax = taxable ? Math.round(subtotal * country.preset.answers.tax_rate) / 100 : 0;
    const formatted = new Intl.NumberFormat(country.locale, { style: 'currency', currency: country.preset.currency }).format(subtotal + tax);
    assert.ok(example.includes(formatted), `${country.slug}: expected total ${formatted}`);
    if (taxable) assert.ok(example.includes(`${country.preset.answers.tax_name} at ${country.preset.answers.tax_rate}%`), country.slug);
    else assert.match(example, /without tax/);
  }
});
