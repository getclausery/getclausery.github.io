import { SITE, esc, ONLINE_KEYS, USAGE_ON, USAGE_REQUEST } from '../tools/partials.mjs';
import { PACK_FILE, LIB } from './library.mjs';
import { GUIDES } from './audience.mjs';
import { COMPETITORS } from './compare.mjs';
import { TOOLS } from './free-tools.mjs';
import { PRESETS } from '../app/lib/presets.js';
import { COUNTRIES } from './countries.mjs';

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

export const pages = [{
  path: '', title: 'Clausery',
  description: `Make invoices, quotes and receipts in Word with totals, tax and numbering done for you, plus ${LIB.length} free templates. No sign-up, and nothing is uploaded.`,
  extraHead: `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Clausery', url: SITE })}</script>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Clausery', url: SITE, logo: `${SITE}assets/icon-512.png`, sameAs: ['https://github.com/getclausery/getclausery.github.io'] })}</script>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Clausery', applicationCategory: 'BusinessApplication', operatingSystem: 'Any (web browser)', description: 'Document automation that never leaves your browser: Word templates become guided questionnaires that generate finished .docx files offline.', url: SITE, offers: [{ '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free' }, { '@type': 'Offer', price: '19', priceCurrency: 'USD', name: 'Pro (per user, monthly)' }], featureList: ['Client-side .docx generation', 'Conditional clauses and repeating groups', 'Calculations', 'Encrypted local workspace', 'Offline client intake forms', 'No account required'] })}</script>`,
  body: (rel) => `
<section class="hero">
  <div class="wrap">
    <div>
      <div class="eyebrow">${ico(I.calc)} For small businesses and freelancers</div>
      <h1>Invoices, quotes and receipts in Word, with the maths done for you.</h1>
      <p class="lead">Answer a few questions and download a finished Word file you can still edit. Totals, tax and discounts are calculated, and your next invoice starts with your details, the next number and today's date. No sign-up, and nothing you type leaves your browser.</p>
      <div class="actions">
        <a class="btn btn-primary btn-lg" href="${rel}app/#/start/invoice">Make an invoice, free</a>
        <a class="btn btn-lg" href="${rel}app/#/start/quote">Make a quote</a>
      </div>
      <p class="small" style="margin-top:.75rem"><a href="${rel}templates/">Or browse all ${LIB.length} free templates →</a></p>
      <div class="proof">
        <span>${ico(I.check)} No sign-up</span>
        <span>${ico(I.check)} Totals, tax and numbering done for you</span>
        <span>${ico(I.check)} An editable Word file, or print to PDF</span>
      </div>
    </div>
    <figure class="shot" style="margin:0">
      <img src="${rel}assets/screenshot-invoice.png" width="1200" height="800" alt="Clausery making an invoice: the questions on the left, and on the right the invoice itself with its line items, HST and total worked out">
    </figure>
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
    <h2>Built for people who cannot upload client files</h2>
    <p class="lead"><a href="${rel}for/law-firms.html">Law firms</a>, <a href="${rel}for/hr-teams.html">HR teams</a> and <a href="${rel}for/consultants.html">consultancies</a> draft the same documents every week from the same templates. The tools that automate this are cloud services that want the client's data first. Clausery does the same job with a different architecture: the browser does all the work, and the data never travels.</p>
    <div class="grid grid-3">
      <div class="feature"><div class="ico">${ico(I.shield)}</div><h3>Confidentiality by construction</h3><p>Templates, answers and generated documents are processed in memory in your browser and stored only on your device. There is no server that could be breached, subpoenaed or misconfigured.</p></div>
      <div class="feature"><div class="ico">${ico(I.file)}</div><h3>Your Word templates, unchanged</h3><p>Add tags like <code>{client_name}</code> to any .docx. Fonts, numbering, headers, tables and tracked formatting come through exactly as you set them in Word.</p></div>
      <div class="feature"><div class="ico">${ico(I.wifi)}</div><h3>Works offline, forever</h3><p>Once loaded, Clausery runs with no connection at all. Install it as an app and keep drafting on a train, in court, or on a client site with no guest Wi‑Fi.</p></div>
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
    <p class="lead">Cloud document-automation platforms are excellent products with a price and an architecture designed for larger firms. Clausery is for everyone else.</p>
    <div class="table-wrap">
    <table class="compare">
      <thead><tr><th scope="col">Capability</th><th scope="col">Clausery</th><th scope="col">Cloud automation platforms</th><th scope="col">Manual find-and-replace</th></tr></thead>
      <tbody>
        <tr><td>Where client data is processed</td><td class="yes">Your browser only</td><td class="no">Vendor's servers</td><td class="yes">Your computer</td></tr>
        <tr><td>Conditional clauses, repeats, calculations</td><td class="yes">Yes</td><td class="yes">Yes</td><td class="no">No</td></tr>
        <tr><td>Works offline</td><td class="yes">Yes</td><td class="no">No</td><td class="yes">Yes</td></tr>
        <tr><td>Setup time</td><td class="yes">Minutes</td><td class="no">Days to weeks, often with onboarding</td><td class="yes">None</td></tr>
        <tr><td>Vendor security questionnaire needed</td><td class="yes">No data shared, so usually no</td><td class="no">Yes</td><td class="yes">No</td></tr>
        <tr><td>Typical price</td><td class="yes">Free, or from $19 per user per month</td><td class="no">From about $83 to $417 per month, or $49 to $149 per user</td><td class="yes">Your time</td></tr>
      </tbody>
    </table>
    </div>
    <p class="small muted" style="margin-top:.75rem">Price ranges are the published 2026 entry and mid tiers of two widely used legal document-automation products; see the <a href="${rel}pricing/">pricing page</a> for sources. Feature comparisons are general and vary by product.</p>
    <p style="margin-top:1rem"><strong>Side-by-side comparisons:</strong> ${COMPETITORS.map((c) => `<a href="${rel}compare/${c.slug}.html">${esc(c.name)} alternative</a>`).join(' · ')} · <a href="${rel}compare/">all comparisons</a></p>
  </div>
</section>

<section class="section section-alt" id="trust">
  <div class="wrap">
    <div class="grid grid-2">
      <div>
        <h2>Verify it yourself</h2>
        <p>Open your browser's Network panel while you draft. The requests are for Clausery's own files from the site that serves it (the app, the sample templates, the intake-form runtime), and once installed they come from the offline cache${USAGE_ON ? `. The one other request is ${USAGE_REQUEST}` : ''}. Nothing you type or upload is ever sent: not to us, not to analytics, not to anyone. The source is readable, the document engine is open-source, and you can host a copy on your own domain or intranet.</p>
        <p><a href="${rel}docs/security.html">Read the security overview →</a></p>
      </div>
      <blockquote class="quote">"Seventy percent of respondents prioritized a data privacy policy when vetting vendors." <cite>Legal professionals surveyed on 2026 technology adoption; the cheapest privacy policy to audit is the one that says the data never left your machine.</cite></blockquote>
    </div>
  </div>
</section>

<section class="section" id="faq">
  <div class="wrap" style="max-width:48rem">
    <h2>Questions</h2>
    <div class="faq">
      <details><summary>Does it really not send anything anywhere?</summary><p>Correct. The app is static files. Once your browser has loaded them, everything (reading the template, evaluating your answers, assembling the .docx) happens in the page. Storage is your browser's local database. ${USAGE_ON || ONLINE_KEYS ? `Apart from fetching the app itself, the only requests are ${[USAGE_ON && USAGE_REQUEST, ONLINE_KEYS && 'a license check with Lemon Squeezy if you activate a key bought online'].filter(Boolean).join(', and ')}. None of them carries anything you typed.` : 'The only outbound requests in the entire product are the ones that fetch the app itself.'}</p></details>
      <details><summary>Is my work saved if I close the tab or my laptop dies?</summary><p>Yes. Every answer is saved as you type to your browser's built-in database, so drafts survive a refresh, a restart or a flat battery, and stay in your Drafts list until you delete them. The first time you make a document, Clausery also asks the browser to protect that storage from automatic clean-up.</p></details>
      <details><summary>Do I have to type my business details on every invoice?</summary><p>No. Your next invoice, quote or receipt starts with your business details, bank details and usual tax rate from the last one you made, the next number in your sequence (INV-0042 becomes INV-0043) and today's date. Only the client and the items are new. It all comes from the drafts saved in your browser; nothing is stored anywhere else.</p></details>
      <details><summary>Is the result a PDF I can't edit?</summary><p>No. You get a normal Word file (.docx) with your own formatting, which you can edit in Word, Google Docs or LibreOffice; printing to PDF is optional. To change a document later, reopen its draft, change any answer and download it again. Each draft keeps a history of every document made from it, with a fingerprint of the exact answers and a one-click restore.</p></details>
      <details><summary>Can it add a clause only when it applies, or make many documents at once?</summary><p>Yes to both. A rule such as <code>contract_value &gt; 5000</code> can switch a clause on or off, and the money templates add up line items and tax for you (see <a href="${rel}docs/logic.html">logic and calculations</a>). <em>From a spreadsheet</em> makes one document per row of a CSV file, such as an invoice for each client.</p></details>
      <details><summary>What doesn't it do?</summary><p>It has no e-signatures, no live co-editing and no server integrations, because each of those needs a server holding your documents, which is what Clausery avoids. Download the Word file or a PDF and sign it with the e-signature service you already use; share templates with your team as a template pack; and send a finished document straight to Mail, Slack or Teams with the Share button where your device supports it.</p></details>
      <details><summary>What happens to my data if I clear my browser?</summary><p>It is deleted, like any local data. Download a backup from Settings to keep a copy, or to move your templates and drafts to another computer or phone: restore it there and carry on. Template packs and answers files move single templates and drafts.</p></details>
      <details><summary>Which template features are supported?</summary><p>Tags, conditional sections, inverted sections, repeating groups (including in bullet lists and table rows), line breaks in answers, headers and footers. Formatting is whatever you set in Word. See the <a href="${rel}docs/templates.html">template syntax</a>.</p></details>
      <details><summary>Can clients fill in a questionnaire?</summary><p>Yes, without a portal. Export a client intake form (a single HTML file), send it, and import the answers file that comes back. It runs on their computer the same way the app runs on yours.</p></details>
      <details><summary>Is this legal advice? Is the output reviewed?</summary><p>No. Clausery is software that fills in the templates you give it. The content, review and sign-off of every document remain with you.</p></details>
      <details><summary>How do teams share templates?</summary><p>With template packs: a file that carries a set of templates and their questionnaires. Put it on the shared drive; everyone imports it. Licensing is per user${ONLINE_KEYS ? ', with one key you activate on each device' : ', verified offline with a signed key'}.</p></details>
    </div>
  </div>
</section>

<section class="cta">
  <div class="wrap">
    <h2>Make your next invoice in a couple of minutes.</h2>
    <p class="lead" style="margin:0 auto">Every library template is free, plus three of your own. No account, no card, no trial clock.</p>
    <div class="actions"><a class="btn btn-primary btn-lg" href="${rel}app/#/start/invoice">Make an invoice, free</a><a class="btn btn-lg" href="${rel}pricing/">See plans</a></div>
    <p class="small muted" style="margin-top:1.5rem">Find Clausery on <a href="https://fazier.com">Fazier</a> · <a href="https://twelve.tools">Twelve Tools</a> · <a href="https://www.uneed.best">Uneed</a> · <a href="https://www.saashub.com">SaaSHub</a></p>
    <p style="margin-top:.75rem"><a href="https://fazier.com" title="Clausery on Fazier"><img src="${rel}assets/badges/fazier.svg" width="182" height="43" alt="Featured on Fazier" loading="lazy"></a></p>
  </div>
</section>`,
}];
