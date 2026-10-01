// Shared HTML fragments for the static site pages (used by tools/build-site.mjs).
export const YEAR = '2026';
// The site's public origin. Every absolute URL (canonical, Open Graph, JSON-LD, sitemap, feed) is built from it.
export const SITE = 'https://getclausery.github.io/';
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
export const faqLd = (faq) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })}</script>`;
export const crumbsLd = (items) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + url })) })}</script>`;
export const faqHtml = (faq) => `<div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`;
export function head({ title, description, path, extraHead = '', ogImage = 'assets/og.png', rel: relOverride }) {
  // Search results show about 60 characters of a title; drop the brand suffix rather than have the title cut off.
  // The home title leads with what people search for (free Word templates) and keeps the product positioning.
  const full = title === 'Clausery' ? 'Clausery: free Word templates, private document automation' :`${title} · Clausery`.length <= 60 ? `${title} · Clausery` : title;
  description = clipDescription(description);
  const url = `${SITE}${path}`;
  const depth = path.split('/').filter(Boolean).length - (path.endsWith('/') || path === '' ? 0 : 1);
  const rel = relOverride || (depth > 0 ? '../'.repeat(depth) : './');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(full)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Clausery">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1b2a41">
<meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="icon" href="${rel}assets/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${rel}assets/icon-192.png">
<link rel="manifest" href="${rel}app/manifest.webmanifest">
<link rel="alternate" type="application/atom+xml" title="Clausery guides and clause library" href="${rel}feed.xml">
<link rel="stylesheet" href="${rel}site.css">
<script src="${rel}app/theme.js"></script>
<script src="${rel}site.js" defer></script>
${extraHead}
</head>
<body>
<a class="sr-only" href="#main">Skip to content</a>
${header(rel, path)}
`;
}
// Bare page for a calculator shown in an iframe on another site: no header, footer, canonical or share tags, and
// noindex so search engines credit the full tool page instead. Light by default (most host sites are), or ?theme=dark.
export function embedPage({ title, description, extraHead = '', rel, body }) {
  return `<!doctype html>
<html lang="en" data-theme="light">
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
    <a class="brand" href="${rel}"><img src="${rel}assets/icon.svg" alt="" width="30" height="30"> Clausery</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="site-nav" id="site-nav" aria-label="Site">
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
      <p>Document automation that never leaves your browser. Turn your own Word templates into guided questionnaires and generate finished documents, offline, with no account.</p>
    </div>
    <div>
      <h4>Product</h4>
      <a href="${rel}app/">Open the app</a>
      <a href="${rel}pricing/">Pricing</a>
      <a href="${rel}changelog.html">Changelog</a>
      <a href="${rel}docs/self-hosting.html">Self-hosting</a>
      <a href="${rel}press/">Press kit</a>
    </div>
    <div>
      <h4>Resources</h4>
      <a href="${rel}templates/">Free templates</a>
      <a href="${rel}nda-templates/">NDA templates</a>
      <a href="${rel}guides/">Guides</a>
      <a href="${rel}clauses/">Clause library</a>
      <a href="${rel}free-tools/">Free tools</a>
      <a href="${rel}compare/">Compare</a>
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
      <a href="mailto:hello@clausery.app">Contact</a>
    </div>
    <div class="legal">© ${YEAR} Clausery. Clausery is software, not legal advice; documents you generate are your responsibility. Not affiliated with Microsoft; Word is a trademark of Microsoft Corporation.</div>
  </div>
</footer>
</body>
</html>
`;
}
export function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
export function docsNav(rel, path) {
  const items = [
    ['Start here', [['docs/', 'Getting started'], ['docs/templates.html', 'Template syntax'], ['docs/questionnaire.html', 'Designing the questionnaire'], ['docs/logic.html', 'Logic & calculations']]],
    ['Working with clients', [['docs/intake.html', 'Client intake forms'], ['docs/teams.html', 'Teams & template packs'], ['docs/backups.html', 'Backups & data']]],
    ['Trust', [['docs/security.html', 'Security'], ['docs/self-hosting.html', 'Self-hosting'], ['docs/faq.html', 'FAQ']]],
  ];
  return `<nav class="docs-nav" aria-label="Documentation">${items.map(([h, links]) => `<h4>${h}</h4>${links.map(([p, l]) => `<a href="${rel}${p}"${p === path ? ' aria-current="page"' : ''}>${l}</a>`).join('')}`).join('')}</nav>`;
}
