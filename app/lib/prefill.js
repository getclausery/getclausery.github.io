/* A new draft of a library template starts from what the person typed last time, so a small business does not retype
   its own details on every invoice. Three things are filled in, all decided by the template's setup (setups.js `reuse`):
   - remember: your own details (name, address, tax number, bank details, usual tax rate), copied from your most recent
     document that asks the same question, even from another template (an invoice's business name fills a quote's);
   - sequence: the next number after the highest one used so far with the same prefix (INV-0042 -> INV-0043);
   - today / keepGap: today's date, and a due date the same number of days after it as on your last document.
   The other party, the items and the amounts are never copied. Everything stays in the browser, like the drafts. */
import { setupFor } from './setups.js';

const pad2 = (n) => String(n).padStart(2, '0');
/** Today's date in the person's own time zone, as the YYYY-MM-DD a date question stores. */
export const localToday = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const dayNumber = (iso) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / 864e5;
const fromDayNumber = (n) => new Date(n * 864e5).toISOString().slice(0, 10);
const isSet = (v) => v !== undefined && v !== null && v !== '';

/** The next number in a sequence: the highest number used with the latest value's prefix and suffix, plus one, keeping
    its zero padding. Returns '' when no earlier value ends in a number. `values` are newest first. */
export function nextInSequence(values) {
  const parse = (v) => { const m = /^(.*?)(\d+)(\D*)$/.exec(String(v ?? '').trim()); return m ? { pre: m[1], digits: m[2], post: m[3] } : null; };
  const latest = values.map(parse).find(Boolean);
  if (!latest) return '';
  let best = latest;
  for (const p of values.map(parse)) if (p && p.pre === latest.pre && p.post === latest.post && BigInt(p.digits) > BigInt(best.digits)) best = p;
  const next = String(BigInt(best.digits) + 1n);
  return best.pre + next.padStart(best.digits.length, '0') + best.post;
}

/**
 * Fill a new draft's answers from earlier drafts.
 * @param template the template the new draft is for
 * @param answers its blank answers (not modified)
 * @param drafts every draft in the workspace
 * @param templates every template in the workspace
 * @returns {{ answers: object, info: { remembered: string[], from: string, number: string, dated: string[] } }}
 */
export function prefillAnswers(template, answers, drafts = [], templates = [], today = localToday()) {
  const out = { ...answers };
  const info = { remembered: [], from: '', number: '', dated: [] };
  const reuse = template && template.sample && setupFor(template.sample) && setupFor(template.sample).reuse;
  if (!reuse) return { answers: out, info };
  const asked = new Map((template.fields || []).filter((f) => f.type !== 'computed' && f.type !== 'repeat').map((f) => [f.key, f]));
  const tById = new Map(templates.map((t) => [t.id, t]));
  const reuseOf = (d) => { const t = tById.get(d.templateId); const s = t && t.sample && setupFor(t.sample); return (s && s.reuse) || null; };
  const newest = (a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
  // documents actually made come first: they are what the person last sent out
  const earlier = drafts.filter((d) => d && d.answers && reuseOf(d)).sort((a, b) => (Number(!!b.generatedAt) - Number(!!a.generatedAt)) || newest(a, b));

  for (const key of reuse.remember || []) {
    const f = asked.get(key);
    if (!f) continue;
    const src = earlier.find((d) => (reuseOf(d).remember || []).includes(key) && key in d.answers && (f.type === 'checkbox' || isSet(d.answers[key])));
    if (!src) continue;
    out[key] = structuredClone(src.answers[key]);
    info.remembered.push(key);
    if (!info.from) info.from = src.templateName || '';
  }

  const sameKind = earlier.filter((d) => tById.get(d.templateId).sample === template.sample).sort(newest);
  for (const key of reuse.sequence || []) {
    if (!asked.has(key)) continue;
    const next = nextInSequence(sameKind.map((d) => d.answers[key]).filter(isSet));
    if (next) { out[key] = next; info.number = info.number || next; }
  }
  for (const key of reuse.today || []) if (asked.has(key) && asked.get(key).type === 'date') { out[key] = today; info.dated.push(key); }
  for (const [key, base] of Object.entries(reuse.keepGap || {})) {
    if (!asked.has(key) || !ISO.test(String(out[base] || ''))) continue;
    const last = sameKind.find((d) => ISO.test(String(d.answers[key] || '')) && ISO.test(String(d.answers[base] || '')));
    if (!last) continue;
    const gap = dayNumber(last.answers[key]) - dayNumber(last.answers[base]);
    if (gap >= 0 && gap <= 366) { out[key] = fromDayNumber(dayNumber(out[base]) + gap); info.dated.push(key); }
  }
  return { answers: out, info };
}

/** A short note for the person: what was filled in and from where. Empty when nothing came from an earlier document
    (today's date on a first invoice needs no announcement). */
export function prefillNote(info, template) {
  if (!info.remembered.length && !info.number) return '';
  const parts = [];
  if (info.remembered.length) parts.push(`your details from your last ${(info.from || 'document').toLowerCase()}`);
  if (info.number) parts.push(`number ${info.number}`);
  if (info.dated.length) parts.push(info.dated.length > 1 ? 'the dates' : 'today\'s date');
  if (!parts.length) return '';
  const list = parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0];
  return `Filled in ${list}. Check them before you send this ${String(template.name || 'document').toLowerCase()}.`;
}
