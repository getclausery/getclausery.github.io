// Pages for each buyer, and how-to guides that answer the searches those buyers make.
import { esc, faqLd, faqHtml, crumbsLd } from '../tools/partials.mjs';

const AUD = [
  { slug: 'law-firms', name: 'Law firms', title: 'Document automation for small law firms, without uploading client files',
    intro: 'Engagement letters, NDAs, demand letters, wills and leases: most firms draft the same documents every week from Word files that already exist. Clausery turns those files into questionnaires and assembles the finished document on the lawyer\'s own computer.',
    points: [['Confidentiality you can explain in one sentence', 'Client information is typed into the browser and the document is built there. It is never sent to Clausery or anyone else, so there is no vendor holding client data.'], ['Keep your precedents', 'Your Word templates keep their styles, numbering and letterhead. Add tags where details change; nothing is re-created in a new editor.'], ['Clients answer without a portal', 'Send a questionnaire as a single file. The client fills it in offline and returns an answers file you import into the draft.'], ['Encrypted on the device', 'Turn on a passphrase and everything stored in the browser is encrypted, with automatic locking when you step away.']],
    templates: ['engagement-letter', 'mutual-nda', 'one-way-nda', 'cease-and-desist-letter', 'letter-of-intent', 'memorandum-of-understanding', 'loan-agreement', 'promissory-note', 'bill-of-sale', 'partnership-agreement', 'general-release', 'payment-demand-letter'],
    related: [['compare/gavel-alternative.html', 'Clausery compared with Gavel'], ['compare/clio-draft-alternative.html', 'Clausery compared with Clio Draft'], ['compare/hotdocs-alternative.html', 'Clausery compared with HotDocs'], ['guides/confidentiality-checklist-document-software.html', 'Confidentiality checklist for document software'], ['guides/client-intake-without-a-portal.html', 'Client intake without a portal'], ['clauses/', 'Contract clauses explained']],
    faq: [['Is Clausery suitable for confidential client matters?', 'Documents are assembled in the browser on the lawyer\'s own computer, and nothing you type or generate is sent to Clausery. On the Pro plan you can also encrypt everything stored in the browser with a passphrase. Check the set-up against your own IT policies and professional rules.'],
      ['Can we use our existing Word precedents?', 'Yes. Add {tags} where details change, wrap optional clauses in a section, and upload the file. Styles, numbering, headers and letterhead are kept exactly.'],
      ['How is it different from Gavel, Clio Draft or HotDocs?', 'Those products run on a vendor\'s servers or need installing, and offer more, such as hosted client portals and practice management integrations. Clausery does the core job, templates into questionnaires into finished documents, in the browser with no server involved. The comparison pages set out the trade-offs honestly.'],
      ['What does it cost?', 'Free for up to three templates with unlimited documents. Pro, with unlimited templates, calculations, encryption and client intake forms, is $19 per user per month.']] },
  { slug: 'hr-teams', name: 'HR teams', title: 'Generate offer letters and HR documents in minutes, privately',
    intro: 'Offer letters, verification letters and contractor agreements contain salaries, addresses and personal data. Clausery produces them from your approved templates without putting that data in another cloud service.',
    points: [['Approved wording, every time', 'HR owns the template; managers answer questions. Optional clauses such as equity, bonus or relocation only appear when they apply.'], ['Personal data stays on the device', 'Salary and personal details are never uploaded, which keeps your records of processing and vendor reviews simple.'], ['Share templates across the team', 'Export a template pack to your shared drive; colleagues import it and draft from the same approved version.'], ['No per-document fees', 'Generate as many letters as you need on every plan.']],
    templates: ['offer-letter', 'internship-offer-letter', 'salary-increase-letter', 'employment-verification-letter', 'reference-letter', 'employment-termination-letter', 'sales-commission-agreement', 'independent-contractor-agreement'],
    related: [['guides/how-to-write-an-offer-letter.html', 'How to write a job offer letter'], ['clauses/at-will-employment-clause.html', 'At-will employment clause'], ['clauses/non-compete-clause.html', 'Non-compete clause'], ['clauses/confidentiality-clause.html', 'Confidentiality clause']],
    faq: [['Does employee data leave our computers?', 'No. Names, salaries and addresses are typed into the browser and the letter is generated there. Nothing is sent to Clausery or any other service.'],
      ['Can managers use it without training?', 'Yes. HR sets up the template once; managers answer plain-language questions and download the finished letter. Optional wording only appears when it applies.'],
      ['How do we keep records of the letters we send?', 'Every draft is saved in the browser and can be backed up to a file. Keep the final signed letters in your HR system as you do today.'],
      ['What does it cost?', 'Free for up to three templates with unlimited letters. Pro, with unlimited templates, calculations, encryption and template packs, is $19 per user per month.']] },
  { slug: 'consultants', name: 'Consultants and agencies', title: 'Proposals, SOWs and contractor agreements without another subscription',
    intro: 'Statements of work, contractor agreements and client letters follow the same pattern every time. Clausery turns your Word versions into a two-minute questionnaire and keeps client details on your laptop.',
    points: [['Repeat deliverables and line items', 'List as many deliverables, milestones or fee lines as you need; the document repeats the paragraph or table row for each one.'], ['Totals calculated for you', 'Add computed fields such as a sum of line items, a date 30 days after signing, or an amount in words.'], ['Works on the road', 'Once loaded, Clausery works offline, including on a train or a client site without Wi-Fi.'], ['Your branding, untouched', 'Your template keeps its logo, fonts and layout.']],
    templates: ['consulting-agreement', 'statement-of-work', 'service-agreement', 'retainer-agreement', 'subcontractor-agreement', 'independent-contractor-agreement', 'memorandum-of-understanding', 'payment-reminder-letter', 'payment-demand-letter'],
    related: [['guides/what-to-include-in-a-statement-of-work.html', 'What to include in a statement of work'], ['guides/is-an-mou-legally-binding.html', 'Is an MOU legally binding?'], ['guides/how-to-write-a-payment-demand-letter.html', 'How to write a demand letter for unpaid invoices'], ['clauses/payment-terms-clause.html', 'Payment terms clause'], ['clauses/intellectual-property-clause.html', 'Intellectual property clause'], ['free-tools/deadline-calculator.html', 'Contract deadline calculator'], ['guides/what-to-do-when-a-client-wont-pay.html', 'What to do when a client won\'t pay'], ['compare/pandadoc-alternative.html', 'Clausery compared with PandaDoc']],
    faq: [['Can I add a table of deliverables or fees?', 'Yes. Put the repeat tags in a table row and the row repeats for each deliverable or line item, keeping your borders and shading.'],
      ['Can it calculate totals and dates?', 'Yes, on the Pro plan: computed fields can add up line items, work out a date 30 days after signing, or write an amount in words.'],
      ['Does it work without an internet connection?', 'Yes. Once the app has loaded, it works offline, so you can draft on a train or at a client site.'],
      ['What does it cost?', 'Free for up to three templates with unlimited documents. Pro is $19 per user per month.']] },
  { slug: 'freelancers', name: 'Freelancers', title: 'Free freelance contract templates you can fill in online',
    intro: 'Designers, photographers, videographers, virtual assistants, planners, trainers, tutors and writers all need a signed contract before work starts. Clausery turns a free Word contract into a two-minute questionnaire, so each client gets the right terms without you editing the document by hand.',
    points: [['Contracts written for your trade', 'Page lists for web projects, concepts and file formats for designers, retainers and usage rights for photographers, platforms and posting schedules for social media, word counts and bylines for writers.'], ['Stop scope creep in writing', 'Revision rounds, content deadlines, hourly rates for extra work and kill fees are built in, so the conversation is already settled when a client asks for "one more change".'], ['Client details stay on your laptop', 'Names, fees and addresses are typed into your browser and the contract is built there. Nothing is uploaded, and it works offline.'], ['Free for your first three templates', 'Use up to three contracts free with unlimited documents; Pro removes the limit for $19 a month.']],
    templates: ['web-design-contract', 'graphic-design-contract', 'photography-contract', 'photo-release-form', 'video-production-contract', 'social-media-management-contract', 'freelance-writing-contract', 'virtual-assistant-agreement', 'event-planning-contract', 'personal-training-agreement', 'tutoring-agreement', 'retainer-agreement', 'subcontractor-agreement', 'independent-contractor-agreement', 'payment-reminder-letter', 'payment-demand-letter'],
    related: [['guides/how-to-write-a-freelance-contract.html', 'How to write a freelance contract'], ['guides/what-to-do-when-a-client-wont-pay.html', 'What to do when a client won\'t pay'], ['guides/what-is-a-kill-fee.html', 'What is a kill fee?'], ['free-tools/freelance-rate.html', 'Freelance rate calculator'], ['free-tools/invoice-due-date.html', 'Invoice due date calculator (net 30)'], ['free-tools/late-payment-interest.html', 'Late payment interest calculator'], ['clauses/intellectual-property-clause.html', 'Who owns the work: intellectual property clause'], ['clauses/payment-terms-clause.html', 'Payment terms clause'], ['clauses/late-payment-interest-clause.html', 'Late payment interest clause'], ['guides/how-to-write-a-payment-demand-letter.html', 'How to write a demand letter for unpaid invoices'], ['free-tools/deadline-calculator.html', 'Contract deadline calculator'], ['compare/honeybook-alternative.html', 'Clausery compared with HoneyBook'], ['compare/bonsai-alternative.html', 'Clausery compared with Bonsai'], ['compare/dubsado-alternative.html', 'Clausery compared with Dubsado']],
    faq: [['Do I need a contract for small freelance jobs?', 'A short written agreement avoids most disputes about scope, revisions, payment and ownership, whatever the size of the job. Email acceptance of a clear contract is often enough, though some documents need a signature.'], ['Can I reuse the same contract for every client?', 'Yes. Answer the questions for each client and download a finished Word contract. Optional terms, such as a deposit, kill fee or maintenance plan, only appear when you switch them on.'], ['Are these contracts legally binding?', 'They are general templates. Whether a contract is enforceable depends on your country or state and how it is agreed, so have one reviewed for your situation, especially for large projects.'], ['Can I add my own clauses?', 'Yes. Download the Word file, edit anything, keep the {tags}, and upload it to Clausery. Your formatting is kept exactly.']] },
  { slug: 'landlords', name: 'Landlords and tenants', title: 'Free landlord and tenant letters, filled in online',
    intro: 'Leases, move-in checklists, late rent notices, rent increases and deposit returns follow the same pattern every time, and most have a deadline. Clausery fills in a free Word template from a few questions, so the dates, amounts and deductions are right, and tenant details stay on your computer.',
    points: [['No account, no trial, no card', 'Download any template as an ordinary Word file, or fill it in here and download the finished document. There is nothing to sign up for, and no free trial that turns into a subscription.'], ['Dates and amounts worked out', 'Each document states the dates that matter, from the first partial month to the deposit deadline. The free prorated rent and deadline calculators do the arithmetic.'], ['A clear record of the deposit', 'Record each room at move-in with the checklist, then list any deductions at move-out: the deposit letter sets out the deposit, interest, each deduction and the refund.'], ['Tenant details stay private', 'Names, addresses and amounts are typed into your browser and the document is built there. Nothing is uploaded, and it works offline.']],
    templates: ['residential-lease-agreement', 'rental-application', 'move-in-checklist', 'rent-receipt', 'late-rent-notice', 'pet-addendum', 'lease-renewal-letter', 'rent-increase-letter', 'security-deposit-return-letter', 'notice-to-vacate', 'sublease-agreement', 'roommate-agreement', 'payment-demand-letter'],
    related: [['guides/what-to-include-in-a-lease-agreement.html', 'What to include in a residential lease agreement'], ['free-tools/prorated-rent.html', 'Prorated rent calculator'], ['guides/how-to-write-a-notice-to-vacate.html', 'How to write a notice to vacate letter'], ['free-tools/deadline-calculator.html', 'Deadline calculator: count notice periods in days'], ['free-tools/late-payment-interest.html', 'Late payment interest calculator'], ['guides/how-to-write-a-payment-demand-letter.html', 'How to write a demand letter for money owed'], ['clauses/notices-clause.html', 'Notices clause: how formal notices must be given'], ['compare/eforms-alternative.html', 'Clausery compared with eForms'], ['compare/lawdepot-alternative.html', 'Clausery compared with LawDepot']],
    faq: [['How much notice does a rent increase need?', 'It depends on the state and the lease. During a fixed-term lease the rent usually cannot rise unless the lease allows it. For a month-to-month tenancy many states require at least 30 days\' written notice, and some require more for larger increases: in California, 90 days for an increase of more than 10%. Some cities also limit increases under rent control.'],
      ['How long does a landlord have to return a security deposit?', 'It depends on the state: for example 21 days after the tenant moves out in California, 14 days in New York and 30 days in Texas. Most states expect an itemized list of any deductions, and missing the deadline can cost the landlord the right to keep any of it.'],
      ['Is a roommate agreement legally binding?', 'It can be enforced between the roommates like other agreements, but it does not change the lease. If you are all on the lease, the landlord can usually still claim the whole rent from any one of you.'],
      ['How is this different from TurboTenant, Zillow or eForms?', 'Landlord software such as TurboTenant and Zillow Rental Manager offers free tools inside an account, and sells or bundles state-specific leases and form packs. Form sites such as eForms often ask you to start a free trial that becomes a paid subscription before you can download. Clausery\'s templates are ordinary Word files with no account, filled in in your browser. They are general templates rather than state-specific forms, so check your state\'s rules and add any required disclosures.'],
      ['What does it cost?', 'The templates are free to download. In the app, up to three templates are free with unlimited documents; Pro is $19 per user per month.']] },
];
const NAMES = { 'rental-application': 'Rental application', 'rent-receipt': 'Rent receipt', 'lease-renewal-letter': 'Lease renewal letter', 'pet-addendum': 'Pet addendum', 'residential-lease-agreement': 'Residential lease agreement', 'sublease-agreement': 'Sublease agreement', 'move-in-checklist': 'Move-in and move-out checklist', 'late-rent-notice': 'Late rent notice', 'notice-to-vacate': 'Notice to vacate (tenant)', 'rent-increase-letter': 'Rent increase letter', 'security-deposit-return-letter': 'Security deposit return letter', 'roommate-agreement': 'Roommate agreement', 'partnership-agreement': 'Partnership agreement', 'sales-commission-agreement': 'Sales commission agreement', 'photo-release-form': 'Photo and model release', 'general-release': 'General release', 'memorandum-of-understanding': 'Memorandum of understanding (MOU)', 'letter-of-intent': 'Letter of intent (business purchase)', 'bill-of-sale': 'Bill of sale', 'loan-agreement': 'Loan agreement', 'payment-reminder-letter': 'Payment reminder letter', 'subcontractor-agreement': 'Subcontractor agreement', 'retainer-agreement': 'Retainer agreement', 'video-production-contract': 'Video production contract', 'virtual-assistant-agreement': 'Virtual assistant agreement', 'event-planning-contract': 'Event planning contract', 'personal-training-agreement': 'Personal training agreement', 'tutoring-agreement': 'Tutoring agreement', 'web-design-contract': 'Web design contract', 'graphic-design-contract': 'Graphic design contract', 'photography-contract': 'Photography contract', 'social-media-management-contract': 'Social media management contract', 'freelance-writing-contract': 'Freelance writing contract',  'one-way-nda': 'One-way NDA', 'cease-and-desist-letter': 'Cease and desist letter', 'promissory-note': 'Promissory note', 'internship-offer-letter': 'Internship offer letter', 'salary-increase-letter': 'Salary increase letter', 'reference-letter': 'Reference letter', 'employment-termination-letter': 'Termination letter', 'consulting-agreement': 'Consulting agreement', 'service-agreement': 'Service agreement', 'engagement-letter': 'Engagement letter', 'mutual-nda': 'Mutual NDA', 'payment-demand-letter': 'Payment demand letter', 'offer-letter': 'Offer letter', 'employment-verification-letter': 'Employment verification letter', 'independent-contractor-agreement': 'Independent contractor agreement', 'statement-of-work': 'Statement of work' };

export const GUIDES = [
  { slug: 'automate-word-templates', title: 'How to automate a Word template without uploading it anywhere',
    description: 'A step-by-step guide to turning any Word document into a reusable, fill-in-the-blanks template with questions, conditional clauses and lists, entirely in your browser.',
    body: (rel) => `
<p class="lead">If you copy last month's letter and hunt for every name and date to change, this guide is for you. It takes about ten minutes for your first template.</p>
<h2>1. Pick a document you draft often</h2>
<p>Start with something you produce at least weekly: an engagement letter, an NDA, an offer letter. Open your best recent version in Word.</p>
<h2>2. Replace the details that change with tags</h2>
<p>Select a detail that changes, such as the client's name, and type a tag in curly braces instead: <code>{client_name}</code>. Use the same tag everywhere the same detail appears. Use letters, digits and underscores, and choose descriptive names; Clausery guesses the question type from them, so <code>{start_date}</code> becomes a date picker and <code>{retainer_amount}</code> a money field.</p>
<pre><code>This Agreement is made on {effective_date} between {client_name} and {firm_name}.</code></pre>
<h2>3. Make optional paragraphs conditional</h2>
<p>Wrap text that only sometimes applies in a section: <code>{#has_retainer}</code> before it and <code>{/has_retainer}</code> after it. Clausery asks a yes/no question and removes the paragraph when the answer is no. For the opposite case, use <code>{^has_retainer}…{/has_retainer}</code>.</p>
<h2>4. Repeat lists</h2>
<p>For parties, attorneys, deliverables or line items, wrap one item in a loop: <code>{#attorneys}{name}, {role}{/attorneys}</code>. The questionnaire lets you add as many as you need. In a table, put the opening tag in the first cell of a row and the closing tag in the last cell.</p>
<h2>5. Save as .docx and drop it into Clausery</h2>
<p>Open <a href="${rel}app/">Clausery</a> and drop the file on the Templates page. Every tag becomes a question. Rename questions, add help text and group them into sections in the designer, then click <em>New draft</em>.</p>
<h2>6. Generate the document</h2>
<p>Answer the questions and download the finished .docx, or print to PDF. Your formatting is kept exactly, and nothing was uploaded at any point.</p>
<p>Want to see a finished example first? Open one of the <a href="${rel}templates/">free templates</a>, or read the full <a href="${rel}docs/templates.html">template syntax</a>.</p>` },
  { slug: 'conditional-clauses-in-word', title: 'Conditional clauses in Word: include or remove paragraphs automatically',
    description: 'How to make parts of a Word document appear only when they apply: yes/no sections, either/or wording, clauses based on amounts or dates, and removing empty lines.',
    body: (rel) => `
<p class="lead">Most contracts and letters have parts that only apply sometimes: a retainer, a guarantor, a bonus, a jurisdiction clause. Here is how to make Word documents include or drop those parts automatically.</p>
<h2>Yes/no sections</h2>
<pre><code>{#has_guarantor}
GUARANTEE
{guarantor_name} guarantees the tenant's obligations.
{/has_guarantor}</code></pre>
<p>Clausery asks "Has guarantor?" and removes the whole block, including its paragraphs, when the answer is no. Questions inside the block, such as the guarantor's name, are only asked when the answer is yes.</p>
<h2>Either/or wording</h2>
<pre><code>{#is_remote}This is a remote position.{/is_remote}{^is_remote}You will work from our {office} office.{/is_remote}</code></pre>
<p><code>{^…}</code> is the opposite of <code>{#…}</code>: it keeps its text when the answer is no.</p>
<h2>Clauses based on amounts, dates or choices</h2>
<p>A section does not have to be a yes/no question. In the designer, change the section's question to <em>Computed</em> and give it a rule such as <code>salary &gt; 100000</code>, <code>fee_type == "flat"</code> or <code>years_between(start_date, today()) &gt;= 5</code>. The clause appears when the rule is true. See <a href="${rel}docs/logic.html">logic and calculations</a> for everything the rules can do.</p>
<h2>Avoiding blank lines</h2>
<p>Put the opening and closing tags each on their own line, as in the examples above. Clausery then removes those lines along with the section, so the document never has gaps where a clause used to be.</p>
<p><a class="btn btn-primary" href="${rel}app/">Try it with your own document</a></p>` },
  { slug: 'client-intake-without-a-portal', title: 'Client intake without a portal: collect answers by email, privately',
    description: 'How to send clients a questionnaire they can fill in offline and return as a file, so you can generate documents from their answers without a client portal or account.',
    body: (rel) => `
<p class="lead">Client portals mean another login for the client and another system holding their data. Clausery takes a different route: the questionnaire travels as a file.</p>
<h2>How it works</h2>
<ol>
  <li>In any draft, open the review step and choose <em>Create client intake form</em>. You get a single HTML file that contains only the questions, with no document and no previous answers.</li>
  <li>Email it to the client, or share it the way you already share documents with them.</li>
  <li>The client double-clicks the file. It opens in their browser, works offline, validates their answers and lets them save progress.</li>
  <li>When finished they save an answers file and send it back. You import it into the draft and generate the document.</li>
</ol>
<h2>Why firms like it</h2>
<ul>
  <li>No accounts, passwords or portal invitations for clients.</li>
  <li>The form cannot send data anywhere; its security policy blocks all network access.</li>
  <li>Answers arrive as one tidy file instead of an email thread.</li>
</ul>
<p>Client intake forms are part of <a href="${rel}pricing/">Clausery Pro</a>. Read the <a href="${rel}docs/intake.html">intake documentation</a> for details.</p>` },

  { slug: 'mail-merge-vs-document-automation', title: 'Mail merge vs document automation: which one do you need?',
    description: 'Mail merge fills the same blanks from a spreadsheet; document automation also includes or removes clauses, repeats lists and calculates. How to tell which one your documents need.',
    body: (rel) => `
<p class="lead">Word's mail merge is free and already on your computer. For some documents it is all you need. For others it becomes a maze of copies and manual edits. Here is how to tell the difference.</p>
<h2>What mail merge does well</h2>
<p>Mail merge takes rows from a spreadsheet and fills the same blanks in the same document: a name, an address, an amount. It is ideal for the same letter to many people, such as a price-change notice to 300 customers.</p>
<h2>Where mail merge runs out</h2>
<ul>
  <li><strong>Optional clauses.</strong> A retainer paragraph that applies to some clients and not others means keeping two versions of the document, or deleting text by hand afterwards.</li>
  <li><strong>Lists of different lengths.</strong> One matter has one attorney, the next has four. Mail merge has no natural way to repeat a paragraph or a table row per item.</li>
  <li><strong>Either/or wording.</strong> "Remote" versus "based at our London office", or past versus present tense in a verification letter.</li>
  <li><strong>Calculations.</strong> Totals, dates 30 days after signing, amounts in words.</li>
  <li><strong>Guidance for the person filling it in.</strong> A spreadsheet column has no help text, no validation and no way to hide questions that do not apply.</li>
</ul>
<h2>What document automation adds</h2>
<p>Document automation turns a template into a questionnaire. Each answer can fill a blank, switch a clause on or off, repeat a block for each item in a list, or feed a calculation. The person drafting answers questions instead of editing a document, and the output is consistent every time.</p>
<h2>A quick test</h2>
<p>If every copy of your document has exactly the same paragraphs, use mail merge. If you ever delete, copy or rewrite paragraphs after merging, you need document automation.</p>
<h2>Trying it on your own document</h2>
<p>Clausery uses tags you type straight into Word, so your mail merge template is already most of the way there. Replace merge fields with tags like <code>{client_name}</code>, wrap optional paragraphs in <code>{#has_retainer}…{/has_retainer}</code>, and drop the file into <a href="${rel}app/">the app</a>. It is free for up to three templates and nothing is uploaded. The <a href="${rel}guides/automate-word-templates.html">step-by-step guide</a> walks through it.</p>` },
  { slug: 'repeating-lists-and-tables-in-word', title: 'Repeating lists and table rows in Word templates',
    description: 'How to make a Word template repeat a paragraph, bullet or table row for every party, attorney, deliverable or line item, with separators and numbering.',
    body: (rel) => `
<p class="lead">Contracts and letters often list things: parties, attorneys, deliverables, beneficiaries, line items. The number changes every time. Here is how to make a Word template handle any number of them.</p>
<h2>Repeat a paragraph or bullet</h2>
<pre><code>{#deliverables}
• {title}: {description}, due {due_date}
{/deliverables}</code></pre>
<p>Everything between <code>{#deliverables}</code> and <code>{/deliverables}</code> is written once per deliverable. In the questionnaire, the person drafting clicks <em>Add deliverable</em> as many times as needed, and each item has its own title, description and due date.</p>
<h2>Repeat a table row</h2>
<p>Put the opening tag at the start of the first cell of a row and the closing tag at the end of the last cell of the same row:</p>
<table><thead><tr><th>Item</th><th>Quantity</th><th>Price</th></tr></thead><tbody><tr><td><code>{#items}{name}</code></td><td><code>{qty}</code></td><td><code>{price}{/items}</code></td></tr></tbody></table>
<p>The whole row repeats, so the table grows with the list and keeps your borders and shading.</p>
<h2>Commas between names</h2>
<p>To write "Ann, Ben and Cara"-style lists, use the built-in <code>{_last}</code> marker, which is true on the final item:</p>
<pre><code>{#parties}{name}{^_last}, {/_last}{/parties}</code></pre>
<p><code>{_index}</code> gives the item number (1, 2, 3) and <code>{_count}</code> the total, which is useful for "Schedule {_index} of {_count}".</p>
<h2>Optional details inside an item</h2>
<p>Conditions work inside lists too: <code>{#attorneys}{name}{#is_partner}, Partner{/is_partner}{/attorneys}</code> asks a yes/no question for each attorney.</p>
<h2>Totals</h2>
<p>A computed field such as <code>sum(items.price)</code> adds up a column, and <code>count(items)</code> counts the rows. See <a href="${rel}docs/logic.html">logic and calculations</a>.</p>
<p>The free <a href="${rel}templates/statement-of-work.html">statement of work</a> and <a href="${rel}templates/engagement-letter.html">engagement letter</a> templates both use repeating lists, if you want a working example.</p>` },
  { slug: 'confidentiality-checklist-document-software', title: 'Choosing document software when client confidentiality matters: a checklist',
    description: 'Questions to ask before putting client or employee information into any document or drafting tool: where data is processed, who can access it, sub-processors, retention and exit.',
    body: (rel) => `
<p class="lead">Professional confidentiality duties and data protection law both expect you to know where client information goes when you use software. These are the questions worth asking any vendor, including us.</p>
<h2>Where is the data processed?</h2>
<ul>
  <li>Is the information you type sent to the vendor's servers, or processed on your own device?</li>
  <li>In which countries are those servers? Are there transfers outside your jurisdiction?</li>
  <li>Is it used to train AI models, or shared with an AI provider?</li>
</ul>
<h2>Who can access it?</h2>
<ul>
  <li>Can the vendor's staff read your documents? Under what circumstances?</li>
  <li>Which sub-processors (hosting, email, analytics, AI) receive it?</li>
  <li>What happens if the vendor receives a subpoena or suffers a breach?</li>
</ul>
<h2>How is it protected?</h2>
<ul>
  <li>Is data encrypted in transit and at rest? Who holds the keys?</li>
  <li>What independent assurance exists (for example SOC 2 or ISO 27001 reports)?</li>
  <li>How are user accounts protected (single sign-on, two-factor authentication)?</li>
</ul>
<h2>Retention and exit</h2>
<ul>
  <li>How long is data kept after you delete it or cancel?</li>
  <li>Can you export everything in an open format?</li>
  <li>Will your templates keep working if the vendor disappears?</li>
</ul>
<h2>How Clausery answers these</h2>
<p>Clausery was designed so that most of these questions have a short answer: documents are built in your browser and stored on your device, so there is no vendor server holding client data, no sub-processor for your content and nothing to breach on our side. Your templates are ordinary Word files and your data exports are plain JSON. The details, including what the web host can see, are in the <a href="${rel}docs/security.html">security overview</a> and the <a href="${rel}legal/dpa.html">data processing statement</a>.</p>
<p class="small muted">This checklist is general information, not legal advice. Your professional rules and data protection obligations depend on your jurisdiction.</p>` },
  { slug: 'how-to-write-an-offer-letter', title: 'How to write a job offer letter (with a free template)',
    description: 'What to put in a job offer letter: role, start date, pay, bonus, equity, benefits, conditions and at-will wording, plus the mistakes that cause disputes later.',
    body: (rel) => `
<p class="lead">An offer letter turns a verbal "we'd love to have you" into something the candidate can accept. It should be short, clear and consistent with the contract and policies that follow it.</p>
<h2>What to include</h2>
<ol>
  <li><strong>The role.</strong> Job title, who they report to, and whether the job is full-time or part-time.</li>
  <li><strong>Where they will work.</strong> Office, hybrid or remote. If remote, say whether they must live in a particular country or state, which affects tax and employment law.</li>
  <li><strong>Start date.</strong> A specific date, or "on a date to be agreed" if it depends on a notice period.</li>
  <li><strong>Pay.</strong> Base salary or hourly rate, the pay period, and whether the role is exempt from overtime where that applies.</li>
  <li><strong>Variable pay.</strong> Bonus target and whether it is discretionary. Equity: number of options or units, vesting schedule and cliff, and that the grant is subject to board approval and the plan documents.</li>
  <li><strong>Benefits and time off.</strong> A short list, pointing to the plan documents rather than restating them.</li>
  <li><strong>Conditions.</strong> Background checks, references, right-to-work checks, signing a confidentiality and invention assignment agreement.</li>
  <li><strong>How to accept, and by when.</strong> An expiry date keeps the process moving.</li>
</ol>
<h2>Wording that causes problems later</h2>
<ul>
  <li><strong>Annual salary described as a guarantee.</strong> "Your salary will be $90,000 per year" can be read as a promise of a year's employment. Stating the pay period avoids that.</li>
  <li><strong>"Permanent position" or "job security".</strong> In the US these can undermine <a href="${rel}clauses/at-will-employment-clause.html">at-will employment</a>. Outside the US, the letter should mention notice and the full contract.</li>
  <li><strong>Equity promises without conditions.</strong> Always make grants subject to approval and the plan.</li>
  <li><strong>Terms that conflict with the employment contract.</strong> If a contract follows, say which document prevails.</li>
</ul>
<h2>Restrictive covenants</h2>
<p>If the job comes with a <a href="${rel}clauses/non-compete-clause.html">non-compete</a> or <a href="${rel}clauses/non-solicitation-clause.html">non-solicitation</a> restriction, mention it in the offer letter. Several US states require candidates to be told before they accept, and some ban non-competes for employees altogether.</p>
<h2>Write it once, reuse it for every hire</h2>
<p>The free <a href="${rel}templates/offer-letter.html">offer letter template</a> already handles remote or office wording, optional bonus and equity, a benefits list and conditions. Open it in Clausery, answer the questions for each candidate and download a finished Word letter. Candidate details stay on your computer. For interns, use the <a href="${rel}templates/internship-offer-letter.html">internship offer letter</a>.</p>
<p class="small muted">General information, not legal advice. Employment law varies by country and state.</p>` },
  { slug: 'how-to-write-a-payment-demand-letter', title: 'How to write a demand letter for unpaid invoices',
    description: 'A step-by-step guide to asking a customer for overdue payment in writing: what to include, tone, deadlines, interest, and what to do if they still do not pay.',
    body: (rel) => `
<p class="lead">Most late invoices are paid after a clear, polite letter with a firm deadline. Here is how to write one that gets paid without damaging the relationship.</p>
<p>Not at the demand stage yet? Start with a <a href="${rel}templates/payment-reminder-letter.html">payment reminder letter</a>, and see the full plan for <a href="${rel}guides/what-to-do-when-a-client-wont-pay.html">what to do when a client won't pay</a>.</p>
<h2>Before you write</h2>
<ul>
  <li>Check the contract or terms for the <a href="${rel}clauses/payment-terms-clause.html">payment terms</a> and any <a href="${rel}clauses/late-payment-interest-clause.html">late payment interest</a> clause.</li>
  <li>Gather the invoice numbers, dates, amounts and any partial payments.</li>
  <li>Check the <a href="${rel}clauses/notices-clause.html">notices clause</a> for how formal notices must be sent.</li>
</ul>
<h2>What the letter should say</h2>
<ol>
  <li><strong>Who owes what.</strong> The customer's legal name, the amount outstanding, and the invoices it relates to.</li>
  <li><strong>What it was for and when it was due.</strong> One sentence each.</li>
  <li><strong>A deadline.</strong> Seven to fourteen days is common. Use the free <a href="${rel}free-tools/deadline-calculator.html">deadline calculator</a> to get the exact date.</li>
  <li><strong>How to pay.</strong> Bank details or a payment link, and a reference to quote.</li>
  <li><strong>Interest, if the contract allows it.</strong> In the UK, businesses can also claim statutory interest on late commercial payments.</li>
  <li><strong>An invitation to talk.</strong> If they dispute the invoice or need a payment plan, ask them to say so before the deadline.</li>
  <li><strong>What happens next.</strong> Collection, suspension of services or legal proceedings. Only mention steps you are prepared to take.</li>
</ol>
<h2>Tone</h2>
<p>Stay factual. Threats you do not intend to carry out, or statements about the customer's honesty, can backfire and in some cases break debt collection rules. Consumer debts are regulated more strictly than business debts in most countries.</p>
<h2>If they still do not pay</h2>
<p>Many courts expect a formal pre-action letter before a claim is issued, and some prescribe what it must contain. Small claims courts are designed for business debts without lawyers. Check your local rules before starting proceedings.</p>
<h2>Use the free template</h2>
<p>The <a href="${rel}templates/payment-demand-letter.html">payment demand letter template</a> includes optional invoice numbers, interest and next steps. Fill it in online and download a Word letter in a couple of minutes, without uploading customer details anywhere. For amounts in words, try the <a href="${rel}free-tools/amount-in-words.html">amount in words converter</a>.</p>
<p class="small muted">General information, not legal advice. Debt collection and pre-action rules vary by jurisdiction.</p>` },
  { slug: 'what-to-include-in-a-statement-of-work', title: 'What to include in a statement of work (SOW)',
    description: 'The sections every statement of work needs: scope, deliverables, timeline, fees, assumptions, acceptance and change control, with examples of what goes wrong when they are missing.',
    body: (rel) => `
<p class="lead">A statement of work describes one project under a master agreement. It is where most project disputes start, usually because something was vague. These sections prevent that.</p>
<h2>1. Reference to the master agreement</h2>
<p>Name the master services or consulting agreement the SOW sits under, and say which document wins if they conflict. Legal terms such as <a href="${rel}clauses/limitation-of-liability-clause.html">liability</a> and <a href="${rel}clauses/intellectual-property-clause.html">intellectual property</a> belong in the master agreement, not in each SOW.</p>
<h2>2. Scope and objectives</h2>
<p>What the project is for, and what is out of scope. An explicit "out of scope" list is the cheapest protection against scope creep.</p>
<h2>3. Deliverables</h2>
<p>Each deliverable with a description specific enough to test: "a responsive five-page website with a contact form", not "a website". Add a due date for each.</p>
<h2>4. Timeline and milestones</h2>
<p>Key dates, and which ones depend on the client providing content, access or feedback.</p>
<h2>5. Fees and payment</h2>
<p>Fixed price with a payment schedule tied to milestones, or time and materials with rates and an estimate or cap. Include expenses and <a href="${rel}clauses/payment-terms-clause.html">payment terms</a>.</p>
<h2>6. Assumptions and client responsibilities</h2>
<p>What the price assumes: number of revision rounds, access to systems, response times for feedback. When an assumption proves wrong, it becomes the basis for a change request.</p>
<h2>7. Acceptance</h2>
<p>How deliverables are reviewed, how long the client has, and what happens if they do not respond. "Deemed accepted after ten business days" avoids projects that never formally finish.</p>
<h2>8. Change control</h2>
<p>How changes are requested, priced and approved in writing. See the <a href="${rel}clauses/amendment-clause.html">amendment clause</a>.</p>
<h2>Write SOWs in minutes</h2>
<p>The free <a href="${rel}templates/statement-of-work.html">statement of work template</a> lists any number of deliverables with due dates, switches between fixed price and time and materials, and includes assumptions and acceptance. Answer the questions in Clausery and download a finished Word SOW. For the master terms, start with the <a href="${rel}templates/service-agreement.html">service agreement</a> or <a href="${rel}templates/consulting-agreement.html">consulting agreement</a>.</p>` },
  { slug: 'what-to-include-in-an-nda', title: 'What to include in an NDA: a clause-by-clause checklist',
    description: 'The clauses a non-disclosure agreement needs, from the definition of confidential information to exclusions, term, return of information and governing law, and when to use a mutual or one-way NDA.',
    body: (rel) => `
<p class="lead">A non-disclosure agreement is short, but each clause does a specific job. Here is what to check before you send or sign one.</p>
<h2>Mutual or one-way?</h2>
<p>If only one side is sharing information, such as a founder pitching to an investor or a company briefing a contractor, a <a href="${rel}templates/one-way-nda.html">one-way NDA</a> is simpler. If both sides will share, as in partnership or acquisition talks, use a <a href="${rel}templates/mutual-nda.html">mutual NDA</a>.</p>
<h2>The clauses</h2>
<ol>
  <li><strong>Parties.</strong> Correct legal names and entity types. An NDA signed by the wrong group company may not protect the one that shares the information.</li>
  <li><strong>Purpose.</strong> What the information may be used for, described narrowly: "evaluating a possible distribution agreement", not "business purposes".</li>
  <li><strong>Definition of confidential information.</strong> Whether it covers only marked information or anything reasonably understood to be confidential. See the <a href="${rel}clauses/confidentiality-clause.html">confidentiality clause</a>.</li>
  <li><strong>Exclusions.</strong> Public information, information already known, information received from someone else, and independent development.</li>
  <li><strong>Obligations.</strong> Use only for the purpose, disclose only to people who need to know, and protect with reasonable care.</li>
  <li><strong>Compelled disclosure.</strong> What happens if a court or regulator requires disclosure.</li>
  <li><strong>Return or destruction.</strong> On request or when talks end, with an exception for automatic backups.</li>
  <li><strong>Term.</strong> How long the agreement lasts and how long the obligations <a href="${rel}clauses/survival-clause.html">survive</a> afterwards.</li>
  <li><strong>No licence and no obligation to proceed.</strong> Sharing information does not grant rights in it or commit anyone to a deal.</li>
  <li><strong>Remedies.</strong> Acknowledging that an injunction may be appropriate, since damages rarely fix a leak.</li>
  <li><strong>Governing law and jurisdiction.</strong> See the <a href="${rel}clauses/governing-law-clause.html">governing law clause</a>.</li>
</ol>
<h2>Things to avoid</h2>
<ul>
  <li>Non-solicitation or non-compete terms hidden in an NDA, which the other side may not expect.</li>
  <li>Clauses that stop someone reporting wrongdoing to a regulator, which are unenforceable in many places.</li>
  <li>An NDA that is later wiped out by the <a href="${rel}clauses/entire-agreement-clause.html">entire agreement clause</a> of the main contract.</li>
</ul>
<h2>Send one in two minutes</h2>
<p>Both NDA templates are free to download as Word files or fill in online. Clausery asks for the parties, purpose, term and governing law, includes the optional clauses you choose, and produces a finished document without uploading anything.</p>` },
  { slug: 'how-to-write-a-freelance-contract', title: 'How to write a freelance contract: 10 clauses that prevent disputes',
    description: 'What every freelance contract should say about scope, revisions, deadlines, payment, deposits, kill fees, ownership and termination, with free templates for designers, photographers, writers and more.',
    body: (rel) => `
<p class="lead">Most freelance disputes come down to one of three questions: what was included, when you get paid, and who owns the work. A short contract that answers them before you start saves weeks of awkward emails later.</p>
<h2>The ten clauses</h2>
<ol>
  <li><strong>Who the parties are.</strong> Your business name and the client's legal name, not just a contact person.</li>
  <li><strong>Scope.</strong> What you will deliver, in a list: pages, designs, articles, hours of coverage or posts per week. Add what is not included.</li>
  <li><strong>Timeline and client inputs.</strong> Your deadlines, and the date the client must supply content, feedback or access. If they are late, your dates move.</li>
  <li><strong>Revisions.</strong> How many rounds are included, and your hourly rate for anything beyond them.</li>
  <li><strong>Fees.</strong> A flat fee or an hourly rate with an estimate. The free <a href="${rel}free-tools/freelance-rate.html">freelance rate calculator</a> helps you set it.</li>
  <li><strong>Deposit and payment terms.</strong> How much is due up front, when invoices are due and how to pay. See the <a href="${rel}clauses/payment-terms-clause.html">payment terms clause</a>.</li>
  <li><strong>Late payment.</strong> Interest on overdue invoices and a right to pause work. The <a href="${rel}free-tools/late-payment-interest.html">late payment interest calculator</a> shows what it adds up to.</li>
  <li><strong>Cancellation and kill fee.</strong> What the client pays if they cancel after work has started. See <a href="${rel}guides/what-is-a-kill-fee.html">what a kill fee is</a>.</li>
  <li><strong>Ownership.</strong> Whether the client owns the work or gets a licence, and that rights pass only on payment in full. See the <a href="${rel}clauses/intellectual-property-clause.html">intellectual property clause</a>.</li>
  <li><strong>Independent contractor status and governing law.</strong> You run your own business and pay your own taxes; name the law that applies.</li>
</ol>
<h2>Keep it short enough to be signed</h2>
<p>Two or three pages is plenty for most projects. A client is more likely to sign a clear, fair contract today than a long one next week, and an unsigned contract protects no one.</p>
<h2>Start from a template for your trade</h2>
<p>The free <a href="${rel}for/freelancers.html">freelance contract templates</a> already contain these clauses for web design, graphic design, photography, social media management and writing. Answer the questions for each client, and optional terms such as a deposit or kill fee only appear when you switch them on.</p>
<p class="small muted">General information, not legal advice. Contract rules differ between countries and states.</p>` },
  { slug: 'what-is-a-kill-fee', title: 'What is a kill fee? How to set one in a freelance contract',
    description: 'A kill fee is what a client pays if they cancel a freelance project after work has started. How much to charge, how to word it, and how it differs from a deposit.',
    body: (rel) => `
<p class="lead">A kill fee is a payment the client makes if they cancel a project after you have started work. It compensates you for time you set aside and other work you turned down.</p>
<h2>Kill fee or deposit?</h2>
<p>A deposit is paid before work starts and is usually credited against the final invoice. A kill fee is only paid if the project is cancelled. Many freelancers use both: the deposit secures the booking and the kill fee covers a cancellation part-way through.</p>
<h2>How much to charge</h2>
<ul>
  <li><strong>Writing and journalism:</strong> 25% to 50% of the agreed fee is common, depending on how far the piece had got.</li>
  <li><strong>Design and web projects:</strong> payment for work completed so far, plus a fixed cancellation fee or a percentage of the remaining fee.</li>
  <li><strong>Photography and events:</strong> usually handled through a non-refundable retainer tied to how close to the date the client cancels.</li>
</ul>
<p>Whatever you choose, it should be a genuine estimate of your loss. In some places, a cancellation charge far above your real loss can be challenged as a penalty, and consumer protection rules may limit charges to private individuals.</p>
<h2>Sample wording</h2>
<pre><code>If the Client cancels the project after work has started, the Client will pay for work completed to date plus a cancellation fee of {kill_fee}.</code></pre>
<p>For writers paid per piece, a percentage works better:</p>
<pre><code>If the Client cancels a piece after writing has started, the Client will pay {kill_fee_percent}% of its fee.</code></pre>
<h2>Templates that include it</h2>
<p>The free <a href="${rel}templates/graphic-design-contract.html">graphic design contract</a> and <a href="${rel}templates/freelance-writing-contract.html">freelance writing contract</a> include an optional kill fee you can switch on for each client.</p>
<p class="small muted">General information, not legal advice.</p>` },
  { slug: 'what-to-do-when-a-client-wont-pay', title: 'What to do when a client won\'t pay: a step-by-step plan',
    description: 'A calm plan for an unpaid invoice: reminders, a final notice, late fees, a demand letter and small claims, with reminder emails you can copy.',
    body: (rel) => `
<p class="lead">Most late invoices are paid after a clear reminder. Most of the rest are paid once the client sees a date and a consequence. This plan takes you from a polite nudge to a formal demand, one step at a time, without damaging the relationship before you need to.</p>
<h2>First, check the basics</h2>
<ul>
  <li>Did the invoice reach the person who actually pays, such as accounts payable, with any purchase order number they asked for?</li>
  <li>Does it show the amount, what it is for, the due date and how to pay? If the terms say net 30 or end of month, the <a href="${rel}free-tools/invoice-due-date.html">invoice due date calculator</a> gives the exact date.</li>
  <li>Is there a complaint about the work you have not answered? A dispute needs a conversation first, not a reminder.</li>
</ul>
<h2>Step 1: a friendly reminder on the due date</h2>
<p>Send a short, neutral email on the due date or a few days before. Assume it was missed, attach the invoice again, and say how to pay.</p>
<pre><code>Subject: Invoice [number] due today

Hi [name],

A quick reminder that invoice [number] for [amount] is due today. I've attached a copy in case it went astray. You can pay by [bank transfer / card link].

Thanks,
[your name]</code></pre>
<h2>Step 2: a firmer reminder a week later</h2>
<p>Ask a direct question. A question needs an answer; a statement is easy to ignore. If you can, also call or message the person who approved the work.</p>
<pre><code>Subject: Invoice [number] is now 7 days overdue

Hi [name],

Invoice [number] for [amount] was due on [date] and I haven't received payment yet. Could you let me know when it will be paid? If there's a problem with the invoice, tell me and I'll sort it out.

Thanks,
[your name]</code></pre>
<h2>Step 3: pause work, if your contract allows it</h2>
<p>If you are part-way through a project or on a monthly retainer, say that new work will pause until the account is up to date. Check your contract first: the free <a href="${rel}templates/retainer-agreement.html">retainer agreement</a> includes a clause that allows it.</p>
<h2>Step 4: a final notice with a date</h2>
<p>About two to three weeks after the due date, send a final notice by email and by post. Give the amount, the dates of your earlier reminders, a pay-by date seven to fourteen days away, and exactly what you will do next. Only name a step you are really prepared to take.</p>
<p>The free <a href="${rel}templates/payment-reminder-letter.html">payment reminder letter</a> does this: switch on <em>final notice</em> and it adds the earlier reminders and your next step.</p>
<pre><code>Subject: Final notice: invoice [number], [amount]

Hi [name],

Invoice [number] for [amount] is now [number] days overdue, despite my reminders on [dates]. Please pay by [date]. If I don't receive payment or hear from you by then, I will [send a formal demand / start a small claim]. The attached letter has the details.

[your name]</code></pre>
<h2>Step 5: add interest or late fees you are entitled to</h2>
<p>If your contract has a <a href="${rel}clauses/late-payment-interest-clause.html">late payment interest clause</a>, apply it and show the working. In the UK, a business owed money by another business can claim statutory interest at 8% above the Bank of England base rate, plus fixed compensation of &pound;40, &pound;70 or &pound;100 depending on the size of the debt, even without a clause. In the US it depends on your contract and your state's law.</p>
<p>The free <a href="${rel}free-tools/late-payment-interest.html">late payment interest calculator</a> works out both.</p>
<h2>Step 6: send a formal demand letter</h2>
<p>If the final notice is ignored, a demand letter, also called a letter before action, is usually the last step before court or a collection agency. It should state the debt, how it arose, what you have already done, and a final date to pay. In England and Wales, if the client is an individual or sole trader, the Pre-Action Protocol for Debt Claims applies: the letter must include certain information and give them 30 days to reply.</p>
<p>Use the free <a href="${rel}templates/payment-demand-letter.html">payment demand letter template</a> and the guide on <a href="${rel}guides/how-to-write-a-payment-demand-letter.html">how to write a demand letter for unpaid invoices</a>.</p>
<h2>Step 7: small claims, mediation or collections</h2>
<ul>
  <li><strong>Small claims court.</strong> In the US, each state sets its own limit, typically somewhere between $2,500 and $25,000. In England and Wales, claims up to &pound;10,000 usually go to the small claims track, and you can start one online.</li>
  <li><strong>Mediation.</strong> Cheaper and faster than a hearing, and it keeps the door open for future work. In England and Wales, most small money claims now include a free telephone mediation session.</li>
  <li><strong>Collection agencies.</strong> They usually keep a percentage of what they recover, so they suit larger debts you have given up collecting yourself.</li>
</ul>
<h2>Can I keep the files until they pay?</h2>
<p>If your contract says ownership passes only on payment in full, the client does not own the work until they pay, and holding back final files is usually fine. Taking down a live website or disabling something you have already handed over is riskier, so get advice before you do that. See the <a href="${rel}clauses/intellectual-property-clause.html">intellectual property clause</a>.</p>
<h2>Stop it happening next time</h2>
<ul>
  <li>Take a deposit before you start, often 25% to 50%, and bill larger projects in milestones.</li>
  <li>Put the due date, late fees and your right to pause work in a written <a href="${rel}clauses/payment-terms-clause.html">payment terms clause</a>.</li>
  <li>Make ownership pass only on payment in full.</li>
  <li>Agree a <a href="${rel}guides/what-is-a-kill-fee.html">kill fee</a> for cancelled work.</li>
</ul>
<p>The free <a href="${rel}for/freelancers.html">freelance contract templates</a> include these terms, and you can fill them in online without uploading client details.</p>
<p class="small muted">General information, not legal advice. Debt recovery rules differ between countries and states.</p>` },
  { slug: 'is-an-mou-legally-binding', title: 'Is an MOU legally binding? How it differs from a contract',
    description: 'When a memorandum of understanding or letter of intent becomes a binding contract, how courts decide, and how to word yours so it binds only what you mean.',
    body: (rel) => `
<p class="lead">Short answer: an MOU is binding if it reads and works like a contract, and not binding if it clearly says it is not and the parties behave that way. The title on the page does not decide it. The same is true of a letter of intent.</p>
<h2>What makes an MOU binding</h2>
<p>Courts in common law countries such as the US, UK, Canada and Australia ask broadly the same questions of any document, whatever it is called:</p>
<ul>
  <li><strong>Did the parties intend to be legally bound?</strong> Words such as "not legally binding", "subject to contract" or "a statement of intent" point one way; "the parties agree" and "shall" point the other.</li>
  <li><strong>Are the essential terms settled?</strong> A document that leaves the price, scope or timetable "to be agreed" is hard to enforce. One that fixes them may be enforceable on its own.</li>
  <li><strong>Does each side give something?</strong> Most contracts need an exchange of value, such as money for services or one commitment for another.</li>
  <li><strong>How did the parties behave?</strong> Starting the work, paying invoices or announcing the deal can show that a binding agreement exists, even if the paperwork said otherwise.</li>
</ul>
<h2>Two cases that show the risk</h2>
<p>In the 1980s, a Texas jury found that Pennzoil and Getty Oil had a binding deal based on a memorandum of agreement and a press release, before any formal contract was signed. Texaco, which bought Getty in the meantime, was ordered to pay about $10.5 billion; the case later settled for $3 billion.</p>
<p>In <em>RTS Flexible Systems v Molkerei Alois Müller</em> (2010), the UK Supreme Court held that two companies had a binding contract even though their draft said it would not take effect until signed, because they had agreed the main terms and carried out the work anyway.</p>
<p>The lesson is the same in both: if you do not want to be bound yet, the document has to say so clearly, and your conduct has to match it.</p>
<h2>MOU, letter of intent and contract compared</h2>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col"></th><th scope="col">MOU</th><th scope="col">Letter of intent</th><th scope="col">Contract</th></tr></thead><tbody>
<tr><th scope="row">Usual purpose</th><td>A shared plan between partners, such as a pilot, joint project or collaboration</td><td>An offer setting out the main terms of a deal, such as buying a business or property</td><td>The final, enforceable terms</td></tr>
<tr><th scope="row">Form</th><td>Joint document signed by both</td><td>Letter from one side, countersigned by the other</td><td>Agreement signed by all parties</td></tr>
<tr><th scope="row">Binding?</th><td>Usually not, except named clauses</td><td>Usually not, except named clauses</td><td>Yes</td></tr>
<tr><th scope="row">Clauses often made binding</th><td>Confidentiality, costs, governing law</td><td>Exclusivity, confidentiality, costs, governing law</td><td>All of it</td></tr>
</tbody></table></div>
<h2>How to keep an MOU or letter of intent non-binding</h2>
<ol>
  <li><strong>Say it in plain words.</strong> For example: "Apart from paragraphs 5, 6 and 7, this memorandum is not legally binding, and neither party is obliged to proceed until a definitive agreement is signed."</li>
  <li><strong>Name the parts that are binding.</strong> A court is more likely to respect the non-binding label when the document is clear about which promises do bind.</li>
  <li><strong>Leave the final terms to the final agreement.</strong> Describe the price and scope as proposals, and say the definitive agreement will contain the full terms.</li>
  <li><strong>Act consistently.</strong> Do not start work, pay money or announce a done deal before the contract is signed unless you accept that you may be bound.</li>
  <li><strong>Set an end date.</strong> An expiry date or a long-stop date stops an old MOU being revived years later.</li>
</ol>
<h2>Which parts should be binding anyway</h2>
<p>Even a non-binding MOU usually needs a few enforceable promises: <a href="${rel}clauses/confidentiality-clause.html">confidentiality</a> of what is shared during talks, exclusivity if one side is stopping other negotiations, who pays the costs if the deal falls through, and the <a href="${rel}clauses/governing-law-clause.html">governing law</a> that applies. Say expressly that these paragraphs are binding.</p>
<h2>When you want it to be binding</h2>
<p>Sometimes an MOU is all the paperwork a small collaboration needs. If so, make it a contract in substance: settle the essential terms, record what each side gives, say the parties intend to be bound, and have authorised people sign it. At that point, consider calling it an agreement so nobody is confused later.</p>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/memorandum-of-understanding.html">memorandum of understanding template</a> asks whether the MOU should be binding and words the legal effect section to match, keeping confidentiality and costs binding either way. The <a href="${rel}templates/letter-of-intent.html">letter of intent to buy a business</a> keeps the deal terms non-binding while making exclusivity, confidentiality and costs binding. If you need to share information during talks, start with a <a href="${rel}templates/mutual-nda.html">mutual NDA</a>; when the deal is agreed, the <a href="${rel}templates/service-agreement.html">service agreement</a> covers many collaborations.</p>
<p class="small muted">General information, not legal advice. Contract law differs between countries and states, and whether a document is binding depends on its exact wording and the facts.</p>` },
  { slug: 'what-to-include-in-a-partnership-agreement', title: 'What to include in a partnership agreement: 10 key terms',
    description: 'The ten terms every partnership agreement needs, what the law decides if you leave them out, common mistakes, and when an LLC or an MOU fits better.',
    body: (rel) => `
<p class="lead">Short answer: who puts in what, how profits are split, who decides what, and what happens when someone leaves. Without a written agreement, default partnership law answers those questions for you, often in ways the partners did not expect.</p>
<h2>What happens without an agreement</h2>
<p>In many places, two or more people who run a business together for profit are a partnership automatically, whether or not they sign anything. Most US states follow the Revised Uniform Partnership Act, and the UK has the Partnership Act 1890. Under both, unless the partners agree otherwise:</p>
<ul>
  <li><strong>Profits are shared equally</strong>, even if one partner put in far more money.</li>
  <li><strong>Every partner has an equal say</strong>, and ordinary decisions are made by a majority.</li>
  <li><strong>No partner is paid a salary</strong> for working in the business.</li>
  <li><strong>Each partner can bind the partnership</strong> to contracts in the ordinary course of business, and each is personally liable for its debts.</li>
</ul>
<p>An agreement cannot remove the partners' personal liability to outsiders, but it can change almost everything else between the partners.</p>
<h2>The ten terms to include</h2>
<ol>
  <li><strong>The partners and the business.</strong> Names and addresses, the business name, what it does and where.</li>
  <li><strong>Contributions.</strong> What each partner puts in, such as money, equipment, clients, intellectual property or work, by when, and whether it can ever be taken out.</li>
  <li><strong>Shares of profits and losses.</strong> Write each partner's percentage down and check the shares add up to 100%.</li>
  <li><strong>Drawings and salaries.</strong> Whether partners can take money out each month against their share of profits, and whether a partner who works more hours is paid for it.</li>
  <li><strong>Decisions.</strong> What any partner can decide alone, a spending limit, and a list of major decisions that need a majority or everyone, such as borrowing, hiring, big purchases or changing what the business does.</li>
  <li><strong>Time and loyalty.</strong> How much time each partner gives the business, and no competing business on the side without the others' consent.</li>
  <li><strong>Money and records.</strong> A bank account in the partnership's name, who can approve payments, and every partner's right to see the books.</li>
  <li><strong>Leaving.</strong> How much notice a partner must give to withdraw, what happens on death or long-term illness, and the right of the others to carry on the business.</li>
  <li><strong>The buyout price.</strong> Fair market value set by an independent accountant, or an agreed formula, and how long the remaining partners have to pay. This is where many partnership disputes end up.</li>
  <li><strong>Disputes and dissolution.</strong> Mediation before court, and how the business is wound up: pay the debts, return the contributions, then divide what is left.</li>
</ol>
<h2>Five mistakes to avoid</h2>
<ul>
  <li><strong>Equal shares by default.</strong> If contributions differ, decide deliberately whether the shares follow money, time, skills or all three.</li>
  <li><strong>No plan for a deadlock.</strong> Two 50/50 partners who disagree can stall the business. Agree how a tie is broken, for example by mediation or an adviser you both trust.</li>
  <li><strong>No exit terms.</strong> Without them, in some places one partner leaving can end the whole partnership, and the value of their share is argued over later.</li>
  <li><strong>Mixing personal and business money.</strong> Open a separate bank account from the first day.</li>
  <li><strong>Never revisiting it.</strong> Review the agreement when a partner's role, contribution or time commitment changes.</li>
</ul>
<h2>Partnership, LLC or MOU?</h2>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col"></th><th scope="col">General partnership</th><th scope="col">LLC or LLP</th><th scope="col">MOU</th></tr></thead><tbody>
<tr><th scope="row">To set up</th><td>No filing needed in many places; a written agreement is strongly advised</td><td>A filing with the state and a fee, plus an operating or members' agreement</td><td>A signed document; no filing</td></tr>
<tr><th scope="row">Personal liability for business debts</th><td>Yes, for every partner</td><td>Generally limited, with exceptions</td><td>Not a business in itself</td></tr>
<tr><th scope="row">Best for</th><td>Low-risk ventures between people who trust each other</td><td>Businesses with debts, staff, leases or customers who could sue</td><td>Exploring a collaboration before committing to one</td></tr>
</tbody></table></div>
<p>For US federal tax, a partnership files an information return and each partner pays tax on their share of the profit, and an LLC with two or more members is taxed the same way unless it chooses otherwise. Ask an accountant which structure suits you before you start trading.</p>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/partnership-agreement.html">partnership agreement template</a> covers all ten terms above as simple questions: any number of partners with their contributions and shares, drawings, a spending limit, a list of major decisions, buyout terms and optional mediation. Still deciding whether to go into business together? Start with a <a href="${rel}templates/memorandum-of-understanding.html">memorandum of understanding</a> and a <a href="${rel}templates/mutual-nda.html">mutual NDA</a>. If one partner lends the business money rather than contributing it, record it in a <a href="${rel}templates/loan-agreement.html">loan agreement</a>.</p>
<p class="small muted">General information, not legal or tax advice. Partnership law differs between countries and states, and a lawyer can check the agreement against the rules where you trade.</p>` },
  { slug: 'how-to-write-a-bill-of-sale', title: 'How to write a bill of sale, with a free template',
    description: 'What a bill of sale must include, extra details for a car or boat, when it needs a notary, and the steps after signing that protect the seller.',
    body: (rel) => `
<p class="lead">A bill of sale is a signed record that one person sold something to another: what it was, the price, and the date ownership changed. It takes ten minutes to write and settles most arguments before they start.</p>
<h2>When you need one</h2>
<p>Write one whenever you sell something valuable privately: a car, motorbike, boat, trailer, equipment, furniture or a horse. For vehicles and boats, some registration offices ask to see a bill of sale, or have their own form. Even where nobody asks for it, it protects you both:</p>
<ul>
  <li>The <strong>buyer</strong> can show they own the item and what they paid for it.</li>
  <li>The <strong>seller</strong> can show when the item stopped being theirs, which matters when parking tickets, tolls or accident claims arrive later.</li>
</ul>
<h2>What to include</h2>
<ol>
  <li><strong>The date of sale</strong>, and the full names and addresses of the seller and the buyer.</li>
  <li><strong>A description of the item</strong> specific enough to identify it: make, model, serial number, colour, and anything included, such as spare keys or accessories.</li>
  <li><strong>The price</strong> and how it is paid: cash, bank transfer or cheque, in full or as a deposit with the balance due by a date.</li>
  <li><strong>Ownership.</strong> A statement that the seller owns the item and that nobody else has a claim to it, such as a lender. If there is a loan on it, say so and say how it will be paid off.</li>
  <li><strong>Condition.</strong> Either "sold as is", meaning the buyer accepts it with any faults, or the specific warranty the seller gives.</li>
  <li><strong>Signatures</strong> of both people, and a witness or notary if the item or the office that registers it needs one.</li>
</ol>
<h2>Extra details for a car, motorbike or boat</h2>
<ul>
  <li><strong>Year, make, model and colour.</strong></li>
  <li><strong>The vehicle identification number (VIN)</strong> or hull identification number, copied from the vehicle itself, not only from the paperwork.</li>
  <li><strong>The odometer reading</strong> at the time of sale, and whether it is accurate. In the US, federal law requires the seller to disclose the mileage when ownership of most vehicles changes, often on the title itself.</li>
</ul>
<h2>Does it need a notary?</h2>
<p>Usually not. A bill of sale is valid when both people sign it. Some US states and some registration offices do ask for a notarized bill of sale for vehicles or boats, so check the motor vehicle agency's website where the item will be registered before you meet the buyer.</p>
<h2>After you sign</h2>
<ol>
  <li><strong>Get paid before you hand over the keys.</strong> Wait for a bank transfer to clear, or meet at the buyer's bank. Cheques can bounce days later.</li>
  <li><strong>Transfer the title or registration.</strong> A bill of sale records the sale; for a vehicle, the title or registration document is what changes the legal owner, and it has its own section to sign.</li>
  <li><strong>Tell the registration office you sold it.</strong> Many have a notice of sale or release of liability form. In California, for example, the seller should report the transfer to the DMV within 5 days.</li>
  <li><strong>Cancel or move your insurance</strong>, and remove your plates if your state keeps them with the owner rather than the vehicle.</li>
  <li><strong>Keep a copy</strong> of the signed bill of sale, and give one to the buyer.</li>
</ol>
<h2>Common mistakes</h2>
<ul>
  <li>Leaving out the VIN or serial number, so the document could describe any similar item.</li>
  <li>Writing "paid" when only a deposit has been paid.</li>
  <li>Promising the item is in good condition when you mean it is sold as is.</li>
  <li>Handing over the item and the title before the payment has cleared.</li>
</ul>
<h2>Free template</h2>
<p>The free <a href="${rel}templates/bill-of-sale.html">bill of sale template</a> asks for each detail above. Tick "vehicle" and it adds the year, make, model, VIN and odometer lines; choose full payment or a deposit and balance; and add a witness or notary block if you need one. If the buyer is paying over time, pair it with a <a href="${rel}templates/promissory-note.html">promissory note</a> for the balance.</p>
<p class="small muted">General information, not legal advice. Rules for vehicles and boats differ between states and countries; check with the office that registers the item.</p>` },
  { slug: 'how-to-lend-money-to-family', title: 'How to lend money to family or friends, in writing',
    description: 'How to lend money to a family member or friend without falling out: deciding loan or gift, the terms to agree, interest and tax, and writing it down.',
    body: (rel) => `
<p class="lead">Decide first whether it is a loan or a gift. If it is a loan, write down the amount, the repayment plan and what happens if a payment is missed, and both sign it. That one page protects the money and the relationship.</p>
<h2>Loan or gift?</h2>
<p>Many family loans go wrong because the two people remember the deal differently. Ask yourself honestly whether you expect the money back, and whether you could afford to lose it. If you would not chase repayment, it may be kinder to call it a gift from the start. If you do expect it back, say so plainly and put it in writing.</p>
<h2>Agree the terms</h2>
<ul>
  <li><strong>Amount</strong> and the date you hand it over.</li>
  <li><strong>Interest</strong>: none, or a rate. Even a low rate makes it clear this is a loan, not a gift.</li>
  <li><strong>Repayments</strong>: one payment by a date, or instalments. A <a href="${rel}free-tools/loan-repayment.html">loan repayment calculator</a> shows the instalment and every payment date.</li>
  <li><strong>How payments are made.</strong> Bank transfers leave a record; cash does not.</li>
  <li><strong>Early repayment</strong>, which should normally be allowed without penalty.</li>
  <li><strong>What happens if a payment is missed</strong>: a grace period, a reminder, and when the whole balance becomes due.</li>
  <li><strong>What happens if something changes</strong>, such as the borrower losing their job, or either of you dying before it is repaid.</li>
</ul>
<h2>Interest and tax</h2>
<p>Tax rules on personal loans differ between countries, so check the rules where you live before lending a large amount.</p>
<ul>
  <li><strong>In the US</strong>, the IRS publishes minimum interest rates each month, called the applicable federal rates. If you lend more than $10,000 to a family member at less than that rate, the IRS can treat the missing interest as income to you and as a gift to the borrower, with some exceptions. Loans of $10,000 or less between individuals are generally exempt, unless the money is used to buy income-producing assets.</li>
  <li><strong>Interest you receive</strong> is usually taxable income for the lender in most countries.</li>
  <li><strong>If you later forgive the loan</strong>, the amount forgiven may count as a gift for tax purposes.</li>
  <li><strong>Maximum rates.</strong> Many places cap the interest rate a lender can charge. Keep family loans well below any such cap.</li>
</ul>
<h2>Promissory note or loan agreement?</h2>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col"></th><th scope="col">Promissory note</th><th scope="col">Loan agreement</th></tr></thead><tbody>
<tr><th scope="row">Who signs</th><td>The borrower</td><td>Both of you</td></tr>
<tr><th scope="row">Length</th><td>About a page</td><td>Two to three pages</td></tr>
<tr><th scope="row">Covers</th><td>Amount, interest and repayment</td><td>Also late fees, collateral, a guarantor and what counts as default</td></tr>
<tr><th scope="row">Best for</th><td>Smaller, simple loans</td><td>Larger loans, or loans secured on property such as a car</td></tr>
</tbody></table></div>
<h2>Keep it friendly</h2>
<ol>
  <li><strong>Only lend what you could afford to lose.</strong></li>
  <li><strong>Treat it like a real loan</strong>: sign the document, keep copies and keep a list of every payment received.</li>
  <li><strong>Talk early if a payment is missed.</strong> A changed payment plan, agreed in writing, is better than silence.</li>
  <li><strong>Tell other family members</strong> if it matters for fairness later, for example when a parent lends to one child but not another.</li>
</ol>
<h2>Free templates</h2>
<p>For a simple loan, use the free <a href="${rel}templates/promissory-note.html">promissory note template</a>. For a larger loan, or one with a late fee, collateral or a guarantor, use the <a href="${rel}templates/loan-agreement.html">loan agreement template</a>. If a payment is missed, the <a href="${rel}templates/payment-reminder-letter.html">payment reminder letter</a> keeps the tone friendly.</p>
<p class="small muted">General information, not legal, tax or financial advice. Tax rules on loans between individuals change and differ by country; check with a tax adviser before lending a large amount.</p>` },
  { slug: 'do-i-need-a-model-release', title: 'When do you need a model release? A plain guide',
    description: 'When photographers, videographers and businesses need a signed model release, when they usually do not, what to put in one, and rules for minors.',
    body: (rel) => `
<p class="lead">Short answer: get a signed release whenever a recognisable person appears in a photo or video that will be used to sell or promote something. For news and editorial use you often do not need one, but a release costs nothing and settles the question.</p>
<h2>Commercial or editorial use</h2>
<p>What matters is how the image is used, not how it was taken.</p>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">Use</th><th scope="col">Examples</th><th scope="col">Release?</th></tr></thead><tbody>
<tr><th scope="row">Commercial</th><td>Adverts, a business website or social media account, brochures, packaging, commercial stock photos</td><td>Yes, get one</td></tr>
<tr><th scope="row">Editorial</th><td>News, documentary, commentary, education, a book about a public event</td><td>Often not needed, depending on where you are</td></tr>
<tr><th scope="row">Personal</th><td>Photos kept or shared privately</td><td>Usually not needed</td></tr>
</tbody></table></div>
<p>In the US, many states protect a person's right of publicity: using someone's name or likeness to advertise or sell without consent can lead to a claim. Rules on privacy and the use of images differ by state and country, so a written release is the simplest way to be safe wherever you work.</p>
<h2>Common situations</h2>
<ul>
  <li><strong>Posting client photos on your business account.</strong> Treat it as commercial use: you are promoting your business. Get a release, or at least written permission, first.</li>
  <li><strong>Stock photography.</strong> Stock agencies generally require a signed model release before they will license an image of a recognisable person for commercial use.</li>
  <li><strong>Crowds and public events.</strong> People in a crowd who are not the focus of the image are a lower risk, but an advert that features one person's face needs that person's release.</li>
  <li><strong>Staff and volunteers.</strong> Employees are not automatically consenting to appear in your marketing. Ask, and put it in writing.</li>
  <li><strong>Private property and artworks.</strong> Recognisable private buildings, logos and artworks can need a separate property release for commercial use.</li>
</ul>
<h2>What to put in a model release</h2>
<ol>
  <li><strong>Who is released</strong>: the photographer, and the client if the images are for someone else.</li>
  <li><strong>Which images</strong>: the date, the place and the project.</li>
  <li><strong>How they may be used</strong>: any commercial use, or only the uses you list, and for how long.</li>
  <li><strong>Use of the person's name</strong>, or a promise not to identify them.</li>
  <li><strong>Any limits</strong> the person asks for, such as no political, medical or adult-content use.</li>
  <li><strong>What the person receives</strong>: a fee, or something else such as copies of the images.</li>
  <li><strong>Signatures and the date</strong>, and a parent or guardian's signature for anyone under 18.</li>
</ol>
<h2>Minors</h2>
<p>A child usually cannot give a binding release on their own, so a parent or legal guardian should sign as well. Schools, clubs and youth organisations often have their own consent rules, so check them before a shoot.</p>
<h2>Outside the US</h2>
<p>In the UK and the EU, a photo of an identifiable person is personal data under the GDPR. Tell people how their images will be used and stored, keep the signed releases, and be ready to stop using an image if someone has a right to ask you to. France and some other countries also protect a person's right to their own image, even outside advertising.</p>
<h2>Free template</h2>
<p>The free <a href="${rel}templates/photo-release-form.html">photo and model release template</a> covers each point above as a question: commercial or limited use, a time limit, use of the person's name, restrictions, payment, and a guardian's consent for a model under 18. For the shoot itself, use the <a href="${rel}templates/photography-contract.html">photography contract</a> or the <a href="${rel}templates/video-production-contract.html">video production contract</a>.</p>
<p class="small muted">General information, not legal advice. Image and privacy rights differ between countries and states.</p>` },
  { slug: 'how-to-write-a-notice-to-vacate', title: 'How to write a notice to vacate letter',
    description: 'What a tenant\'s notice to vacate should say, how much notice to give, how to deliver it, and how to get the security deposit back after moving out.',
    body: (rel) => `
<p class="lead">A notice to vacate is a short letter from a tenant telling the landlord the date they will move out. Give it in writing, give at least the notice your lease and local law require, and keep proof that the landlord received it.</p>
<p>It is not an eviction notice. A landlord who wants a tenant to leave usually has to serve a formal notice with wording and timing set by law, which this letter does not replace.</p>
<h2>How much notice to give</h2>
<p>Start with the lease. It usually says how much notice is needed and how it must be given, and it can require more notice than the law does.</p>
<ul>
  <li><strong>Month-to-month tenancy.</strong> Many US states require at least 30 days' written notice, or one full rental period. In California, for example, a tenant gives 30 days; a landlord ending the tenancy must give 60 days if the tenant has lived there for a year or more.</li>
  <li><strong>Fixed-term lease.</strong> The lease often ends on its end date without notice, but many leases say it continues month to month unless one side gives notice first, often 30 or 60 days before the end date. Check the renewal clause.</li>
  <li><strong>Leaving before the lease ends.</strong> You may owe rent until the end of the lease or until the home is re-let. Many states require the landlord to try to find a new tenant, and some let tenants end a lease early for reasons such as military deployment or domestic violence. Ask the landlord in writing whether they will agree to an earlier date.</li>
</ul>
<h2>Time it against the rent</h2>
<p>Some leases and local rules count the notice from the next rent due date, or require it to end on the last day of a rental period. Giving notice a few days after rent is due can then mean paying for an extra month. Put the move-out date in the letter and count the days with the <a href="${rel}free-tools/deadline-calculator.html">deadline calculator</a>.</p>
<h2>What to include</h2>
<ol>
  <li><strong>The date</strong> of the letter, and the landlord's name and address.</li>
  <li><strong>The property address</strong>, including the unit number.</li>
  <li><strong>The move-out date</strong>, and either the lease end date or the number of days' notice you are giving.</li>
  <li><strong>Every tenant on the lease</strong>, each of whom should sign.</li>
  <li><strong>A request for a move-out inspection</strong>, so you can fix small problems before the landlord deducts for them.</li>
  <li><strong>How keys, fobs, garage remotes and parking permits</strong> will be returned.</li>
  <li><strong>The security deposit</strong> amount and your forwarding address for its return. In some states, including Texas, the landlord does not have to return the deposit until the tenant gives a forwarding address in writing.</li>
  <li><strong>Your phone number and email.</strong></li>
</ol>
<h2>Deliver it with proof</h2>
<p>Use the method the lease requires for notices. If it says nothing, hand the letter over and ask for a signed receipt, or send it by certified mail with a return receipt. An email or a text on its own can be hard to prove later. Keep a copy of the letter and the proof of delivery.</p>
<h2>After you send it</h2>
<ul>
  <li>Take dated photos and video of every room when you move in and again when you leave.</li>
  <li>Clean, repair any damage you caused, and remove all your belongings.</li>
  <li>Return every key and device, and get a written receipt if you can.</li>
  <li>Watch for the deposit. Deadlines are set by state law: for example 21 days after moving out in California, 14 days in New York and 30 days in Texas, usually with an itemized list of any deductions. If the deposit does not arrive, send a short demand letter that quotes the deadline.</li>
</ul>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/notice-to-vacate.html">notice to vacate template</a> asks for each detail above and builds the letter in your browser. Sharing the home? A <a href="${rel}templates/roommate-agreement.html">roommate agreement</a> sets out who pays what and how much notice a roommate gives before leaving. Landlords can use the <a href="${rel}templates/security-deposit-return-letter.html">security deposit return letter</a> and the <a href="${rel}templates/rent-increase-letter.html">rent increase letter</a>, and there are more on the <a href="${rel}for/landlords.html">landlord and tenant page</a>.</p>
<p class="small muted">General information, not legal advice. Notice periods and deposit rules differ between states and cities and change over time; check the current rules for the property.</p>` },
  { slug: 'what-to-include-in-a-lease-agreement', title: 'What to include in a residential lease agreement',
    description: 'A checklist of what a residential lease should cover, from rent and the deposit to repairs, entry and pets, and the state rules it cannot override.',
    body: (rel) => `
<p class="lead">A residential lease agreement should say who is renting which home, for how long, for how much, and who is responsible for what. Most disputes between landlords and tenants start with something the lease left out, so a complete lease is the cheapest protection either side can have.</p>
<h2>What a lease should include</h2>
<ol>
  <li><strong>The parties.</strong> The landlord, or the manager acting for them, and every adult who will live there. Say that tenants are jointly responsible, so each one owes the full rent.</li>
  <li><strong>The property.</strong> The full address and unit number, and any parking, storage or furnishings that come with it.</li>
  <li><strong>The term.</strong> A start and end date for a fixed term, or a start date for a month-to-month tenancy, and what happens when a fixed term ends.</li>
  <li><strong>Rent.</strong> The amount, the day it is due, how to pay, the rent for a first partial month, and any grace period and late fee.</li>
  <li><strong>The security deposit.</strong> The amount, what it can cover, and how and when it is returned.</li>
  <li><strong>Utilities.</strong> Which bills the tenant pays and which the landlord pays.</li>
  <li><strong>Occupants and guests.</strong> Who may live there, and how long a guest may stay.</li>
  <li><strong>Pets and smoking.</strong> Whether they are allowed, and any pet deposit.</li>
  <li><strong>Repairs and maintenance.</strong> How to report a problem, the landlord's duty to keep the home fit to live in, and any tasks the tenant takes on, such as the yard.</li>
  <li><strong>Entry.</strong> How much notice the landlord gives before coming in, and what counts as an emergency.</li>
  <li><strong>Subletting.</strong> Whether the tenant may sublet or assign the lease, and whether consent is needed.</li>
  <li><strong>Disclosures.</strong> Anything the law requires the landlord to tell the tenant.</li>
  <li><strong>Notices and signatures.</strong> Where each side sends notices, and the signature of the landlord and every tenant.</li>
</ol>
<h2>Rules a lease cannot override</h2>
<p>State and local law applies whatever the lease says, and a term that breaks it is usually unenforceable. The rules that most often catch landlords out:</p>
<ul>
  <li><strong>Deposit limits and deadlines.</strong> Many states cap the deposit and set a deadline to return it with an itemized list of deductions. California, for example, generally limits deposits to one month's rent and allows 21 days to return them.</li>
  <li><strong>Late fees.</strong> Some states cap late fees or require a grace period before one can be charged.</li>
  <li><strong>Notice to enter.</strong> Many states require notice before a landlord enters, often 24 hours, except in an emergency.</li>
  <li><strong>A home fit to live in.</strong> In almost every state the landlord must keep the home habitable, with working heat, water and plumbing, and a lease cannot waive that.</li>
  <li><strong>Fair housing.</strong> Federal, state and local laws forbid discrimination in renting, and require landlords to allow assistance animals for people with disabilities, even under a no-pets lease.</li>
  <li><strong>Rent control.</strong> Some cities and a few states limit rent increases and the reasons a tenancy can be ended.</li>
</ul>
<h2>Required disclosures</h2>
<p>For a home built before 1978, federal law requires the landlord to give the tenant a lead-based paint disclosure, any reports the landlord has, and the EPA pamphlet <a href="https://www.epa.gov/lead/protect-your-family-lead-your-home-real-estate-disclosure" rel="noopener">Protect Your Family From Lead in Your Home</a> before the lease is signed, and the lease must include the federal lead warning statement. States and cities add their own, such as known mold, flood risk, bed bug history, the name of the owner or manager, or where the deposit is held. Check the list for the place where the property is.</p>
<h2>Fixed term or month to month?</h2>
<p>A fixed term, usually a year, fixes the rent and the dates for both sides. Month to month is flexible: either side can end it with notice, and the landlord can change the rent with notice. Many leases start with a fixed term and continue month to month afterwards unless someone gives notice.</p>
<h2>Before the tenant moves in</h2>
<p>Walk through the home together and record the condition of every room with a <a href="${rel}templates/move-in-checklist.html">move-in checklist</a>, and take dated photos. It is the best evidence if you disagree about the deposit later, and some states require one. Give each tenant a copy of the signed lease and keep one yourself.</p>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/residential-lease-agreement.html">residential lease agreement</a> covers each point in the list above, for a fixed term or month to month, and builds the lease in your browser without an account. Work out a first partial month with the <a href="${rel}free-tools/prorated-rent.html">prorated rent calculator</a>. To choose a tenant, start with the <a href="${rel}templates/rental-application.html">rental application</a>; to allow a pet under an existing lease, add a <a href="${rel}templates/pet-addendum.html">pet addendum</a>. Tenants subletting while they are away can use the <a href="${rel}templates/sublease-agreement.html">sublease agreement</a>, and there are more letters on the <a href="${rel}for/landlords.html">landlord and tenant page</a>.</p>
<p class="small muted">General information, not legal advice. Landlord and tenant law differs between states and cities and changes often; check the current rules for the property.</p>` },
];

export const pages = [
  ...AUD.map((a) => ({
    path: `for/${a.slug}.html`, title: a.title, description: a.intro.slice(0, 290), extraHead: faqLd(a.faq),
    body: (rel) => `<section class="hero"><div class="wrap" style="display:block;max-width:52rem">
  <p class="eyebrow">For ${esc(a.name.toLowerCase())}</p>
  <h1>${esc(a.title)}</h1>
  <p class="lead">${esc(a.intro)}</p>
  <div class="actions"><a class="btn btn-primary btn-lg" href="${rel}app/">Open Clausery, free</a><a class="btn btn-lg" href="${rel}templates/">Browse free templates</a></div>
</div></section>
<section class="section section-alt"><div class="wrap"><div class="grid grid-2">
  ${a.points.map(([h, p]) => `<div class="feature"><h2 style="font-size:1.15rem">${esc(h)}</h2><p>${esc(p)}</p></div>`).join('')}
</div></div></section>
<section class="section"><div class="wrap" style="max-width:52rem">
  <h2>Start from a free template</h2>
  <ul>${a.templates.map((s) => `<li><a href="${rel}templates/${s}.html">${esc(NAMES[s])}</a></li>`).join('')}</ul>
  <h2 style="margin-top:2.5rem">Questions</h2>
  ${faqHtml(a.faq)}
  <h2 style="margin-top:2.5rem">Further reading</h2>
  <ul>${a.related.map(([href, label]) => `<li><a href="${rel}${href}">${esc(label)}</a></li>`).join('')}</ul>
</div></section>`,
  })),
  { path: 'guides/', title: 'Guides', description: 'Practical guides to automating Word documents, conditional clauses and client intake, without uploading client data.',
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem"><h1>Guides</h1><ul>${GUIDES.map((g) => `<li><a href="${rel}guides/${g.slug}.html">${esc(g.title)}</a><div class="small muted">${esc(g.description)}</div></li>`).join('')}</ul></div></section>` },
  ...GUIDES.map((g) => ({
    path: `guides/${g.slug}.html`, title: g.title, description: g.description, feed: true, published: '2026-09-26',
    extraHead: `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, datePublished: '2026-09-26', author: { '@type': 'Organization', name: 'Clausery' } })}</script>` + crumbsLd([['Home', ''], ['Guides', 'guides/'], [g.title, `guides/${g.slug}.html`]]),
    body: (rel) => `<section class="section"><div class="wrap prose"><nav class="small muted" aria-label="Breadcrumb"><a href="${rel}">Home</a> › <a href="${rel}guides/">Guides</a></nav><h1 style="margin-top:1rem">${esc(g.title)}</h1>${g.body(rel)}
<h2>More guides</h2>
<ul>${GUIDES.filter((x) => x.slug !== g.slug).map((x) => `<li><a href="${rel}guides/${x.slug}.html">${esc(x.title)}</a></li>`).join('')}</ul></div></section>`,
  })),
];
