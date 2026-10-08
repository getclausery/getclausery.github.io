import { USAGE_ON } from '../tools/partials.mjs';
export const pages = [
  {
    path: '404.html', title: 'Page not found', description: 'The page you were looking for does not exist.',
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:40rem;text-align:center"><p class="eyebrow">404</p><h1>That page is not here.</h1><p class="lead" style="margin:0 auto 1.5rem">The address may be wrong, or the page moved. Nothing you do in Clausery is stored on a server, so there is nothing to recover from here.</p><div class="actions" style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="${rel}">Go to the home page</a><a class="btn" href="${rel}app/">Open the app</a></div></div></section>`,
  },
  {
    path: 'changelog.html', title: 'Changelog', description: 'Release notes for Clausery, newest first: the free templates, guides, calculators and app features added in each version.',
    body: (rel) => `<section class="section"><div class="wrap prose">
<h1>Changelog</h1>
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
