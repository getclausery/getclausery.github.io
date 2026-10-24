import { USAGE_ON } from '../tools/partials.mjs';
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
    extraHead: '<meta name="robots" content="noindex, follow">',
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:44rem"><p class="eyebrow">404 — page not found</p><h1>That page is not here.</h1><p class="lead">The address may be wrong or the page moved. Nothing you type in Clausery is stored on a server, so there is nothing to recover from a broken link — but what you were looking for is probably one click away.</p><div class="grid grid-2" style="margin-top:1.5rem"><a class="feature" href="${rel}app/#/start/invoice"><div class="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg></div><h3>Make a free invoice →</h3><p>60-second start; editable Word file; totals, tax and numbering done for you.</p></a><a class="feature" href="${rel}templates/"><div class="ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></div><h3>Browse ${87}+ free templates</h3><p>Invoices, contracts, NDAs, letters, forms and more — all editable Word.</p></a></div><h2 style="margin-top:2rem;font-size:1.1rem">Popular starting points</h2><ul class="link-list" style="columns:2 12rem;column-gap:2rem;margin-top:.5rem"><li><a href="${rel}invoice-templates/">Invoice templates</a></li><li><a href="${rel}invoice-templates/deposit-invoice.html">Deposit invoice</a></li><li><a href="${rel}invoice-templates/final-invoice.html">Final invoice</a></li><li><a href="${rel}templates/quote.html">Price quote</a></li><li><a href="${rel}templates/payment-receipt.html">Payment receipt</a></li><li><a href="${rel}templates/mutual-nda.html">Mutual NDA</a></li><li><a href="${rel}templates/independent-contractor-agreement.html">Independent contractor agreement</a></li><li><a href="${rel}guides/">All guides</a></li><li><a href="${rel}pricing/">Pricing</a></li><li><a href="${rel}docs/security.html">Security & privacy</a></li></ul><div class="actions" style="display:flex;gap:.75rem;margin-top:1.75rem;flex-wrap:wrap"><button class="btn btn-primary" type="button" onclick="(document.getElementById('nav-search')||{}).click?.()">Search the site <span class="arr">→</span></button><a class="btn" href="${rel}">Home page</a><a class="btn btn-ghost" href="${rel}app/">Open the app</a></div></div></section>`,
  },
  {
    path: 'search/', title: 'Search free Word templates and guides',
    description: 'Search 87+ free Word templates, invoices, NDAs, contracts, letters and plain-English guides. Every result is a real page you can read or download — no account required.',
    extraHead: `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'SearchResultsPage', '@id': '${SITE}search/#webpage', url: '${SITE}search/', name: 'Search free Word templates and guides', description: 'Search 87+ free Word templates, invoices, NDAs, contracts, letters and plain-English guides. Every result is a real page you can read or download — no account required.', inLanguage: 'en-GB', isPartOf: { '@id': '${SITE}#website' } })}</script>`,
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
<h2 id="v1-77-0">1.77.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li><strong>CTR-optimised hub-page titles.</strong> Top section hubs (Invoice templates, Pricing, Guides, NDA templates, Free tools) rewritten to lead with the keyword and a 2026 year marker so Google bolds the year in results and the snippet reads as fresh.</li>
  <li><strong>HTML sitemap at <a href="${rel}sitemap/">/sitemap/</a>.</strong> A single crawlable page that links every public page grouped by section, with a <code>CollectionPage</code> + <code>SiteNavigationElement</code> JSON-LD block and counts per group. Linked from the footer alongside the version/changelog/license links so crawlers have a second, shallow path from any page to every other page (internal-link depth for deep pages drops from 3 clicks to 2).</li>
  <li><strong>Footer navigation tightened.</strong> Sitemap link added to the legal strip.</li>
  <li>0 new third parties; budgets: HTML ~79 KB, CSS 41.7 KB, JS 17.3 KB.</li>
</ul>
<h2 id="v1-76-0">1.76.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li><strong>Crawlable <code>/search/</code> page for Google Sitelinks Searchbox.</strong> Google only activates the Sitelinks Searchbox rich result if the target URL is crawlable, returns real results for <code>?q=</code>, and works without JavaScript. The new <a href="${rel}search/">/search/</a> page server-renders popular searches as real links (so a crawler sees actual results), runs a live client-side search against <code>search-index.json</code> when you type or land with <code>?q=</code>, and carries <code>SearchResultsPage</code> JSON-LD. The WebSite schema's <code>SearchAction</code> now points at this dedicated endpoint (previously <code>/templates/?q=</code>, which did not meet Google's functional-search requirement).</li>
  <li><strong>Home-page title/description rewritten for higher CTR.</strong> New title: <em>"Free Invoice Template for Word (2026) — Make &amp; Download in 60s"</em>; new meta description leads with year + time-to-result and moves the "(not clausery.ai)" disambiguation into the second sentence. This matches the high-intent "free invoice template for word" query head-on and puts the numbers Google bolds (2026, 60s) up front.</li>
  <li><strong>Accessibility polish.</strong> Header marked <code>role="banner"</code>, footer <code>role="contentinfo"</code>; the ⌘K command palette gains <code>aria-controls</code>, <code>aria-labelledby</code> pointing at a screen-reader title, an <code>aria-live</code> hint region and a descriptive <code>aria-label</code> on the results listbox.</li>
  <li><strong>Speculation-rules prefetch.</strong> Added a conservative <code>eagerness: "moderate"</code> prefetch rule on every page that excludes /app/ (which has its own prerender), downloads, external targets and non-HTML URLs, so likely next clicks are already cached on Chromium browsers without extra data cost.</li>
  <li>0 new third parties; CWV/CSP/AGPL/CMI/trademarks preserved.</li>
</ul>
<h2 id="v1-75-0">1.75.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li><strong>Critical-asset preload hints.</strong> Added <code>&lt;link rel="preload"&gt;</code> for the Clausery mark (icon.svg), site.css and site.js so the header brand and first paint land sooner on slow connections; added <code>fetchpriority="low"</code> on the non-critical JS preload to avoid competing with render-blocking CSS.</li>
  <li><strong>Richer share metadata.</strong> Added <code>og:logo</code> pointing at the 512×512 brand mark so platforms that support a publisher logo (Slack, LinkedIn, Pinterest) pick up the Clausery mark alongside the share image.</li>
  <li><strong>FAQ accessibility + schema tightening.</strong> Every FAQ accordion (<code>&lt;details&gt;/&lt;summary&gt;</code>) now carries proper <code>aria-controls</code>, <code>aria-labelledby</code> and <code>role="region"</code> on the answer panel, and is wrapped in microdata (<code>FAQPage</code> → <code>Question</code> → <code>acceptedAnswer/Answer</code>) for richer rich-result parsing alongside the existing FAQPage JSON-LD.</li>
  <li><strong>Performance:</strong> home page keeps its app-origin preconnect; overall JS remains 15.5 KB and CSS 41.4 KB — zero new third parties.</li>
</ul>
<h2 id="v1-74-0">1.74.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li><strong>Deeper SEO / metadata pass.</strong>
    <ul>
      <li>Auto-generated <code>BreadcrumbList</code> JSON-LD on every inner page (not just section hubs) so Google can show breadcrumb trails for every template, guide, legal page and compare/feature page.</li>
      <li>Added <code>og:image:secure_url</code>, <code>og:image:type</code>, <code>twitter:image:alt</code> (tightened) and a <code>&lt;meta name="thumbnail"&gt;</code> to every page for richer shares in Slack, LinkedIn, WhatsApp, iMessage and link previews.</li>
      <li>Added <code>preconnect</code> hint for the app bundle origin on the home page so "Open app" lands faster for first-click users.</li>
    </ul>
  </li>
  <li><strong>Much better 404 page.</strong> Instead of a dead end, the <a href="${rel}404.html">not-found page</a> now shows direct shortcuts to the invoice maker, template library, plus a 2-column popular-links list covering invoices, quotes, receipts, NDAs, contractor agreements, guides, pricing and security — and a one-click search button.</li>
  <li><strong>Indexation/accessibility cleanup.</strong> <code>description</code> meta is clipped to a safe 155-char limit across the board so Google Search previews don't truncate mid-sentence; canonical URLs are normalised to trailing-slash to avoid duplicate indexing. No new third parties; CWV/CSP/AGPL/CMI/trademarks preserved.</li>
</ul>
<h2 id="v1-73-0">1.73.0 <span class="small muted">— 24 October 2026</span></h2>
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
  <li>Copy sweep: removed the word "project" from descriptions of Clausery itself (home, about, FAQ, organization JSON-LD, SoftwareApplication schema, copyright/CMI header, AI disambiguation note, copyguard message and service-worker comment). Clausery is described as an <em>independent open-source business</em> / <em>tool</em> / <em>product</em>, not a project. References to a client's project in invoices, quotes, contracts and guidance (e.g. project description, project fee, "project cancelled" kill-fee wording) are unchanged — those describe the user's work, not Clausery.</li>
</ul>
<h2 id="v1-72-1">1.72.1 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li>Restored the original Clausery mark in the header and footer brand lockup (the SVG icon, not the "C" badge introduced in 1.72.0), while keeping the new header sizing, spacing and hover rotation.</li>
</ul>
<h2 id="v1-72-0">1.72.0 <span class="small muted">— 24 October 2026</span></h2>
<ul>
  <li><strong>Command palette (⌘K / Ctrl+K / /):</strong> a universal fast launcher on every page — fuzzy-search every template, invoice template, guide, clause, free tool and page, plus quick actions (New invoice / New quote / New receipt / Drafts / Pricing / Docs). Keyboard-navigable (↑↓ to browse, Enter to open, Esc to dismiss) with a search button in the header so it's discoverable on mobile too.</li>
  <li><strong>Returning-visitor welcome bar:</strong> if you have saved drafts locally, a dismissible sticky bar under the header greets you back, names the last document you were working on, and drops you into your drafts in one click. Remembered across sessions; snoozed for 7 days once dismissed.</li>
  <li><strong>Redesigned navigation:</strong> shorter 58px glass header with pill-shaped links, brand-tint active state, keyboard affordance and a unified search entry. The mobile nav is now a proper slide-in drawer with a backdrop instead of a crude dropdown; the primary CTA is "Make an invoice" instead of the generic "Open the app".</li>
  <li><strong>Scroll-to-top button</strong> (plus the existing "Continue drafting" floating CTA) grouped in a floating action stack; CTA label now names your actual draft when one exists.</li>
  <li><strong>Visual refresh v2:</strong> unified design tokens (OKLch-style accents, new radius 18px, layered shadows, ambient gradient wash on the page background, grainless light), refined typography scale with tighter headings, border-gradient primary button, animated 2px read-progress bar with glow, card spotlight on hover, feature-card arrow affordance, and quieter FAQ / table / quote treatments.</li>
  <li><strong>Footer restructure</strong> into Brand / Product / Learn / Company / Legal columns with social icons; legal line adds the clausery.ai disambiguation.</li>
  <li><strong>Breadcrumbs</strong> and <strong>scroll-reveal</strong> for feature/plan/step cards (respects prefers-reduced-motion).</li>
  <li>0 new third parties; CSP unchanged; AGPL / CMI / trademarks preserved.</li>
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
  <li><strong>Local invoice tracker.</strong> After you download or print an invoice, the review step now shows a status card: <em>Ready to send → Sent → Paid</em>. Tap "Mark as sent" once you email it; "Mark paid" when money arrives; "Send reminder" opens a pre-filled <code>mailto:</code> with the invoice summary and a friendly nudge. Overdue invoices (past their due date) show a red badge.</li>
  <li>The <a href="${rel}app/#/drafts">Drafts list</a> sorts overdue invoices to the top and shows the same status badge (Ready / Sent / Overdue / Paid) plus days-since-sent and the due date under each invoice draft. The list counts how many invoices are overdue right now.</li>
  <li>Editing answers, restoring an older version or importing answers clears the sent/paid marker so you never see a "Paid" badge on a reworked invoice that was never re-sent. Duplicating a draft also clears status.</li>
  <li>Everything is stored locally on your device (as with drafts and answers) — nothing is sent to a server, there is no sync, and no new permissions are required. The controls only appear for invoice/billing templates, not quotes, NDAs or letters.</li>
</ul>
<h2 id="v1-48-0">1.48.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Home-page SoftwareApplication Offer entries now carry a <code>url</code>: Free points at the pricing page; Pro monthly, Pro yearly and Team point at their existing checkout URLs. This lets search engines and product-graph consumers surface a direct purchase path.</li>
</ul>
<h2 id="v1-47-0">1.47.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Organization schema now carries a stable <code>@id</code> (<code>#organization</code>), a <code>legalName</code>, and a <code>contactPoint</code> (customer support, en-GB). The same <code>ORG</code> object is reused on the About and Contact pages, so JSON-LD consumers see a single organisation node rather than three separate unnamed nodes.</li>
</ul>
<h2 id="v1-46-0">1.46.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Expanded <code>llms.txt</code> (the AI-assistant link map at <a href="${rel}llms.txt">llms.txt</a>) to cover every indexable marketing section. Previously it emitted Free Word templates, Invoice templates, Clause library, Guides, Free tools and Comparisons; now it also indexes Self-hosting / Enterprise, Customers, Who Clausery is for, NDA templates, Press, Roadmap, Status, Contact, the Docs landing page, the changelog and the GitHub repository. Section helpers include each section's hub index page as well as its child pages.</li>
</ul>
<h2 id="v1-45-0">1.45.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>FAQ schema sweep: the <a href="${rel}made-with/">"Made with Clausery"</a> page's FAQPage JSON-LD now matches the three visible <code>&lt;details&gt;</code> questions exactly ("Is this a scam? Is it safe to pay?", "Can I edit the document?", "Does this track me?"), including the previously-missing third question. All 14 pages with visible <code>.faq</code> blocks now have matching faqLd.</li>
  <li>Confirmed the <a href="${rel}about/">About</a> page already emits <code>@type: AboutPage</code> JSON-LD.</li>
</ul>
<h2 id="v1-44-0">1.44.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Added <code>/.well-known/ai.txt</code>: plain-text guidance for AI crawlers, pointing at <a href="${rel}llms.txt">llms.txt</a> for the public page index and deferring to robots.txt for crawl policy.</li>
  <li>Added <code>/.well-known/copyright</code> meta-refresh redirect pointing to the existing <a href="${rel}legal/dmca.html">DMCA and takedowns page</a>, matching the pattern used for privacy-policy, support and change-password.</li>
</ul>
<h2 id="v1-43-0">1.43.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Home-page hero now shows a "New in v1.43.0" release pill under the eyebrow, linking straight to the matching changelog anchor and highlighting the latest feature additions. The release note stays honest about what shipped rather than promising what did not.</li>
  <li>Added <code>.release-pill</code> styling: soft-accent chip, rounded, accessible colour contrast.</li>
</ul>
<h2 id="v1-42-0">1.42.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Added a marketing-oriented <a href="${rel}self-hosting/">Self-hosting / Enterprise</a> page describing intranet deployment, white-label rebranding, air-gapped use, compliance documentation and what does and does not require a commercial license. Footer Product column links it as "Self-host / Enterprise"; Enterprise plan card links to it.</li>
  <li>Home-page "Run it yourself" feature card now links to both the marketing page and the technical self-hosting guide.</li>
</ul>
<h2 id="v1-41-0">1.41.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Added a <code>SiteNavigationElement</code> JSON-LD block to the home page describing the primary navigation (Invoices, Templates, Pricing, Docs, Security, Customers, Open the app) so search engines and accessibility tooling understand the site structure from the entry page.</li>
</ul>
<h2 id="v1-40-0">1.40.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Footer now shows the running version (e.g. <code>v1.40.0</code>) as a link straight to the matching changelog anchor, so it is one click to see what changed between versions.</li>
</ul>
<h2 id="v1-39-0">1.39.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Comparisons now carry the same "vendor source" link pattern consistently, and the trust-chips system used on pricing is available on other high-intent pages.</li>
</ul>
<h2 id="v1-38-0">1.38.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Added <code>/.well-known/privacy-policy</code> and <code>/.well-known/terms-of-service</code> redirects (community well-known conventions used by privacy tooling, GDPR data-discovery crawlers, and platform privacy shortcuts). Both point cleanly at the human-readable legal pages and are marked noindex.</li>
  <li>Rewrote the <a href="${rel}made-with/">Made with Clausery</a> page (the page free-plan document recipients land on): stronger security framing, a receiver-focused FAQ answering "Is this a scam?", "Can I edit it?" and "Does this track me?", trust-chip proof bar, and a more honest "contact the sender" notice with an accent-left rule.</li>
</ul>
<h2 id="v1-37-0">1.37.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Added <code>/.well-known/support</code> (RFC 9405), redirecting to the contact page. Browsers and OSes that show a “Get support” entry for installed PWAs now resolve it somewhere useful instead of 404.</li>
</ul>
<h2 id="v1-36-1">1.36.1 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Home-page SoftwareApplication schema now lists every paid offer (Pro monthly, Pro yearly, Team) with availability, so product rich results include the full price ladder.</li>
</ul>
<h2 id="v1-36-0">1.36.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Added a <a href="${rel}customers/">Customers page</a> describing who uses Clausery (freelancers, consultants, landlords, HR teams, trades, small firms) and what they use it for, with links into real template and audience pages.</li>
  <li>Added <a href="${rel}releases.xml">releases.xml</a>, an Atom feed of every version, linked from every page's <code>&lt;head&gt;</code> and from the changelog heading. Subscribe in any feed reader to get release notes.</li>
  <li>Footer now links Customers alongside Pricing and Why Clausery.</li>
  <li>Added anchor IDs to recent changelog entries so feed entries deep-link to the right version.</li>
</ul>
<h2 id="v1-35-0">1.35.0 <span class="small muted">— 23 October 2026</span></h2>
<ul>
  <li>Redesigned plan cards on the pricing page with stronger visual hierarchy for the featured Pro plan, a clearer “no-card free trial” ribbon, refund-note trust signal, larger primary CTA, and more direct benefit copy.</li>
  <li>Added a public <a href="${rel}status/">status page</a> listing every component (site, repository, document engine, checkout) and where to verify each one, plus a public <a href="${rel}roadmap/">roadmap</a> linked to changelog entries and open GitHub issues.</li>
  <li>Footer now links to Status and Roadmap alongside Changelog; About page links to both.</li>
  <li>Primary buttons now use a gradient fill with inset highlight, stronger hover lift and glow, active-state reset, and an accessible focus-visible ring.</li>
  <li>Added Crawl-delay and Host directives to robots.txt and refined the robots policy.</li>
</ul>
<h2 id="v1-34-0">1.34.0 <span class="small muted">— 15 October 2026</span></h2>
<ul>
  <li>Try Pro free for ${TRIAL_DAYS} days with one click, from the upgrade dialog, Settings or the <a href="${rel}pricing/">pricing page</a>. No card, no account and no email: the trial runs in your browser and simply ends, and you keep everything you made.</li>
  <li>Paid plans now have a ${REFUND_DAYS}-day money-back guarantee on the first payment. See the updated <a href="${rel}legal/terms.html">terms</a>.</li>
  <li>On the Free plan, documents made from library templates end with a small “Made with Clausery” line. Pro, Team and the trial leave it out, and templates you upload yourself never get it.</li>
  <li>Links inside a document preview open in a new tab, so a click never leaves the draft.</li>
</ul>
<h2 id="v1-33-0">1.33.0 <span class="small muted">— 9 October 2026</span></h2>
<ul><li>A free <a href="${rel}guides/invoice-email-template.html">invoice email generator and four message templates</a> for sending an invoice, reminding a client, following up on overdue payment and acknowledging money received. Details stay on your device; copy the message into your own email app.</li></ul>
<h2 id="v1-32-1">1.32.1 <span class="small muted">— 9 October 2026</span></h2>
<ul>
  <li>The automatic activation page accepts the return-link format supported by Lemon Squeezy's confirmation and receipt buttons. Access links are cleared from the address before activation and are not sent as referrers.</li>
</ul>
<h2 id="v1-32-0">1.32.0 <span class="small muted">— 9 October 2026</span></h2>
<ul>
  <li>Choose a plan, pay, then select Open Clausery after payment or in your receipt. Your plan activates automatically and opens the app, with no separate account or key to copy.</li>
  <li>Repeated receipt clicks reuse the existing browser activation. Purchase credentials are removed from the address before routing or usage counts; the payment provider still verifies the purchase.</li>
  <li>Settings now leads with Plan and billing and direct checkout buttons. Manual activation remains under Advanced activation for offline licenses and support.</li>
</ul>
<h2 id="v1-31-0">1.31.0 <span class="small muted">— 9 October 2026</span></h2>
<ul>
  <li>Online checkout is open through Lemon Squeezy: <a href="${rel}pricing/">Pro monthly, Pro yearly and five-seat Team</a>, with license keys delivered after purchase.</li>
  <li>Paid licenses are matched to the published live products. Test-mode products cannot unlock a paid plan. Existing cached online keys without product information are checked again.</li>
  <li>Pricing, activation instructions and privacy disclosures now describe online billing, device activation limits and extra Team seats by request.</li>
</ul>
<h2 id="v1-30-0">1.30.0 <span class="small muted">— 9 October 2026</span></h2>
<ul>
  <li>A <a href="${rel}guides/how-to-write-a-payment-receipt.html">payment receipt guide</a> with a Word example, partial-payment instructions and a sending checklist.</li>
  <li>The <a href="${rel}templates/payment-receipt.html">Word receipt page</a> explains how to record a payment and includes a local balance calculator. The calculator distinguishes earlier payments from the current payment and flags overpayments.</li>
</ul>
<h2 id="v1-29-0">1.29.0 <span class="small muted">— 9 October 2026</span></h2>
<ul>
  <li>A <a href="${rel}guides/how-to-save-an-invoice-as-pdf.html">guide to saving an invoice as PDF</a> from Clausery or Word, with export instructions and a checklist for the finished file.</li>
  <li>Print / Save as PDF waits for the document preview, fonts and images to finish preparing. A failed preview no longer opens the print dialog or records a print action.</li>
</ul>
<h2 id="v1-28-0">1.28.0 <span class="small muted">— 8 October 2026</span></h2>
<ul>
  <li>A <a href="${rel}business-document-kit/">free small business Word document kit</a>: quote, statement of work, invoice, receipt, purchase order and credit note in one download, with instructions for editing the templates or filling them in online.</li>
  <li>The <a href="${rel}press/">press kit</a> includes seven downloadable graphics for invoices, quotes, receipts and the business kit, with matching resource links.</li>
  <li>About, pricing and home page copy now lead with small business document workflows. The directory link points to the verified Clausery listing on Fazier.</li>
</ul>
<h2>1.27.0 <span class="small muted">— 8 October 2026</span></h2>
<ul>
  <li>New billing workflows: <a href="${rel}invoice-templates/deposit-invoice.html">deposit invoices</a>, <a href="${rel}invoice-templates/hourly-invoice.html">hourly invoices</a> and <a href="${rel}invoice-templates/final-invoice.html">final invoices</a>. Each has its own app starter, worked example and checklist.</li>
  <li>The deposit invoice page calculates an agreed percentage and remaining balance on your device.</li>
  <li>The Word invoice page explains how to prepare an invoice, what the online and Word downloads do, and how to keep amounts correct after editing.</li>
  <li>Invoice pages are easier to find from the main navigation, template library and related documents.</li>
</ul>
<h2>1.26.0 <span class="small muted">— 8 October 2026</span></h2>
<ul>
  <li>Invoice templates by country: <a href="${rel}invoice-templates/uk-vat-invoice.html">UK VAT</a>, <a href="${rel}invoice-templates/ireland-vat-invoice.html">Ireland VAT</a>, <a href="${rel}invoice-templates/australia-tax-invoice.html">Australia GST</a>, <a href="${rel}invoice-templates/new-zealand-gst-invoice.html">New Zealand GST</a>, <a href="${rel}invoice-templates/canada-gst-hst-invoice.html">Canada GST/HST</a> and <a href="${rel}invoice-templates/south-africa-tax-invoice.html">South Africa VAT</a>. Each opens an invoice with that country's tax, standard rate, tax number and currency set up, and lists what the tax authority says an invoice must show.</li>
  <li>In a new workspace, a country invoice also sets the currency and the date style (8 October 2026 in the UK, Ireland, Australia and New Zealand; dollar amounts written as $ in Canada). In a workspace with drafts already, both stay as they are and the app tells you where to change the currency.</li>
</ul>
<h2>1.25.0 <span class="small muted">— 7 October 2026</span></h2>
<ul>
  <li>Invoice templates by trade: contractor, handyman, cleaning, landscaping, photography, video, graphic design, web design, consulting, writing, tutoring and personal training. Each opens an invoice with the lines that trade usually bills, ready for your prices, and explains what that trade should put on an invoice and how it usually gets paid.</li>
</ul>
<h2>1.24.1 <span class="small muted">— 7 October 2026</span></h2>
<ul>
  <li>Anonymous usage counts are on: the app tells GoatCounter when it is opened, when a draft is started and when a document is made, and which library template it was. Nothing you type, no file names and none of your own templates are ever part of it, and GoatCounter sets no cookies and does not store IP addresses. The <a href="${rel}legal/privacy.html">privacy policy</a> has the details.</li>
</ul>
<h2>1.24.0 <span class="small muted">— 7 October 2026</span></h2>
<ul>
  <li>Your next invoice fills itself in: a new invoice, quote, receipt, purchase order or credit note starts with your own details, bank details and usual tax rate from the last one you made, the next number in your sequence and today's date. A due date keeps the same number of days after the invoice date as last time. The client, the items and the amounts are never copied.</li>
  <li>A clearer first visit: the app opens on the documents small businesses make most, each one click from a draft, with a search across all the templates. "Fill it in" starts a draft; "Customise" opens a library template's questions for editing.</li>
  <li>The home page now leads with invoices, quotes and receipts.</li>
  <li>Groundwork for anonymous usage counts (which templates are used, never what is typed), switched on in 1.24.1.</li>
</ul>
<h2>1.23.0 <span class="small muted">— 7 October 2026</span></h2>
<ul>
  <li>From a spreadsheet: make one document per row of a CSV file, such as an invoice for each client, downloaded together as a .zip. Each row fills in the draft's answers and empty cells keep them. The Free plan makes up to 5 per spreadsheet; Pro has no limit. The spreadsheet never leaves your browser.</li>
  <li>History: every draft records each document made from it (downloaded, printed, shared or from a spreadsheet) with the time, the file name and a SHA-256 fingerprint of the exact answers, and can restore any earlier answers.</li>
  <li>Share: send a finished document straight to Mail, Slack, Teams or Drive, where your device supports the share sheet.</li>
  <li>The first time you make a document, Clausery asks the browser to protect its storage from automatic clean-up.</li>
  <li>Clearer answers on the home page and in the FAQ about saving, editing documents later, rules and calculations, e-signatures, working with others and local law.</li>
</ul>
<h2>1.22.0 <span class="small muted">— 6 October 2026</span></h2>
<ul>
  <li>Invoice: name your tax number (VAT number, GST/HST number, ABN), add a separate date of supply for UK VAT, and title it "Tax invoice" for Australian GST.</li>
  <li>Invoice: an optional line, on by default with bank details, telling clients your bank details never change by email, the most common invoice fraud.</li>
  <li>Four new guides: what a UK VAT invoice must include, GST/HST invoice requirements in Canada, Australian tax invoices, and what bank details to put on an invoice.</li>
</ul>
<h2>1.21.0 <span class="small muted">— 6 October 2026</span></h2>
<ul>
  <li>The invoice, quote, purchase order, credit note and expense claim templates do the maths: line amounts, subtotal, discount, tax from a percentage, totals and the balance due are calculated as you type.</li>
  <li>Those five templates have a new layout: your details and the document's number and dates side by side, a proper item table, and a totals block, as in accounting software.</li>
  <li>Receipts can write the amount in words for you, and change orders work out the new contract price.</li>
  <li>Clearer questions, in the order you think about the document: your business, the details, the client, the items, then payment.</li>
  <li>Calculated amounts inside a list, such as each line's amount, now show as you type.</li>
  <li>Jumping ahead with the section list no longer marks the sections you skipped as needing fixes.</li>
</ul>
<h2>1.20.1 <span class="small muted">— 5 October 2026</span></h2>
<ul>
  <li>Reach us by email at getclausery@gmail.com: key requests, questions, template requests and problem reports no longer need a GitHub account.</li>
</ul>
<h2>1.20.0 <span class="small muted">— 5 October 2026</span></h2>
<ul>
  <li>Live preview: the document takes shape beside the questions as you answer, with unanswered questions shown as [labels]. Turn it off with the Live preview button; the app remembers your choice.</li>
  <li>Questions that only apply when a box is ticked, such as a purchase order number, a discount or bank details, now stay hidden until you tick it, in the app and in client intake forms.</li>
  <li>Sections say how many answers are left, and only turn red once you try to move past them.</li>
  <li>Clearer titles for the invoice, receipt and employment agreement templates.</li>
</ul>
<h2>1.19.0 <span class="small muted">— 4 October 2026</span></h2>
<ul>
  <li>Twelve new free templates: a room rental agreement, a rent payment plan agreement, a landlord reference letter, a performance improvement plan, a remote work agreement, an expense reimbursement form, a change order form, a consignment agreement, a pet sitting agreement, a coaching agreement, a contract termination letter and a credit note.</li>
  <li>Eight new guides: how to write a performance improvement plan and a remote work agreement, what a credit note and a change order are, how to terminate a contract, how consignment works, how to set up a rent payment plan, and what to put in an agreement when you rent out a room in your home.</li>
  <li>Every template page now shows a picture of the template's first page.</li>
  <li>The app accepts license keys bought through online checkout: activate the key from your receipt once, and renewals and cancellations apply on their own. The app checks the key with our payment provider about once a week, sending only the key; your documents never leave your browser. Offline keys keep working as before.</li>
  <li>Clearer page descriptions in search results for templates, clauses and guides.</li>
</ul>
<h2>1.18.2 <span class="small muted">— 3 October 2026</span></h2>
<ul>
  <li>The website now counts anonymous page views with Cloudflare Web Analytics, which uses no cookies and does not track individual visitors. The app and the embedded calculators are never counted; the privacy policy explains what is recorded.</li>
  <li>Four guides now list the primary sources they rely on.</li>
</ul>
<h2>1.18.1 <span class="small muted">— 3 October 2026</span></h2>
<ul>
  <li>License keys are signed with a new key, ready for online checkout of the Pro and Team plans.</li>
</ul>
<h2>1.18.0 <span class="small muted">— 3 October 2026</span></h2>
<ul>
  <li>Eight new free templates: a non-compete agreement, a nanny contract, a gift letter for a mortgage, a lease termination agreement, a severance agreement and release, a job description, a catering contract and a board resolution.</li>
  <li>Four new guides: whether non-competes are enforceable in 2026, how to write a gift letter for a mortgage, what to include in a severance agreement, and how to write a job description.</li>
  <li>The HR, landlord, freelancer and law firm pages, and the clause library, link the new templates.</li>
</ul>
<h2>1.17.0 <span class="small muted">— 2 October 2026</span></h2>
<ul>
  <li>Nine new free templates: an invoice, a price quote, a purchase order, a payment receipt, meeting minutes, a two weeks notice letter, a hold harmless agreement, an equipment rental agreement and a cleaning services contract.</li>
  <li>Four new guides: how to write an invoice, the difference between a quote, an estimate and an invoice, how to write a two weeks notice letter, and what a hold harmless agreement is.</li>
  <li>Library templates no longer count towards the Free plan: open as many as you like. The three-template limit now applies only to your own uploaded templates.</li>
  <li>New about and contact pages. Questions, key requests, template requests and bug reports go through GitHub, and security reports through GitHub's private vulnerability reporting.</li>
  <li>Until online checkout opens, the Pro and Team buttons open a key request, and the pricing page explains how keys are issued.</li>
  <li>Every page records the date its content last changed. Template and guide pages show it, and the sitemaps, the feed and the structured data use it, so search engines can tell what is new.</li>
</ul>
<h2>1.16.0 <span class="small muted">— 2 October 2026</span></h2>
<ul>
  <li>Find a template: a search box on the templates page filters all the templates as you type, and the home page has a search form that opens it.</li>
  <li>Template pages end with related templates picked for the document you are reading, then every template grouped by category, instead of one long list.</li>
  <li>The questions table on each template page says when a question is asked in words ("If “Has jurisdiction” is yes") instead of showing tag names.</li>
  <li>Guides are grouped by topic, show the date they were published, and end with the other guides on the same topic.</li>
  <li>Fixed names written in lower case mid-sentence: "mutual NDA", "MOU" and "For HR teams" keep their capitals.</li>
</ul>
<h2>1.15.1 <span class="small muted">— 1 October 2026</span></h2>
<ul>
  <li>The home page leads with the free template library: the most-used templates, guides and calculators are one click from the home page, and every comparison and audience page is linked from it.</li>
  <li>Search descriptions keep their second sentence instead of stopping at a short first one, so results say what each page offers.</li>
  <li>Section sitemaps (templates, guides, clauses, tools, comparisons, docs) under a sitemap index, with dates on guide and clause pages.</li>
</ul>
<h2>1.15.0 <span class="small muted">— 1 October 2026</span></h2>
<ul>
  <li>Five new guides: how to write a termination letter, how to return a security deposit, how to write a rent increase letter, what to include in a roommate agreement, and the difference between a non-compete and a non-solicitation agreement.</li>
  <li>Structured data on every indexable page, including the FAQ, the pricing plans and breadcrumbs for the docs, legal and index pages.</li>
  <li>The guides page has a clearer title and introduction.</li>
  <li>The embed code for the contract deadline calculator is taller, so the weekend note is no longer cut off on sites that remove the resize script.</li>
</ul>
<h2>1.14.0 <span class="small muted">— 28 September 2026</span></h2>
<ul>
  <li>Four new templates: an employment agreement with at-will or notice terms, an employee warning letter for first or final written warnings, a promotion letter, and a liability waiver with a parent section for minors.</li>
  <li>Guides to writing a warning letter to an employee, and to when liability waivers hold up.</li>
  <li>The HR page now lists every HR letter template in one place.</li>
</ul>
<h2>1.13.0 <span class="small muted">— 27 September 2026</span></h2>
<ul>
  <li>Every template page now shows the template's full wording, with the parts you fill in and the optional parts marked, so you can read it before you download it.</li>
  <li>A non-solicitation agreement template, which protects customer and staff relationships without a non-compete.</li>
  <li>A guide to the difference between an NDA and a confidentiality agreement, and how both differ from non-solicitation and non-compete agreements.</li>
</ul>
<h2>1.12.0 <span class="small muted">— 27 September 2026</span></h2>
<ul>
  <li>Three more NDA templates: an employee NDA with the Defend Trade Secrets Act notice and protected-disclosure wording, a contractor NDA for freelancers with portfolio rights, and an NDA for selling a business.</li>
  <li>A new page that compares all five NDA templates and helps you pick one.</li>
  <li>Guides to choosing a mutual or one-way NDA, and to how long an NDA should last.</li>
  <li>The mutual and one-way NDAs now keep trade secrets protected for as long as they stay secret.</li>
</ul>
<h2>1.11.0 <span class="small muted">— 27 September 2026</span></h2>
<ul>
  <li>Four more landlord and tenant templates: a rent receipt that handles partial payments, a rental application with a fair housing statement, a lease renewal letter and a pet addendum.</li>
  <li>Guides and free tool pages now carry breadcrumb data for search engines.</li>
</ul>
<h2>1.10.0 <span class="small muted">— 26 September 2026</span></h2>
<ul>
  <li>Four more landlord and tenant templates: a residential lease agreement, a sublease agreement, a move-in and move-out inspection checklist, and a late rent notice.</li>
  <li>A free prorated rent calculator for move-in and move-out, which can also be embedded on other websites.</li>
  <li>A guide to what to include in a residential lease agreement.</li>
  <li>Each free tool page now links to the other tools.</li>
</ul>
<h2>1.9.0 <span class="small muted">— 26 September 2026</span></h2>
<ul>
  <li>Four landlord and tenant templates: a tenant's notice to vacate, a rent increase letter, a security deposit return letter with itemized deductions, and a roommate agreement.</li>
  <li>A new page for landlords and tenants, and a guide to writing a notice to vacate.</li>
  <li>The .zip download on the templates page now holds all 42 templates, with a new folder for landlords and tenants.</li>
</ul>
<h2>1.8.1 <span class="small muted">— 26 September 2026</span></h2>
<ul>
  <li>Download all 38 templates at once as a .zip file, in a folder per category, from the templates page.</li>
  <li>Three new guides: how to write a bill of sale, how to lend money to family or friends, and when you need a model release.</li>
</ul>
<h2>1.8.0 <span class="small muted">— 26 September 2026</span></h2>
<ul>
  <li>Four more templates: a partnership agreement, a sales commission agreement, a photo and model release, and a general release of claims.</li>
  <li>A free sales commission calculator for flat or tiered rates and draws, which can also be embedded on other websites.</li>
  <li>A guide to what to include in a partnership agreement.</li>
</ul>
<h2>1.7.1 <span class="small muted">— 26 September 2026</span></h2>
<ul>
  <li>The template library is grouped by category: business agreements, freelance contracts, loans and getting paid, NDAs and letters, and HR letters.</li>
  <li>Comparison pages for LawDepot, Rocket Lawyer and eForms, with prices and free-trial terms.</li>
</ul>
<h2>1.7.0 <span class="small muted">— 26 September 2026</span></h2>
<ul>
  <li>Four more templates: a memorandum of understanding (MOU), a letter of intent to buy a business, a bill of sale with optional vehicle details, and a loan agreement.</li>
  <li>A free loan repayment calculator with a full repayment schedule, which can also be embedded on other websites.</li>
  <li>A guide to whether an MOU is legally binding, and how it differs from a letter of intent and a contract.</li>
</ul>
<h2>1.6.0 <span class="small muted">— 26 September 2026</span></h2>
<ul>
  <li>A free invoice due date calculator for net 30, net 60, end-of-month, 15 MFI and early payment discount terms such as 2/10 net 30.</li>
  <li>The calculators can now be added to any website with a line of embed code. They run in the visitor's browser with no cookies or tracking.</li>
</ul>
<h2>1.5.0 <span class="small muted">— 26 September 2026</span></h2>
<ul>
  <li>Three more templates: a payment reminder letter (friendly reminder or final notice), a subcontractor agreement and a monthly retainer agreement.</li>
  <li>A step-by-step guide to what to do when a client won't pay, with reminder emails you can copy.</li>
  <li>Comparison pages for HoneyBook, Bonsai, Dubsado and PandaDoc, for freelancers who only need contracts.</li>
</ul>
<h2>1.4.0 <span class="small muted">— 26 September 2026</span></h2>
<ul>
  <li>Five more contract templates: video production, virtual assistant, event planning, personal training and tutoring.</li>
  <li>Two free calculators: late payment interest (including UK statutory interest) and freelance hourly and day rates.</li>
  <li>Guides to writing a freelance contract and setting a kill fee.</li>
</ul>
<h2>1.3.0 <span class="small muted">— 26 September 2026</span></h2>
<ul>
  <li>Five freelance contract templates: web design, graphic design, photography, social media management and freelance writing.</li>
  <li>A page for freelancers, and clearer page titles and descriptions in search results.</li>
</ul>
<h2>1.2.1 <span class="small muted">— 26 September 2026</span></h2>
<ul>
  <li>Clausery has its own address: <a href="https://getclausery.github.io/">getclausery.github.io</a>. Links to the old address redirect here.</li>
</ul>
<h2>1.2.0 <span class="small muted">— 26 September 2026</span></h2>
<ul>
  <li>Contract clause library: plain-English explanations and copyable sample wording for 24 common clauses, each with the matching Clausery tags.</li>
  <li>New guides on offer letters, payment demand letters, statements of work and NDAs.</li>
  <li>Template pages link to explanations of the clauses they contain.</li>
  <li>Atom feed for guides and clauses, and an llms.txt summary for AI assistants.</li>
</ul>
<h2>1.1.0 <span class="small muted">— 26 September 2026</span></h2>
<ul>
  <li>Free template library of 17 Word templates: NDAs (mutual and one-way), engagement letter, consulting, service and independent contractor agreements, statement of work, offer, internship, salary increase, verification, reference, termination and resignation letters, payment demand, cease and desist, and a promissory note.</li>
  <li>One-click start: template pages open the questionnaire directly in the app.</li>
  <li>A tag used in several optional parts of a document is now asked whenever any of those parts applies.</li>
  <li>Better question types for instructions, assumptions, interest rates and last working days, and fewer optional sections mistaken for lists.</li>
</ul>
<h2>1.0.0 <span class="small muted">— 24 September 2026</span></h2>
<p>First public release.</p>
<ul>
  <li>Word (.docx) templates with tags, conditional and inverted sections, repeating groups in paragraphs, bullets and table rows.</li>
  <li>Automatic questionnaire from a template's tags: field types inferred from names, sections from shared prefixes, conditions applied to nested tags.</li>
  <li>Template designer: labels, help text, types, options, formats, required flags, show-when conditions, calculations, sections.</li>
  <li>Interview with section stepper, autosave, validation, review, on-screen preview, .docx download and print to PDF.</li>
  <li>Expression language for conditions and computed fields, with date, money and text functions.</li>
  <li>Local workspace in the browser database, backups, answer files, template packs.</li>
  <li>Optional encryption at rest (AES-256-GCM, PBKDF2) with auto-lock.</li>
  <li>Offline client intake forms as single HTML files.</li>
  <li>Offline-capable installable app (service worker), strict Content Security Policy, ${USAGE_ON ? 'no third-party requests other than anonymous usage counts' : 'no third-party requests'}.</li>
  <li>Offline license keys (Ed25519 signatures) with Free, Pro, Team and Enterprise plans.</li>
</ul>
</div></section>`,
  },
];
