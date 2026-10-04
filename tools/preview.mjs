// Renders a sample .docx as readable HTML for its template page (site/library.mjs), so visitors and search engines
// can read the whole template before downloading it. {tags} become [Labels] taken from the inferred questionnaire,
// optional text is marked, and repeating groups say what repeats. Only handles what tools/make-samples.mjs produces:
// paragraphs, headings and lists, no tables.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import PizZip from 'pizzip';
import { inspectDocx } from '../app/lib/render.js';
import { inferQuestionnaire, humanize } from '../app/lib/schema.js';
import { esc, lowerFirst } from './partials.mjs';

const unxml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const TAG = /\{([#^/]?)([a-z0-9_]+)\}/g;

export const PREVIEW_CSS = `<style>
.tpl-doc { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1.25rem 1.5rem; max-height: 38rem; overflow: auto; font-family: Georgia, "Times New Roman", serif; line-height: 1.6; }
.tpl-doc h3 { font-size: 1.05rem; margin: 1.25rem 0 .5rem; }
.tpl-doc p, .tpl-doc li { margin: 0 0 .75rem; }
.tpl-title { text-align: center; font-weight: 700; letter-spacing: .02em; }
.tpl-ph { background: var(--surface-3); border-radius: 3px; padding: 0 .2em; font-family: system-ui, sans-serif; font-size: .9em; }
.tpl-opt { background: var(--accent-soft); border-bottom: 1px dashed var(--accent); }
.tpl-alt { background: var(--warn-soft); border-bottom: 1px dashed var(--warn); }
.tpl-block { border-left: 3px solid var(--accent); padding-left: .9rem; margin: 0 0 .75rem; }
.tpl-note { font-family: system-ui, sans-serif; font-size: .8rem; color: var(--muted); margin: 0 0 .35rem !important; }
</style>`;

function numberingFormats(zip) {
  const xml = zip.file('word/numbering.xml')?.asText() || '';
  const abs = new Map([...xml.matchAll(/<w:abstractNum [^>]*w:abstractNumId="(\d+)"[^>]*>([\s\S]*?)<\/w:abstractNum>/g)].map(([, id, body]) => [id, (body.match(/<w:numFmt w:val="([a-zA-Z]+)"/) || [])[1]]));
  return new Map([...xml.matchAll(/<w:num w:numId="(\d+)"[^>]*>[\s\S]*?<w:abstractNumId w:val="(\d+)"/g)].map(([, num, a]) => [num, abs.get(a)]));
}

export function previewHtml(file) {
  const bytes = readFileSync(new URL(`../samples/${file}`, import.meta.url));
  const q = inferQuestionnaire(inspectDocx(bytes));
  const fields = new Map();
  for (const f of q.fields) { fields.set(f.key, f); for (const c of f.children || []) fields.set(c.key, c); }
  const label = (k) => fields.get(k)?.label || humanize(k);
  const zip = new PizZip(bytes);
  const fmts = numberingFormats(zip);
  const body = zip.file('word/document.xml').asText();

  const items = [];      // { kind: 'open'|'close'|'p', ... }
  const inline = [];     // sections opened inside a paragraph and still open: [{ key, alt }]
  const blocks = [];     // keys of sections opened by a paragraph holding only the tag
  const span = (s) => `<span class="${s.alt ? 'tpl-alt' : 'tpl-opt'}" title="${esc((s.alt ? 'Only if not: ' : 'Only if: ') + label(s.key))}">`;
  for (const [p] of body.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)) {
    const text = unxml([...p.matchAll(/<w:t(?: [^>]*)?>([^<]*)<\/w:t>/g)].map((m) => m[1]).join(''));
    const only = text.trim().match(/^\{([#^/])([a-z0-9_]+)\}$/);
    if (only) {
      const [, sign, key] = only;
      if (sign === '/') {
        if (blocks.at(-1) === key) { blocks.pop(); items.push({ kind: 'close' }); }
        else { const i = inline.findLastIndex((s) => s.key === key); if (i >= 0) inline.splice(i, 1); }
      } else {
        const f = fields.get(key);
        blocks.push(key);
        items.push({ kind: 'open', note: f?.type === 'repeat' ? `Repeated for each ${f.itemLabel.toLowerCase()}` : `${sign === '^' ? 'Included unless' : 'Included if'}: ${label(key)}` });
      }
      continue;
    }
    if (!text.trim()) continue;
    let html = inline.map(span).join('');
    let last = 0;
    for (const m of text.matchAll(TAG)) {
      html += esc(text.slice(last, m.index));
      last = m.index + m[0].length;
      const [, sign, key] = m;
      if (!sign) html += `<span class="tpl-ph">[${esc(label(key))}]</span>`;
      else if (sign === '/') { const i = inline.findLastIndex((s) => s.key === key); if (i >= 0) { html += '</span>'.repeat(inline.length - i); const reopen = inline.slice(i + 1); inline.splice(i); inline.push(...reopen); html += reopen.map(span).join(''); } }
      else { const s = { key, alt: sign === '^' }; inline.push(s); html += span(s); }
    }
    html += esc(text.slice(last)) + '</span>'.repeat(inline.length);
    const style = (p.match(/<w:pStyle w:val="([^"]+)"/) || [])[1] || '';
    const num = (p.match(/<w:numId w:val="(\d+)"/) || [])[1];
    items.push({ kind: 'p', html, style, list: num ? (fmts.get(num) === 'decimal' ? 'ol' : 'ul') : null });
  }

  let out = '', list = null;
  const endList = () => { if (list) { out += `</${list}>`; list = null; } };
  for (const it of items) {
    if (it.kind === 'open') { endList(); out += `<div class="tpl-block"><p class="tpl-note">${esc(it.note)}</p>`; continue; }
    if (it.kind === 'close') { endList(); out += '</div>'; continue; }
    if (it.list) { if (list !== it.list) { endList(); list = it.list; out += `<${list}>`; } out += `<li>${it.html}</li>`; continue; }
    endList();
    out += it.style === 'Title' ? `<p class="tpl-title">${it.html}</p>` : /^Heading/.test(it.style) ? `<h3>${it.html}</h3>` : `<p>${it.html}</p>`;
  }
  endList();
  return out + '</div>'.repeat(blocks.length);
}

// First-page images of each template (tools/make-previews.mjs renders them with Chromium; site/library.mjs shows them).
export const PREVIEW_SIZE = { width: 680, height: 880 };
export const PREVIEW_DIR = 'assets/previews';
export const PREVIEW_HASHES = `${PREVIEW_DIR}/hashes.json`;   // per template: hash of its sample and preview page when last rendered

export const previewPage = (t) => `<!doctype html><html><head><meta charset="utf-8">${PREVIEW_CSS}<style>
:root { --surface: #fff; --surface-3: #e8edf5; --border: #fff; --radius-sm: 0; --accent: #0f766e; --accent-soft: #dff3f0; --warn: #b45309; --warn-soft: #fdf0dc; --muted: #6b7280; }
html, body { margin: 0; background: #fff; }
.sheet { width: ${PREVIEW_SIZE.width}px; height: ${PREVIEW_SIZE.height}px; box-sizing: border-box; padding: 44px 52px 0; overflow: hidden; position: relative; color: #1f2937; }
.sheet .tpl-doc { max-height: none; overflow: visible; padding: 0; border: 0; font-size: 14px; line-height: 1.5; }
.fade { position: absolute; left: 0; right: 0; bottom: 34px; height: 90px; background: linear-gradient(rgba(255,255,255,0), #fff); }
.foot { position: absolute; left: 0; right: 0; bottom: 0; height: 34px; display: flex; align-items: center; justify-content: space-between; padding: 0 22px; background: #1b2a41; color: #fff; font: 600 13px system-ui, sans-serif; }
.foot span:last-child { color: #b9c3d4; font-weight: 500; }
</style></head><body><div class="sheet"><div class="tpl-doc">${previewHtml(t.file)}</div><div class="fade"></div>
<div class="foot"><span>Free ${lowerFirst(t.name)} template (Word)</span><span>getclausery.github.io</span></div></div></body></html>`;

// The preview page is built from the sample's text, so its hash changes exactly when the image would.
export const previewHash = (t) => createHash('sha256').update(previewPage(t)).digest('hex').slice(0, 16);
