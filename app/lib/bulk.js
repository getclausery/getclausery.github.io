/* Documents from a spreadsheet: one CSV row per document. A row fills in or replaces the answers of the current draft
   (empty cells keep the draft's answer), so a template's line items, terms and wording are set once and each row only
   carries what changes: the client, the amount, the date. Everything runs in the browser, like the rest of Clausery. */
import { coerce } from './logic.js';
import { humanize } from './schema.js';

export const FREE_BULK_ROWS = 5;   // the Free plan generates up to this many documents per spreadsheet
export const MAX_BULK_ROWS = 500;  // a sanity limit for one batch on any plan

/** Parse CSV text (RFC 4180: quoted fields, doubled quotes, line breaks inside quotes). The separator is taken from the
    header line: comma, semicolon (European Excel) or tab. Returns rows of strings; blank lines are dropped. */
export function parseCsv(text) {
  const src = String(text || '').replace(/^\uFEFF/, '');
  const firstLine = src.split(/\r?\n/, 1)[0] || '';
  const count = (ch) => firstLine.split(ch).length - 1;
  const sep = [',', ';', '\t'].reduce((best, ch) => (count(ch) > count(best) ? ch : best), ',');
  const rows = []; let row = []; let field = ''; let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') { if (src[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else field += c;
      continue;
    }
    if (c === '"' && field === '') { quoted = true; continue; }
    if (c === sep) { row.push(field); field = ''; continue; }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((x) => x.trim() !== '')) rows.push(row);
      row = [];
      continue;
    }
    field += c;
  }
  row.push(field);
  if (row.some((x) => x.trim() !== '')) rows.push(row);
  return rows;
}

const csvCell = (v) => { const s = v == null ? '' : String(v); return /[",\r\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
export const toCsv = (rows) => rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';

/** The questions a spreadsheet can fill: top-level answers that are not calculated and not repeating lists. */
export function bulkFields(template) {
  return (template.fields || []).filter((f) => f.type !== 'computed' && f.type !== 'repeat' && !(f.role === 'condition' && f.expr));
}

/** A starter spreadsheet: one column per question (headed by its tag name), with the current draft's answers as row 1. */
export function templateCsv(template, answers = {}) {
  const fields = bulkFields(template);
  const example = fields.map((f) => { const v = answers[f.key]; return f.type === 'checkbox' ? (v ? 'yes' : 'no') : v == null ? '' : v; });
  return toCsv([fields.map((f) => f.key), example]);
}

const norm = (s) => String(s || '').trim().toLowerCase().replace(/[\s_-]+/g, ' ');
/** Match each column header to a question by tag name, label or the readable form of the tag name. */
export function mapHeaders(headers, template) {
  const fields = bulkFields(template);
  const used = new Set();
  const map = headers.map((h) => {
    const n = norm(h);
    const f = fields.find((x) => !used.has(x.key) && (norm(x.key) === n || norm(x.label) === n || norm(humanize(x.key)) === n));
    if (f) used.add(f.key);
    return f ? f.key : null;
  });
  return { map, unknown: headers.filter((h, i) => !map[i] && String(h).trim() !== ''), matched: [...used] };
}

const YES = new Set(['yes', 'y', 'true', '1', 'x', '✓', 'on']);
const NO = new Set(['no', 'n', 'false', '0', '', 'off']);
const pad = (n) => String(n).padStart(2, '0');

/** One cell into the shape a field expects. Returns undefined to keep the draft's answer (empty cell), or an Error. */
export function cellValue(field, raw) {
  const s = String(raw ?? '').trim();
  if (s === '') return undefined;
  switch (field.type) {
    case 'checkbox': {
      const v = s.toLowerCase();
      if (YES.has(v)) return true;
      if (NO.has(v)) return false;
      return new Error(`"${s}" is not yes or no`);
    }
    case 'date': {
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
      const m = /^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/.exec(s);   // 10/5/2026 is read month first, as Excel exports it in the US
      if (m) return `${m[3]}-${pad(m[1])}-${pad(m[2])}`;
      const d = new Date(s);
      return Number.isNaN(d.getTime()) || !/\d{4}/.test(s) ? new Error(`"${s}" is not a date`) : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
    case 'select': case 'radio': {
      const o = (field.options || []).find((x) => norm(x.value) === norm(s) || norm(x.label) === norm(s));
      return o ? o.value : new Error(`"${s}" is not one of the options`);
    }
    default: return coerce(field, s);
  }
}

/**
 * Turn spreadsheet rows into one set of answers per row, each starting from the draft's answers.
 * @returns {{ items: { row: number, answers: object }[], problems: string[] }}
 */
export function rowsToAnswers(template, base, rows, map) {
  const byKey = new Map(bulkFields(template).map((f) => [f.key, f]));
  const items = [], problems = [];
  rows.forEach((cells, i) => {
    const answers = structuredClone(base || {});
    map.forEach((key, c) => {
      if (!key) return;
      const v = cellValue(byKey.get(key), cells[c]);
      if (v instanceof Error) { problems.push(`Row ${i + 2}, ${byKey.get(key).label}: ${v.message}.`); return; }
      if (v !== undefined) answers[key] = v;
    });
    items.push({ row: i + 2, answers });
  });
  return { items, problems };
}

/** A file name for each document: its first text answer, or the row number, made unique within the batch. */
export function uniqueNames(names) {
  const seen = new Map();
  return names.map((n) => {
    const clean = [...String(n || 'Document')].map((ch) => (ch.charCodeAt(0) < 32 || '\\/:*?"<>|'.includes(ch) ? ' ' : ch)).join('');
    const base = clean.replace(/\s+/g, ' ').trim().slice(0, 80) || 'Document';
    const k = base.toLowerCase();
    const count = (seen.get(k) || 0) + 1; seen.set(k, count);
    return count === 1 ? base : `${base} (${count})`;
  });
}
