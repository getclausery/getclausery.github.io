/* Clausery <https://getclausery.github.io> — (C) 2026 Clausery. AGPL-3.0-or-later WITH Clausery-Trademark-Exception. Removing this notice is removal of copyright management information under 17 U.S.C. 1202. Source: https://github.com/getclausery/getclausery.github.io */
/* Clausery app bootstrap: opens the local store, checks the license, handles the vault lock, wires routes. */
import { APP_VERSION, DEFAULT_SETTINGS, licensePublicKey, CHECKOUT_URLS, CONTACT_URL, KEY_REQUEST_URL, SITE_URL, LICENSE_SERVICE, TRIAL_DAYS } from './config.js';
import { Store, LockedError } from './lib/store.js';
import { Plan, FEATURE_LABELS } from './lib/plan.js';
import { verifyKey } from './lib/license.js';
import { isOnlineKey, isOnlineRecord, activateOnline, validateOnline, deactivateOnline, evaluateOnline } from './lib/onlinelicense.js';
import { Router } from './ui/router.js';
import { h, icon, toast, modal, confirmDialog, setTitle, setChildren, closeAllModals } from './ui/dom.js';
import { nowISO, newDraft } from './lib/schema.js';
import { prefillAnswers, prefillNote } from './lib/prefill.js';
import { applyPreset, presetNote } from './lib/presets.js';
import { countEvent } from './lib/usage.js';
import { newTrial, trialState, trialPayload, daysLeftText } from './lib/trial.js';
import { priceLine, buyLabel } from './ui/offer.js';
import { installCopyGuard } from './lib/copyguard.js';
import * as templatesView from './ui/views/templates.js';
import * as designerView from './ui/views/designer.js';
import * as draftsView from './ui/views/drafts.js';
import * as interviewView from './ui/views/interview.js';
import * as settingsView from './ui/views/settings.js';
import * as lockView from './ui/views/lock.js';
import * as trialView from './ui/views/trial.js';

const store = new Store();
const plan = new Plan();
const router = new Router();
const main = document.getElementById('main');
const statusEl = document.getElementById('status');
const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
/** This browser's free Pro trial record (settings store, never encrypted, so it is readable while the workspace is locked). */
let trialRec = null;
/** Back to the Free plan, unless the free trial is still running, which unlocks Pro by itself. */
function fallBack(error = null) {
  if (trialState(trialRec).status === 'active') plan.set('pro', trialPayload(trialRec));
  else plan.set('free', null, error);
}

const ctx = {
  version: APP_VERSION, store, plan, router, main, settings: { ...DEFAULT_SETTINGS }, siteUrl: SITE_URL, contactUrl: CONTACT_URL, keyRequestUrl: KEY_REQUEST_URL, checkoutUrls: CHECKOUT_URLS, licenseService: LICENSE_SERVICE,
  navigate: (p) => router.go(p),
  trial: {
    state: () => trialState(trialRec),
    /** Start this browser's one free trial. Returns its state; a trial that was already used is not restarted. */
    async start() {
      if (trialState(trialRec).status !== 'unused') return trialState(trialRec);
      trialRec = newTrial();
      await store.setSetting('trial', trialRec);
      if (!plan.isPaid) plan.set('pro', trialPayload(trialRec));
      renderStatus();
      countEvent('trial-started');
      return trialState(trialRec);
    },
  },
  /** Go to the checkout for a plan, counting the click first (a page leaving at once can drop the count request). */
  checkout(which) {
    const url = CHECKOUT_URLS[which];
    if (!url) { location.assign('../pricing/'); return; }
    countEvent('checkout-click/' + which);
    setTimeout(() => location.assign(url), 150);
  },
  templates: {
    list: async () => (await store.all('templates')).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')),
    get: (id) => store.get('templates', id),
    save: async (t) => { t.updatedAt = nowISO(); return store.put('templates', t); },
    remove: async (id) => { await store.delete('templates', id); await store.delete('files', id).catch(() => {}); },
    getFile: async (id) => { const f = await store.get('files', id); return f ? f.bytes : null; },
    saveFile: (id, bytes) => store.put('files', { id, bytes }),
    count: () => store.count('templates'),
    /** Templates that count against the Free plan's limit: the user's own. Library samples (t.sample) are free and unlimited. */
    ownCount: async () => (await store.all('templates')).filter((t) => !t.sample).length,
  },
  drafts: {
    list: async () => (await store.all('drafts')).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')),
    get: (id) => store.get('drafts', id),
    save: async (d) => { d.updatedAt = nowISO(); return store.put('drafts', d); },
    remove: (id) => store.delete('drafts', id),
  },
  /** Start a new draft of a template and open it. Library templates start from your last document (prefill.js): your own
      details, the next number and today's date, so a repeat invoice is a few answers rather than a dozen. */
  async startDraft(t, { replace = false, preset = null } = {}) {
    const d = newDraft(t);
    const drafts = await ctx.drafts.list();
    const { answers, info } = prefillAnswers(t, d.answers, drafts, await ctx.templates.list());
    d.answers = applyPreset(t, answers, preset);
    // A country preset brings its currency and date style. Both are workspace settings that every draft is shown in, so
    // they only change by themselves in a workspace with no drafts yet (and a date style chosen in Settings is kept);
    // otherwise the note says where to change the currency.
    let currencyNote = '';
    if (preset && !drafts.length) {
      const patch = {};
      if (preset.currency && preset.currency !== ctx.settings.currency) patch.currency = preset.currency;
      if (preset.locale && !ctx.settings.locale) patch.locale = preset.locale;
      if (Object.keys(patch).length) await ctx.saveSettings(patch);
      if (patch.currency) currencyNote = `Amounts are in ${patch.currency}.`;
    } else if (preset && preset.currency && preset.currency !== ctx.settings.currency) {
      currencyNote = `Amounts show in ${ctx.settings.currency}; to show ${preset.currency}, change the currency in Settings.`;
    }
    await ctx.drafts.save(d);
    countEvent(preset ? `draft-started/${t.sample}/${preset.slug}` : 'draft-started', preset ? null : t);
    router.go('/drafts/' + d.id, replace);
    const note = [presetNote(preset), currencyNote, prefillNote(info, t)].filter(Boolean).join(' ');
    if (note) toast(note, { type: 'ok', timeout: 9000 });
    return d;
  },
  async saveSettings(patch) {
    Object.assign(ctx.settings, patch);
    await store.setSetting('settings', ctx.settings);
    applyTheme();
    renderStatus();
  },
  async setLicense(key) {
    const previous = await store.getSetting('license', null);
    // a key bought online holds an activation slot: give it back (best effort) when it is removed or replaced
    const release = () => { if (isOnlineRecord(previous) && previous.key !== String(key || '').trim()) deactivateOnline(previous, LICENSE_SERVICE).catch(() => {}); };
    if (!key) { await store.delete('settings', 'license'); fallBack(); renderStatus(); release(); return { ok: true }; }
    if (isOnlineKey(key)) {
      const res = await activateOnline(key, LICENSE_SERVICE);
      if (res.ok) { await store.setSetting('license', res.record); plan.set(res.plan, res.payload); renderStatus(); release(); }
      return res;
    }
    const res = await verifyKey(key, licensePublicKey());
    if (res.ok) { await store.setSetting('license', key); plan.set(res.plan, res.payload); renderStatus(); release(); }
    return res;
  },
  /** Re-check a key bought online now. Returns { ok: true | false | null, error }; null means the service could not be reached. */
  async recheckLicense() {
    const rec = await store.getSetting('license', null);
    if (!isOnlineRecord(rec)) return { ok: null };
    const res = await validateOnline(rec, LICENSE_SERVICE);
    if (res.ok === null) return res;
    await store.setSetting('license', res.record);
    const wasLicensed = plan.isPaid && !plan.isTrial;
    if (res.ok) plan.set(res.plan, res.payload);
    else fallBack(res.error);
    renderStatus();
    if (!res.ok && wasLicensed) toast(res.error + (plan.isTrial ? ' Your free Pro trial is still running.' : ' The workspace is back on the Free plan; everything you made is still here.'), { type: 'warn', timeout: 10000 });
    if (res.ok && !wasLicensed) toast(`${plan.name} plan restored.`, { type: 'ok' });
    return res;
  },
  requirePlan(feature, opts = {}) {
    if (feature === 'templates' ? plan.canAddTemplate(opts.count || 0) : plan.can(feature)) return true;
    upgradeModal(feature);
    return false;
  },
  /** Views add async functions here to flush pending work before the key is dropped; cleared on every navigation. */
  lockHooks: new Set(),
  /** Unsaved in-memory edits by record id, kept across lock/unlock so a lock never discards work. Never cleared here. */
  pendingEdits: new Map(),
  async lock() {
    if (!store.vaultMeta || store.locked) return;
    for (const hook of [...ctx.lockHooks]) { try { await hook(); } catch (e) { console.error(e); } }
    store.setKey(null);
    closeAllModals();
    armIdle();
    await router.resolve();
    renderStatus();
  },
  armIdle: () => armIdle(),
  renderStatus,
};

function applyTheme() {
  const t = ctx.settings.theme || 'system';
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('clausery.theme', t); } catch { /* ignore */ }
}

function renderStatus() {
  const trial = plan.isTrial ? trialState(trialRec) : null;
  setChildren(statusEl,
    h('span.badge', { title: trial ? `Free Pro trial: ${trial.status === 'active' ? daysLeftText(trial.daysLeft) : 'ended'}` : plan.payload ? 'Licensed' : 'Free plan' }, plan.isPaid ? icon('sparkle', 13) : null, trial && trial.status === 'active' ? `Pro trial · ${daysLeftText(trial.daysLeft)}` : plan.name),
    store.vaultMeta ? h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: () => ctx.lock(), title: 'Lock the workspace now' }, icon('lock', 15), h('span.nav-label', 'Lock')) : null,
  );
}

function upgradeModal(feature) {
  const label = feature === 'templates' ? 'More than 3 of your own templates' : FEATURE_LABELS[feature] || feature;
  const canTrial = !plan.isPaid && trialState(trialRec).status === 'unused';
  countEvent('upgrade-shown/' + feature);
  modal({
    title: 'Available on Pro',
    body: h('div.stack',
      h('p', h('strong', label), ' is part of Clausery Pro. Everything still runs in your browser; Pro simply unlocks the feature.'),
      feature === 'templates' ? h('p.small.muted', 'Templates from the free library never count towards the limit: open as many of them as you like.') : null,
      h('ul.feature-list', Object.values(FEATURE_LABELS).map((f) => h('li', icon('check', 16), f))),
      canTrial ? h('p.small', h('strong', `Try every Pro feature free for ${TRIAL_DAYS} days.`), ' No card and no account. When the trial ends you are back on the Free plan with everything you made, and nothing renews.')
        : h('p.small', priceLine()),
      h('p.small.muted', LICENSE_SERVICE.api ? 'Already paid? Open Clausery using the button in your receipt email. No key to copy.' : 'Already have an offline key? Enter it in Settings → Advanced activation.')),
    actions: [
      { label: 'Plan and billing', onClick: () => router.go('/settings') },
      canTrial
        ? { label: `Start ${TRIAL_DAYS}-day free trial`, primary: true, onClick: async () => { await ctx.trial.start(); toast(`Your free Pro trial has started: ${daysLeftText(TRIAL_DAYS)}. Try that again; it is unlocked now.`, { type: 'ok', timeout: 9000 }); } }
        : { label: buyLabel(), primary: true, onClick: () => { ctx.checkout('pro'); return false; } },
    ],
  });
}

/** Once, after the free trial runs out: say so plainly, keep everything, and offer Pro. */
async function trialEnded() {
  if (!trialRec || trialRec.endSeen || store.locked || trialState(trialRec).status !== 'ended') return;
  trialRec = { ...trialRec, endSeen: true };
  await store.setSetting('trial', trialRec).catch(() => {});
  // bought a plan in the meantime: nothing to say now, and nothing about the trial if that plan ever lapses
  if (plan.isPaid) return;
  countEvent('trial-ended');
  modal({
    title: 'Your free Pro trial has ended',
    body: h('div.stack',
      h('p', 'Everything you made is still here and keeps working. This browser is back on the Free plan, so these Pro features are paused:'),
      h('ul.feature-list', Object.values(FEATURE_LABELS).map((f) => h('li', icon('lock', 16), f))),
      h('p.small', priceLine())),
    actions: [{ label: 'Stay on Free' }, { label: buyLabel(), primary: true, onClick: () => { ctx.checkout('pro'); return false; } }],
  });
}

/** A trial that runs out while the app is open ends at the next navigation. */
function checkTrialEnd() {
  if (!plan.isTrial || trialState(trialRec).status === 'active') return;
  fallBack();
  renderStatus();
}

function setNav(name) {
  for (const a of document.querySelectorAll('#nav a[data-nav]')) { if (a.dataset.nav === name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }
}

async function guarded(fn, params, navName, title) {
  ctx.lockHooks.clear();   // the previous view is unmounted now; the next one registers its own hooks
  checkTrialEnd();
  if (store.locked) { setNav(null); setTitle('Locked'); await lockView.render(ctx, { onUnlocked: () => router.resolve() }); return; }
  setNav(navName); setTitle(title);
  setChildren(main, h('p.muted', 'Loading…'));
  try { await fn(ctx, params); }
  catch (e) {
    if (e instanceof LockedError) { await lockView.render(ctx, { onUnlocked: () => router.resolve() }); return; }
    console.error(e);
    setChildren(main, h('div.notice.notice-danger', icon('warn'), h('div', h('strong', 'Something went wrong. '), String(e.message || e))));
  }
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
  trialEnded();   // after the view, so the dialog keeps the focus; at most once, and never over the lock screen
}

router
  .add('/', () => router.go('/templates', true))
  .add('/templates', (p) => guarded(templatesView.render, p, 'templates', 'Templates'))
  .add('/templates/:id', (p) => guarded(designerView.render, p, 'templates', 'Edit template'))
  .add('/drafts', (p) => guarded(draftsView.render, p, 'drafts', 'Drafts'))
  .add('/drafts/:id', (p) => guarded(interviewView.render, p, 'drafts', 'Draft'))
  .add('/settings', (p) => guarded(settingsView.render, p, 'settings', 'Settings'))
  .add('/trial', (p) => guarded(trialView.render, p, 'settings', 'Free Pro trial'))
  .add('/start/:slug', (p) => guarded(templatesView.startFromSample, p, 'drafts', 'New draft'))
  .add('/start/:slug/:preset', (p) => guarded(templatesView.startFromSample, p, 'drafts', 'New draft'));
router.notFound = () => router.go('/templates', true);

// auto-lock after inactivity when a vault is enabled
let idleTimer;
function armIdle() {
  clearTimeout(idleTimer);
  const mins = Number(ctx.settings.autoLockMinutes) || 0;
  if (store.vaultMeta && !store.locked && mins > 0) idleTimer = setTimeout(() => { ctx.lock(); toast('Workspace locked after inactivity.', { type: 'info' }); }, mins * 60000);
}
for (const ev of ['pointerdown', 'keydown', 'scroll']) window.addEventListener(ev, armIdle, { passive: true });
store.onChange((s, id, info) => { if (info && info.remote) { if (s === 'vault') onRemoteVault(); } else armIdle(); });

/** Another tab enabled, changed or turned off the vault: this tab's key is stale, so drop it and re-read the metadata. */
async function onRemoteVault() {
  store.setKey(null);
  store.vaultMeta = await store.getSetting('vault', null);
  if (!store.vaultMeta && await store.hasEncryptedRecords()) store.vaultMeta = { missing: true };
  renderStatus(); armIdle();
  await router.resolve();
}

async function boot() {
  // Watermark: unlicensed rebranded copies that still carry the Clausery name get
  // an attribution banner. Runs before anything else renders so the bar can't be
  // suppressed by later DOM work. Official hosts, renamed forks, white-label
  // licensees and local dev see nothing (see app/lib/copyguard.js).
  installCopyGuard();
  document.getElementById('nav-version').textContent = 'v' + APP_VERSION;
  const navIcons = { templates: 'file', drafts: 'edit', settings: 'settings', docs: 'info' };
  for (const a of document.querySelectorAll('#nav a[data-nav]')) a.querySelector('.nav-icon').replaceWith(icon(navIcons[a.dataset.nav] || 'info'));
  try { await store.open(); } catch (e) { setChildren(main, h('div.notice.notice-danger', icon('warn'), h('div', h('strong', 'Clausery needs local storage. '), String(e.message || e), ' Private browsing modes and some privacy settings block IndexedDB.'))); return; }
  ctx.settings = { ...DEFAULT_SETTINGS, ...(await store.getSetting('settings', {})) };
  applyTheme();
  store.vaultMeta = await store.getSetting('vault', null);
  if (!store.vaultMeta && await store.hasEncryptedRecords()) store.vaultMeta = { missing: true };
  trialRec = await store.getSetting('trial', null);
  fallBack();
  const licenseKey = await store.getSetting('license', null);
  if (isOnlineRecord(licenseKey)) {
    // decide from the stored record so the app opens instantly and offline; re-check in the background when due
    const ev = evaluateOnline(licenseKey, new Date(), LICENSE_SERVICE);
    if (ev.ok) plan.set(ev.plan, ev.payload); else fallBack(ev.error);
    if (ev.due && navigator.onLine !== false) ctx.recheckLicense().then((r) => { if (!ev.ok && r.ok !== true) toast(r.error || ev.error, { type: 'warn', timeout: 10000 }); }).catch(() => {});
    else if (!ev.ok) toast(ev.error, { type: 'warn', timeout: 10000 });
  } else if (licenseKey) {
    const res = await verifyKey(licenseKey, licensePublicKey());
    if (res.ok) plan.set(res.plan, res.payload); else { fallBack(res.error); toast(res.expired ? `Your license has expired. ${plan.isTrial ? 'Your free Pro trial is still running.' : 'The workspace is back on the Free plan.'}` : 'The stored license key is not valid for this deployment.', { type: 'warn', timeout: 8000 }); }
  }
  renderStatus();
  if ('serviceWorker' in navigator && !isLocal) {
    navigator.serviceWorker.register('../sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) toast('A new version of Clausery is ready.', { timeout: 0, action: { label: 'Reload', onClick: () => location.reload() } }); }); });
    }).catch(() => {});
  }
  window.addEventListener('beforeunload', (e) => { if (ctx.dirty) { e.preventDefault(); e.returnValue = ''; } });
  router.beforeLeave = async () => { if (!ctx.dirty) return true; const ok = await confirmDialog({ title: 'Discard unsaved changes?', message: 'You have unsaved changes in this template. Leave without saving?', confirmLabel: 'Discard', danger: true }); if (ok) ctx.dirty = false; return ok; };
  await router.resolve();
  armIdle();
  countEvent('app-opened');
}
boot();
window.__clausery = ctx;   // for debugging and end-to-end tests
