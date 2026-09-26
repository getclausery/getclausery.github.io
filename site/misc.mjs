export const pages = [
  {
    path: '404.html', title: 'Page not found', description: 'The page you were looking for does not exist.',
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:40rem;text-align:center"><p class="eyebrow">404</p><h1>That page is not here.</h1><p class="lead" style="margin:0 auto 1.5rem">The address may be wrong, or the page moved. Nothing you do in Clausery is stored on a server, so there is nothing to recover from here.</p><div class="actions" style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="${rel}">Go to the home page</a><a class="btn" href="${rel}app/">Open the app</a></div></div></section>`,
  },
  {
    path: 'changelog.html', title: 'Changelog', description: 'What changed in each Clausery release.',
    body: (rel) => `<section class="section"><div class="wrap prose">
<h1>Changelog</h1>
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
  <li>Offline-capable installable app (service worker), strict Content Security Policy, no third-party requests.</li>
  <li>Offline license keys (Ed25519 signatures) with Free, Pro, Team and Enterprise plans.</li>
</ul>
</div></section>`,
  },
];
