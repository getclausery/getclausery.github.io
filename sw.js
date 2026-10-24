/* Clausery <https://getclausery.github.io> — (C) 2026 Clausery. AGPL-3.0-or-later WITH Clausery-Trademark-Exception. Removing this notice is removal of copyright management information under 17 U.S.C. 1202. Source: https://github.com/getclausery/getclausery.github.io */
/* Clausery service worker: makes the app work offline. Same-origin only; never touches other origins.
   Strategy: the app files listed in PRECACHE are fetched once at install and then served from the cache with no
   background requests (a new release ships a new VERSION, which installs a fresh cache). Pages are network-first so a
   deploy is visible at once; offline, app routes fall back to the app shell and other pages to offline.html.
   VERSION and PRECACHE are written by tools/release.mjs; do not edit them by hand. */
const VERSION = '1.63.0';
const CACHE = 'clausery-' + VERSION;
const BASE = new URL('./', self.location).pathname;
// PRECACHE:BEGIN
const PRECACHE = [
  '',
  'app/',
  'app/config.js',
  'app/index.html',
  'app/lib/backup.js',
  'app/lib/bulk.js',
  'app/lib/copyguard.js',
  'app/lib/credit.js',
  'app/lib/expr.js',
  'app/lib/form.js',
  'app/lib/history.js',
  'app/lib/intake.js',
  'app/lib/license.js',
  'app/lib/logic.js',
  'app/lib/onlinelicense.js',
  'app/lib/plan.js',
  'app/lib/prefill.js',
  'app/lib/presets.js',
  'app/lib/provenance.js',
  'app/lib/purchase.js',
  'app/lib/render.js',
  'app/lib/schema.js',
  'app/lib/setups.js',
  'app/lib/store.js',
  'app/lib/trial.js',
  'app/lib/usage.js',
  'app/lib/vault.js',
  'app/lib/versions.js',
  'app/main.js',
  'app/manifest.webmanifest',
  'app/purchase-entry.js',
  'app/styles.css',
  'app/theme.js',
  'app/ui/dom.js',
  'app/ui/offer.js',
  'app/ui/router.js',
  'app/ui/views/designer.js',
  'app/ui/views/drafts.js',
  'app/ui/views/interview.js',
  'app/ui/views/lock.js',
  'app/ui/views/settings.js',
  'app/ui/views/templates.js',
  'app/ui/views/trial.js',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/icon-maskable-192.png',
  'assets/icon-maskable-512.png',
  'assets/icon.svg',
  'favicon.ico',
  'index.html',
  'offline.html',
  'samples/bill-of-sale.docx',
  'samples/board-resolution.docx',
  'samples/business-sale-nda.docx',
  'samples/catering-contract.docx',
  'samples/cease-and-desist-letter.docx',
  'samples/change-order-form.docx',
  'samples/cleaning-services-contract.docx',
  'samples/coaching-agreement.docx',
  'samples/consignment-agreement.docx',
  'samples/consulting-agreement.docx',
  'samples/contract-termination-letter.docx',
  'samples/contractor-nda.docx',
  'samples/credit-note.docx',
  'samples/employee-nda.docx',
  'samples/employee-warning-letter.docx',
  'samples/employment-agreement.docx',
  'samples/employment-termination-letter.docx',
  'samples/employment-verification-letter.docx',
  'samples/engagement-letter.docx',
  'samples/equipment-rental-agreement.docx',
  'samples/event-planning-contract.docx',
  'samples/expense-reimbursement-form.docx',
  'samples/freelance-writing-contract.docx',
  'samples/general-release.docx',
  'samples/gift-letter.docx',
  'samples/graphic-design-contract.docx',
  'samples/hold-harmless-agreement.docx',
  'samples/independent-contractor-agreement.docx',
  'samples/internship-offer-letter.docx',
  'samples/invoice.docx',
  'samples/job-description.docx',
  'samples/landlord-reference-letter.docx',
  'samples/late-rent-notice.docx',
  'samples/lease-renewal-letter.docx',
  'samples/lease-termination-agreement.docx',
  'samples/letter-of-intent.docx',
  'samples/liability-waiver.docx',
  'samples/loan-agreement.docx',
  'samples/meeting-minutes.docx',
  'samples/memorandum-of-understanding.docx',
  'samples/move-in-checklist.docx',
  'samples/mutual-nda.docx',
  'samples/nanny-contract.docx',
  'samples/non-compete-agreement.docx',
  'samples/non-solicitation-agreement.docx',
  'samples/notice-to-vacate.docx',
  'samples/offer-letter.docx',
  'samples/one-way-nda.docx',
  'samples/partnership-agreement.docx',
  'samples/payment-demand-letter.docx',
  'samples/payment-receipt.docx',
  'samples/payment-reminder-letter.docx',
  'samples/performance-improvement-plan.docx',
  'samples/personal-training-agreement.docx',
  'samples/pet-addendum.docx',
  'samples/pet-sitting-agreement.docx',
  'samples/photo-release-form.docx',
  'samples/photography-contract.docx',
  'samples/promissory-note.docx',
  'samples/promotion-letter.docx',
  'samples/purchase-order.docx',
  'samples/quote.docx',
  'samples/reference-letter.docx',
  'samples/remote-work-agreement.docx',
  'samples/rent-increase-letter.docx',
  'samples/rent-payment-plan-agreement.docx',
  'samples/rent-receipt.docx',
  'samples/rental-application.docx',
  'samples/residential-lease-agreement.docx',
  'samples/resignation-letter.docx',
  'samples/retainer-agreement.docx',
  'samples/room-rental-agreement.docx',
  'samples/roommate-agreement.docx',
  'samples/salary-increase-letter.docx',
  'samples/sales-commission-agreement.docx',
  'samples/security-deposit-return-letter.docx',
  'samples/service-agreement.docx',
  'samples/severance-agreement.docx',
  'samples/social-media-management-contract.docx',
  'samples/statement-of-work.docx',
  'samples/subcontractor-agreement.docx',
  'samples/sublease-agreement.docx',
  'samples/tutoring-agreement.docx',
  'samples/two-weeks-notice-letter.docx',
  'samples/video-production-contract.docx',
  'samples/virtual-assistant-agreement.docx',
  'samples/web-design-contract.docx',
  'site.css',
  'site.js',
  'vendor/docs.js',
  'vendor/intake-runtime.js',
  'vendor/purchase-runtime-1.63.0.js'
];
// PRECACHE:END
const PRECACHE_URLS = new Set(PRECACHE.map((p) => BASE + p));

// ORIGIN-GUARD:BEGIN — updated by hand; release.mjs must not strip this block.
// The service worker refuses to install or cache anything on hosts that are
// not run by the Clausery project. This means a clone cannot become a working
// PWA (offline mode, install to home screen, cached assets) without editing
// this section, and that section is CMI (17 U.S.C. §1202). White-label
// commercial licensees receive a patched sw.js with their host added here.
const OFFICIAL_HOSTS = [
  'getclausery.github.io',
  'getclausery.com',
  'www.getclausery.com',
  'clausery.app',
  'www.clausery.app',
];
function isOfficialOrigin(origin) {
  try {
    const h = new URL(origin).hostname.toLowerCase();
    if (h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' || h === '') return true;
    if (h.endsWith('.e2b.app') || h.endsWith('.e2b.dev') || h.endsWith('.arena.ai')) return true;
    for (const o of OFFICIAL_HOSTS) if (h === o || h.endsWith('.' + o)) return true;
    return false;
  } catch { return false; }
}
const ALLOW_UNOFFICIAL = false; // set to true only in a commercial white-label build
// ORIGIN-GUARD:END

self.addEventListener('install', (e) => {
  // Refuse to install on unauthorised origins. Without an installed SW there
  // is no offline support, no precache and no "install app" prompt — the clone
  // becomes a plain website.
  if (!ALLOW_UNOFFICIAL && !isOfficialOrigin(self.location.href)) {
    e.waitUntil(self.registration.uninstall().then(() => self.skipWaiting()));
    return;
  }
  // cache: 'reload' bypasses the HTTP cache so a release never precaches a stale copy of a file
  e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled([...PRECACHE_URLS].map((u) => c.add(new Request(u, { cache: 'reload' }))))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  if (!ALLOW_UNOFFICIAL && !isOfficialOrigin(self.location.href)) {
    e.waitUntil(self.registration.uninstall().then(() => self.clients.claim()));
    return;
  }
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('clausery-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // On unauthorised origins, never intercept fetches: let the browser behave
  // normally but do not serve cached assets. The SW stays in "pass-through"
  // mode so it cannot be used to persist a clone offline.
  if (!ALLOW_UNOFFICIAL && !isOfficialOrigin(self.location.href)) return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (isHTML) {
    e.respondWith(fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; })
      .catch(async () => (await caches.match(req, { ignoreSearch: true }))
        || (url.pathname.startsWith(BASE + 'app/') ? await caches.match(BASE + 'app/index.html') : null)
        || (await caches.match(BASE + 'offline.html'))
        || Response.error()));
    return;
  }
  if (PRECACHE_URLS.has(url.pathname)) {
    // released files never change within a VERSION: answer from the cache and do not touch the network
    e.respondWith(caches.match(url.pathname).then((hit) => hit || fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(url.pathname, copy)); } return res; })));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; })));
});
