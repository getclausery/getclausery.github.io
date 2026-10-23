import { SITE, esc, picture, ONLINE_KEYS, USAGE_ON, USAGE_REQUEST, faqLd } from '../tools/partials.mjs';
import { PACK_FILE, LIB } from './library.mjs';
import { GUIDES } from './audience.mjs';
import { COMPETITORS } from './compare.mjs';
import { TOOLS } from './free-tools.mjs';
import { PRESETS } from '../app/lib/presets.js';
import { COUNTRIES } from './countries.mjs';
import { PRICES, TRIAL_DAYS, REFUND_DAYS } from '../app/config.js';

// The home page is the most-crawled URL on the site, so it links straight to the pages people search for most. That puts
// them one click from the home page instead of two, which is the strongest crawl-priority signal a new site can give.
const POPULAR_TEMPLATES = ['invoice', 'independent-contractor-agreement', 'residential-lease-agreement', 'mutual-nda', 'employment-agreement', 'quote', 'two-weeks-notice-letter', 'bill-of-sale', 'hold-harmless-agreement', 'non-compete-agreement', 'gift-letter', 'job-description', 'promissory-note', 'liability-waiver', 'offer-letter', 'resignation-letter', 'consulting-agreement', 'partnership-agreement', 'loan-agreement', 'notice-to-vacate', 'rent-receipt', 'cease-and-desist-letter', 'service-agreement', 'statement-of-work', 'roommate-agreement', 'memorandum-of-understanding', 'letter-of-intent', 'rental-application', 'sublease-agreement', 'purchase-order', 'meeting-minutes', 'photo-release-form', 'general-release'];
const POPULAR_GUIDES = ['how-to-write-an-invoice', 'how-to-write-a-two-weeks-notice-letter', 'are-non-competes-enforceable', 'how-to-write-a-bill-of-sale', 'what-to-include-in-a-lease-agreement', 'is-an-mou-legally-binding', 'are-liability-waivers-enforceable', 'how-long-should-an-nda-last', 'how-to-write-a-termination-letter', 'what-to-do-when-a-client-wont-pay', 'how-to-lend-money-to-family'];
// The documents small businesses make most, each with calculations and remembered details in the app (app/lib/setups.js).
const SMALL_BUSINESS = [
  ['invoice', 'Invoice', 'Line items, discount, VAT, GST or sales tax, bank details and balance due.'],
  ['quote', 'Price quote', 'Itemised prices with tax, a valid-until date, deposit and what is not included.'],
  ['payment-receipt', 'Payment receipt', 'Proof of payment with the amount in words, partial payments and the balance left.'],
  ['rent-receipt', 'Rent receipt', 'The rent period, late fees and other charges, for each payment a tenant makes.'],
  ['purchase-order', 'Purchase order', 'What you are ordering from a supplier, delivery details, tax and shipping.'],
  ['credit-note', 'Credit note', 'Credits or refunds part of an invoice, with the tax worked out again.'],
];
const pick = (list, slugs, what) => slugs.map((s) => list.find((x) => x.slug === s) || (() => { throw new Error(`home: no ${what} ${s}`); })());
const linkList = (items) => `<ul class="link-cols">${items.map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join('')}</ul>`;
const ico = (d) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const I = { lock: 'M6 11h12v10H6zM9 11V7a3 3 0 016 0v4', file: 'M6 3h8l4 4v14H6zM14 3v4h4', bolt: 'M13 2L4 14h7l-1 8 9-12h-7z', users: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8', wifi: 'M5 12.5a11 11 0 0114 0M8.5 16a6 6 0 017 0M12 20h.01M2 9a15 15 0 0120 0', calc: 'M4 3h16v18H4zM8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0', check: 'M5 12l5 5L20 7', shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z' };

import { workflowLinks } from './invoice-workflows.mjs';

const HOME_FAQ = [
  ['Is Clausery really free? What does Pro add?', `Yes. Every library template and up to three of your own are free, with unlimited documents and no time limit; documents made from library templates end with a small "Made with Clausery" line. Pro ($${PRICES.pro} a month) leaves that line out and adds unlimited templates of your own with calculations, unlimited documents from a spreadsheet, workspace encryption and client intake forms. Try Pro free for ${TRIAL_DAYS} days: no card, and it simply ends.`],
  ['Are my document contents uploaded?', `No. Reading templates, evaluating document answers and assembling the .docx happen in your browser. Saved documents use its local database. ${USAGE_ON || ONLINE_KEYS ? `Separate from document processing, requests include ${[USAGE_ON && 'an anonymous count when a document is made', ONLINE_KEYS && 'a license check with Lemon Squeezy if you activate a key bought online'].filter(Boolean).join(', and ')}. These do not carry document contents.` : 'The app requests its own files from the site that serves it.'}`],
  ['Is the result a PDF I can\'t edit?', 'No. You get a normal Word file (.docx) with your own formatting, which you can edit in Word, Google Docs or LibreOffice; printing to PDF is optional. To change a document later, reopen its draft, change any answer and download it again. Each draft keeps a history of every document made from it, with a fingerprint of the exact answers and a one-click restore.'],
  ['Do I have to type my business details on every invoice?', 'No. Your next invoice, quote or receipt starts with your business details, bank details and usual tax rate from the last one you made, the next number in your sequence (INV-0042 becomes INV-0043) and today\'s date. Only the client and the items are new. It all comes from the drafts saved in your browser; nothing is stored anywhere else.'],
];

export const pages = [{
  path: '', title: 'Free Word invoice maker — no signup, editable .docx',
  description: `Free Word invoice maker: invoices, quotes, receipts, contracts and templates for small businesses and freelancers. Make an editable .docx in your browser — no account, no card, nothing uploaded. Not the compliance platform at clausery.ai.`,
  extraHead: `<link rel="preload" as="image" type="image/webp" href="./assets/screenshot-invoice.webp" imagesrcset="./assets/screenshot-invoice-800.webp 800w, ./assets/screenshot-invoice.webp 1200w" imagesizes="1px" fetchpriority="high">
<meta name="directree-verify" content="18cd9ea3fefedd43ee1d57c58248886c">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE}#website`, name: 'Clausery', url: SITE, inLanguage: 'en-GB' })}</script>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${SITE}#webpage`, url: SITE, name: 'Clausery', description: 'Make invoices, quotes and receipts in Word, plus free templates for contracts, HR letters and landlord forms. Nothing is uploaded.', inLanguage: 'en-GB', isPartOf: { '@id': `${SITE}#website` } })}</script>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE}#organization`, name: 'Clausery', url: SITE, logo: `${SITE}assets/icon-512.png`, sameAs: ['https://github.com/getclausery/getclausery.github.io'] })}</script>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Clausery', applicationCategory: 'BusinessApplication', operatingSystem: 'Any (web browser)', description: 'Create invoices, quotes and receipts from free Word templates. Guided questions generate editable .docx files on your device.', url: SITE, offers: [{ '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free' }, { '@type': 'Offer', price: String(PRICES.pro), priceCurrency: 'USD', name: 'Pro (per user, monthly)' }], featureList: ['Client-side .docx generation', 'Conditional clauses and repeating groups', 'Calculations', 'Encrypted local workspace', 'Offline client intake forms', 'No account required'] })}</script>${faqLd(HOME_FAQ)}`,
  body: (rel) => `
<section class="hero">
  <div class="wrap">
    <div>
      <div class="eyebrow">${ico(I.calc)} Free · No account · No card · Editable Word</div>
      <h1>Make a free invoice in Word in 60 seconds — no signup.</h1>
      <p class="lead">Answer a few questions and download a finished <strong>.docx</strong> you can still edit. Totals, tax, discounts and the next invoice number are done for you. Nothing you type is uploaded — it all runs in your browser.</p>
      <p class="small muted" style="margin-top:.25rem"><strong>Looking for the enterprise compliance platform at clausery.ai?</strong> Same name, different product — that one does policy management for regulated companies (ISO 27001, DORA, GDPR, NIS2). You're on the free Word-templates / invoice site for freelancers and small businesses. <a href="https://www.clausery.ai/" rel="noopener">clausery.ai →</a></p>
      <div class="actions">
        <a class="btn btn-primary btn-lg" href="${rel}app/#/start/invoice">Make my free invoice →</a>
        <a class="btn btn-lg" href="${rel}templates/">Browse ${LIB.length} free templates</a>
      </div>
      <p class="small" style="margin-top:.75rem">Or start with a <a href="${rel}app/#/start/quote">quote</a> · <a href="${rel}app/#/start/receipt">receipt</a> · <a href="${rel}business-document-kit/">free 6-template business kit</a></p>
      <div class="proof">
        <span>${ico(I.check)} No email, no password</span>
        <span>${ico(I.check)} Downloads as a normal Word file</span>
        <span>${ico(I.check)} Works offline once loaded</span>
        <span>${ico(I.check)} ${LIB.length} templates, all free</span>
      </div>
      <div class="as-seen" style="margin-top:1.25rem;display:flex;gap:.6rem 1rem;flex-wrap:wrap;align-items:center;font-size:.82rem;color:#7a8ba3">
        <span style="display:inline-flex;align-items:center;gap:.4rem"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0l2 5h5l-4 3 1.5 5L8 10l-4.5 3L5 8 1 5h5z" fill="#f59e0b"/></svg> Featured on <a href="https://fazier.com/launches/clausery" rel="noopener" style="color:#cfe0f3">Fazier</a></span>
        <span>·</span>
        <a href="https://github.com/getclausery" rel="noopener" style="color:#cfe0f3">Public source on GitHub</a>
        <span>·</span>
        <span>Updated ${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
        <span>·</span>
        <span>No ads, no tracking cookies</span>
      </div>
    </div>
    <figure class="shot" style="margin:0">
      <div class="hero-demo" aria-label="Interactive preview — fill in three fields and watch the invoice total update live">
        <picture aria-hidden="true" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${picture({ src: `${rel}assets/screenshot-invoice.png`, webp: [[`${rel}assets/screenshot-invoice-800.webp`, 800], [`${rel}assets/screenshot-invoice.webp`, 1200]], sizes: '1px', width: 1200, height: 800, loading: 'eager', fetchpriority: 'high', alt: '' })}</picture>
        <div class="demo-q">
          <label>
            <span>Hourly rate ($)</span>
            <input type="number" id="demo-rate" value="85" min="0" step="1" inputmode="decimal">
          </label>
          <label>
            <span>Hours</span>
            <input type="number" id="demo-hours" value="12" min="0" step="0.25" inputmode="decimal">
          </label>
          <label>
            <span>Sales tax (%)</span>
            <input type="number" id="demo-tax" value="0" min="0" step="0.1" inputmode="decimal">
          </label>
          <p class="demo-hint">Try it — numbers update as you type. Nothing is sent anywhere.</p>
        </div>
        <div class="demo-inv" aria-hidden="true">
          <div class="inv-head">
            <strong>INVOICE</strong>
            <span>#1042 · ${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
          </div>
          <div class="inv-row inv-headrow"><span>Description</span><span>Qty</span><span>Rate</span><span>Amount</span></div>
          <div class="inv-row"><span>Design work</span><span id="d-hours">12.00</span><span>$<span id="d-rate">85.00</span></span><span>$<span id="d-subtotal">1,020.00</span></span></div>
          <div class="inv-totals">
            <div><span>Subtotal</span><span>$<span id="d-sub2">1,020.00</span></span></div>
            <div><span>Tax (<span id="d-taxpct">0</span>%)</span><span>$<span id="d-taxamt">0.00</span></span></div>
            <div class="inv-total"><span>TOTAL DUE</span><span>$<span id="d-total">1,020.00</span></span></div>
          </div>
          <a class="demo-cta" href="${rel}app/#/start/invoice">Make a real invoice →</a>
        </div>
      </div>
    </figure>
  </div>
</section>
<style>
.hero-demo{display:grid;grid-template-columns:240px 1fr;gap:1.25rem;background:#0d1b2e;border:1px solid #1f3454;border-radius:14px;padding:1.1rem;box-shadow:0 20px 50px rgba(4,10,20,.35);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif}
.demo-q label{display:block;margin-bottom:.7rem}
.demo-q label span{display:block;font-size:.78rem;color:#8aa0bd;margin-bottom:.25rem;letter-spacing:.02em;text-transform:uppercase}
.demo-q input{width:100%;padding:.5rem .65rem;border:1px solid #2a456b;background:#0a1626;color:#eaf1fb;border-radius:8px;font-size:1rem;font-variant-numeric:tabular-nums;outline:none;transition:border-color .15s,box-shadow .15s}
.demo-q input:focus{border-color:#4f8cff;box-shadow:0 0 0 3px rgba(79,140,255,.25)}
.demo-hint{font-size:.72rem;color:#6d83a1;margin:.4rem 0 0;line-height:1.3}
.demo-inv{background:#fff;color:#111;border-radius:8px;padding:1rem 1.1rem;font-size:.78rem}
.inv-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:.85rem;padding-bottom:.6rem;border-bottom:2px solid #111}
.inv-head strong{font-size:1.2rem;letter-spacing:.08em}
.inv-head span{color:#555;font-size:.7rem}
.inv-row{display:grid;grid-template-columns:1fr 54px 70px 80px;gap:.4rem;padding:.3rem 0;font-variant-numeric:tabular-nums}
.inv-row span:last-child,.inv-totals span:last-child{text-align:right}
.inv-headrow{font-weight:700;font-size:.66rem;text-transform:uppercase;color:#444;border-bottom:1px solid #ddd;padding-bottom:.4rem}
.inv-totals{margin-top:.5rem;border-top:1px solid #ddd;padding-top:.4rem}
.inv-totals > div{display:flex;justify-content:space-between;padding:.15rem 0;font-variant-numeric:tabular-nums}
.inv-total{border-top:2px solid #111;margin-top:.25rem;padding-top:.4rem !important;font-weight:700;font-size:.92rem}
.demo-cta{display:block;text-align:center;margin-top:.75rem;background:#2563eb;color:#fff !important;text-decoration:none;padding:.5rem;border-radius:6px;font-weight:600;font-size:.85rem}
.demo-cta:hover{background:#1d4ed8}
@media (max-width:900px){.hero-demo{grid-template-columns:1fr}.demo-q{order:2}.demo-inv{order:1}}
</style>
<script src="${rel}assets/hero-demo.js" defer></script>

<section class="section section-alt" id="proof">
  <div class="wrap">
    <h2>Proof, not adjectives</h2>
    <p class="lead">Every claim on this site points at something you can open: the code, the release notes, the security write-up and the pricing configuration. Six checks, none of them a customer quote.</p>
    <div class="grid grid-3" style="margin-top:2rem">
      <div class="feature"><h3>The code is public</h3><p>The app, the document engine and this website are published on <a href="https://github.com/getclausery" rel="noopener">GitHub</a>, so you can read what actually runs when you press a button.</p></div>
      <div class="feature"><h3>Every release is logged</h3><p>Each version is listed in the <a href="${rel}changelog.html">changelog</a> with what changed, including the ones that fixed something.</p></div>
      <div class="feature"><h3>No account, no card</h3><p>All ${LIB.length} templates are free with no sign-up and no time limit. Pro is $${PRICES.pro} per user per month when you want more.</p></div>
      <div class="feature"><h3>A guarantee, not a promise</h3><p>If it is not right for you, email and ask for a refund within ${REFUND_DAYS} days. No form, and no reason needed.</p></div>
      <div class="feature"><h3>See what leaves your browser</h3><p>The <a href="${rel}docs/security.html">security overview</a> lists every request the app makes, and the <a href="${rel}legal/privacy.html">privacy policy</a> lists every data flow.</p></div>
      <div class="feature"><h3>Run it yourself</h3><p>Follow the <a href="${rel}docs/self-hosting.html">self-hosting guide</a> to run a copy on your own domain or intranet, if your policies ask for that.</p></div>
    </div>
    <p style="margin-top:1.5rem"><a href="${rel}why-clausery/">Why Clausery: the differences, a decision guide and the proof in one page →</a></p>
  </div>
</section>

<section class="section" id="small-business">
  <div class="wrap">
    <h2>Everything a small business sends, ready to fill in</h2>
    <p class="lead">Each one asks only what changes, works out the numbers and gives you a Word file in your own name.</p>
    <div class="grid grid-3">
${SMALL_BUSINESS.map(([slug, name, what]) => `      <div class="feature"><h3><a href="${rel}templates/${slug}.html">${esc(name)}</a></h3><p>${esc(what)}</p><p><a class="btn btn-sm btn-primary" href="${rel}app/#/start/${slug}">Fill it in</a></p></div>`).join('\n')}
    </div>
    <p style="margin-top:1.25rem"><strong>Invoice templates by trade:</strong> ${Object.entries(PRESETS.invoice).map(([slug, p]) => `<a href="${rel}invoice-templates/${slug}.html">${esc(p.name)}</a>`).join(' · ')} · <a href="${rel}invoice-templates/">all trades →</a></p>
    <p><strong>By country (VAT and GST set up for you):</strong> ${COUNTRIES.map((c) => `<a href="${rel}invoice-templates/${c.slug}.html">${esc(c.country)}</a>`).join(' · ')}</p>
    <!--nav--><p><strong>By billing task:</strong> ${workflowLinks(rel)}. Worked examples and a starter for each stage of the job.</p><!--/nav-->
    <p><a class="btn" href="${rel}business-document-kit/">Get the free six-template business kit</a> <span class="small muted">Quote, scope, invoice, receipt, purchase order and credit note. No email signup.</span></p>
    <div class="grid grid-3" style="margin-top:2rem">
      <div class="feature"><div class="ico">${ico(I.calc)}</div><h3>Adds itself up</h3><p>Line amounts, discount, VAT, GST or sales tax, total and balance due update as you type. No formula to break.</p></div>
      <div class="feature"><div class="ico">${ico(I.check)}</div><h3>Remembers your details</h3><p>Your next invoice starts with your business details, bank details, tax rate and the next number filled in. Only the client and the items are new.</p></div>
      <div class="feature"><div class="ico">${ico(I.users)}</div><h3>Many at once</h3><p>Monthly invoices for twenty clients? Fill in one row per client in a spreadsheet and get all twenty Word files in one go with Pro, or five at a time free.</p></div>
    </div>
  </div>
</section>

<section class="section section-alt" id="templates">
  <div class="wrap">
    <h2>Free Word templates, filled in online</h2>
    <p class="lead">${LIB.length} ready-made Word templates, from NDAs and employment contracts to leases, liability waivers and freelance contracts. Read the full wording, answer a few questions, and download a finished .docx. No sign-up, and nothing you type leaves your browser.</p>
    <form class="find-form" action="${rel}templates/" method="get" role="search" aria-label="Find a free template">
      <label class="sr-only" for="home-q">Find a template</label>
      <input id="home-q" name="q" type="search" placeholder="Find a template: lease, NDA, invoice…" autocomplete="off">
      <button class="btn btn-primary" type="submit">Search</button>
    </form>
    <div class="grid grid-4">
      <a class="feature" style="text-decoration:none;color:inherit" href="${rel}nda-templates/"><h3>NDA templates</h3><p>Mutual, one-way, employee, contractor and business sale.</p></a>
      <a class="feature" style="text-decoration:none;color:inherit" href="${rel}for/landlords.html"><h3>Landlord forms</h3><p>Lease, notice to vacate, rent receipt, late rent notice.</p></a>
      <a class="feature" style="text-decoration:none;color:inherit" href="${rel}for/hr-teams.html"><h3>HR letter templates</h3><p>Offer, contract, warning, promotion and more.</p></a>
      <a class="feature" style="text-decoration:none;color:inherit" href="${rel}for/freelancers.html"><h3>Freelance contracts</h3><p>Contractor, retainer, design, writing and SOW.</p></a>
    </div>
    <h3 style="margin-top:2rem">Most-used templates</h3>
    ${linkList(pick(LIB, POPULAR_TEMPLATES, 'template').map((t) => [`${rel}templates/${t.slug}.html`, `${t.name} template`]))}
    <div class="grid grid-2" style="margin-top:1.5rem">
      <div><h3>Guides</h3>${linkList(pick(GUIDES, POPULAR_GUIDES, 'guide').map((g) => [`${rel}guides/${g.slug}.html`, g.title]))}</div>
      <div><h3>Free calculators</h3>${linkList(TOOLS.map((t) => [`${rel}free-tools/${t.slug}.html`, t.name]))}</div>
    </div>
    <p style="margin-top:1.25rem"><a href="${rel}templates/">See all ${LIB.length} free templates →</a> &nbsp;·&nbsp; <a href="${rel}samples/${PACK_FILE}" download>Download them all (.zip) →</a> &nbsp;·&nbsp; <a href="${rel}clauses/">Contract clauses explained →</a> &nbsp;·&nbsp; <a href="${rel}guides/">All guides →</a></p>
  </div>
</section>

<section class="section" id="why">
  <div class="wrap">
    <h2>For the paperwork around a small business job</h2>
    <p class="lead">Send a quote, define the scope, request a deposit, bill the work and record the payment. Clausery helps <a href="${rel}for/freelancers.html">freelancers</a>, <a href="${rel}for/consultants.html">consultants</a> and service businesses prepare the Word documents they send repeatedly, while keeping document contents on their own device.</p>
    <div class="grid grid-3">
      <div class="feature"><div class="ico">${ico(I.shield)}</div><h3>Your document contents stay local</h3><p>Templates, answers and generated documents are processed in your browser and saved on your device. Download backups to keep a separate copy or move your work.</p></div>
      <div class="feature"><div class="ico">${ico(I.file)}</div><h3>Your Word templates, unchanged</h3><p>Add tags like <code>{client_name}</code> to any .docx. Fonts, numbering, headers, tables and tracked formatting come through exactly as you set them in Word.</p></div>
      <div class="feature"><div class="ico">${ico(I.wifi)}</div><h3>Keep working offline</h3><p>Once the required app and template files are available, keep drafting on a train or at a client site. Online license checks have their own offline grace period.</p></div>
    </div>
  </div>
</section>

<section class="section section-alt" id="how">
  <div class="wrap">
    <h2>Three steps to a finished document</h2>
    <ol class="steps">
      <li><h3>Pick a document</h3><p>Start from an invoice, a quote or any of the ${LIB.length} free templates. There is nothing to install and no account to make.</p></li>
      <li><h3>Answer the questions</h3><p>Plain questions, one section at a time, with the document updating beside them. Amounts, tax and totals are worked out for you, and everything saves as you type.</p></li>
      <li><h3>Download it</h3><p>Get a normal Word file in your own name, ready to send, or print it to PDF. Change an answer later and make it again in a second.</p></li>
    </ol>
    <p style="margin-top:1.5rem">Already have your own invoice or contract in Word? Put tags like <code>{client_name}</code> where the details change and Clausery turns it into the same kind of questionnaire, keeping your formatting. <a href="${rel}docs/templates.html">How to tag a template →</a></p>
  </div>
</section>

<section class="section section-ink" id="features">
  <div class="wrap">
    <h2>Everything a drafting tool needs. Nothing that uploads your work.</h2>
    <div class="grid grid-3">
      <div class="feature"><div class="ico">${ico(I.bolt)}</div><h3>Conditional clauses</h3><p class="muted">Show or hide any part of the document based on answers: yes/no questions, choices, or expressions like <code>fee_type == "flat" and amount > 5000</code>.</p></div>
      <div class="feature"><div class="ico">${ico(I.users)}</div><h3>Repeating groups</h3><p class="muted">Parties, attorneys, beneficiaries, line items: add as many as needed and the document repeats paragraphs, bullets or table rows for each one.</p></div>
      <div class="feature"><div class="ico">${ico(I.calc)}</div><h3>Calculations</h3><p class="muted">Totals, dates, durations and amounts in words: <code>format_money(sum(items.amount) * 1.2)</code>, <code>add_days(signed_on, 30)</code>, <code>words(term_years)</code>.</p></div>
      <div class="feature"><div class="ico">${ico(I.lock)}</div><h3>Encrypted workspace</h3><p class="muted">Optionally encrypt everything stored in the browser with a passphrase (AES-256-GCM). The workspace locks itself after inactivity.</p></div>
      <div class="feature"><div class="ico">${ico(I.file)}</div><h3>Offline client intake</h3><p class="muted">Export a questionnaire as a single HTML file. The client fills it in on their own computer and sends back an answers file. No portal, no account for them either.</p></div>
      <div class="feature"><div class="ico">${ico(I.users)}</div><h3>Template packs for teams</h3><p class="muted">Export a firm's templates as a pack and share it over your existing file share or email. Everyone drafts from the same approved versions.</p></div>
    </div>
  </div>
</section>

<section class="section" id="compare">
  <div class="wrap">
    <h2>How it compares</h2>
    <p class="lead">Choose the tool that matches your workflow. Clausery focuses on local document generation and editable Word output; check another product's current features when you need hosted collaboration or signatures.</p>
    <div class="table-wrap">
    <table class="compare">
      <thead><tr><th scope="col">Capability</th><th scope="col">Clausery</th><th scope="col">Cloud automation platforms</th><th scope="col">Manual find-and-replace</th></tr></thead>
      <tbody>
        <tr><td>Where client data is processed</td><td class="yes">Your browser only</td><td class="no">Vendor's servers</td><td class="yes">Your computer</td></tr>
        <tr><td>Conditional clauses, repeats, calculations</td><td class="yes">Yes</td><td class="yes">Yes</td><td class="no">No</td></tr>
        <tr><td>Works offline</td><td class="yes">After required files are loaded</td><td>Check the product</td><td class="yes">Yes</td></tr>
        <tr><td>Ready-made business templates</td><td class="yes">Free library and six-template business kit</td><td>Check the product</td><td>You supply the document</td></tr>
        <tr><td>Price</td><td class="yes">Free; Pro $${PRICES.pro} per user per month, with a ${TRIAL_DAYS}-day free trial</td><td>Check current vendor pricing</td><td>Your existing Word software and time</td></tr>
      </tbody>
    </table>
    </div>
    <p class="small muted" style="margin-top:.75rem">Product features vary. See <a href="${rel}pricing/">Clausery's current plans</a> and confirm the features you need before choosing a tool.</p>
    <p style="margin-top:1rem"><strong>Side-by-side comparisons:</strong> ${COMPETITORS.map((c) => `<a href="${rel}compare/${c.slug}.html">${esc(c.name)} alternative</a>`).join(' · ')} · <a href="${rel}compare/">all comparisons</a></p>
    <p style="margin-top:.75rem">Not sure which kind of tool you need? <a href="${rel}why-clausery/">Why Clausery</a> starts from the job rather than the product: one table of differences, a decision guide that names the right alternative for each kind of work, and the proof you can check yourself.</p>
  </div>
</section>

<section class="section section-alt" id="plans">
  <div class="wrap" style="max-width:60rem">
    <h2>Free for everyday documents. Pro when the paperwork is your business.</h2>
    <p class="lead">Start free with no account. When you send documents every week, Pro takes the Clausery line off them and automates your own templates.</p>
    <div class="grid grid-2">
      <div class="plan">
        <h3>Free</h3>
        <p class="price">$0 <small>no time limit</small></p>
        <ul>
          <li>Every template in the free library, unlimited documents</li>
          <li>Totals, tax and numbering done for you</li>
          <li>Up to 3 of your own Word templates</li>
          <li class="no">Remove the “Made with Clausery” line from library documents</li>
        </ul>
        <a class="btn" href="${rel}app/#/start/invoice">Make an invoice, free</a>
      </div>
      <div class="plan featured">
        <h3>Pro</h3>
        <p class="price">$${PRICES.pro} <small>/ user / month</small></p>
        <ul>
          <li>No “Made with Clausery” line on your documents</li>
          <li>Unlimited own templates, with calculations</li>
          <li>Unlimited documents from a spreadsheet</li>
          <li>Encrypted workspace and client intake forms</li>
        </ul>
        <a class="btn btn-primary" href="${rel}app/#/trial">Try Pro free for ${TRIAL_DAYS} days</a>
        <p class="small muted" style="margin:.6rem 0 0;text-align:center">No card, nothing renews. ${REFUND_DAYS}-day money-back guarantee when you buy. <a href="${rel}pricing/">All plans</a></p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="trust">
  <div class="wrap">
    <div class="grid grid-2">
      <div>
        <h2>Verify it yourself</h2>
        <p>Open your browser's Network panel while you draft. The requests are for Clausery's own files from the site that serves it (the app, the sample templates, the intake-form runtime), and once installed they come from the offline cache${USAGE_ON ? `. The one other request is ${USAGE_REQUEST}` : ''}. Nothing you type or upload is ever sent: not to us, not to analytics, not to anyone. The source is readable, the document engine is open-source, and you can host a copy on your own domain or intranet.</p>
        <p><a href="${rel}docs/security.html">Read the security overview →</a></p>
      </div>
      <div class="feature"><h3>Check the parts that matter to you</h3><p>Try a free invoice, reopen its saved draft and download the Word output. Read the <a href="${rel}legal/privacy.html">privacy policy</a> for cookieless analytics and license checks, and the <a href="${rel}docs/security.html">security overview</a> for local storage and backups.</p></div>
    </div>
  </div>
</section>

<section class="section section-alt" id="faq">
  <div class="wrap" style="max-width:48rem">
    <h2>Questions</h2>
    <div class="faq">
      ${HOME_FAQ.map(([q,a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n      ')}
      <details><summary>Can it add a clause only when it applies, or make many documents at once?</summary><p>Yes to both. A rule such as <code>contract_value &gt; 5000</code> can switch a clause on or off, and the money templates add up line items and tax for you (see <a href="${rel}docs/logic.html">logic and calculations</a>). <em>From a spreadsheet</em> makes one document per row of a CSV file, such as an invoice for each client.</p></details>
      <details><summary>What doesn't it do?</summary><p>It has no e-signatures, no live co-editing and no server integrations, because each of those needs a server holding your documents, which is what Clausery avoids. Download the Word file or a PDF and sign it with the e-signature service you already use; share templates with your team as a template pack; and send a finished document straight to Mail, Slack or Teams with the Share button where your device supports it.</p></details>
      <details><summary>What happens to my data if I clear my browser?</summary><p>It is deleted, like any local data. Download a backup from Settings to keep a copy, or to move your templates and drafts to another computer or phone: restore it there and carry on. Template packs and answers files move single templates and drafts.</p></details>
      <details><summary>Which template features are supported?</summary><p>Tags, conditional sections, inverted sections, repeating groups (including in bullet lists and table rows), line breaks in answers, headers and footers. Formatting is whatever you set in Word. See the <a href="${rel}docs/templates.html">template syntax</a>.</p></details>
      <details><summary>Can clients fill in a questionnaire?</summary><p>Yes, without a portal. Export a client intake form (a single HTML file), send it, and import the answers file that comes back. It runs on their computer the same way the app runs on yours.</p></details>
      <details><summary>Is this legal advice? Is the output reviewed?</summary><p>No. Clausery is software that fills in the templates you give it. The content, review and sign-off of every document remain with you.</p></details>
      <details><summary>How do teams share templates?</summary><p>With template packs: a file that carries a set of templates and their questionnaires. Put it on the shared drive; everyone imports it. Licensing is per user${ONLINE_KEYS ? '; the private Open Clausery link from your receipt activates each licensed browser automatically' : ', verified offline with a signed key'}.</p></details>
      <details><summary>Is this the Clausery compliance platform for ISO 27001 / DORA / NIS2?</summary><p>No. This Clausery is a free tool for making Word invoices, quotes, receipts, NDAs and other small-business templates, with documents assembled in your browser. The enterprise compliance-policy platform with the same name is a separate company at <a href="https://www.clausery.ai/" rel="noopener">clausery.ai</a> — it manages approved policy versions, cross-references and audit trails for regulated organisations. Same name, different product; no affiliation.</p></details>
    </div>
  </div>
</section>

<section class="cta">
  <div class="wrap">
    <h2>Your next invoice is one minute away.</h2>
    <p class="lead" style="margin:0 auto">No signup, no card. Fill in the boxes, download a Word file, done. Pro is only for people who want to automate their own templates — and it's free to try for ${TRIAL_DAYS} days.</p>
    <div class="actions"><a class="btn btn-primary btn-lg" href="${rel}app/#/start/invoice">Make my free invoice →</a><a class="btn btn-lg" href="${rel}pricing/">See Pro ($${PRICES.pro}/mo)</a></div>
    <p class="small muted" style="margin-top:1.5rem">Read <a href="${rel}about/">about Clausery</a>, see the <a href="${rel}why-clausery/">differences from other tools</a>, or browse <a href="${rel}templates/">all ${LIB.length} free templates</a>.</p>
  </div>
</section>`,
}];
