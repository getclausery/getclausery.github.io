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
import { CONTACT_URL, KEY_REQUEST_URL, REPO_URL, CONTACT_EMAIL, mailto, keyRequestUrl } from '../app/config.js';
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
const SITE_ANALYTICS = readFileSync(new URL('../site.js', import.meta.url), 'utf8').match(/const CLAUSERY_ANALYTICS = \{ token: '([^']*)', since: '([^']*)', host: '[^']*' \};/);
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
  const articleMeta = ogType === 'article' ? `${published ? `<meta property="article:published_time" content="${published}">\n` : ''}${modified ? `<meta property="article:modified_time" content="${modified}">\n` : ''}` : '';
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
<meta name="theme-color" content="#1b2a41">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="author" content="Clausery">
<meta name="generator" content="Clausery ${SITE} — AGPL-3.0-or-later open source">
<meta name="original-source" content="${url}">
<meta name="color-scheme" content="light dark">
<meta name="format-detection" content="telephone=no">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
<meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=(), display-capture=()">
<link rel="icon" href="${rel}assets/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${rel}assets/icon-192.png">
<link rel="manifest" href="${rel}app/manifest.webmanifest">
<link rel="search" type="application/opensearchdescription+xml" title="Clausery templates" href="${rel}opensearch.xml">
<link type="text/plain" rel="author" href="${rel}humans.txt">
<link rel="alternate" type="application/atom+xml" title="Clausery guides and clause library" href="${rel}feed.xml">
<link rel="alternate" hreflang="en-GB" href="${url}">
<link rel="alternate" hreflang="en" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<link rel="preconnect" href="https://api.lemonsqueezy.com" crossorigin>
<link rel="dns-prefetch" href="https://api.lemonsqueezy.com">
<link rel="preconnect" href="https://static.cloudflareinsights.com" crossorigin>
<link rel="dns-prefetch" href="https://static.cloudflareinsights.com">
<link rel="preconnect" href="https://getclausery.goatcounter.com" crossorigin>
<link rel="dns-prefetch" href="https://getclausery.goatcounter.com">
<link rel="stylesheet" href="${rel}site.css">
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://getclausery.goatcounter.com; font-src 'self' data:; connect-src 'self' https://api.lemonsqueezy.com https://getclausery.goatcounter.com; worker-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'self'; upgrade-insecure-requests">
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
<link rel="icon" href="${rel}assets/icon.svg" type="image/svg+xml">
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
  return `<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${rel}"><img src="${rel}assets/icon.svg" alt="" width="30" height="30" decoding="async"> Clausery</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="site-nav" id="site-nav" aria-label="Site">
      <a href="${rel}invoice-templates/"${cur('invoice-templates/')}>Invoices</a>
      <a href="${rel}templates/"${cur('templates/')}>Templates</a>
      <a href="${rel}#features">Features</a>
      <a href="${rel}pricing/"${cur('pricing/')}>Pricing</a>
      <a href="${rel}docs/"${cur('docs/')}>Docs</a>
      <a href="${rel}docs/security.html"${path === 'docs/security.html' ? ' aria-current="page"' : ''}>Security</a>
      <a class="btn btn-primary" href="${rel}app/">Open the app</a>
    </nav>
  </div>
</header>
<main id="main" tabindex="-1">`;
}
export function footer(rel) {
  return `</main>
<footer class="site-footer">
  <div class="wrap">
    <div>
      <h4>Clausery</h4>
      <p>Make invoices, quotes and receipts in Word with the maths done for you. Your documents stay in your browser; no account is needed.</p>
    </div>
    <div>
      <h4>Product</h4>
      <a href="${rel}app/">Open the app</a>
      <a href="${rel}pricing/">Pricing</a>
      <a href="${rel}why-clausery/">Why Clausery</a>
      <a href="${rel}changelog.html">Changelog</a>
      <a href="${rel}status/">Status</a>
      <a href="${rel}docs/self-hosting.html">Self-hosting</a>
      <a href="${rel}roadmap/">Roadmap</a>
      <a href="${rel}press/">Press kit</a>
    </div>
    <div>
      <h4>Resources</h4>
      <a href="${rel}invoice-templates/">Invoice templates</a>
      <a href="${rel}invoice-templates/deposit-invoice.html">Deposit invoice</a>
      <a href="${rel}invoice-templates/hourly-invoice.html">Hourly invoice</a>
      <a href="${rel}invoice-templates/final-invoice.html">Final invoice</a>
      <a href="${rel}templates/">Free templates</a>
      <a href="${rel}nda-templates/">NDA templates</a>
      <a href="${rel}guides/">Guides</a>
      <a href="${rel}clauses/">Clause library</a>
      <a href="${rel}free-tools/">Free tools</a>
      <a href="${rel}compare/">Compare</a>
      <a href="${rel}for/">Who it's for</a>
      <a href="${rel}for/law-firms.html">For law firms</a>
      <a href="${rel}for/hr-teams.html">For HR teams</a>
      <a href="${rel}for/consultants.html">For consultants</a>
      <a href="${rel}for/freelancers.html">For freelancers</a>
      <a href="${rel}for/landlords.html">For landlords</a>
    </div>
    <div>
      <h4>Docs</h4>
      <a href="${rel}docs/">Getting started</a>
      <a href="${rel}docs/templates.html">Template syntax</a>
      <a href="${rel}docs/logic.html">Logic &amp; calculations</a>
      <a href="${rel}docs/intake.html">Client intake</a>
      <a href="${rel}docs/security.html">Security</a>
    </div>
    <div>
      <h4>Legal</h4>
      <a href="${rel}legal/privacy.html">Privacy</a>
      <a href="${rel}legal/terms.html">Terms</a>
      <a href="${rel}legal/dpa.html">Data processing</a>
      <a href="${rel}legal/license.html">Open-source license</a>
      <a href="${rel}legal/dmca.html">Takedowns &amp; DMCA</a>
      <a href="${rel}about/">About</a>
      <a href="${rel}contact/">Contact</a>
    </div>
    <div class="legal">© ${YEAR} Clausery. Open source under <a href="${rel}legal/license.html" style="color:inherit">AGPLv3</a> · Clausery name and logo are <a href="${REPO_URL}/blob/main/TRADEMARKS.md" rel="noopener" style="color:inherit">trademarks</a>. Clausery is software, not legal advice; documents you generate are your responsibility. Not affiliated with Microsoft; Word is a trademark of Microsoft Corporation. <a href="${REPO_URL}" rel="noopener" style="color:inherit">Source on GitHub</a></div>
  </div>
</footer>
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
