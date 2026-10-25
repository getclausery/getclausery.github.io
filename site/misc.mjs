import { USAGE_ON, SITE } from '../tools/partials.mjs';
import { TRIAL_DAYS, REFUND_DAYS } from '../app/config.js';

// Machine-readable release list, newest first, used to build releases.xml (Atom) and kept in sync
// with the HTML changelog below. Date format is "D MMMM YYYY" (English, UTC). summary is a one-line
// description used as the Atom entry title and summary.
export const releases = [
  { version: '1.70.0', date: '24 October 2026', summary: 'offline.html icon/manifest/license/security/search autodiscovery parity' },
  { version: '1.69.0', date: '24 October 2026', summary: 'PWA shortcut icons; generic-form-factor screenshot in manifest' },
  { version: '1.68.0', date: '24 October 2026', summary: 'PWA manifest display_override/lang/dir; OpenSearch autodiscovery on app, activate, /go/' },
  { version: '1.67.0', date: '24 October 2026', summary: 'offline.html CSP and Permissions-Policy; every served HTML page now carries a CSP' },
  { version: '1.66.0', date: '24 October 2026', summary: 'CSP blob: removed from marketing img-src; X-Content-Type-Options on embed/go/activate/offline' },
  { version: '1.65.0', date: '24 October 2026', summary: 'Tightened marketing CSP + preconnects to the origins marketing pages actually load' },
  { version: '1.64.0', date: '24 October 2026', summary: '<link rel="security"> autodiscovery for .well-known/security.txt on every page' },
  { version: '1.63.0', date: '24 October 2026', summary: 'Open Graph article:author and article:publisher on guides and clauses' },
  { version: '1.62.0', date: '24 October 2026', summary: '/go/ social page CSP; activate.html security/theme/icon parity' },
  { version: '1.61.0', date: '24 October 2026', summary: 'offline.html and app/activate.html lang attribute set to en-GB (consistency)' },
  { version: '1.60.0', date: '24 October 2026', summary: 'App shell + activate page preconnect to the live origins they hit on load' },
  { version: '1.59.0', date: '24 October 2026', summary: 'Dedicated maskable PWA icons; legacy favicon.ico fallback' },
  { version: '1.58.0', date: '24 October 2026', summary: 'LemonSqueezy preconnect now only emitted on the Pricing page (the only marketing page that loads checkout)' },
  { version: '1.57.0', date: '24 October 2026', summary: 'Social /go/ page security header parity (X-Frame-Options, Referrer-Policy, Permissions-Policy)' },
  { version: '1.56.0', date: '24 October 2026', summary: 'Social link-in-bio page: mask-icon, sizes=any favicon, dark theme-color' },
  { version: '1.55.0', date: '24 October 2026', summary: 'BreadcrumbList JSON-LD on Pricing, Why Clausery and Business Kit pages' },
  { version: '1.54.0', date: '24 October 2026', summary: 'Safari mask-icon link; favicon sizes=any everywhere; dark theme-color correction' },
  { version: '1.53.0', date: '24 October 2026', summary: 'Light/dark theme-color, PWA app-capable meta, sitemap autodiscovery link' },
  { version: '1.52.0', date: '24 October 2026', summary: 'HTML rel=license link on every page' },
  { version: '1.51.0', date: '24 October 2026', summary: 'PWA/metadata polish: manifest disambiguation, shortcuts, 404 search, security.txt source' },
  { version: '1.50.0', date: '24 October 2026', summary: 'Stronger disambiguation from clausery.ai across every AI-visible surface' },
  { version: '1.49.0', date: '23 October 2026', summary: 'Local invoice tracker: mark invoices sent/paid, overdue badges, reminder email' },
  { version: '1.48.0', date: '23 October 2026', summary: 'SoftwareApplication Offer schema includes direct checkout URLs' },
  { version: '1.46.0', date: '23 October 2026', summary: 'llms.txt expanded to cover all indexable marketing sections' },
  { version: '1.45.0', date: '23 October 2026', summary: 'Made-with FAQPage schema matches visible questions exactly' },
  { version: '1.44.0', date: '23 October 2026', summary: 'AI crawler guidance + copyright well-known endpoint' },
  { version: '1.43.0', date: '23 October 2026', summary: 'Home-page "What\'s new" release pill linking to the changelog' },
  { version: '1.42.0', date: '23 October 2026', summary: 'Self-hosting / Enterprise marketing page' },
  { version: '1.41.0', date: '23 October 2026', summary: 'SiteNavigationElement JSON-LD on the home page' },
  { version: '1.40.0', date: '23 October 2026', summary: 'Version badge in footer links to the changelog' },
  { version: '1.39.0', date: '23 October 2026', summary: 'Pricing trust chips and vendor-source labeling on comparisons' },
  { version: '1.38.0', date: '23 October 2026', summary: '/.well-known/privacy-policy + terms-of-service, stronger made-with landing' },
  { version: '1.37.0', date: '23 October 2026', summary: '/.well-known/support redirect (RFC 9405)' },
  { version: '1.36.1', date: '23 October 2026', summary: 'Richer SoftwareApplication schema (all paid offers)' },
  { version: '1.36.0', date: '23 October 2026', summary: 'Customers page and releases Atom feed' },
  { version: '1.35.0', date: '23 October 2026', summary: 'UI upgrade, pricing redesign, status and roadmap pages' },
  { version: '1.34.0', date: '15 October 2026', summary: `${TRIAL_DAYS}-day no-card Pro trial and ${REFUND_DAYS}-day money-back guarantee` },
  { version: '1.33.0', date: '9 October 2026', summary: 'Invoice email generator and four message templates' },
  { version: '1.32.1', date: '9 October 2026', summary: 'Lemon Squeezy return-link activation fix' },
  { version: '1.32.0', date: '9 October 2026', summary: 'One-click online checkout with automatic activation' },
  { version: '1.31.0', date: '9 October 2026', summary: 'Online checkout via Lemon Squeezy' },
  { version: '1.30.0', date: '9 October 2026', summary: 'Payment receipt guide and Word receipt page' },
  { version: '1.29.0', date: '9 October 2026', summary: 'Save an invoice as PDF guide and improved print flow' },
  { version: '1.28.0', date: '8 October 2026', summary: 'Free small business document kit and press kit' },
];

export const pages = [
  {
    path: '404.html', title: 'Page not found', description: 'The page you were looking for does not exist.',
    extraHead: '<meta name="robots" content="noindex, follow">', _404: true,
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:44rem"><p class="eyebrow">404 — page not found</p><h1>That page is not here.</h1><p class="lead">The address may be wrong or the page moved. Nothing you type in Clausery is stored on a server, so there is nothing to recover from a broken link — but what you were looking for is probably one click away.</p><div class="grid grid-2" style="margin-top:1.5rem"><a class="feature" href="${rel}app/#/start/invoice"><div class="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg></div><h3>Make a free invoice →</h3><p>60-second start; editable Word file; totals, tax and numbering done for you.</p></a><a class="feature" href="${rel}templates/"><div class="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></div><h3>Browse ${87}+ free templates</h3><p>Invoices, contracts, NDAs, letters, forms and more — all editable Word.</p></a></div><h2 style="margin-top:2rem;font-size:1.1rem">Popular starting points</h2><ul class="link-list" style="columns:2 12rem;column-gap:2rem;margin-top:.5rem"><li><a href="${rel}invoice-templates/">Invoice templates</a></li><li><a href="${rel}invoice-templates/deposit-invoice.html">Deposit invoice</a></li><li><a href="${rel}invoice-templates/final-invoice.html">Final invoice</a></li><li><a href="${rel}templates/quote.html">Price quote</a></li><li><a href="${rel}templates/payment-receipt.html">Payment receipt</a></li><li><a href="${rel}templates/mutual-nda.html">Mutual NDA</a></li><li><a href="${rel}templates/independent-contractor-agreement.html">Independent contractor agreement</a></li><li><a href="${rel}guides/">All guides</a></li><li><a href="${rel}pricing/">Pricing</a></li><li><a href="${rel}docs/security.html">Security & privacy</a></li></ul><div id="suggested" hidden><h2 style="margin-top:2rem;font-size:1.1rem">Were you looking for…?</h2><ul class="link-list" id="suggested-list" style="columns:2 12rem;column-gap:2rem;margin-top:.5rem"></ul></div><div class="actions" style="display:flex;gap:.75rem;margin-top:1.75rem;flex-wrap:wrap"><button class="btn btn-primary" type="button" onclick="(document.getElementById('nav-search')||{}).click?.()">Search the site <span class="arr">→</span></button><a class="btn" href="${rel}">Home page</a><a class="btn btn-ghost" href="${rel}app/">Open the app</a></div></div></section>`,
  },
  {
    path: 'search/', title: 'Search free Word templates and guides',
    description: 'Search 87+ free Word templates, invoices, NDAs, contracts, letters and plain-English guides. Every result is a real page you can read or download — no account required.',
    extraHead: `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'SearchResultsPage', '@id': `${SITE}search/#webpage`, url: `${SITE}search/`, name: 'Search free Word templates and guides', description: 'Search 87+ free Word templates, invoices, NDAs, contracts, letters and plain-English guides. Every result is a real page you can read or download — no account required.', inLanguage: 'en-GB', isPartOf: { '@id': `${SITE}#website` } })}</script>`,
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem">
<p class="eyebrow">Search</p>
<h1>Search free templates, invoices and guides</h1>
<p class="lead">Type what you are looking for — for example <a href="${rel}search/?q=invoice"><em>invoice</em></a>, <a href="${rel}search/?q=nda"><em>NDA</em></a>, <a href="${rel}search/?q=late+payment"><em>late payment</em></a>, <a href="${rel}search/?q=lease"><em>lease</em></a>, <a href="${rel}search/?q=independent+contractor"><em>independent contractor</em></a> — and the matching template, calculator or guide appears below.</p>
<form class="find-form" action="${rel}search/" method="get" role="search" aria-label="Search the site" style="margin:1.5rem 0 1rem">
  <label for="site-q" class="sr-only">Search</label>
  <input id="site-q" type="search" name="q" placeholder="invoice, NDA, lease, late payment…" autocomplete="off" spellcheck="false" autofocus>
  <button class="btn btn-primary" type="submit">Search <span class="arr">→</span></button>
</form>
<p class="small muted" role="status" aria-live="polite" id="site-q-status">Start typing to filter results, or press Enter to load the full page.</p>
<div id="site-q-results" aria-live="polite">
  <h2 style="margin-top:2rem;font-size:1.1rem">Popular searches</h2>
  <ul class="link-list" style="columns:2 14rem;column-gap:2rem;margin-top:.5rem">
    <li><a href="${rel}invoice-templates/">Invoice templates</a></li>
    <li><a href="${rel}templates/quote.html">Quote template</a></li>
    <li><a href="${rel}templates/payment-receipt.html">Payment receipt</a></li>
    <li><a href="${rel}templates/mutual-nda.html">Mutual NDA</a></li>
    <li><a href="${rel}templates/independent-contractor-agreement.html">Independent contractor agreement</a></li>
    <li><a href="${rel}templates/employment-agreement.html">Employment agreement</a></li>
    <li><a href="${rel}nda-templates/">All NDA templates</a></li>
    <li><a href="${rel}templates/liability-waiver.html">Liability waiver</a></li>
    <li><a href="${rel}templates/residential-lease-agreement.html">Residential lease</a></li>
    <li><a href="${rel}templates/non-solicitation-agreement.html">Non-solicitation</a></li>
    <li><a href="${rel}guides/how-to-write-an-invoice.html">How to write an invoice</a></li>
    <li><a href="${rel}free-tools/invoice-due-date.html">Invoice due date calculator</a></li>
  </ul>
</div>
<p style="margin-top:2rem">Prefer to browse? <a href="${rel}templates/">All templates by category</a> · <a href="${rel}invoice-templates/">Invoices by trade / country</a> · <a href="${rel}guides/">All guides</a> · <a href="${rel}free-tools/">Free calculators</a>.</p>
<noscript><p class="small muted">Search needs JavaScript in your browser, but every page is linked from <a href="${rel}">Home</a>, <a href="${rel}templates/">Templates</a> or <a href="${rel}guides/">Guides</a>.</p></noscript>
</div></section>`,
  },
  {
    path: 'changelog.html', title: 'Changelog', description: 'Release notes for Clausery, newest first: the free templates, guides, calculators and app features added in each version.',
    body: (rel) => `<section class="section"><div class="wrap prose">
<h1>Changelog <a href="${rel}releases.xml" style="font-size:.8rem;font-weight:500;vertical-align:middle;margin-left:.5rem" title="Subscribe to releases (Atom feed)"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true" style="vertical-align:-2px"><path d="M6.18 15.64a2.18 2.18 0 012.18 2.18M4 4.44A15.56 15.56 0 0119.56 20M4 10.75a9.25 9.25 0 019.25 9.25" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Atom feed</a></h1>
<h2 id="v2-8-0">2.8.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>Copy fix + humans.txt wording.</strong> Fixed one remaining "independent open-source project" reference in <code>humans.txt</code> (the human-readable credits file) to "independent open-source business", matching the About, footer and JSON-LD copy sweep from v1.72.2.</li></ul>
<h2 id="v2-7-0">2.7.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>Freshness badges across all hub pages.</strong> The "Updated Mmm YYYY" pill introduced on the Templates hub in v2.6.0 now appears on every listing card across the Clauses library (24), Free tools (9), Who it's for audience hubs (5) and Invoice templates by workflow/trade/country (5+10+6 = 21). Each card's badge pulls from that page's real last-modified date with a full-date tooltip, surfacing a visible freshness signal on every hub listing surface.</li></ul>
<h2 id="v2-6-0">2.6.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>Freshness badges on template hub cards.</strong> Every template card on the Templates hub now shows a pill "Updated Mmm YYYY" label pulled from the page's real last-modified date, surfacing which templates have been revised most recently and giving users (and quality raters) a visible freshness signal before they click into a page.</li></ul>
<h2 id="v2-5-0">2.5.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>Software application entity + TableOfContents schema across the site.</strong> Every page now emits a <code>WebApplication</code>/<code>SoftwareApplication</code> JSON-LD node describing Clausery (free, in-browser Word document generator, BusinessApplication category, isAccessibleForFree=true, Offer price=0, license) and a <code>SoftwareSourceCode</code> node pointing at the GitHub repository, tying every long-form page to the product it describes via <code>mentions</code>. Pages with a visible "On this page" TOC (all clauses, templates and multi-section guides) now also emit <code>TableOfContents</code> JSON-LD with <code>ListItem</code> jump anchors, which unlocks the mobile "Jump to" section strip in Google SERPs.</li></ul>
<h2 id="v2-4-0">2.4.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>Main-navigation schema.</strong> The header <code>&lt;nav&gt;</code> now carries <code>SiteNavigationElement</code> RDFa microdata (<code>itemprop="url"</code>/<code>itemprop="name"</code> on each top-level link) plus a matching JSON-LD node (<code>@id #sitenav</code>) on every page, helping crawlers identify the primary navigation for breadcrumb/sitelink extraction. (The Sitelinks Searchbox was already shipped in v1.76 and continues to point at <code>/search/?q={search_term_string}</code>.)</li></ul>
<h2 id="v2-3-0">2.3.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>E-E-A-T editorial team identity.</strong> New "Editorial policy &amp; review" section on the About page names the Clausery editors (practising small-business owners, contract drafters, bookkeepers) and links to the public GitHub contributors graph. A Person schema node (<code>@id /about/#editors</code>) with <code>sameAs</code>, <code>knowsAbout</code> and <code>worksFor</code> is emitted on every page; all Article/WebPage <code>reviewedBy</code>, <code>author</code> and visible bylines now reference that Person instead of a generic Organization, giving quality raters an attributable reviewer on every long-form page.</li></ul>
<h2 id="v2-2-0">2.2.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>Sibling prev/next chains for every long-form page.</strong> The crawl-chain <code>&lt;link rel="prev/next"&gt;</code> that previously only linked guides now covers all long-form sections — templates, clauses, guides, free tools, comparisons, audience, invoice and NDA pages — in source order. Each page ends with a visible Previous/Next block above the footer so readers can move through a section without returning to its hub.</li></ul>
<h2 id="v2-1-0">2.1.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>Related reading clusters</strong> on every long-form page. A server-rendered block at the foot of each page mixes matching pages from other sections (guides, templates, clauses, free tools, comparisons) scored on shared keywords — guides surface templates/clauses, templates surface their how-to guide and calculators, clauses surface templates that use them. Editorial internal links: 2588 → 3305 (+28%).</li></ul>
<h2 id="v2-0-4">2.0.4 <span class="small muted">— 25 October 2026</span></h2>
<ul><li>Visible &lt;time datetime&gt; stamps on every changelog release heading. The 71 dated entries on this page now carry machine-readable ISO <code>YYYY-MM-DD</code> dates in the DOM, matching the visible byline on guides, clauses, templates and hub pages, so crawlers and readers see the same freshness signal everywhere.</li></ul>
<h2 id="v2-0-3">2.0.3 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>E-E-A-T entity linking.</strong> Article schema adds an <code>about</code> array of Topic entities from the page's h2 sections, a full <code>image</code> ImageObject (dimensions + caption) on pages with a dedicated share card, <code>thumbnailUrl</code>, and <code>reviewedBy</code>. Every FAQPage block gets a stable <code>@id</code> linked to its page's WebPage so repeated generic FAQs are not merged into one entity.</li></ul>
<h2 id="v2-0-2">2.0.2 <span class="small muted">— 25 October 2026</span></h2>
<ul><li>Smart 404 suggestions: the not-found page now tokenises the missing URL (and any <code>#fragment</code>), scores every indexable page on word overlap, slug prefix and substring matches, and surfaces up to six "Were you looking for…?" links before the action buttons. Stale bookmarks, truncated links and renamed pages recover in one click instead of forcing a site search.</li></ul>
<h2 id="v2-0-1">2.0.1 <span class="small muted">— 25 October 2026</span></h2>
<ul><li>Added Article schema (with headline, datePublished, dateModified, lastReviewed, author and publisher) to every long-form page — all 24 clauses and 87 templates now carry a connected Article→WebPage→Organization graph alongside the existing guide Articles; Article image points at the page's own share card where one exists.</li></ul>
<h2 id="v2-0-0">2.0.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>SEO & E-E-A-T milestone.</strong> v2.0 ships the full structured-data / rich-result / content-quality pass: visible BreadcrumbList microdata on every nav (1.88), complete shared WebSite+Organization schema graph on every page (1.89), rel=prev/next topical chaining on guides (1.90), self-referencing hreflang (1.91), FAQPage on every long-form page (1.92), visible "Reviewed by / Updated" byline on guides, clauses, templates, comparisons and hubs (1.93–1.94), auto-generated meta keywords (1.95), primaryImageOfPage on every page with a share card (1.96), lastReviewed/reviewedBy on WebPage/ItemPage (1.97), rel=author and contactPoint/sameAs on the Organization node (1.98), and server-rendered "On this page" TOC with h2 anchor ids on clauses and templates (1.99). All 261 indexable pages carry a connected schema graph, a visible freshness byline, crawlable internal links and a valid share card.</li></ul>
<h2 id="v1-99-0">1.99.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>"On this page" TOC + h2 anchor ids on clauses and templates.</strong> All 24 clause pages and 87 template pages now have stable slug ids on every <code>&lt;h2&gt;</code> and a server-rendered "On this page" table of contents above the fold, matching the existing TOC on guides. This gives users a skimmable outline and Google stable named anchors for jump-to links.</li></ul>
<h2 id="v1-98-0">1.98.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>Author link + richer shared Organization node.</strong> Every page now carries <code>&lt;link rel="author" href="/about/"&gt;</code> and a <code>&lt;meta name="author" content="Clausery"&gt;</code>. The Organization schema emitted on every page now includes contactPoint (email), sameAs (GitHub repo) and full logo, matching the homepage Organization node.</li></ul>
<h2 id="v1-97-0">1.97.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>lastReviewed + reviewedBy on every WebPage/ItemPage.</strong> Every non-Article page now carries <code>lastReviewed</code> and <code>reviewedBy</code> (Organization: Clausery) schema matching the Article schema already emitted on guides, completing freshness/E-E-A-T signals across hub, comparison, tool and template pages.</li></ul>
<h2 id="v1-96-0">1.96.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>primaryImageOfPage on every page with a custom share card.</strong> Pages with a dedicated 1200×630 OG image (all 87 templates + country invoice pages) now emit <code>primaryImageOfPage</code> ImageObject on their WebPage/ItemPage schema, up from templates-only. That completes image-signal parity for all high-intent landing pages.</li></ul>
<h2 id="v1-95-0">1.95.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>Auto-generated meta keywords on every page.</strong> Every indexable page now emits a <code>&lt;meta name="keywords"&gt;</code> built from the cleaned page title and hub segment (template, guide, clause, alternative, calculator…), reinforcing topical relevance signals without duplicating description or title.</li></ul>
<h2 id="v1-94-0">1.94.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>Visible byline on every long-form page.</strong> Templates, comparisons, audience, free tools and trade invoice pages show "Reviewed by Clausery editors · Updated <time>", matching guides/clauses across all 261 indexable pages.</li></ul>
<h2 id="v1-93-0">1.93.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>Visible "Reviewed / Updated" byline on clause pages.</strong> Every clause page now shows a visible "Reviewed by Clausery editors · Updated …" line with a <code>&lt;time datetime&gt;</code> matching the JSON-LD last-modified date, giving users and crawlers an explicit freshness signal that already existed on guides.</li></ul>
<h2 id="v1-92-0">1.92.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>FAQPage on every long-form page.</strong> All 67 guides, 24 clauses and 87 templates now carry a visible "Common questions" section and matching FAQPage JSON-LD (where an author-written FAQ didn't already exist), unlocking FAQ rich-result eligibility. Broadened HowTo detection so more step-by-step guides emit HowTo schema.</li></ul>
<h2 id="v1-91-0">1.91.0 <span class="small muted">— 25 October 2026</span></h2>
<ul><li><strong>Self-referencing hreflang on every page.</strong> All 261 indexable pages now declare <code>hreflang="en"</code>, <code>hreflang="en-GB"</code> and <code>x-default</code> pointing at the canonical URL, giving Google an explicit language/region signal.</li></ul>
<h2 id="v1-90-0">1.90.0 <span class="small muted">— 25 October 2026</span></h2><ul><li><strong>Rel=prev/next on guides.</strong> Every guide carries <code>&lt;link rel="prev/next"&gt;</code> to adjacent guides, strengthening crawl chains.</li></ul>
<h2 id="v1-89-0">1.89.0 <span class="small muted">— 25 October 2026</span></h2><ul><li><strong>Schema graph on every page.</strong> Every page emits <code>WebSite</code> and <code>Organization</code> nodes inline (referenced by <code>@id</code>), so parsers see a connected graph without relying on the homepage node.</li></ul>
<h2 id="v1-88-0">1.88.0 <span class="small muted">— 25 October 2026</span></h2><ul><li><strong>Visible BreadcrumbList microdata</strong> on every page (RDFa <code>itemscope</code>/<code>itemprop</code> matching existing JSON-LD) so DOM and schema agree.</li></ul>
<h2 id="v1-87-0">1.87.0 <span class="small muted">— 24 October 2026</span></h2><ul><li><strong>Tighter template graph.</strong> Template <code>ItemPage</code> nodes reference their <code>DigitalDocument</code> by <code>@id</code>; guide Article <code>#article</code> is linked from template <code>isRelatedTo</code>.</li></ul>
<h2 id="v1-86-0">1.86.0 <span class="small muted">— 24 October 2026</span></h2><ul><li><strong>Richer template-page schema.</strong> Templates now emit <code>ItemPage</code> with <code>primaryImageOfPage</code> (share card), plus <code>headline</code>/<code>keywords</code> on the <code>DigitalDocument</code>.</li></ul>
<h2 id="v1-85-0">1.85.0 <span class="small muted">— 24 October 2026</span></h2><ul><li><strong>"Was this helpful?" widget</strong> on templates and guides; votes stored only in <code>localStorage</code>, nothing uploaded.</li></ul>
<h2 id="v1-84-0">1.84.0 <span class="small muted">— 24 October 2026</span></h2><ul><li><strong>Article freshness parity.</strong> Invoice-email, invoice-PDF and payment-receipt guides now carry <code>lastReviewed</code> and a 512×512 publisher logo ImageObject.</li></ul>
<h2 id="v1-83-0">1.83.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li><strong>Server-rendered "On this page" TOC on every guide.</strong> All 67 guides now have stable H2 anchor ids (no client randomness), a visible TOC nav before the first section, and <code>articleSection</code> in Article JSON-LD — unlocking jump-to-section links in SERPs and sharable anchor URLs.</li>
</ul>
<h2 id="v1-82-0">1.82.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li><strong>E-E-A-T byline on every guide.</strong> "Reviewed by Clausery editors" link alongside published/updated dates, an explicit editorial signal for readers and quality raters.</li>
</ul>
<h2 id="v1-81-0">1.81.0 <span class="small muted">— 24 October 2026</span></h2><ul><li>Mobile page-speed pass: CSS purged of unused rules, preconnect for analytics, eager hero images, JS deferred, render-blocking requests reduced to 1.</li></ul>
<h2 id="v1-80-0">1.80.0 <span class="small muted">— 24 October 2026</span></h2><ul><li>Year-marker (2026) titles on all 87 templates: keyword first, year bolded.</li></ul><h2 id="v1-79-0">1.79.0 <span class="small muted">— 24 October 2026</span></h2><ul><li>FAQ rich-result parity: templates use <code>faqHtml</code> microdata matching FAQPage JSON-LD; CTR titles on 16 high-volume templates.</li></ul><h2 id="v1-78-0">1.78.0 <span class="small muted">— 24 October 2026</span></h2><ul><li><strong>HowTo schema</strong> on step-by-step guides auto-extracted from numbered <code>&lt;ol&gt;</code> lists.</li></ul><h2 id="v1-77-0">1.77.0 <span class="small muted">— 24 October 2026</span></h2><ul><li>CTR-optimised hub titles with 2026 marker; <a href="sitemap/">/sitemap/</a> HTML sitemap linking every public page; tightened footer nav.</li></ul><h2 id="v1-76-0">1.76.0 <span class="small muted">— 24 October 2026</span></h2><ul><li>Crawlable <a href="search/">/search/</a> page with server-rendered popular-result links for Google Sitelinks Searchbox; WebSite <code>SearchAction</code> points at it. Home-page title/description rewritten for CTR (year + 60s time-to-result up front).</li></ul><h2 id="v1-75-0">1.75.0 <span class="small muted">— 24 October 2026</span></h2><ul><li>Home page reworked to lead with the template library; two-sentence search snippets; section sitemaps with dates under a sitemap index.</li></ul><h2 id="v1-74-0">1.74.0 <span class="small muted">— 24 October 2026</span></h2><ul><li>Five new guides; structured data on every indexable page (FAQ, pricing, breadcrumbs); taller deadline-calculator embed.</li></ul><h2 id="v1-73-0">1.73.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li><strong>Copy: Clausery is a business.</strong> Remaining "projects" wording that referred to Clausery itself, competitor features or open-source network tools replaced with "business", "tool", "product", "job" or "engagement" (Bonsai compare page, legal/license page). References to a client's project in invoices, quotes, contracts, change orders and guidance (e.g. "project fee", "if the client cancels the project") are left alone — that's the user's client work.</li>
  <li><strong>SEO / metadata sweep:</strong>
    <ul>
      <li>Organization and SoftwareApplication JSON-LD now use a proper <code>ImageObject</code> logo (512×512) instead of a bare URL, which helps Google Knowledge Panel and rich results.</li>
      <li>Added <code>browserconfig.xml</code> (Windows 10/11 tile icon + tile color), <code>msapplication-TileColor</code>, <code>msapplication-config</code>, <code>application-name</code>, <code>apple-mobile-web-app-title</code>, <code>apple-mobile-web-app-capable</code>, <code>apple-mobile-web-app-status-bar-style</code> and a generic <code>theme-color</code> fallback.</li>
      <li>Safari mask-icon color updated to match the new teal brand (<code>#0d9488</code>); <code>apple-touch-icon</code> gains an explicit <code>sizes="192x192"</code>.</li>
      <li>OpenSearch description updated: added a 192px PNG image, a self-describing URL, more tags and removed the "open-source project" wording.</li>
      <li>Reused one <code>color-scheme</code> meta instead of emitting it twice; meta tag order tightened so crawlers hit canonical, robots, OG, Twitter, theme-color in the optimal sequence.</li>
    </ul>
  </li>
  <li>Changelog and marketing copy aligned to "independent open-source business" language throughout.</li>
  <li>0 new third parties; CWV/CSP/AGPL/CMI/trademarks preserved.</li>
</ul>
<h2 id="v1-72-2">1.72.2 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Copy sweep: removed "project" from descriptions of Clausery itself (home, about, FAQ, JSON-LD, CMI header, copyguard). Clausery is described as an independent open-source business/product, not a project. References to a client's project in invoices, quotes, contracts and guidance (project description, project fee, "project cancelled" kill-fee wording) are unchanged — those describe the user's work, not Clausery.</li>
</ul>
<h2 id="v1-72-1">1.72.1 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Restored the original Clausery mark in the header and footer brand lockup (the SVG icon, not the "C" badge introduced in 1.72.0), while keeping the new header sizing, spacing and hover rotation.</li>
</ul>
<h2 id="v1-72-0">1.72.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li><strong>Command palette (⌘K / Ctrl+K / /):</strong> universal fast launcher on every page — fuzzy-search every template, invoice, guide, clause, tool and page, plus quick actions (New invoice/quote/receipt, Drafts, Pricing, Docs). Keyboard-navigable; search button in the header for mobile.</li>
  <li><strong>Returning-visitor welcome bar:</strong> if you have saved drafts, a dismissible sticky bar greets you back, names your last document and drops you into drafts. Remembered across sessions; snoozed 7 days after dismiss.</li>
  <li><strong>Redesigned navigation:</strong> shorter 58px glass header with pill links, brand-tint active state and unified search. Mobile nav is a slide-in drawer; primary CTA is "Make an invoice" instead of "Open the app".</li>
  <li><strong>Scroll-to-top button</strong> grouped with the existing "Continue drafting" floating CTA; CTA label names your actual draft when one exists.</li>
  <li><strong>Visual refresh v2:</strong> unified design tokens (OKLch accents, 18px radius, layered shadows, ambient gradient, grainless light), tighter typography, border-gradient primary button, animated 2px read-progress bar, card spotlight on hover, quieter FAQ/table/quote treatments.</li>
  <li><strong>Footer restructure</strong> into Brand/Product/Learn/Company/Legal columns; legal line adds the clausery.ai disambiguation.</li>
  <li><strong>Breadcrumbs</strong> and <strong>scroll-reveal</strong> (respects prefers-reduced-motion).</li>
  <li>No new third parties; CSP unchanged; AGPL/CMI/trademarks preserved.</li>
</ul>
<h2 id="v1-71-0">1.71.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Marketing UI refresh: softer surfaces, gentler borders and shadows, shorter glassier header, pill-shaped buttons and rounded 16px corners throughout. Cards, plans, steps and docs-cards now use subtler elevations and hover lifts so the page feels cleaner and less cluttered.</li>
  <li>Navigation polish: current-page link is now highlighted in brand tint on a soft pill, hover states are quieter, and the mobile menu button uses a matching surface.</li>
  <li>Hero tightened: the name disambiguation notice is now a compact inline pill rather than a warning box, the primary CTA uses a flat brand colour instead of a heavy gradient, and secondary entry points ("quote / receipt / kit") stay reachable without competing with the main action.</li>
  <li>Retention hook: a thin top read-progress bar tracks how far you've scrolled, and once you've scrolled past the hero (or if you have saved drafts from a previous visit), a floating "Pick up where you left off" pill returns you straight to your drafts — one click to get back to work.</li>
  <li>Footer and section dividers softened to match the new surface palette; mobile spacing tightened across hero, sections, plans and feature grids.</li>
</ul>
<h2 id="v1-70-0">1.70.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>The <code>offline.html</code> service-worker fallback now carries the same icon, manifest and autodiscovery links as every other page on the site: vector favicon with <code>sizes="any"</code>, legacy ICO favicon, Apple touch icon, Safari mask-icon, PWA manifest, <code>rel="license"</code>, <code>rel="security"</code> and the OpenSearch description. v1.61 and v1.66–v1.67 already added light/dark <code>theme-color</code>, <code>color-scheme</code>, <code>X-Content-Type-Options</code>, <code>Referrer-Policy</code>, <code>X-Frame-Options</code>, <code>Permissions-Policy</code> and a strict CSP to this page; with this change the offline fallback is visually and metadata-parity with the rest of the site when it appears.</li>
</ul>
<h2 id="v1-69-0">1.69.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>PWA manifest polish: each shortcut (New invoice, New quote, New receipt, Drafts, Templates) now carries a 192px icon so shortcut menus on Android, Windows and ChromeOS show the brand badge next to each action rather than a blank glyph. Added a second (form-factor-less) screenshot entry so mobile install prompts show the same hero screenshot (the first entry was marked <code>form_factor: "wide"</code> and thus only eligible for desktop install dialogs).</li>
</ul>
<h2 id="v1-68-0">1.68.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>PWA manifest polish: added <code>display_override</code> (<code>window-controls-overlay</code>, <code>standalone</code>, <code>minimal-ui</code>) so desktop installs on Chrome/Edge can use the window-controls-overlay custom title bar if the app opts in later; declared <code>lang: "en-GB"</code> and <code>dir: "ltr"</code> explicitly so installed-app metadata carries correct locale/direction.</li>
  <li>Added the OpenSearch description link to the app shell, the activate page and the <code>/go/</code> social landing. Marketing pages and the 404 already offered <code>&lt;link rel="search"&gt;</code>; now every page on the site advertises the template search plugin so browsers that discover OpenSearch from any entry point can add it.</li>
</ul>
<h2 id="v1-67-0">1.67.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Added a strict <code>Content-Security-Policy</code> and <code>Permissions-Policy</code> to the <code>offline.html</code> service-worker fallback page, matching the hardening of the rest of the site. v1.66 brought <code>X-Content-Type-Options</code>, <code>Referrer-Policy</code> and <code>X-Frame-Options</code> here; this adds the CSP (same-origin-only style/image/font/connect/worker, no scripts, no objects, no forms, no framing) and locks down camera/microphone/geolocation/payment/display-capture so that even the offline-failure page served from the SW cache has the same CSP profile as the rest of the app. With this, every HTML page the build emits now carries both a CSP and <code>X-Content-Type-Options: nosniff</code>, except the Google Search Console verification file.</li>
</ul>
<h2 id="v1-66-0">1.66.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Dropped <code>blob:</code> from marketing-page and 404 <code>img-src</code>. Blob: URLs are only used inside the app (for downloaded-document previews and QR/share canvases); marketing pages serve only static images from the <code>assets/</code> folder or inline <code>data:</code> URIs.</li>
  <li>Added a tightened CSP and hardening metas to the embed calculator pages (<code>free-tools/embed/*.html</code>): same-origin-only script/style/image/font/connect, <code>X-Content-Type-Options: nosniff</code>, <code>Permissions-Policy</code> locking down camera/microphone/geolocation/payment/display-capture, vector favicon with legacy ICO fallback and Safari mask-icon, dual light/dark <code>color-scheme</code>. Embeds deliberately omit <code>X-Frame-Options</code>/<code>frame-ancestors</code> because they are meant to be iframed on other sites.</li>
  <li>Added <code>X-Content-Type-Options: nosniff</code> to the <a href="${rel}go/">/go/</a> social page, <code>app/activate.html</code> and the <code>offline.html</code> service-worker fallback; also added <code>Referrer-Policy: no-referrer</code> and <code>X-Frame-Options: SAMEORIGIN</code> to the offline fallback. With this, every HTML file the build emits now carries <code>X-Content-Type-Options: nosniff</code> except the one Google Search Console verification file (which they require verbatim).</li>
</ul>
<h2 id="v1-65-0">1.65.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Tightened the marketing-site and 404 CSP + preconnect lists down to only what those pages actually load:
    <ul>
      <li>Removed <code>getclausery.goatcounter.com</code> from <code>img-src</code>/<code>connect-src</code> and its <code>preconnect</code>/<code>dns-prefetch</code>. The anonymous GoatCounter event pixel only fires inside the app (document made, draft started, plan chosen); marketing pages run Cloudflare Web Analytics only and never hit GoatCounter.</li>
      <li>Removed <code>api.lemonsqueezy.com</code> from marketing <code>connect-src</code> and its <code>preconnect</code>/<code>dns-prefetch</code>. Marketing pages only link to the hosted checkout with ordinary <code>&lt;a href&gt;</code> (top-level navigation, not a fetch or XHR), so they never make a same-tab request to the LemonSqueezy API; the app shell, activate page and purchase runtime still preconnect and allow-list it, since those pages call the license-key endpoint directly.</li>
    </ul>
    App-shell CSP/preconnects are unchanged; that is where the license-key check and anonymous event count actually fire.
  </li>
</ul>
<h2 id="v1-64-0">1.64.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Added <code>&lt;link rel="security" href="${rel}.well-known/security.txt"&gt;</code> autodiscovery on every marketing page, the 404 page, the app shell, the activate page and the <a href="${rel}go/">/go/</a> social landing, so security-researcher tooling, automated scanners and link extractors can find the security contact without guessing the standard path. Joins the existing <code>rel="author"</code> (humans.txt), <code>rel="license"</code> and <code>rel="sitemap"</code> autodiscovery links.</li>
</ul>
<h2 id="v1-63-0">1.63.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>All guide and clause pages (which declare <code>og:type=article</code>) now carry <code>article:author</code> and <code>article:publisher</code> Open Graph metas set to "Clausery", alongside the existing <code>article:published_time</code>/<code>article:modified_time</code>. Facebook/LinkedIn/Pinterest and other Open Graph consumers use these to attribute shared article cards; they were missing because the pages have no named individual author.</li>
</ul>
<h2 id="v1-62-0">1.62.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>The <a href="${rel}go/">/go/</a> social link-in-bio page now carries a full Content-Security-Policy (locked down to <code>'self'</code> — this page loads no scripts, analytics, checkouts or remote fonts). v1.57 added X-Frame-Options / Referrer-Policy / Permissions-Policy here; this adds the missing CSP header so the page is fully consistent with the rest of the site's security posture.</li>
  <li><code>app/activate.html</code> (post-checkout license activation) now matches the marketing and app shell for security and theme metadata: light/dark <code>theme-color</code> + <code>color-scheme</code>, <code>X-Frame-Options: SAMEORIGIN</code>, <code>Permissions-Policy</code> locking down camera/microphone/geolocation/payment/display-capture, <code>frame-ancestors 'self'</code> and <code>upgrade-insecure-requests</code> in the CSP, apple-touch-icon and Safari mask-icon links, and the <code>&lt;link rel="license"&gt;</code> autodiscovery link.</li>
</ul>
<h2 id="v1-61-0">1.61.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Corrected the <code>&lt;html&gt;</code> lang attribute on <code>offline.html</code> (service-worker fallback page) and <code>app/activate.html</code> (post-checkout license activation) from <code>en</code> to <code>en-GB</code>, matching every other page on the site; also added dual light/dark <code>theme-color</code> metas and a <code>color-scheme</code> meta to the offline page so the browser chrome matches when the service worker falls back to it in either mode. A consistent <code>lang</code> helps screen readers, spellcheck and language-specific search signals.</li>
</ul>
<h2 id="v1-60-0">1.60.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Added <code>preconnect</code>/<code>dns-prefetch</code> for the live origins the app shell hits on load: <code>api.lemonsqueezy.com</code> (license-key validation on Pro installs) and <code>getclausery.goatcounter.com</code> (anonymous usage count). Previously the marketing pages already preconnected these origins when they needed them, but the app shell itself — the place where those connections actually fire for every session — didn't. A matching <code>preconnect</code> for <code>api.lemonsqueezy.com</code> is now on <code>app/activate.html</code> (the post-checkout license-activation page, which always makes a key check).</li>
</ul>
<h2 id="v1-59-0">1.59.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Added dedicated maskable PWA icons at 192px and 512px (<code>assets/icon-maskable-192.png</code>, <code>assets/icon-maskable-512.png</code>). These have a full-bleed dark gradient background and the document+check glyph centered in the 80% safe zone, so Android adaptive-icon masks (circles, squircles, rounded squares) never clip the logo when Clausery is installed to the home screen. The existing icon-192/icon-512 PNGs remain as <code>purpose: any</code>; the maskable PNGs are declared separately with <code>purpose: maskable</code> so Chrome/WebView never have to guess where to crop.</li>
  <li>Added a legacy <code>favicon.ico</code> (16/32/48 multi-size) at the site root and linked it from the marketing head, 404 page, app shell, activate page and <code>/go/</code> social landing. The SVG favicon is still the primary (vector) pick for modern browsers, but the ICO fallback covers older Safari, IE-mode Edge, corporate kiosks and bookmark bars that still request <code>/favicon.ico</code> regardless of <code>&lt;link rel="icon"&gt;</code>.</li>
  <li>Updated the service-worker precache list to include icon-512 (previously omitted), both new maskable PNGs and <code>favicon.ico</code> so offline installs have all the icon assets they need.</li>
</ul>
<h2 id="v1-58-0">1.58.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>The <code>preconnect</code>/<code>dns-prefetch</code> hints for the LemonSqueezy payments origin (<code>api.lemonsqueezy.com</code>) now only get emitted on the <a href="${rel}pricing/">Pricing</a> page, which is the only marketing page that actually loads the checkout script. Previously they were injected into every marketing page and the 404, opening two unused TLS handshakes per page view. Cloudflare Insights and GoatCounter preconnects remain page-wide because those scripts fire on every marketing page visit.</li>
</ul>
<h2 id="v1-57-0">1.57.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Social <a href="${rel}go/">/go/</a> link-in-bio page now carries the same <code>X-Frame-Options: SAMEORIGIN</code>, <code>Referrer-Policy: strict-origin-when-cross-origin</code>, and <code>Permissions-Policy</code> security metas (camera, microphone, geolocation, payment, display-capture all disabled) that the marketing pages and 404 already ship. The app shell keeps <code>Referrer-Policy: no-referrer</code> because it renders user documents.</li>
</ul>
<h2 id="v1-56-0">1.56.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Social link-in-bio landing page (<a href="${rel}go/">/go/</a>) now carries <code>sizes="any"</code> on the SVG favicon, a Safari <code>mask-icon</code> link, an explicit dark <code>theme-color</code> <code>#0f1d2e</code>, and a <code>color-scheme: dark</code> hint so the in-app browser chrome on TikTok/Reels/Shorts/LinkedIn/X matches the page gradient instead of flashing the light document background.</li>
</ul>
<h2 id="v1-55-0">1.55.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Added BreadcrumbList JSON-LD to three high-intent marketing pages that were missing it: <a href="${rel}pricing/">Pricing</a>, <a href="${rel}why-clausery/">Why Clausery</a>, and the <a href="${rel}business-document-kit/">Free business document kit</a>. Templates, invoice-templates, clauses, guides, comparisons, customers, NDA templates, free tools, self-hosting and status pages already carried breadcrumb schema.</li>
</ul>
<h2 id="v1-54-0">1.54.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Added <code>&lt;link rel="mask-icon" color="#2dd4bf"&gt;</code> on marketing pages, the 404 page and the app shell for Safari pinned-tab icons.</li>
  <li>SVG favicon links now carry <code>sizes="any"</code> everywhere (marketing, 404, app) so Chrome and Edge pick the SVG for the install dialog and address bar.</li>
  <li>App dark theme-color corrected to the actual dark background <code>#0f1419</code> (was off by one shade <code>#0b1522</code>, which is the ink-surface, not the page background).</li>
</ul>
<h2 id="v1-53-0">1.53.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Light/dark <code>theme-color</code> meta on marketing pages, the 404 page and the app shell. Previously every page advertised a fixed dark-blue <code>#1b2a41</code> even when the browser was in light mode, which showed a dark flash and mismatched the address bar; now the color matches the page background for each prefers-color-scheme.</li>
  <li>App shell adds the iOS/Android PWA meta tags: <code>apple-mobile-web-app-capable</code>, <code>apple-mobile-web-app-status-bar-style</code>, <code>apple-mobile-web-app-title</code>, <code>mobile-web-app-capable</code>, <code>application-name</code>, and <code>sizes="any"</code> on the SVG favicon so Chrome/Edge pick it up for the install dialog. App <code>&lt;title&gt;</code> carries the clausery.ai disambiguation too.</li>
  <li>PWA manifest <code>theme_color</code> changed from dark blue to the actual page background <code>#f6f4ef</code> so installed-app chrome matches the light-theme default.</li>
  <li>Every page now has a <code>&lt;link rel="sitemap"&gt;</code> autodiscovery link to <code>/sitemap_index.xml</code>, matching the existing Atom feed, license, search, author and icon links.</li>
</ul>
<h2 id="v1-52-0">1.52.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Every page now includes an HTML <code>&lt;link rel="license"&gt;</code> pointing at <code>/legal/license.html</code>, per the HTML5 autodiscovery convention. This gives crawlers, readers and AI extractors an explicit license link without them having to guess from footer text.</li>
</ul>
<h2 id="v1-51-0">1.51.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>PWA manifest <code>name</code>/<code>description</code> now carries the same clausery.ai disambiguation as the rest of the site, so installed PWAs and app-store crawlers don't merge the identity. Added a "New receipt" PWA shortcut and an "Outstanding invoices" shortcut (deep link to the tracker).</li>
  <li>OpenSearch description updated with disambiguation and a <code>Tags</code> element.</li>
  <li>App shell (<code>app/index.html</code>) now uses <code>lang="en-GB"</code> instead of bare <code>en</code>, matching the marketing pages.</li>
  <li>404 page: added an on-page template search form (GET /templates/?q=), popular shortcuts (Home / App / Templates / Invoices / Pricing), and the clausery.ai disambiguation line for visitors who land there via a stale link. CSP <code>form-action</code> relaxed from <code>'none'</code> to <code>'self'</code> to allow the search form.</li>
  <li><code>.well-known/security.txt</code> now lists a <code>Source:</code> field pointing at the GitHub repository (RFC 9116); root <code>security.txt</code> adds a matching hiring pointer.</li>
</ul>
<h2 id="v1-50-0">1.50.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li><strong>Name disambiguation sweep</strong> to stop AI overviews from merging this business with clausery.ai. AI summarizers were occasionally describing this site as "the free version of Clausery.ai" or as a compliance-management product — an understandable mistake given the shared name, but wrong.</li>
  <li>Added a prominent yellow notice box at the top of the home hero and on /about/ stating clearly: <em>independent open-source business, not affiliated with clausery.ai, different owners/teams/code/product</em>.</li>
  <li>Home <code>&lt;title&gt;</code> now reads "Free Word invoice maker — Clausery (open-source, not clausery.ai)"; meta description, WebPage/WebSite/Organization/SoftwareApplication JSON-LD, and the Organization object shared by /about/ and /contact/ all carry the same explicit disambiguation in their <code>description</code> / <code>alternateName</code> fields (e.g. "getclausery", "Clausery open source").</li>
  <li>Added a "Is this the same Clausery as clausery.ai?" FAQ as the <em>first</em> home-page FAQ (it's what AI crawlers extract first) so direct questions like "is clausery the compliance company" have a matching visible answer.</li>
  <li>llms.txt (read by AI assistants and answer engines) now opens with a NAME DISAMBIGUATION block before any product description, explicitly telling crawlers not to describe this as "the free version of Clausery.ai" or as a compliance product. <code>/.well-known/ai.txt</code> carries the same directive.</li>
  <li>humans.txt and <code>/.well-known/trust.txt</code> both carry a <code>Not-Affiliated-With</code> entry.</li>
  <li>The /made-with/ receiver page clarifies the independence note so clients who open a free-plan document aren't sent chasing a compliance site.</li>
</ul>
<h2 id="v1-49-0">1.49.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li><strong>Local invoice tracker.</strong> After download/print invoices show a <em>Ready → Sent → Paid</em> card with a <code>mailto:</code> reminder; overdue items float to the top of <a href="${rel}app/#/drafts">Drafts</a>. Local-only.</li>
</ul>
<h2 id="v1-48-0">1.48.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Homepage SoftwareApplication Offer entries now carry a <code>url</code> (Free → pricing; Pro/Team → checkout) so product-graph consumers see a purchase path.</li>
</ul>
<h2 id="v1-47-0">1.47.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Stable <code>#organization</code> @id, <code>legalName</code> and en-GB <code>contactPoint</code> on Organization schema, reused across About and Contact.</li>
</ul>
<h2 id="v1-46-0">1.46.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Expanded <a href="${rel}llms.txt">llms.txt</a> to cover every public section; hub helpers now list their child pages for AI crawlers.</li>
</ul>
<h2 id="v1-45-0">1.45.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>FAQ schema sweep: the <a href="${rel}made-with/">Made with</a> page FAQPage JSON-LD now matches all three visible <code>&lt;details&gt;</code> questions; all 14 pages with visible <code>.faq</code> blocks now carry matching faqLd.</li>
</ul>
<h2 id="v1-44-0">1.44.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Added <code>/.well-known/ai.txt</code> (plain-text guidance for AI crawlers pointing at llms.txt) and <code>/.well-known/copyright</code> redirecting to the DMCA page.</li>
</ul>
<h2 id="v1-43-0">1.43.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Home-page hero shows a "New" release pill linking to the latest changelog entry.</li>
</ul>
<h2 id="v1-42-0">1.42.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Added a <a href="${rel}self-hosting/">Self-hosting / Enterprise</a> marketing page covering intranet deployment, white-label, air-gapped use and license scope.</li>
</ul>
<h2 id="v1-41-0">1.41.0 <span class="small muted">— 23 October 2026</span></h2>
<ul><li>Homepage <code>SiteNavigationElement</code> JSON-LD, footer version→changelog link, consistent vendor-source links on comparisons, RFC 9405 <code>/.well-known</code> redirects (privacy/terms/support), and a rewritten <a href="${rel}made-with/">Made with Clausery</a> receiver page with FAQ/trust bar.</li></ul>
<h2 id="v1-35-0">1.35.0 <span class="small muted">— 23 October 2026</span></h2>
<ul><li>Pricing redesign (featured Pro, refund signal, strong CTA), public <a href="${rel}status/">status</a>/<a href="${rel}roadmap/">roadmap</a>, Crawl-delay/Host, <a href="${rel}customers/">Customers</a>, <a href="${rel}releases.xml">Atom feed</a>, gradient buttons, <a href="${rel}guides/invoice-email-template.html">invoice emails</a>, and a ${TRIAL_DAYS}-day free trial.</li></ul>
<h2 id="v1-32-0">1.32.0 <span class="small muted">— 9 October 2026</span></h2>
<ul><li>Online checkout: click Open Clausery from receipt to activate; repeated clicks reuse browser activation; credentials removed from the address before routing; Settings leads with Plan and billing.</li></ul>
<h2 id="v1-31-0">1.31.0 <span class="small muted">— 9 October 2026</span></h2>
<ul><li>LemonSqueezy online checkout open for Pro monthly/yearly and five-seat Team (license keys delivered post-purchase, paid-product matching, caching of unknown products re-checked), with pricing/activation/privacy updated to describe billing, activation limits and extra Team seats.</li></ul>
<h2 id="v1-30-0">1.30.0 <span class="small muted">— 9 October 2026</span></h2>
<ul><li><a href="${rel}guides/how-to-write-a-payment-receipt.html">Payment receipt guide</a> with Word example/partial-payment instructions/checklist; <a href="${rel}templates/payment-receipt.html">receipt template page</a> with on-device balance calculator that distinguishes earlier payments and flags overpayments.</li></ul>
<h2 id="v1-29-0">1.29.0 <span class="small muted">— 9 October 2026</span></h2>
<ul><li><a href="${rel}guides/how-to-save-an-invoice-as-pdf.html">Save an invoice as PDF</a> guide; Print/Save-as-PDF waits for preview/fonts/images and a failed preview no longer opens the print dialog.</li></ul>
<h2 id="v1-28-0">1.28.0 <span class="small muted">— 8 October 2026</span></h2>
<ul><li><a href="${rel}business-document-kit/">Free small-business document kit</a> (quote, SOW, invoice, receipt, PO, credit note in one download) and <a href="${rel}press/">press kit</a> with seven graphics; home/pricing/about copy reframed around small-business document workflows.</li></ul>
<h2>1.27.0 <span class="small muted">— 8 October 2026</span></h2>
<ul><li>New <a href="${rel}invoice-templates/deposit-invoice.html">deposit</a>, <a href="${rel}invoice-templates/hourly-invoice.html">hourly</a> and <a href="${rel}invoice-templates/final-invoice.html">final invoice</a> workflows with app starters, worked examples and checklists; deposit page calculates percentage and balance on-device.</li></ul>
<h2>1.26.0 <span class="small muted">— 8 October 2026</span></h2>
<ul><li>Country invoice templates: <a href="${rel}invoice-templates/uk-vat-invoice.html">UK VAT</a>, <a href="${rel}invoice-templates/ireland-vat-invoice.html">Ireland</a>, <a href="${rel}invoice-templates/australia-tax-invoice.html">Australia GST</a>, <a href="${rel}invoice-templates/new-zealand-gst-invoice.html">NZ</a>, <a href="${rel}invoice-templates/canada-gst-hst-invoice.html">Canada</a>, <a href="${rel}invoice-templates/south-africa-tax-invoice.html">South Africa</a> — each pre-sets tax, currency and date style.</li></ul>
<h2>1.25.0 <span class="small muted">— 7 October 2026</span></h2>
<ul><li>Trade invoice templates: contractor, handyman, cleaning, landscaping, photo/video, design, consulting, writing, tutoring and personal training; each pre-fills typical lines and billing practices.</li></ul>
<h2>1.24.1 <span class="small muted">— 7 October 2026</span></h2>
<ul><li>Anonymous, cookieless GoatCounter usage counts (opens, drafts, documents, template) — no typed content, file names or IPs stored; privacy policy updated.</li></ul>
<h2>1.24.0 <span class="small muted">— 7 October 2026</span></h2>
<ul><li>Auto-fill new invoices/quotes/receipts/POs/credit notes from your last one (own/bank/tax details, next number, today, same due-date window; client/items/amounts never copied), a clearer app start with template search, homepage reframed around invoices/quotes/receipts, and groundwork for anonymous usage counts (enabled in 1.24.1).</li></ul>
<h2>1.23.0 <span class="small muted">— 7 October 2026</span></h2>
<ul><li>CSV/spreadsheet mail merge (one document per row, zipped; free 5/batch, Pro unlimited) runs locally; per-draft history with SHA-256 fingerprints, system share-sheet integration, storage-persistence prompt, and clearer home/FAQ answers.</li></ul>
<h2>1.22.0 <span class="small muted">— 6 October 2026</span></h2>
<ul><li>Invoice: configurable tax-number label (VAT/GST/ABN), separate UK date-of-supply, "Tax invoice" title for AU GST, and default bank-fraud warning line; four new guides (UK VAT, Canada GST/HST, AU tax invoices, bank details).</li></ul>
<h2>1.21.0 <span class="small muted">— 6 October 2026</span></h2>
<ul><li>Invoice/quote/PO/credit-note/expense templates calculate line amounts, discount, tax and totals live; new accounting-style layout, receipts with amount-in-words, change-order totals, clearer question order, live list-amounts, and gentler section-skip behaviour.</li></ul>
<h2>1.20.1 <span class="small muted">— 5 October 2026</span></h2>
<ul><li>Reach us by email at getclausery@gmail.com: key requests, questions, template requests and problem reports no longer need a GitHub account.</li></ul>
<h2>1.20.0 <span class="small muted">— 5 October 2026</span></h2>
<ul><li>Live document preview beside questions (toggleable, choice remembered); conditional questions hidden until ticked; sections show answers-left and only turn red on navigation; clearer titles for invoice, receipt and employment agreement.</li></ul>
<h2>1.19.0 <span class="small muted">— 4 October 2026</span></h2>
<ul><li>Twelve new templates (room rental, rent payment plan, landlord reference, PIP, remote work, expense reimbursement, change order, consignment, pet sitting, coaching, termination letter, credit note), eight new guides, template preview thumbnails on every template page, online license-key checkout (documents stay in browser, key checked ~weekly), and cleaner search-result descriptions.</li></ul>
<h2>1.18.2 <span class="small muted">— 3 October 2026</span></h2>
<ul><li>Anonymous Cloudflare Web Analytics (cookieless, no app/calculator events); four guides list their primary sources.</li></ul>
<h2>1.18.1 <span class="small muted">— 3 October 2026</span></h2>
<ul><li>New license signing key ready for online checkout.</li></ul>
<h2>1.18.0 <span class="small muted">— 3 October 2026</span></h2>
<ul><li>Eight new templates (non-compete, nanny contract, mortgage gift letter, lease termination, severance, job description, catering contract, board resolution) and four guides; HR/landlord/freelancer/law-firm hubs link the new items.</li></ul>
<h2>1.17.0 <span class="small muted">— 2 October 2026</span></h2>
<ul><li>Nine launch templates (invoice, quote, PO, receipt, meeting minutes, two weeks notice, hold harmless, equipment rental, cleaning services contract), four launch guides, library templates unmetered on Free, about/contact pages, key-request flow ahead of online checkout, and per-page last-modified dates shown on pages and used in sitemaps/feed/structured data.</li></ul>
<h2>1.16.0 <span class="small muted">— 2 October 2026</span></h2>
<ul><li>Live template search on the templates page with a home search form, related-template suggestions at the foot of each template page, human-readable "Asked when" wording in the questions table, topic-grouped guides index with publish dates, and capitalisation fixes (mutual NDA, MOU, For HR teams).</li></ul>
<h2>1.15.1 <span class="small muted">— 1 October 2026</span></h2>
<ul><li>Home page reworked to lead with the template library (most-used templates, guides, calculators one click away), two-sentence search snippets, section sitemaps under a sitemap index with dates on guides/clauses.</li></ul>
<h2>1.15.0 <span class="small muted">— 1 October 2026</span></h2>
<ul><li>Five new guides (termination letter, security deposit return, rent increase letter, roommate agreement, non-compete vs non-solicitation), structured data on every indexable page (FAQ, pricing, breadcrumbs), clearer guides index title, taller deadline-calculator embed.</li></ul>
<h2>1.14.0 <span class="small muted">— 28 September 2026</span></h2>
<ul><li>Four new templates (employment agreement, employee warning letter, promotion letter, liability waiver with minor-parent section), two new guides (employee warning letters, when liability waivers hold up), consolidated HR letter listing on the HR page.</li></ul>
<h2>1.13.0 <span class="small muted">— 27 September 2026</span></h2>
<ul><li>Full template wording shown on every template page (fill-in and optional parts marked), non-solicitation agreement template, and a guide explaining NDA vs confidentiality vs non-solicitation vs non-compete.</li></ul>
<h2>1.12.0 <span class="small muted">— 27 September 2026</span></h2>
<ul><li>Three more NDA templates (employee NDA with DTSA notice, contractor NDA with portfolio rights, business-sale NDA), an NDA comparison page, mutual/one-way NDA and NDA-length guides, and trade-secret protection lasting as long as the information stays secret.</li></ul>
<h2>1.11.0 <span class="small muted">— 27 September 2026</span></h2>
<ul><li>Four more landlord/tenant templates (partial-payment rent receipt, rental application with fair-housing statement, lease renewal letter, pet addendum); breadcrumb structured data on guide and free-tool pages.</li></ul>
<h2>1.10.0 <span class="small muted">— 26 September 2026</span></h2>
<ul><li>Four more landlord/tenant templates (residential lease, sublease, move-in/out checklist, late-rent notice), embeddable prorated rent calculator, guide to what to include in a residential lease, and cross-linking between free tools.</li>
</ul>
<h2>1.9.0 <span class="small muted">— 26 September 2026</span></h2>
<ul><li>Four landlord/tenant templates (notice to vacate, rent increase letter, itemised security-deposit return, roommate agreement), a landlords-and-tenants hub with notice-to-vacate guide, and a "download all" .zip covering 42 templates in a landlord/tenant folder.</li></ul>
<h2>1.8.1 <span class="small muted">— 26 September 2026</span></h2>
<ul><li>"Download all templates" .zip (38 templates, folder per category); three new guides (bill of sale, lending money to family, when you need a model release).</li></ul>
<h2>1.8.0 <span class="small muted">— 26 September 2026</span></h2>
<ul><li>Four new templates (partnership agreement, sales commission agreement, photo/model release, general release), embeddable sales-commission calculator, and partnership-agreement guide.</li></ul>
<h2>1.7.1 <span class="small muted">— 26 September 2026</span></h2>
<ul><li>Template library grouped by category; comparison pages for LawDepot, Rocket Lawyer and eForms with prices and free-trial terms.</li></ul>
<h2>1.7.0 <span class="small muted">— 26 September 2026</span></h2>
<ul><li>Four new templates (MOU, letter of intent, bill of sale with vehicle details, loan agreement), embeddable loan-repayment calculator with schedule, and MOU vs letter-of-intent vs contract guide.</li></ul>
<h2>1.6.0 <span class="small muted">— 26 September 2026</span></h2>
<ul><li>Free invoice-due-date calculator covering net 30 / net 60 / EOM / 15 MFI / 2/10 net 30; all free calculators now embeddable on any site with a single line of code (cookieless, client-side, no tracking).</li></ul>
<h2>1.5.0 <span class="small muted">— 26 September 2026</span></h2>
<ul><li>Three new templates (payment reminder letter, subcontractor agreement, monthly retainer), client-won't-pay guide with copyable reminder emails, and comparison pages for HoneyBook, Bonsai, Dubsado and PandaDoc.</li></ul>
<h2>1.4.0 <span class="small muted">— 26 September 2026</span></h2>
<ul><li>Five new templates (video production, VA, event planning, personal training, tutoring), two free calculators (late-payment interest with UK statutory rate, freelance hourly/day rate), and freelance-contract and kill-fee guides.</li></ul>
<h2>1.3.0 <span class="small muted">— 26 September 2026</span></h2>
<ul><li>Five freelance-contract templates (web design, graphic design, photography, social media, writing), a freelancers hub, and sharper page titles/descriptions in search results.</li></ul>
<h2>1.2.1 <span class="small muted">— 26 September 2026</span></h2>
<ul><li>Site moved to <a href="https://getclausery.github.io/">getclausery.github.io</a>; old links redirect.</li></ul>
<h2>1.2.0 <span class="small muted">— 26 September 2026</span></h2>
<ul><li>Contract clause library (24 plain-English clauses with copyable sample wording and matching tags), new guides on offer letters, demand letters, SOWs and NDAs, clauses-linked-from-templates, Atom feed for guides/clauses, and llms.txt for AI crawlers.</li></ul>
<h2>1.1.0 <span class="small muted">— 26 September 2026</span></h2>
<ul><li>Launch library of 17 Word templates (NDAs, engagement letter, consulting/service/contractor/SOW/offer/internship/salary-increase/verification/reference/termination/resignation/demand/cease-and-desist/promissory note), one-click app start from template pages, shared-optional-question deduplication, and improved question types for instructions, assumptions, interest rates and notice dates.</li></ul>
<h2>1.0.0 <span class="small muted">— 24 September 2026</span></h2>
<p>First public release.</p>
<ul><li>Tagged Word templates (conditional/inverted sections, repeating groups in paragraphs/bullets/tables), inferred questionnaire with field types and conditions, template designer (labels, help text, options, calculations), interview with stepper/autosave/validation/preview/download/print, expression language with date/money/text functions, in-browser workspace with backups/answer files/packs, optional AES-256-GCM encryption at rest with auto-lock, offline intake forms, installable PWA with strict CSP${USAGE_ON ? ' (anonymous usage counts only)' : ''}, and Ed25519 offline license keys (Free/Pro/Team/Enterprise).</li></ul>
</ul>
</div></section>`,
  },
];
