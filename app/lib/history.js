/* Generation history: every time a draft becomes a document (downloaded, printed, shared or made from a spreadsheet),
   the draft keeps a record of when, how, under which file name, and a SHA-256 fingerprint of the exact answers used,
   with a copy of those answers so any earlier version can be restored. It lives in the draft, in this browser, and
   travels with backups. The newest records are kept; very old ones are dropped once there are more than HISTORY_MAX. */

export const HISTORY_MAX = 25;

/** JSON with object keys sorted at every level, so the same answers always give the same text and fingerprint. */
export function canonicalJson(value) {
  if (Array.isArray(value)) return '[' + value.map(canonicalJson).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map((k) => JSON.stringify(k) + ':' + canonicalJson(value[k])).join(',') + '}';
  return JSON.stringify(value === undefined ? null : value);
}

/** Hex SHA-256 of the answers' canonical JSON. */
export async function fingerprint(answers) {
  const bytes = new TextEncoder().encode(canonicalJson(answers || {}));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

export const KIND_LABELS = { download: 'Downloaded .docx', print: 'Printed or saved as PDF', share: 'Shared', bulk: 'Made from a spreadsheet', restore: 'Answers restored' };

/**
 * Add a record to a draft's history (newest first) and return it.
 * @param {object} draft the draft, changed in place
 * @param {{ kind: string, file?: string, count?: number, template?: string, app?: string }} info
 */
export async function recordHistory(draft, info) {
  const answers = structuredClone(draft.answers || {});
  const entry = { at: new Date().toISOString(), kind: info.kind, file: info.file || '', count: info.count || 1, template: info.template || '', app: info.app || '', fingerprint: await fingerprint(answers), answers };
  draft.history = [entry, ...(Array.isArray(draft.history) ? draft.history : [])].slice(0, HISTORY_MAX);
  return entry;
}
