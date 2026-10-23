/* Clausery <https://getclausery.github.io> — (C) 2026 Clausery. AGPL-3.0-or-later WITH Clausery-Trademark-Exception. Removing this notice is removal of copyright management information under 17 U.S.C. 1202. Source: https://github.com/getclausery/getclausery.github.io */
/* Clausery site script: the mobile menu, the copy buttons and the template finder. External so the pages work under a strict script-src 'self' policy. */
// Cookieless page-view counts (Cloudflare Web Analytics) on the website pages that load this script; never the app or embedded calculators.
// Empty token = off. The build reads these two values to switch the privacy, about and security wording, so change them only here.
// Only the public site counts, so tests, previews and self-hosted copies never send page views.
const CLAUSERY_ANALYTICS = { token: '20524027c20141ab8306d586c8518877', since: '2026-10-03', host: 'getclausery.github.io' };
if (CLAUSERY_ANALYTICS.token && location.hostname === CLAUSERY_ANALYTICS.host) {
  const s = document.createElement('script');
  s.type = 'module';
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token: CLAUSERY_ANALYTICS.token }));
  document.head.appendChild(s);
}
document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest('.menu-btn');
  if (!btn) return;
  const nav = document.getElementById(btn.getAttribute('aria-controls'));
  if (!nav) return;
  btn.setAttribute('aria-expanded', String(nav.classList.toggle('open')));
});
// Copy buttons: the clause library's sample wording as plain text, one paragraph per line, or a code box (textarea) as is.
document.addEventListener('click', async (e) => {
  const btn = e.target.closest && e.target.closest('.copy-btn');
  if (!btn) return;
  const src = document.getElementById(btn.dataset.copy);
  const status = btn.parentElement.querySelector('.copy-status');
  if (!src) return;
  const box = src.tagName === 'TEXTAREA';
  const text = box ? src.value : [...src.querySelectorAll('p')].map((p) => p.textContent.trim()).join('\n\n');
  try {
    await navigator.clipboard.writeText(text);
    if (status) status.textContent = 'Copied to the clipboard.';
  } catch {
    if (box) { src.focus(); src.select(); if (status) status.textContent = 'Press Ctrl+C (or Cmd+C) to copy the selected code.'; return; }
    const range = document.createRange();
    range.selectNodeContents(src);
    const sel = window.getSelection();
    sel.removeAllRanges(); sel.addRange(range);
    if (status) status.textContent = 'Press Ctrl+C (or Cmd+C) to copy the selected text.';
  }
});
// Template finder on list pages: filters the cards as you type. The box is hidden in the HTML and only shown here, so
// readers without JavaScript never see a control that does nothing. ?q= pre-fills it (the home page search form uses it).
for (const box of document.querySelectorAll('[data-filter-for]')) {
  const root = document.getElementById(box.dataset.filterFor);
  const input = box.querySelector('input');
  if (!root || !input) continue;
  const count = box.querySelector('[data-filter-count]');
  const empty = document.querySelector('[data-filter-empty]');
  // Match the start of words, so "nda" finds NDAs but not "standard" or "calendar".
  const items = [...root.querySelectorAll('.feature')].map((el) => [el, [...el.childNodes].map((n) => n.textContent).join(' ').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)]);
  const groups = [...root.querySelectorAll('.filter-group')];
  const run = () => {
    const words = input.value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    let shown = 0;
    for (const [el, tokens] of items) { const hit = words.every((w) => tokens.some((t) => t.startsWith(w))); el.hidden = !hit; if (hit) shown += 1; }
    for (const g of groups) g.hidden = !g.querySelector('.feature:not([hidden])');
    if (count) count.textContent = words.length ? `${shown} of ${items.length} templates match` : '';
    if (empty) empty.hidden = shown > 0;
  };
  input.addEventListener('input', run);
  box.hidden = false;
  const q = new URL(location.href).searchParams.get('q');
  if (q) { input.value = q; run(); }
}

/* Copy-protection watermark for site pages (parallel to app/lib/copyguard.js).
   Official deployments and local dev see nothing; unlicensed rebranded copies
   that still carry the Clausery brand get a top banner pointing back to the
   source. White-label licensees set a window.__CLAUSERY_WHITE_LABEL flag on a
   preceding inline script to suppress this. */
(function(){
  const OFFICIAL = ['getclausery.github.io','getclausery.com','www.getclausery.com','clausery.app','www.clausery.app'];
  const h = location.hostname.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' || h === '' ||
      h.endsWith('.e2b.app') || h.endsWith('.e2b.dev') || h.endsWith('.arena.ai') ||
      h.endsWith('.local') || h === 'file') return;
  if (window.__CLAUSERY_WHITE_LABEL) return;
  for (const o of OFFICIAL) if (h === o || h.endsWith('.' + o)) return;
  const brand = ((document.querySelector('.brand')?.textContent||'') + ' ' + document.title + ' '
    + (document.querySelector('meta[property="og:site_name"]')?.getAttribute('content')||'') + ' '
    + (document.querySelector('meta[name="generator"]')?.getAttribute('content')||'') + ' '
    + (document.querySelector('meta[name="original-source"]')?.getAttribute('content')||'') + ' '
    + (document.querySelector('.legal')?.textContent||'') + ' '
    + [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent).join(' ')
  ).toLowerCase();
  if (!/clausery/.test(brand)) return;
  if (document.getElementById('clausery-copyguard')) return;
  const bar = document.createElement('div');
  bar.id = 'clausery-copyguard';
  bar.setAttribute('role','note');
  bar.innerHTML = 'This appears to be an unlicensed copy of <a href="https://getclausery.github.io/" rel="noopener" target="_blank">Clausery</a>. Clausery is free and open source (AGPLv3); hosted copies that keep the Clausery name require a <a href="https://getclausery.github.io/legal/license.html" rel="noopener" target="_blank">commercial license</a>, and modified copies must publish their source.';
  document.documentElement.setAttribute('data-copyguard','1');
  document.body.insertBefore(bar, document.body.firstChild);
  try { console.log('%cClausery', 'color:#fff;background:#0b5;padding:2px 6px;border-radius:3px', 'open source AGPLv3 — unlicensed copy detected. Source: https://github.com/getclausery/getclausery.github.io'); } catch(e){}
})();

/* Frame-busting: block the site from being embedded in a cross-origin iframe.
   Same-origin embeds (preview tools, dev sandboxes) are left alone. This stops
   a class of clone where someone scrapes the site and iframes it behind their
   own paywall/lead-form. X-Frame-Options cannot be set from static Pages so
   this is a JS-level enforcement; pair with the <meta http-equiv> fallback in
   the generated <head>. */
(function(){
  try {
    if (window.top === window.self) return;
    // Cross-origin access to top.location throws, which is exactly what tells us
    // we are in a foreign frame.
    const allowed = ['getclausery.github.io','getclausery.com','www.getclausery.com','clausery.app','www.clausery.app'];
    let ok = false;
    try {
      const host = window.top.location.hostname;
      if (!host) ok = true;
      else for (const a of allowed) if (host === a || host.endsWith('.' + a)) { ok = true; break; }
    } catch (e) {
      // Cross-origin = third-party frame = bust out.
      ok = false;
    }
    if (!ok) window.top.location.replace(window.self.location.href);
  } catch (e) { /* sandboxed without top access: cannot bust out, but banners still run */ }
})();
