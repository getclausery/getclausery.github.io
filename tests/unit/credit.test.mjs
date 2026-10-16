/* The Free plan's "Made with Clausery" line: added as the last paragraph of the body, linked, idempotent, and only when
   asked for. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { makeDocx, paragraphs } from './docx-helper.mjs';
import { PizZip } from '../../vendor/docs.js';
import { renderDocx, renderDocxBytes } from '../../app/lib/render.js';
import { addCreditToDocument, addCreditRelationship, bodySectPrStart, CREDIT_TEXT, CREDIT_URL } from '../../app/lib/credit.js';
import { SITE_URL } from '../../app/config.js';

const buf = async (blob) => Buffer.from(await blob.arrayBuffer());
const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
const R = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';

test('the credit names the site and links to the made-with page', () => {
  assert.match(CREDIT_TEXT, /^Made with Clausery · /);
  assert.ok(CREDIT_TEXT.endsWith(SITE_URL.replace(/^https?:\/\//, '')));
  assert.equal(CREDIT_URL, `${SITE_URL}/made-with/`);
});

test('rendering adds the credit only when asked, as the last paragraph before the section properties', async () => {
  const bytes = makeDocx({ body: ['Hello {name}', 'Bye'] });
  const plain = await buf(renderDocx(bytes, { name: 'Ada' }));
  assert.deepEqual(paragraphs(plain), ['Hello Ada', 'Bye']);
  const credited = await buf(renderDocx(bytes, { name: 'Ada' }, { credit: true }));
  assert.deepEqual(paragraphs(credited), ['Hello Ada', 'Bye', CREDIT_TEXT]);
  const zip = new PizZip(credited);
  const doc = zip.file('word/document.xml').asText();
  assert.match(doc, /<w:hyperlink r:id="rIdClauseryCredit"[^>]*>/);
  assert.match(doc, /<\/w:p><w:sectPr>[\s\S]*<\/w:sectPr><\/w:body>/);   // the section properties stay last
  const rels = zip.file('word/_rels/document.xml.rels').asText();
  assert.match(rels, /<Relationship Id="rIdClauseryCredit" Type="http:\/\/schemas\.openxmlformats\.org\/officeDocument\/2006\/relationships\/hyperlink" Target="https:\/\/getclausery\.github\.io\/made-with\/" TargetMode="External"\/>/);
  // the bulk path takes the same option
  assert.deepEqual(paragraphs(Buffer.from(renderDocxBytes(bytes, { name: 'Bo' }, { credit: true }))), ['Hello Bo', 'Bye', CREDIT_TEXT]);
  assert.deepEqual(paragraphs(Buffer.from(renderDocxBytes(bytes, { name: 'Bo' }))), ['Hello Bo', 'Bye']);
});

test('adding the credit twice changes nothing', () => {
  const xml = `<w:document ${W} ${R}><w:body><w:p/><w:sectPr/></w:body></w:document>`;
  const once = addCreditToDocument(xml);
  assert.equal(addCreditToDocument(once), once);
  const rels = addCreditRelationship('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>');
  assert.equal(addCreditRelationship(rels), rels);
});

test('a document without the relationships namespace or a rels file still gets a valid link', () => {
  const xml = `<w:document ${W}><w:body><w:p><w:r><w:t>A</w:t></w:r></w:p></w:body></w:document>`;
  const out = addCreditToDocument(xml);
  assert.match(out, /^<w:document [^>]*xmlns:r="http:\/\/schemas\.openxmlformats\.org\/officeDocument\/2006\/relationships"/);
  assert.ok(out.indexOf(CREDIT_TEXT.slice(0, 18)) < out.indexOf('</w:body>'));   // no sectPr: just before the end of the body
  const rels = addCreditRelationship('');
  assert.match(rels, /^<\?xml[^>]+\?>\n<Relationships [^>]+><Relationship Id="rIdClauseryCredit"/);
  assert.equal(addCreditToDocument('<w:document><w:p/></w:document>'), '<w:document><w:p/></w:document>');   // no body: unchanged
});

test('only the section properties that close the body count, including nested and self-closing ones', () => {
  const end = (x) => x.lastIndexOf('</w:body>');
  // a section break inside an earlier paragraph is not the body's own
  const brk = `<w:body><w:p><w:pPr><w:sectPr><w:pgSz/></w:sectPr></w:pPr></w:p><w:p/><w:sectPr><w:pgSz/></w:sectPr></w:body>`;
  assert.equal(bodySectPrStart(brk, end(brk)), brk.lastIndexOf('<w:sectPr>'));
  // a tracked change keeps the previous properties nested inside
  const nested = `<w:body><w:p/><w:sectPr><w:pgSz/><w:sectPrChange w:id="1"><w:sectPr><w:pgSz/></w:sectPr></w:sectPrChange></w:sectPr></w:body>`;
  assert.equal(bodySectPrStart(nested, end(nested)), nested.indexOf('<w:sectPr>'));
  const self = `<w:body><w:p/><w:sectPr w:rsidR="00"/></w:body>`;
  assert.equal(bodySectPrStart(self, end(self)), self.indexOf('<w:sectPr'));
  const none = `<w:body><w:p><w:pPr><w:sectPr/></w:pPr></w:p><w:p/></w:body>`;
  assert.equal(bodySectPrStart(none, end(none)), -1);
  // and the credit lands before the outer one, never inside the tracked change
  const out = addCreditToDocument(`<w:document ${W} ${R}>${nested}</w:document>`);
  assert.ok(out.indexOf('rIdClauseryCredit') < out.indexOf('<w:sectPr>'));
});

test('every library template accepts the credit as its last paragraph', async () => {
  const { LIB } = await import('../../site/library.mjs');
  for (const t of LIB) {
    const bytes = readFileSync(`samples/${t.file}`);
    const zip = new PizZip(bytes);
    const doc = addCreditToDocument(zip.file('word/document.xml').asText());
    const sect = doc.lastIndexOf('<w:sectPr');
    assert.ok(sect > doc.indexOf('rIdClauseryCredit'), t.slug);
    assert.match(doc.slice(sect), /^<w:sectPr[\s\S]*<\/w:sectPr><\/w:body><\/w:document>$/, t.slug);
  }
});
