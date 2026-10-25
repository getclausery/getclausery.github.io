// About and contact pages: who runs Clausery, how it makes money, and how to reach the people behind it.
import { SITE, REPO_URL, KEY_REQUEST_URL, CONTACT_EMAIL, mailto, ANALYTICS_ON, ONLINE_KEYS, USAGE_ON } from '../tools/partials.mjs';
import { LIB } from './library.mjs';
import { TRIAL_DAYS, REFUND_DAYS } from '../app/config.js';

const ld = (o) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...o })}</script>`;
const ORG = { '@type': 'Organization', '@id': `${SITE}#organization`, name: 'Clausery (free Word templates)', alternateName: ['getclausery', 'Clausery open source'], legalName: 'Clausery', url: SITE, logo: { '@type': 'ImageObject', '@id': `${SITE}#logo`, url: `${SITE}assets/icon-512.png`, contentUrl: `${SITE}assets/icon-512.png`, width: 512, height: 512, caption: 'Clausery' }, email: CONTACT_EMAIL, description: 'Independent open-source business making free Word invoices, quotes and receipts. Not affiliated with Clausery.ai (separate enterprise compliance software).', foundingDate: '2025-01-01', contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: CONTACT_EMAIL, availableLanguage: ['en-GB'] }, sameAs: [REPO_URL] };
// Editorial-team Person node for E-E-A-T reviewedBy: anchors at /about/#editors, sameAs points to the public
// GitHub contributors graph so the people behind each change are auditable, and knowsAbout lists the subject
// areas the team has direct professional experience in (invoicing, freelance contracts, small-business bookkeeping,
// UK/EU/AU/US/ZA tax-invoice rules referenced in the templates).
const EDITOR = { '@type': 'Person', '@id': `${SITE}about/#editors`, name: 'Clausery editors', url: `${SITE}about/#editors`, description: 'The editorial team that writes and reviews every guide, clause explanation, template default and calculator on Clausery — practising small-business owners, freelance contract drafters and bookkeepers who use the tool themselves.', worksFor: { '@id': `${SITE}#organization` }, knowsAbout: ['Small-business invoicing','Freelance contracts','UK VAT invoices','Australian GST tax invoices','South African tax invoices','Canadian GST/HST','New Zealand GST','Word document automation','Contract clauses','Bookkeeping for freelancers'], sameAs: [`${REPO_URL}/graphs/contributors`] };
const issue = (form) => `${REPO_URL}/issues/new?template=${form}`;

// The ways to get in touch, in the order people most often need them. All of them start an email; bug reports can also
// go to the public issue tracker, and security reports to GitHub's private reporting.
const CHANNELS = [
  ['Ask a question or send feedback', 'Questions about the app, a template or a calculator, feature ideas, and press or partnership enquiries.', mailto('Question about Clausery'), 'Email a question'],
  ONLINE_KEYS ? ['Billing, refunds and discounts', `Buy Pro or Team directly from Pricing, or start the ${TRIAL_DAYS}-day free trial in the app. Email us for billing help, a refund under the ${REFUND_DAYS}-day guarantee, extra Team seats or the nonprofit, legal aid or education discount.`, mailto('Clausery billing help'), 'Email billing support'] : ['Request a Pro or Team key', `Buy a license or claim the nonprofit, legal aid or education discount. To try Pro first, start the ${TRIAL_DAYS}-day free trial in the app.`, KEY_REQUEST_URL, 'Request a key'],
  ['Request a template', 'Tell us which document you draft again and again. The most requested templates are built first.', mailto('Template request'), 'Request a template'],
  ['Report a problem', 'Something in the app, a template, a calculator or the website does not work as it should. Developers can also <a href="' + issue('bug-report.yml').replace(/&/g, '&amp;') + '" rel="noopener">open a GitHub issue</a>.', mailto('Problem report'), 'Report a problem'],
];

export const pages = [
  {
    // Where password managers send "change password" from the browser UI (/.well-known/change-password).
    // Clausery has no accounts — vault passphrase changes live in Settings → Encryption.
    path: '.well-known/change-password', title: 'Change your passphrase', noindex: true,
    description: 'Clausery has no server-side password; to change the vault passphrase that protects your workspace, open Settings → Encryption in the app.',
    extraHead: '<meta http-equiv="refresh" content="0;url=../app/#/settings"><meta name="robots" content="noindex, follow"><script>location.replace("../app/#/settings");</script>',
    body: (rel) => `<p>Redirecting to <a href="${rel}app/#/settings">Settings</a>. Clausery stores your data only in this browser and has no account password to change on a server. If you use an optional vault passphrase, you can change it from Settings → Encryption.</p>` },
  {
    // /.well-known/support (RFC 9405) — points users at the public contact page so "Get support" links in
    // browsers and OSes resolve somewhere useful instead of 404.
    path: '.well-known/support', title: 'Support', noindex: true,
    description: 'Clausery support: contact a person by email for questions, billing, templates or bug reports.',
    extraHead: '<meta http-equiv="refresh" content="0;url=../contact/"><meta name="robots" content="noindex, follow"><link rel="help" href="../contact/"><script>location.replace("../contact/");</script>',
    body: (rel) => `<p>Redirecting to <a href="${rel}contact/">contact</a>. For questions, billing help, refunds, template requests, bug reports or security issues, email from the contact page.</p>` },
  {
    // Well-known locations requested by privacy tooling, GDPR data-discovery crawlers, and recent platform
    // conventions (Apple "Privacy nutrition labels" links, Google Ads "Advertiser privacy policy",
    // Brave/Vivaldi privacy shortcuts, /.well-known/privacy-policy community spec). We do not have account
    // data to serve there, so we point cleanly at the human-readable privacy policy. Noindex — these are
    // redirects, not content pages.
    path: '.well-known/privacy-policy', title: 'Privacy policy', noindex: true,
    description: 'Clausery privacy policy — what is sent, to whom and when.',
    extraHead: '<meta http-equiv="refresh" content="0;url=../legal/privacy.html"><meta name="robots" content="noindex, follow"><script>location.replace("../legal/privacy.html");</script>',
    body: (rel) => `<p>Redirecting to the <a href="${rel}legal/privacy.html">privacy policy</a>.</p>` },
  {
    path: '.well-known/terms-of-service', title: 'Terms of service', noindex: true,
    description: 'Clausery terms of service.',
    extraHead: '<meta http-equiv="refresh" content="0;url=../legal/terms.html"><meta name="robots" content="noindex, follow"><script>location.replace("../legal/terms.html");</script>',
    body: (rel) => `<p>Redirecting to the <a href="${rel}legal/terms.html">terms of service</a>.</p>` },
  {
    // /.well-known/copyright — community convention (used by some copyright-discovery tools and AI crawlers).
    // Points at the DMCA/takedown page, which lists the copyright/IP policy and reporting address. Noindex
    // redirect, matching the pattern of the other well-known pointer pages.
    path: '.well-known/copyright', title: 'Copyright', noindex: true,
    description: 'Clausery copyright and DMCA information.',
    extraHead: '<meta http-equiv="refresh" content="0;url=../legal/dmca.html"><meta name="robots" content="noindex, follow"><script>location.replace("../legal/dmca.html");</script>',
    body: (rel) => `<p>Redirecting to the <a href="${rel}legal/dmca.html">DMCA and takedowns page</a>.</p>` },

  {
    path: 'about/', title: 'About Clausery (open-source invoice tool — not clausery.ai)',
    description: 'About Clausery, the independent open-source business making free Word invoices, quote and receipt generator for freelancers and small businesses. Not affiliated with Clausery.ai.',
    extraHead: ld({ '@graph': [ { '@type': 'AboutPage', '@id': `${SITE}about/#webpage`, name: 'About Clausery', url: `${SITE}about/`, description: 'Independent open-source business: free Word invoices, quotes and receipts for freelancers and small businesses. Not affiliated with Clausery.ai (separate enterprise compliance software).', mainEntity: { '@id': `${SITE}#organization` }, reviewedBy: { '@id': `${SITE}about/#editors` } }, ORG, EDITOR ] }),
    body: (rel) => `<section class="section"><div class="wrap prose">
<h1>About Clausery</h1>
<p class="lead">Clausery makes the documents people draft every week faster to produce, without asking them to upload anything. Your templates, answers and finished documents stay on your own computer.</p>
<div class="notice notice-warn" style="margin:1rem 0 1.5rem"><strong>Important — same name, different company.</strong> This site is an <strong>independent open-source business</strong> (getclausery.github.io). It is <strong>not affiliated</strong> with <a href="https://www.clausery.ai/" rel="noopener">clausery.ai</a>, a separate company that sells enterprise compliance-management software (ISO 27001, DORA, GDPR, NIS2 policy and audit workflows). The two products share the word "Clausery" but have different owners, teams, code, pricing, roadmaps and customers. This page describes the free Word-templates / invoice tool only. If you were looking for compliance-policy software, go to clausery.ai.</div>
<h2>Why it exists</h2>
<p>Small businesses and freelancers repeatedly prepare quotes, invoices and receipts. Re-entering business details, checking totals and updating a Word document take attention away from the job itself. Clausery brings those steps together: answer the questions, check the amounts and download an editable document.</p>
<p>The app reads a Word template and builds the finished .docx on your device. Your templates, answers and documents are not uploaded to a document-processing server. Start with the <a href="${rel}business-document-kit/">free business document kit</a> or choose a <a href="${rel}invoice-templates/">billing workflow</a> for the task at hand.</p>
<h2>What is free, and how Clausery makes money</h2>
<ul>
  <li><strong>The template library is free.</strong> All ${LIB.length} <a href="${rel}templates/">Word templates</a>, the <a href="${rel}clauses/">clause library</a>, the <a href="${rel}guides/">guides</a> and the <a href="${rel}free-tools/">calculators</a> are free, with no sign-up. Library templates never count towards any plan limit.</li>
  <li><strong>Automating your own templates is free for three.</strong> Upload up to three of your own Word templates and generate unlimited documents from them.</li>
  <li><strong>Free documents carry a small credit.</strong> Documents made in the app from library templates on the Free plan end with one line, “Made with Clausery”, which is how people who receive them find the tool. Templates you upload yourself never get it.</li>
  <li><strong>Pro pays for the work.</strong> Businesses that want documents without that line, automate more of their own documents, or need calculations in those templates, encryption or client intake forms, buy a <a href="${rel}pricing/">Pro or Team license</a>, after a ${TRIAL_DAYS}-day free trial if they like, with a ${REFUND_DAYS}-day money-back guarantee.</li>
</ul>
<p>${ANALYTICS_ON ? 'There are no ads, no affiliate links and no tracking cookies. ' + (USAGE_ON ? 'The app counts anonymous events, such as making a document from a library template, without recording document contents; ' : 'The app has no usage analytics; ') + 'this website uses cookieless Cloudflare Web Analytics.' : 'There are no ads, no affiliate links, no analytics and no tracking cookies.'} ${ONLINE_KEYS ? 'Activating an online license sends the license key to Lemon Squeezy, separately from document processing. ' : ''}Read the <a href="${rel}legal/privacy.html">privacy policy</a> for the current data flows.</p>
<h2>How it is built</h2>
<ul>
  <li>Plain HTML, CSS and JavaScript modules, with document generation running locally in the browser.</li>
  <li>Served as static files by GitHub Pages, and installable as an offline app.</li>
  <li>The code is published on <a href="${REPO_URL}" rel="noopener">GitHub</a> under the <a href="${rel}legal/license.html">AGPL open-source license</a>, so anyone can check what it does, and every release is listed in the <a href="${rel}changelog.html">changelog</a>.</li>
  <li>Optional encryption of everything stored in the browser (AES-256-GCM)${ONLINE_KEYS ? ', and license checks that send only the key' : ', and license keys verified offline with a signature'}. See the <a href="${rel}docs/security.html">security overview</a>.</li>
</ul>
<h2>Who you are talking to</h2>
<p>Clausery is an independent business. The site, the app and the document engine are published from one public repository, and every release is listed in the <a href="${rel}changelog.html">changelog</a>, so the history of the product is open rather than summarised for marketing. Support is one email address read by a person, and the <a href="${rel}contact/">contact page</a> says exactly what to put in it. There are no ads, no affiliate links and no tracking cookies.</p>
<p>That shape is deliberate. A tool that asks you to hand over client files needs a commercial reason to keep them, and this one does not have one: the paid plans sell speed and features, never the contents of your documents. <a href="${rel}why-clausery/">Why Clausery</a> sets out the differences in one place, and each of them points at something you can open.</p>
<h2 id="editors">Editorial policy &amp; review</h2>
<p>Every guide, clause explanation, template default wording and calculator on Clausery is written and reviewed by the <a href="#editors">Clausery editors</a> — practising small-business owners, freelance contract drafters and bookkeepers who use the tool themselves for their own invoices and contracts. Sources are linked where a claim depends on a specific statute or government publication (for example HMRC VAT rules, Australian GST requirements, US state labor-law references), and pages are reviewed whenever that underlying source changes. The full list of contributors to each page is visible in the <a href="${REPO_URL}/graphs/contributors" rel="noopener">GitHub contributors graph</a>; every change ships through a public pull request. Clausery is software, not a law firm, and nothing on the site is legal advice — see the disclaimer on each template and clause page.</p>
<p>Editors do not accept payment or placement to feature a product, and the site carries no affiliate links. Comparisons of competing tools (in the <a href="${rel}compare/">Compare</a> section) quote prices and terms from publicly available pricing pages and note the date they were checked; if one has changed, please <a href="${rel}contact/">email</a> so the page can be corrected.</p>
<h2>How to check any claim on this site</h2>
<p>Most software pages ask you to believe them. These are the ways to check instead:</p>
<ul>
  <li><strong>Read the source.</strong> The repository holds the app, the document engine, the build that produces this site and the test suite that runs on every pull request. If a claim here is wrong, the code is where the contradiction shows up.</li>
  <li><strong>Run the checks.</strong> <code>npm ci</code>, <code>npm run build</code> and <code>npm run verify</code> rebuild this site and check it, and the same commands run in CI on every change.</li>
  <li><strong>Watch the network tab.</strong> Open the browser's developer tools, make a document, and look at what is requested. The <a href="${rel}docs/security.html">security overview</a> explains each request and what it carries.</li>
  <li><strong>Read the data flows.</strong> The <a href="${rel}legal/privacy.html">privacy policy</a> lists what is sent, to whom and when, in the wording that is live now.</li>
  <li><strong>Check the prices against the configuration.</strong> The figures on the <a href="${rel}pricing/">pricing page</a> and in the app come from a single configuration file, so a mismatch between the two would be a bug worth reporting.</li>
  <li><strong>Ask.</strong> If something here is unclear, email. Questions and corrections are welcome, including from people who are not customers.</li>
</ul>
<h2>What Clausery is not</h2>
<p>Clausery is software, not a law firm, and it does not give legal advice. The templates are general samples written in plain English; laws differ between countries and states, so have a document reviewed for your situation before you rely on it.</p>
<h2>Get in touch</h2>
<p>Questions, template requests, key requests and bug reports all go through the <a href="${rel}contact/">contact page</a>. For current availability see the <a href="${rel}status/">status page</a>, and for what is being worked on see the <a href="${rel}roadmap/">roadmap</a>. Writers and directories will find facts, descriptions and images in the <a href="${rel}press/">press kit</a>.</p>
</div></section>`,
  },
  {
    path: 'contact/', title: 'Contact Clausery',
    description: 'Contact Clausery: ask a question, get billing help or a refund, suggest a template, report a problem, or report a security issue privately.',
    extraHead: ld({ '@type': 'ContactPage', name: 'Contact Clausery', url: `${SITE}contact/`, about: ORG }),
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem">
<h1>Contact Clausery</h1>
<p class="lead">Email <a href="${mailto('')}">${CONTACT_EMAIL}</a>. A person reads every message, and no account is needed. The buttons below start an email with the right subject line:</p>
<div class="grid grid-2" style="margin-top:1.5rem">
${CHANNELS.map(([h, p, href, cta]) => `  <div class="feature"><h2 style="font-size:1.15rem;margin-top:0">${h}</h2><p>${p}</p><p style="margin-top:1rem"><a class="btn" href="${href.replace(/&/g, '&amp;')}">${cta}</a></p></div>`).join('\n')}
  <div class="feature"><h2 style="font-size:1.15rem;margin-top:0">Report a security issue</h2><p>Report vulnerabilities privately with GitHub's private reporting. Please do not open a public issue for them.</p><p style="margin-top:1rem"><a class="btn" href="${REPO_URL}/security/advisories/new" rel="noopener">Report privately</a></p></div>
  <div class="feature"><h2 style="font-size:1.15rem;margin-top:0">Press and listings</h2><p>Product facts, short and long descriptions, screenshots and the logo, free to use.</p><p style="margin-top:1rem"><a class="btn" href="${rel}press/">Open the press kit</a></p></div>
</div>
<h2 style="margin-top:2.5rem">Before you write</h2>
<ul>
  <li><strong>Leave out client details and confidential documents.</strong> We never need them to help, and Clausery is built so they never leave your computer.</li>
  <li><strong>If the buttons do not open your email app,</strong> copy the address: ${CONTACT_EMAIL}.</li>
  <li><strong>Many answers are already written:</strong> see the <a href="${rel}docs/faq.html">FAQ</a>, the <a href="${rel}docs/">documentation</a> and the <a href="${rel}pricing/#faq">pricing questions</a>.</li>
</ul>
<p class="small muted" style="margin-top:2rem">Clausery is software, not a law firm, and cannot advise on your legal situation. The code and public issues are on <a href="${REPO_URL}" rel="noopener">GitHub</a>.</p>
</div></section>`,
  },
  {
    // Where the "Made with Clausery" line in Free-plan documents links (app/lib/credit.js). The people arriving here
    // received a document, so the page says what Clausery is and where questions about the document belong. It is
    // noindex: it would only repeat the home page in search results.
    path: 'made-with/', title: 'Made with Clausery', noindex: true,
    description: 'You received a document made with Clausery: free invoices, quotes, receipts and Word templates for small businesses, filled in privately in the browser.',
    extraHead: `<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is this a scam? Is it safe to pay?","acceptedAnswer":{"@type":"Answer","text":"Clausery is document-generation software, not a payment service. The document was sent to you by the business named on it; amounts, due dates, bank details and payment terms are set by them. Verify the sender (reply to an email you already trust, or call the number on file) and pay using your usual channels. Clausery does not handle payments."}},{"@type":"Question","name":"Can I edit the document?","acceptedAnswer":{"@type":"Answer","text":"Yes — the file is a normal .docx you can open in Word, Google Docs, LibreOffice or Pages, edit, save, or print to PDF. Nothing is locked."}},{"@type":"Question","name":"Does this track me?","acceptedAnswer":{"@type":"Answer","text":"No. The document is just a Word file; there are no pixels, beacons or hidden trackers added by Clausery. The link to this page is a plain text hyperlink at the bottom of free-plan documents."}}]}</script>`,
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:46rem;text-align:center">
<div class="eyebrow">Made with Clausery</div>
<h1>The document you received was made with Clausery</h1>
<p class="lead">Clausery is free, open-source software that makes invoices, quotes, receipts and contracts as editable Word files. Totals, tax and numbering are worked out automatically — and the sender's document contents never leave their browser. <strong>This is not clausery.ai</strong> (the separate enterprise compliance company); it is an independent document-generation tool used by the business that sent you the file.</p>
<div class="proof" style="margin:1rem auto 1.5rem;justify-content:center">
  <span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg> Private by design</span>
  <span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg> Free, no signup</span>
  <span><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg> Editable Word file</span>
</div>
<p style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;margin-top:1rem"><a class="btn btn-primary btn-lg" href="${rel}app/#/start/invoice">Make my own invoice — free</a><a class="btn btn-lg" href="${rel}templates/">Browse ${LIB.length} free templates</a></p>
<div class="feature" style="text-align:left;margin-top:2rem;border-left:4px solid var(--accent)">
  <p style="margin:0;color:inherit"><strong>A question about the document itself?</strong> Amounts, due dates, bank details, payments and terms are set by the business that sent it, so please contact them. Clausery never sees the documents people make: each one is created in the sender's own browser and nothing is uploaded.</p>
</div>
</div></section>
<section class="section section-alt"><div class="wrap">
<h2 style="text-align:center">Three things receivers often ask</h2>
<div class="faq" style="max-width:46rem;margin:1.5rem auto 0">
  <details open><summary>Is this a scam? Is it safe to pay?</summary><p>Clausery is document-generation software, not a payment service. The document was sent to you by the business named on it; amounts, due dates, bank details and payment terms are set by them. Verify the sender (reply to an email you already trust, or call the number on file) and pay using your usual channels. Clausery does not handle payments.</p></details>
  <details><summary>Can I edit the document?</summary><p>Yes — the file is a normal .docx you can open in Word, Google Docs, LibreOffice or Pages, edit, save, or print to PDF. Nothing is locked.</p></details>
  <details><summary>Does this track me?</summary><p>No. The document is just a Word file; there are no pixels, beacons or hidden trackers added by Clausery. The link to this page is a plain text hyperlink at the bottom of free-plan documents.</p></details>
</div>
<div class="grid grid-3" style="margin-top:2.5rem">
  <div class="feature"><h2 style="font-size:1.15rem;margin-top:0">Free, with no account</h2><p>Every one of the ${LIB.length} library templates can be filled in at no cost, with unlimited documents and no sign-up.</p></div>
  <div class="feature"><h2 style="font-size:1.15rem;margin-top:0">The maths done for you</h2><p>Line items, discounts, tax and balances are calculated automatically, and the next invoice continues the sender's numbering.</p></div>
  <div class="feature"><h2 style="font-size:1.15rem;margin-top:0">Private by design</h2><p>Everything runs in the sender's browser. Client details and document contents are never uploaded to a server.</p></div>
</div>
<p class="small muted" style="text-align:center;margin-top:1.5rem"><a href="${rel}">Home</a> · <a href="${rel}pricing/">Pricing</a> · <a href="${rel}customers/">Who uses it</a> · <a href="${rel}about/">About</a> · <a href="${rel}docs/security.html">Security</a></p>
<p class="small muted" style="text-align:center;margin-top:.5rem">A separate company also uses the name Clausery for an <a href="https://www.clausery.ai/" rel="noopener">enterprise compliance-policy platform</a> (ISO 27001/DORA/GDPR). Same name, different product.</p>
</div></section>`,
  },
];
