import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { previewHtml } from '../../tools/preview.mjs';

test('every sample template renders as readable text with no raw tags', () => {
  const files = readdirSync('samples').filter((f) => f.endsWith('.docx'));
  assert.ok(files.length > 50);
  for (const f of files) {
    const html = previewHtml(f);
    const count = (rx) => (html.match(rx) || []).length;
    assert.doesNotMatch(html, /\{[#^/]?[a-z0-9_]+\}/, `${f}: a tag was left in the text`);
    assert.equal(count(/<span/g), count(/<\/span>/g), `${f}: unbalanced spans`);
    assert.equal(count(/<div/g), count(/<\/div>/g), `${f}: unbalanced blocks`);
    assert.ok(html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length > 60, `${f}: too little text`);
  }
});

test('placeholders use questionnaire labels, and optional and repeating parts are marked', () => {
  const html = previewHtml('pet-addendum.docx');
  assert.match(html, /<span class="tpl-ph">\[Pet deposit amount\]<\/span>/);
  assert.match(html, /<p class="tpl-note">Repeated for each pet<\/p><ul><li><span class="tpl-ph">\[Pet name\]<\/span>/);
  assert.match(html, /<span class="tpl-opt" title="Only if: Has pet deposit">Tenant will pay a pet deposit/);
  assert.match(html, /<span class="tpl-alt" title="Only if not: Has pet deposit">/);
  assert.match(previewHtml('mutual-nda.docx'), /^<p class="tpl-title">MUTUAL NON-DISCLOSURE AGREEMENT<\/p>/);
});
