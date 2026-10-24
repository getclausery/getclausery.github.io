import { readFileSync } from 'node:fs';
// Shared HTML fragments for the static site pages (used by tools/build-site.mjs).
// YEAR is taken from the build clock so the footer never needs a manual bump.
export const YEAR = String(new Date().getUTCFullYear());
/* The theme script is 260 bytes and decides the colours before the first paint. Inlining it removes a
   render-blocking request from every page (the file stays in app/ for the app itself and for cached copies). */
const THEME_FILE = readFileSync(new URL('../app/theme.js', import.meta.url), 'utf8');
export const THEME_INLINE = THEME_FILE.replace(/^\/\*[\s\S]*?\*\/\s*/, '').replace(/^\/\/[^\n]*\n/, '').replace(/\n?try /, 'try ').trim();
/** A responsive picture: WebP sources with the original raster as the fallback. Dimensions are always set so the
    browser reserves the box and the layout does not shift while the image loads. */
export function picture({ src, webp, width, height, alt, sizes = '100vw', loading = 'lazy', fetchpriority, className = '' }) {
  const srcset = Array.isArray(webp) ? webp.map(([url, w]) => `${url} ${w}w`).join(', ') : webp;
  return `<picture>${srcset ? `<source type="image/webp" srcset="${srcset}" sizes="${sizes}">` : ''}<img src="${src}" width="${width}" height="${height}" alt="${esc(alt)}" loading="${loading}" decoding="async"${fetchpriority ? ` fetchpriority="${fetchpriority}"` : ''}${className ? ` class="${className}"` : ''}></picture>`;
}
// Contact and repository links come from the app's deployment config, so the site and the app never disagree.
import { CONTACT_URL, KEY_REQUEST_URL, REPO_URL, CONTACT_EMAIL, mailto, keyRequestUrl, APP_VERSION } from '../app/config.js';
export { CONTACT_URL, KEY_REQUEST_URL, REPO_URL, CONTACT_EMAIL, mailto, keyRequestUrl };
// The site's public origin. Every absolute URL (canonical, Open Graph, JSON-LD, sitemap, feed) is built from it.
export const SITE = 'https://getclausery.github.io/';

/* Copyright management information (17 U.S.C. §1202). This HTML comment is
   injected at the top of every generated page and into bundled JS. Removing or
   altering it to conceal the origin of a copy is itself a copyright violation
   separate from any AGPL or trademark breach, and is the statutory hook for a
   DMCA takedown against sites that strip the visible footer. */
export const CMI_HTML = `<!--
  Clausery <${SITE}> — original open-source project.
  (C) ${YEAR} Clausery. License: AGPL-3.0-or-later WITH Clausery-Trademark-Exception.
  Removing this notice or the visible attribution in the footer is a removal of
  copyright management information under 17 U.S.C. §1202 and violates s5 of the AGPL.
  Source: ${REPO_URL}  ·  License terms: ${SITE}legal/license.html
  Trademark policy: ${REPO_URL}/blob/main/TRADEMARKS.md
-->`;
export const CMI_JS = `/* Clausery <${SITE}> (C) ${YEAR} Clausery. AGPL-3.0-or-later WITH Clausery-Trademark-Exception. Removing this notice is removal of CMI under 17 U.S.C. 1202. Source: ${REPO_URL} */`;
/* Cookieless page-view counts: site.js loads Cloudflare Web Analytics on website pages when its token is set.
   The token and the date it went live live in site.js only; the build reads them here to keep the privacy wording accurate. */
const SITE_ANALYTICS = readFileSync(new URL('../site.js', import.meta.url), 'utf8').match(/const\s+CLAUSERY_ANALYTICS\s*=\s*\{\s*token\s*:\s*'([^']*)'\s*,\s*since\s*:\s*'([^']*)'\s*,\s*host\s*:\s*'[^']*'\s*\}\s*;/);
if (!SITE_ANALYTICS) throw new Error('site.js: CLAUSERY_ANALYTICS settings line not found');
export const ANALYTICS_TOKEN = SITE_ANALYTICS[1];
export const ANALYTICS_SINCE = SITE_ANALYTICS[2];
export const ANALYTICS_ON = Boolean(ANALYTICS_TOKEN);
export const ANALYTICS_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';
/* Keys sold through the online checkout are checked with Lemon Squeezy's License API (app/lib/onlinelicense.js). The
   site describes that only once checkout is live; until then every key is an offline CLSY- key. */
import { CHECKOUT_URLS, CHECKOUT_SINCE, LICENSE_SERVICE, USAGE_COUNTER } from '../app/config.js';
/* Anonymous app usage counts (app/lib/usage.js): the privacy wording describes them only once an endpoint is set. */
export const USAGE_ON = Boolean(USAGE_COUNTER.endpoint);
export const USAGE_SINCE = USAGE_COUNTER.since;
/** The one request the app makes beyond its own files when counting is on, for pages that describe its network traffic. */
export const USAGE_REQUEST = 'an anonymous count to GoatCounter when the app opens, a draft starts, a document is made or a plan or the free trial is chosen, carrying only the event and, for a library template, its name';
export const ONLINE_KEYS = Object.values(CHECKOUT_URLS).some(Boolean) && Boolean(LICENSE_SERVICE.api);
export { CHECKOUT_SINCE };
/** One sentence on how keys are checked, for pages that mention licensing. */
export const LICENSE_CHECK = ONLINE_KEYS
  ? 'Keys bought online are checked with Lemon Squeezy, our payment provider, when you activate them and about once a week; only the key is sent, never your documents. Offline keys for air-gapped setups are available on request.'
  : 'License keys are verified offline with a cryptographic signature; the app never contacts a license server.';
// Placeholders a page can use for its last-modified date; tools/build-site.mjs swaps in the date from page-dates.json.
export const LASTMOD = '@@LASTMOD@@';
export const LASTMOD_LONG = '@@LASTMOD_LONG@@';
export const longDate = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
// Search results show about 155-160 characters of a description; cut longer ones at a sentence, else a word.
// A sentence cut must keep at least 130 characters: stopping at a short first sentence drops the selling point
// (the second sentence usually says what Clausery offers) and leaves a snippet Google is more likely to rewrite.
export function clipDescription(d, max = 160) {
  if (d.length <= max) return d;
  const cut = d.slice(0, max + 1);
  const stop = cut.lastIndexOf('. ');
  if (stop >= 130) return cut.slice(0, stop + 1);
  return cut.slice(0, cut.lastIndexOf(' ', max - 1)).replace(/[,;:]$/, '') + '…';
}
/** A description that fits a search snippet whole: the lead, then as many whole sentences of `text` as fit, then the
    tail if it still fits. If not even one sentence fits, lead and tail alone (or a word-boundary cut) are used. */
export function fitSnippet(text, { lead = '', tail = '', max = 158 } = {}) {
  const join = (...xs) => xs.filter(Boolean).join(' ');
  let out = lead;
  for (const sentence of String(text).match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) || []) {
    const next = join(out, sentence.trim());
    if (next.length > max) break;
    out = next;
  }
  if (out === lead && !lead) return clipDescription(join(text, tail), max);
  return join(out, tail).length <= max ? join(out, tail) : out;
}
export const faqLd = (faq) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })}</script>`;
export const crumbsLd = (items) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + url })) })}</script>`;
export const collectionLd = ({ path, name, description, items }) => `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${SITE}${path}#webpage`, url: `${SITE}${path}`, name, description,
  inLanguage: 'en-GB', isPartOf: { '@id': `${SITE}#website` },
  mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map(([itemName, itemPath], i) => ({ '@type': 'ListItem', position: i + 1, name: itemName, url: `${SITE}${itemPath}` })) },
})}</script>`;
export const faqHtml = (faq) => `<div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`;
export function head({ title, description, path, extraHead = '', pageLd = '', ogImage = 'assets/og.png', ogType = 'website', published, modified, rel: relOverride, noindex = false }) {
  // Search results show about 60 characters of a title; drop the brand suffix rather than have the title cut off.
  // The home title leads with what the site is for (small businesses making invoices in Word) and what people search for.
  // A title that already names Clausery gets no suffix (no "About Clausery · Clausery").
  const full = title === 'Clausery' ? 'Clausery: free invoice maker and Word templates' : /\bClausery\b/.test(title) ? title : `${title} · Clausery`.length <= 60 ? `${title} · Clausery` : title;
  description = clipDescription(description);
  const url = `${SITE}${path}`;
  const image = `${SITE}${ogImage}`;
  const imageAlt = `${full} — Clausery`;
  const depth = path.split('/').filter(Boolean).length - (path.endsWith('/') || path === '' ? 0 : 1);
  const rel = relOverride || (depth > 0 ? '../'.repeat(depth) : './');
  const robots = /<meta\s+[^>]*name=["']robots["']/i.test(extraHead) ? '' : `<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">\n`;
  const articleMeta = ogType === 'article' ? `${published ? `<meta property="article:published_time" content="${published}">\n` : ''}${modified ? `<meta property="article:modified_time" content="${modified}">\n` : ''}<meta property="article:author" content="Clausery"><meta property="article:publisher" content="Clausery">` : '';
  return `${CMI_HTML}
<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<title>${esc(full)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${esc(description)}">
${robots}<link rel="canonical" href="${url}">
<meta property="og:type" content="${ogType}">
<meta property="og:locale" content="en_GB">
<meta property="og:site_name" content="Clausery">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(imageAlt)}">
${articleMeta}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(full)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${image}">
<meta name="twitter:image:alt" content="${esc(imageAlt)}">
<meta name="theme-color" content="#f6f4ef" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1419" media="(prefers-color-scheme: dark)">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="author" content="Clausery">
<meta name="generator" content="Clausery ${SITE} — AGPL-3.0-or-later open source">
<meta name="original-source" content="${url}">
<meta name="color-scheme" content="light dark">
<meta name="format-detection" content="telephone=no">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
<meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=(), display-capture=()">
<link rel="icon" sizes="any" href="${rel}assets/icon.svg" type="image/svg+xml">
<link rel="icon" sizes="16x16 32x32 48x48" href="${rel}favicon.ico" type="image/x-icon">
<link rel="apple-touch-icon" href="${rel}assets/icon-192.png">
<link rel="mask-icon" href="${rel}assets/icon.svg" color="#2dd4bf">
<link rel="manifest" href="${rel}app/manifest.webmanifest">
<link rel="search" type="application/opensearchdescription+xml" title="Clausery templates" href="${rel}opensearch.xml">
<link type="text/plain" rel="author" href="${rel}humans.txt">
<link rel="license" href="${rel}legal/license.html" title="AGPL-3.0-or-later WITH Clausery-Trademark-Exception">
<link rel="security" href="${rel}.well-known/security.txt">
<link rel="sitemap" type="application/xml" title="Sitemap" href="${rel}sitemap_index.xml">
<link rel="alternate" type="application/atom+xml" title="Clausery guides and clause library" href="${rel}feed.xml">
<link rel="alternate" type="application/atom+xml" title="Clausery releases" href="${rel}releases.xml">
<link rel="alternate" hreflang="en-GB" href="${url}">
<link rel="alternate" hreflang="en" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<link rel="preconnect" href="https://static.cloudflareinsights.com" crossorigin>
<link rel="dns-prefetch" href="https://static.cloudflareinsights.com">
<link rel="stylesheet" href="${rel}site.css">
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'self'; upgrade-insecure-requests">
<script>${THEME_INLINE}</script>
<script src="${rel}site.js" defer></script>
${extraHead}${pageLd}
</head>
<body>
<a class="sr-only" href="#main">Skip to content</a>
${header(rel, path)}
`;
}
// Bare page for a calculator shown in an iframe on another site: no header, footer, canonical or share tags, and
// noindex so search engines credit the full tool page instead. Light by default (most host sites are), or ?theme=dark.
export function embedPage({ title, description, extraHead = '', rel, body }) {
  return `${CMI_HTML}
<!doctype html>
<html lang="en-GB" data-theme="light">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${esc(clipDescription(description))}">
<meta name="robots" content="noindex, follow">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="color-scheme" content="light dark">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=(), display-capture=()">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests">
<link rel="icon" sizes="any" href="${rel}assets/icon.svg" type="image/svg+xml">
<link rel="icon" sizes="16x16 32x32 48x48" href="${rel}favicon.ico" type="image/x-icon">
<link rel="mask-icon" href="${rel}assets/icon.svg" color="#2dd4bf">
<link rel="stylesheet" href="${rel}site.css">
<script src="${rel}free-tools/embed/embed.js"></script>
${extraHead}
</head>
<body class="embed">
<main id="main">
${body}
</main>
</body>
</html>
`;
}
export function header(rel, path) {
  const cur = (p) => (path.startsWith(p) && p !== '' ? ' aria-current="page"' : '');
  const I = { menu:'M4 6h16M4 12h16M4 18h16', search:'M11 4a7 7 0 100 14 7 7 0 000-14zm10 16l-4-4' };
  const ico = (d,s=18)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  return `<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${rel}"><img src="${rel}assets/icon.svg" alt="" width="28" height="28" decoding="async"> Clausery</a>
    <button class="nav-search" id="nav-search" type="button" aria-label="Search or jump to… (⌘K)">
      ${ico(I.search,16)}<span>Search or jump to…</span><kbd>⌘K</kbd>
    </button>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">${ico(I.menu)} Menu</button>
    <div class="nav-backdrop" id="nav-backdrop"></div>
    <nav class="site-nav" id="site-nav" aria-label="Site">
      <a href="${rel}app/#/start/invoice" class="nav-mobile-head">+ Start an invoice</a>
      <a href="${rel}templates/"${cur('templates/')}>Templates</a>
      <a href="${rel}invoice-templates/"${cur('invoice-templates/')}>Invoices</a>
      <a href="${rel}guides/"${cur('guides/')}>Guides</a>
      <a href="${rel}pricing/"${cur('pricing/')}>Pricing</a>
      <a href="${rel}docs/"${cur('docs/')}>Docs</a>
      <a class="btn btn-primary btn-sm" href="${rel}app/#/start/invoice">Make an invoice <span class="arr">→</span></a>
    </nav>
  </div>
</header>
<div class="welcome-bar" id="welcome-bar" role="region" aria-label="Welcome back">
  <div class="wrap">
    <span class="wb-dot" aria-hidden="true"></span>
    <span><strong id="wb-msg">Welcome back</strong> <span class="wb-meta" id="wb-meta"></span></span>
    <span class="wb-spacer"></span>
    <a class="wb-cta" id="wb-cta" href="${rel}app/#/drafts">Continue <span class="arr">→</span></a>
    <button class="wb-dismiss" type="button" aria-label="Dismiss" id="wb-dismiss">${ico('M6 6l12 12M18 6L6 18',16)}</button>
  </div>
</div>
<main id="main" tabindex="-1">`;
}
export function footer(rel) {
  const I = { github:'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22', rss:'M4 11a9 9 0 019 9M4 4a16 16 0 0116 16M5 19a1 1 0 100-2 1 1 0 000 2z', arrowUp:'M12 19V5M5 12l7-7 7 7' };
  const ico = (d,s=16)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  return `</main>
<div class="read-progress" id="read-progress" aria-hidden="true"></div>
<div class="float-actions">
  <a class="scroll-cta" id="scroll-cta" href="${rel}app/#/drafts" aria-label="Pick up where you left off — open your saved drafts">
    ${ico('M3 12a9 9 0 1 0 3-6.7M3 4v5h5',15)}
    <span id="scroll-cta-label">Continue drafting</span>
  </a>
  <button class="to-top" id="to-top" type="button" aria-label="Back to top">${ico(I.arrowUp,15)} Top</button>
</div>
<div class="cmdk-backdrop" id="cmdk" role="dialog" aria-modal="true" aria-label="Search and jump to" hidden>
  <div class="cmdk" role="combobox" aria-expanded="true" aria-haspopup="listbox" aria-owns="cmdk-list">
    <div class="cmdk-bar">
      ${ico('M11 4a7 7 0 100 14 7 7 0 000-14zm10 16l-4-4',20)}
      <input id="cmdk-input" type="text" placeholder="Search templates, guides, pages, actions…" autocomplete="off" autocapitalize="off" spellcheck="false" aria-controls="cmdk-list" aria-label="Search">
      <kbd>Esc</kbd>
    </div>
    <div class="cmdk-body" id="cmdk-list" role="listbox"></div>
    <div class="cmdk-footer"><span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>⌘K</kbd> close</span></div>
  </div>
</div>
<footer class="site-footer">
  <div class="wrap">
    <div class="brand-col">
      <a class="brand" href="${rel}"><img src="${rel}assets/icon.svg" alt="" width="28" height="28" decoding="async"> Clausery</a>
      <p style="margin-top:.75rem">Make invoices, quotes and receipts in Word with the maths done for you. Your documents stay in your browser — no account required.</p>
      <div class="footer-social">
        <a href="${REPO_URL}" rel="noopener" aria-label="Source on GitHub">${ico(I.github)}</a>
        <a href="${rel}releases.xml" aria-label="Releases Atom feed">${ico(I.rss)}</a>
      </div>
    </div>
    <div>
      <h4>Product</h4>
      <a href="${rel}app/">Open the app</a>
      <a href="${rel}app/#/drafts">Your drafts</a>
      <a href="${rel}templates/">Templates</a>
      <a href="${rel}invoice-templates/">Invoices</a>
      <a href="${rel}pricing/">Pricing</a>
      <a href="${rel}free-tools/">Free tools</a>
      <a href="${rel}changelog.html">Changelog</a>
    </div>
    <div>
      <h4>Learn</h4>
      <a href="${rel}docs/">Getting started</a>
      <a href="${rel}guides/">Guides</a>
      <a href="${rel}clauses/">Clause library</a>
      <a href="${rel}docs/templates.html">Template syntax</a>
      <a href="${rel}docs/logic.html">Calculations</a>
      <a href="${rel}docs/security.html">Security</a>
      <a href="${rel}compare/">Compare</a>
    </div>
    <div>
      <h4>Company</h4>
      <a href="${rel}about/">About</a>
      <a href="${rel}customers/">Customers</a>
      <a href="${rel}why-clausery/">Why Clausery</a>
      <a href="${rel}self-hosting/">Self-host / Enterprise</a>
      <a href="${rel}roadmap/">Roadmap</a>
      <a href="${rel}status/">Status</a>
      <a href="${rel}contact/">Contact</a>
    </div>
    <div>
      <h4>Legal</h4>
      <a href="${rel}legal/privacy.html">Privacy</a>
      <a href="${rel}legal/terms.html">Terms</a>
      <a href="${rel}legal/dpa.html">Data processing</a>
      <a href="${rel}legal/license.html">Open-source license</a>
      <a href="${rel}legal/dmca.html">DMCA</a>
      <a href="${rel}press/">Press kit</a>
    </div>
    <div class="legal">© ${YEAR} Clausery · <a href="${rel}changelog.html#v${APP_VERSION.replace(/\./g,'-')}" style="color:inherit">v${APP_VERSION}</a> · Open source under <a href="${rel}legal/license.html" style="color:inherit">AGPLv3</a> · Clausery name and logo are <a href="${REPO_URL}/blob/main/TRADEMARKS.md" rel="noopener" style="color:inherit">trademarks</a>. Clausery is software, not legal advice; documents you generate are your responsibility. Not affiliated with Microsoft; Word is a trademark of Microsoft Corporation. Not affiliated with clausery.ai. <a href="${REPO_URL}" rel="noopener" style="color:inherit">Source on GitHub</a></div>
  </div>
</footer>
<script id="search-index" type="application/json" data-src="${rel}search-index.json" defer></script>
</body>
</html>
`;
}
// Lower-cases a name for use mid-sentence without breaking acronyms: "Mutual NDA" -> "mutual NDA", "HR teams" stays "HR teams".
export const lowerFirst = (s) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
export function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
export function docsNav(rel, path) {
  const items = [
    ['Start here', [['docs/', 'Getting started'], ['docs/templates.html', 'Template syntax'], ['docs/questionnaire.html', 'Designing the questionnaire'], ['docs/logic.html', 'Logic & calculations']]],
    ['Working with clients', [['docs/intake.html', 'Client intake forms'], ['docs/teams.html', 'Teams & template packs'], ['docs/backups.html', 'Backups & data']]],
    ['Trust', [['docs/security.html', 'Security'], ['docs/self-hosting.html', 'Self-hosting'], ['docs/faq.html', 'FAQ']]],
  ];
  return `<nav class="docs-nav" aria-label="Documentation">${items.map(([h, links]) => `<h4>${h}</h4>${links.map(([p, l]) => `<a href="${rel}${p}"${p === path ? ' aria-current="page"' : ''}>${l}</a>`).join('')}`).join('')}</nav>`;
}
