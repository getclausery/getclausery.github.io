/* Clausery <https://getclausery.github.io> — (C) 2026 Clausery. AGPL-3.0-or-later WITH Clausery-Trademark-Exception. Removing this notice is removal of copyright management information under 17 U.S.C. 1202. Source: https://github.com/getclausery/getclausery.github.io */
/* The free Pro trial: one per browser, TRIAL_DAYS long, with no card, no account and no email. It is a record in this
   browser's settings and nothing is sent anywhere. When it ends the workspace is simply back on the Free plan with
   everything kept: there is nothing to cancel and nothing renews. A purchased license always takes precedence. */
import { TRIAL_DAYS } from '../config.js';

const DAY = 86400000;

/** A new trial record starting now. */
export function newTrial(now = new Date(), days = TRIAL_DAYS) {
  return { startedAt: now.toISOString(), endsAt: new Date(now.getTime() + days * DAY).toISOString() };
}

/** Where a trial record stands: 'unused' (no trial yet), 'active' (with whole days left, rounded up) or 'ended'.
    A record that cannot be read counts as ended, so a damaged record never grants a fresh trial. */
export function trialState(rec, now = new Date()) {
  if (!rec || typeof rec !== 'object') return { status: 'unused' };
  const end = new Date(rec.endsAt).getTime();
  if (!Number.isFinite(end)) return { status: 'ended', endsAt: null, seen: !!rec.endSeen };
  const left = end - now.getTime();
  if (left > 0) return { status: 'active', endsAt: rec.endsAt, daysLeft: Math.ceil(left / DAY) };
  return { status: 'ended', endsAt: rec.endsAt, seen: !!rec.endSeen };
}

/** The plan payload an active trial unlocks (same shape as a license payload, marked as a trial). */
export function trialPayload(rec) {
  return { plan: 'pro', trial: true, expires: String(rec.endsAt).slice(0, 10), endsAt: rec.endsAt, source: 'trial' };
}

/** "13 days left", "1 day left". */
export function daysLeftText(n) { return `${n} day${n === 1 ? '' : 's'} left`; }
