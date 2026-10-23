/* Clausery <https://getclausery.github.io> — (C) 2026 Clausery. AGPL-3.0-or-later WITH Clausery-Trademark-Exception. Removing this notice is removal of copyright management information under 17 U.S.C. 1202. Source: https://github.com/getclausery/getclausery.github.io */
/* The "Made with Clausery" line: one small, centred, linked line at the end of a document made from a library template
   on the Free plan. Paid plans and the free trial leave it out (feature `unbranded` in license.js), and templates people
   upload themselves never get it. It is ordinary text in the .docx, added in the browser like everything else; nothing
   about the document or the person who made it is sent anywhere, and the link carries no tracking data. */
import { SITE_URL } from '../config.js';

export const CREDIT_URL = `${SITE_URL}/made-with/`;
export const CREDIT_TEXT = `Made with Clausery · free invoices and Word templates · ${SITE_URL.replace(/^https?:\/\//, '')}`;
const REL_ID = 'rIdClauseryCredit';
const REL_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const HYPERLINK = `${REL_NS}/hyperlink`;

const escXml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** The credit paragraph: 8 pt grey text (5.4:1 contrast on white, enough for WCAG AA at that size), centred, linked to the site. */
export function creditParagraph(text = CREDIT_TEXT) {
  return `<w:p><w:pPr><w:spacing w:before="360" w:after="0"/><w:jc w:val="center"/></w:pPr><w:hyperlink r:id="${REL_ID}" w:history="1"><w:r><w:rPr><w:color w:val="5F6B7A"/><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr><w:t xml:space="preserve">${escXml(text)}</w:t></w:r></w:hyperlink></w:p>`;
}

/** Where the body's own section properties start, or -1 if the body has none. Those are the top-level <w:sectPr> that
    closes the body; one inside an earlier paragraph is a section break and is followed by more content. Section
    properties can nest (a tracked change keeps the old <w:sectPr> inside <w:sectPrChange>), so depth is counted. */
export function bodySectPrStart(xml, bodyEnd) {
  const rx = /<(\/?)w:sectPr(?=[\s>/])[^>]*?(\/?)>/g;
  let depth = 0, start = -1, end = -1, m;
  while ((m = rx.exec(xml)) && m.index < bodyEnd) {
    if (m[1]) { depth = Math.max(0, depth - 1); if (depth === 0) end = m.index + m[0].length; continue; }
    if (depth === 0) { start = m.index; end = -1; }
    if (m[2]) { if (depth === 0) end = m.index + m[0].length; } else depth += 1;
  }
  if (start < 0 || end < 0) return -1;
  return /^\s*$/.test(xml.slice(end, bodyEnd)) ? start : -1;
}

/** document.xml with the credit paragraph as the last paragraph of the body (before the body's section properties,
    which must stay last). Unchanged if the credit is already there or the file has no body. */
export function addCreditToDocument(xml, text = CREDIT_TEXT) {
  if (xml.includes(`r:id="${REL_ID}"`) || !xml.includes('</w:body>')) return xml;
  // the hyperlink needs the relationships namespace; Word always declares it, but a hand-made file might not
  const out = xml.replace(/<w:document\b([^>]*)>/, (tag, attrs) => (/\sxmlns:r=/.test(attrs) ? tag : `<w:document${attrs} xmlns:r="${REL_NS}">`));
  const bodyEnd = out.lastIndexOf('</w:body>');
  const sect = bodySectPrStart(out, bodyEnd);
  const at = sect >= 0 ? sect : bodyEnd;
  return out.slice(0, at) + creditParagraph(text) + out.slice(at);
}

/** document.xml.rels with the credit link's relationship (created if the file is missing). */
export function addCreditRelationship(rels, url = CREDIT_URL) {
  const rel = `<Relationship Id="${REL_ID}" Type="${HYPERLINK}" Target="${escXml(url)}" TargetMode="External"/>`;
  if (!rels) return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rel}</Relationships>`;
  if (rels.includes(`Id="${REL_ID}"`)) return rels;
  const end = rels.lastIndexOf('</Relationships>');
  return end < 0 ? rels : rels.slice(0, end) + rel + rels.slice(end);
}

/** Add the credit to a rendered document's zip (PizZip), in place. */
export function addCredit(zip) {
  const doc = zip.file('word/document.xml');
  if (!doc) return zip;
  zip.file('word/document.xml', addCreditToDocument(doc.asText()));
  const relsFile = zip.file('word/_rels/document.xml.rels');
  zip.file('word/_rels/document.xml.rels', addCreditRelationship(relsFile ? relsFile.asText() : ''));
  return zip;
}
