/* Anonymous usage counts (see USAGE_COUNTER in config.js). One request per event to GoatCounter's /count endpoint, made
   as an image request with no referrer: the event name says what happened and, for a library template, which one by its
   public slug. Nothing typed into Clausery is ever part of it. Off unless an endpoint is configured, and only on the
   public site, never in automated browsers (tests, crawlers). */
import { USAGE_COUNTER } from '../config.js';

export const USAGE_ON = Boolean(USAGE_COUNTER.endpoint);

/** "document-download/invoice" for a library template, "document-download/own" for one of your own. */
export function eventName(what, template) {
  const which = !template ? '' : template.sample ? String(template.sample) : 'own';
  return which ? `${what}/${which}` : what;
}

/** Count one event. Returns the URL requested, or null when nothing was sent. Never throws. */
export function countEvent(what, template, { endpoint = USAGE_COUNTER.endpoint, host = USAGE_COUNTER.host, loc = globalThis.location, nav = globalThis.navigator } = {}) {
  try {
    if (!endpoint || !loc || loc.hostname !== host || (nav && nav.webdriver)) return null;
    const u = new URL(endpoint);
    u.searchParams.set('p', eventName(what, template));
    u.searchParams.set('e', 'true');
    u.searchParams.set('rnd', Math.random().toString(36).slice(2, 10));
    const Img = globalThis.Image;
    if (typeof Img === 'function') { const img = new Img(); img.referrerPolicy = 'no-referrer'; img.src = u.href; }
    return u.href;
  } catch {
    return null;
  }
}
