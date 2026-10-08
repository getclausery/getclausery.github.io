// Pages for each buyer, and how-to guides that answer the searches those buyers make.
import { esc, faqLd, faqHtml, crumbsLd, lowerFirst, SITE, LASTMOD, LASTMOD_LONG } from '../tools/partials.mjs';

const AUD = [
  { slug: 'law-firms', name: 'Law firms', title: 'Document automation for small law firms, without uploading client files',
    intro: 'Engagement letters, NDAs, demand letters, wills and leases: most firms draft the same documents every week from Word files that already exist. Clausery turns those files into questionnaires and assembles the finished document on the lawyer\'s own computer.',
    points: [['Confidentiality you can explain in one sentence', 'Client information is typed into the browser and the document is built there. It is never sent to Clausery or anyone else, so there is no vendor holding client data.'], ['Keep your precedents', 'Your Word templates keep their styles, numbering and letterhead. Add tags where details change; nothing is re-created in a new editor.'], ['Clients answer without a portal', 'Send a questionnaire as a single file. The client fills it in offline and returns an answers file you import into the draft.'], ['Encrypted on the device', 'Turn on a passphrase and everything stored in the browser is encrypted, with automatic locking when you step away.']],
    templates: ['engagement-letter', 'mutual-nda', 'one-way-nda', 'business-sale-nda', 'non-compete-agreement', 'severance-agreement', 'board-resolution', 'cease-and-desist-letter', 'letter-of-intent', 'memorandum-of-understanding', 'loan-agreement', 'promissory-note', 'bill-of-sale', 'partnership-agreement', 'general-release', 'payment-demand-letter', 'contract-termination-letter'],
    related: [['compare/gavel-alternative.html', 'Clausery compared with Gavel'], ['compare/clio-draft-alternative.html', 'Clausery compared with Clio Draft'], ['compare/hotdocs-alternative.html', 'Clausery compared with HotDocs'], ['compare/docassemble-alternative.html', 'Clausery compared with docassemble'], ['guides/confidentiality-checklist-document-software.html', 'Confidentiality checklist for document software'], ['guides/client-intake-without-a-portal.html', 'Client intake without a portal'], ['clauses/', 'Contract clauses explained']],
    faq: [['Is Clausery suitable for confidential client matters?', 'Documents are assembled in the browser on the lawyer\'s own computer, and nothing you type or generate is sent to Clausery. On the Pro plan you can also encrypt everything stored in the browser with a passphrase. Check the set-up against your own IT policies and professional rules.'],
      ['Can we use our existing Word precedents?', 'Yes. Add {tags} where details change, wrap optional clauses in a section, and upload the file. Styles, numbering, headers and letterhead are kept exactly.'],
      ['How is it different from Gavel, Clio Draft or HotDocs?', 'Those products run on a vendor\'s servers or need installing, and offer more, such as hosted client portals and practice management integrations. Clausery does the core job, templates into questionnaires into finished documents, in the browser with no server involved. The comparison pages set out the trade-offs honestly.'],
      ['What does it cost?', 'Every library template is free, and you can automate up to three of your own Word templates free, with unlimited documents. Pro, with unlimited templates, calculations, encryption and client intake forms, is $19 per user per month.']] },
  { slug: 'hr-teams', name: 'HR teams', title: 'Free HR letter templates you can fill in online',
    intro: 'Offer letters, employment contracts, warning letters, promotions, pay rises, references and terminations: free HR letter templates for Word, with no sign-up. Managers answer a few questions, optional wording only appears when it applies, and employee details never leave your computer.',
    points: [['Free, with no account', 'Download any template as an ordinary Word file, or fill it in here and download the finished letter. There is nothing to sign up for and no trial that turns into a subscription.'], ['Approved wording, every time', 'HR owns the template; managers answer questions. Optional clauses such as equity, bonus, probation or a right of appeal only appear when they apply.'], ['Personal data stays on the device', 'Salary and personal details are never uploaded, which keeps your records of processing and vendor reviews simple.'], ['Share templates across the team', 'Export a template pack to your shared drive; colleagues import it and draft from the same approved version.']],
    templates: ['offer-letter', 'employment-agreement', 'employee-warning-letter', 'promotion-letter', 'salary-increase-letter', 'employment-termination-letter', 'employment-verification-letter', 'reference-letter', 'internship-offer-letter', 'job-description', 'severance-agreement', 'resignation-letter', 'two-weeks-notice-letter', 'employee-nda', 'non-solicitation-agreement', 'sales-commission-agreement', 'independent-contractor-agreement', 'performance-improvement-plan', 'remote-work-agreement', 'expense-reimbursement-form'],
    related: [['guides/how-to-write-an-offer-letter.html', 'How to write a job offer letter'], ['guides/how-to-write-an-employee-warning-letter.html', 'How to write a warning letter to an employee'], ['guides/how-to-write-a-termination-letter.html', 'How to write a termination letter'], ['guides/non-compete-vs-non-solicitation.html', 'Non-compete vs non-solicitation agreement'], ['guides/nda-vs-confidentiality-agreement.html', 'NDA vs confidentiality agreement'], ['clauses/at-will-employment-clause.html', 'At-will employment clause'], ['clauses/non-compete-clause.html', 'Non-compete clause'], ['clauses/confidentiality-clause.html', 'Confidentiality clause'], ['free-tools/deadline-calculator.html', 'Deadline calculator: review dates and notice periods']],
    faq: [['Are these HR templates free?', 'Yes. Every template can be downloaded as a Word file or filled in online at no cost and with no account. Library templates never count towards a limit, and the free plan also holds up to three of your own templates with unlimited letters; Pro adds unlimited templates and team features for $19 per user per month.'],
      ['Which letter do I need?', 'An offer letter to make the offer, then an employment agreement for the full terms. A salary increase letter for a pay rise, a promotion letter for a new title, a warning letter to put a problem in writing, and a termination letter if employment ends. Verification and reference letters confirm employment for others.'],
      ['Does employee data leave our computers?', 'No. Names, salaries and addresses are typed into the browser and the letter is generated there. Nothing is sent to Clausery or any other service.'],
      ['Can managers use it without training?', 'Yes. HR sets up the template once; managers answer plain-language questions and download the finished letter. Optional wording only appears when it applies.']] },
  { slug: 'consultants', description: 'Statements of work, consulting and contractor agreements from your own Word templates, filled in a two-minute questionnaire. Free templates, nothing uploaded.', name: 'Consultants and agencies', title: 'Proposals, SOWs and contractor agreements without another subscription',
    intro: 'Statements of work, contractor agreements and client letters follow the same pattern every time. Clausery turns your Word versions into a two-minute questionnaire and keeps client details on your laptop.',
    points: [['Repeat deliverables and line items', 'List as many deliverables, milestones or fee lines as you need; the document repeats the paragraph or table row for each one.'], ['Totals calculated for you', 'Add computed fields such as a sum of line items, a date 30 days after signing, or an amount in words.'], ['Works on the road', 'Once loaded, Clausery works offline, including on a train or a client site without Wi-Fi.'], ['Your branding, untouched', 'Your template keeps its logo, fonts and layout.']],
    templates: ['consulting-agreement', 'statement-of-work', 'quote', 'service-agreement', 'retainer-agreement', 'subcontractor-agreement', 'independent-contractor-agreement', 'memorandum-of-understanding', 'invoice', 'purchase-order', 'meeting-minutes', 'payment-reminder-letter', 'payment-demand-letter', 'change-order-form', 'contract-termination-letter', 'credit-note'],
    related: [['guides/what-to-include-in-a-statement-of-work.html', 'What to include in a statement of work'], ['guides/is-an-mou-legally-binding.html', 'Is an MOU legally binding?'], ['guides/how-to-write-a-payment-demand-letter.html', 'How to write a demand letter for unpaid invoices'], ['clauses/payment-terms-clause.html', 'Payment terms clause'], ['clauses/intellectual-property-clause.html', 'Intellectual property clause'], ['free-tools/deadline-calculator.html', 'Contract deadline calculator'], ['guides/what-to-do-when-a-client-wont-pay.html', 'What to do when a client won\'t pay'], ['compare/pandadoc-alternative.html', 'Clausery compared with PandaDoc']],
    faq: [['Can I add a table of deliverables or fees?', 'Yes. Put the repeat tags in a table row and the row repeats for each deliverable or line item, keeping your borders and shading.'],
      ['Can it calculate totals and dates?', 'Yes. The free invoice, quote and purchase order templates already add up line items and work out tax as you type. In your own templates, computed fields (Pro plan) can add up line items, work out a date 30 days after signing, or write an amount in words.'],
      ['Does it work without an internet connection?', 'Yes. Once the app has loaded, it works offline, so you can draft on a train or at a client site.'],
      ['What does it cost?', 'Every library template is free, plus up to three of your own templates, with unlimited documents. Pro is $19 per user per month.']] },
  { slug: 'freelancers', name: 'Freelancers', title: 'Free freelance contract templates you can fill in online',
    intro: 'Designers, photographers, videographers, virtual assistants, planners, trainers, tutors and writers all need a signed contract before work starts. Clausery turns a free Word contract into a two-minute questionnaire, so each client gets the right terms without you editing the document by hand.',
    points: [['Contracts written for your trade', 'Page lists for web projects, concepts and file formats for designers, retainers and usage rights for photographers, platforms and posting schedules for social media, word counts and bylines for writers.'], ['Stop scope creep in writing', 'Revision rounds, content deadlines, hourly rates for extra work and kill fees are built in, so the conversation is already settled when a client asks for "one more change".'], ['Client details stay on your laptop', 'Names, fees and addresses are typed into your browser and the contract is built there. Nothing is uploaded, and it works offline.'], ['Every library contract is free', 'Use any contract in the library free, with unlimited documents, and automate up to three of your own; Pro removes that limit for $19 a month.']],
    templates: ['web-design-contract', 'contractor-nda', 'graphic-design-contract', 'photography-contract', 'photo-release-form', 'video-production-contract', 'social-media-management-contract', 'freelance-writing-contract', 'virtual-assistant-agreement', 'event-planning-contract', 'personal-training-agreement', 'tutoring-agreement', 'cleaning-services-contract', 'catering-contract', 'nanny-contract', 'retainer-agreement', 'subcontractor-agreement', 'independent-contractor-agreement', 'quote', 'invoice', 'payment-receipt', 'payment-reminder-letter', 'payment-demand-letter', 'change-order-form', 'pet-sitting-agreement', 'coaching-agreement', 'credit-note'],
    related: [['guides/how-to-write-a-freelance-contract.html', 'How to write a freelance contract'], ['guides/what-to-do-when-a-client-wont-pay.html', 'What to do when a client won\'t pay'], ['guides/what-is-a-kill-fee.html', 'What is a kill fee?'], ['free-tools/freelance-rate.html', 'Freelance rate calculator'], ['free-tools/invoice-due-date.html', 'Invoice due date calculator (net 30)'], ['free-tools/late-payment-interest.html', 'Late payment interest calculator'], ['clauses/intellectual-property-clause.html', 'Who owns the work: intellectual property clause'], ['clauses/payment-terms-clause.html', 'Payment terms clause'], ['clauses/late-payment-interest-clause.html', 'Late payment interest clause'], ['guides/how-to-write-a-payment-demand-letter.html', 'How to write a demand letter for unpaid invoices'], ['free-tools/deadline-calculator.html', 'Contract deadline calculator'], ['compare/honeybook-alternative.html', 'Clausery compared with HoneyBook'], ['compare/bonsai-alternative.html', 'Clausery compared with Bonsai'], ['compare/dubsado-alternative.html', 'Clausery compared with Dubsado']],
    faq: [['Do I need a contract for small freelance jobs?', 'A short written agreement avoids most disputes about scope, revisions, payment and ownership, whatever the size of the job. Email acceptance of a clear contract is often enough, though some documents need a signature.'], ['Can I reuse the same contract for every client?', 'Yes. Answer the questions for each client and download a finished Word contract. Optional terms, such as a deposit, kill fee or maintenance plan, only appear when you switch them on.'], ['Are these contracts legally binding?', 'They are general templates. Whether a contract is enforceable depends on your country or state and how it is agreed, so have one reviewed for your situation, especially for large projects.'], ['Can I add my own clauses?', 'Yes. Download the Word file, edit anything, keep the {tags}, and upload it to Clausery. Your formatting is kept exactly.']] },
  { slug: 'landlords', name: 'Landlords and tenants', title: 'Free landlord and tenant letters, filled in online',
    intro: 'Leases, move-in checklists, late rent notices, rent increases and deposit returns follow the same pattern every time, and most have a deadline. Clausery fills in a free Word template from a few questions, so the dates, amounts and deductions are right, and tenant details stay on your computer.',
    points: [['No account, no trial, no card', 'Download any template as an ordinary Word file, or fill it in here and download the finished document. There is nothing to sign up for, and no free trial that turns into a subscription.'], ['Dates and amounts worked out', 'Each document states the dates that matter, from the first partial month to the deposit deadline. The free prorated rent and deadline calculators do the arithmetic.'], ['A clear record of the deposit', 'Record each room at move-in with the checklist, then list any deductions at move-out: the deposit letter sets out the deposit, interest, each deduction and the refund.'], ['Tenant details stay private', 'Names, addresses and amounts are typed into your browser and the document is built there. Nothing is uploaded, and it works offline.']],
    templates: ['residential-lease-agreement', 'rental-application', 'move-in-checklist', 'rent-receipt', 'late-rent-notice', 'pet-addendum', 'lease-renewal-letter', 'rent-increase-letter', 'security-deposit-return-letter', 'notice-to-vacate', 'lease-termination-agreement', 'sublease-agreement', 'roommate-agreement', 'payment-demand-letter', 'room-rental-agreement', 'rent-payment-plan-agreement', 'landlord-reference-letter'],
    related: [['compare/rocket-lawyer-alternative.html', 'Clausery compared with Rocket Lawyer'], ['guides/what-to-include-in-a-lease-agreement.html', 'What to include in a residential lease agreement'], ['guides/how-to-return-a-security-deposit.html', 'How to return a security deposit: deadlines and deductions'], ['guides/how-to-write-a-rent-increase-letter.html', 'How to write a rent increase letter'], ['guides/what-to-include-in-a-roommate-agreement.html', 'What to include in a roommate agreement'], ['free-tools/prorated-rent.html', 'Prorated rent calculator'], ['guides/how-to-write-a-notice-to-vacate.html', 'How to write a notice to vacate letter'], ['free-tools/deadline-calculator.html', 'Deadline calculator: count notice periods in days'], ['free-tools/late-payment-interest.html', 'Late payment interest calculator'], ['guides/how-to-write-a-payment-demand-letter.html', 'How to write a demand letter for money owed'], ['clauses/notices-clause.html', 'Notices clause: how formal notices must be given'], ['compare/eforms-alternative.html', 'Clausery compared with eForms'], ['compare/lawdepot-alternative.html', 'Clausery compared with LawDepot']],
    faq: [['How much notice does a rent increase need?', 'It depends on the state and the lease. During a fixed-term lease the rent usually cannot rise unless the lease allows it. For a month-to-month tenancy many states require at least 30 days\' written notice, and some require more for larger increases: in California, 90 days for an increase of more than 10%. Some cities also limit increases under rent control.'],
      ['How long does a landlord have to return a security deposit?', 'It depends on the state: for example 21 days after the tenant moves out in California, 14 days in New York and 30 days in Texas. Most states expect an itemized list of any deductions, and missing the deadline can cost the landlord the right to keep any of it.'],
      ['Is a roommate agreement legally binding?', 'It can be enforced between the roommates like other agreements, but it does not change the lease. If you are all on the lease, the landlord can usually still claim the whole rent from any one of you.'],
      ['How is this different from TurboTenant, Zillow or eForms?', 'Landlord software such as TurboTenant and Zillow Rental Manager offers free tools inside an account, and sells or bundles state-specific leases and form packs. Form sites such as eForms often ask you to start a free trial that becomes a paid subscription before you can download. Clausery\'s templates are ordinary Word files with no account, filled in in your browser. They are general templates rather than state-specific forms, so check your state\'s rules and add any required disclosures.'],
      ['What does it cost?', 'The templates are free to download or fill in, with no limit. In the app you can also automate up to three of your own templates free; Pro is $19 per user per month.']] },
];
const NAMES = { 'room-rental-agreement': 'Room rental agreement', 'rent-payment-plan-agreement': 'Rent payment plan agreement', 'landlord-reference-letter': 'Landlord reference letter', 'performance-improvement-plan': 'Performance improvement plan', 'remote-work-agreement': 'Remote work agreement', 'expense-reimbursement-form': 'Expense reimbursement form', 'change-order-form': 'Change order form', 'pet-sitting-agreement': 'Pet sitting agreement', 'coaching-agreement': 'Coaching agreement', 'contract-termination-letter': 'Contract termination letter', 'credit-note': 'Credit note', 'employment-agreement': 'Employment agreement', 'employee-warning-letter': 'Employee warning letter', 'promotion-letter': 'Promotion letter', 'liability-waiver': 'Liability waiver', 'resignation-letter': 'Resignation letter', 'non-solicitation-agreement': 'Non-solicitation agreement', 'employee-nda': 'Employee NDA', 'contractor-nda': 'Contractor NDA', 'business-sale-nda': 'NDA for selling a business', 'rental-application': 'Rental application', 'rent-receipt': 'Rent receipt', 'lease-renewal-letter': 'Lease renewal letter', 'pet-addendum': 'Pet addendum', 'residential-lease-agreement': 'Residential lease agreement', 'sublease-agreement': 'Sublease agreement', 'move-in-checklist': 'Move-in and move-out checklist', 'late-rent-notice': 'Late rent notice', 'notice-to-vacate': 'Notice to vacate (tenant)', 'rent-increase-letter': 'Rent increase letter', 'security-deposit-return-letter': 'Security deposit return letter', 'roommate-agreement': 'Roommate agreement', 'partnership-agreement': 'Partnership agreement', 'sales-commission-agreement': 'Sales commission agreement', 'photo-release-form': 'Photo and model release', 'general-release': 'General release', 'memorandum-of-understanding': 'Memorandum of understanding (MOU)', 'letter-of-intent': 'Letter of intent (business purchase)', 'bill-of-sale': 'Bill of sale', 'loan-agreement': 'Loan agreement', 'payment-reminder-letter': 'Payment reminder letter', 'subcontractor-agreement': 'Subcontractor agreement', 'retainer-agreement': 'Retainer agreement', 'video-production-contract': 'Video production contract', 'virtual-assistant-agreement': 'Virtual assistant agreement', 'event-planning-contract': 'Event planning contract', 'personal-training-agreement': 'Personal training agreement', 'tutoring-agreement': 'Tutoring agreement', 'web-design-contract': 'Web design contract', 'graphic-design-contract': 'Graphic design contract', 'photography-contract': 'Photography contract', 'social-media-management-contract': 'Social media management contract', 'freelance-writing-contract': 'Freelance writing contract',  'one-way-nda': 'One-way NDA', 'cease-and-desist-letter': 'Cease and desist letter', 'promissory-note': 'Promissory note', 'internship-offer-letter': 'Internship offer letter', 'salary-increase-letter': 'Salary increase letter', 'reference-letter': 'Reference letter', 'employment-termination-letter': 'Termination letter', 'consulting-agreement': 'Consulting agreement', 'service-agreement': 'Service agreement', 'engagement-letter': 'Engagement letter', 'mutual-nda': 'Mutual NDA', 'payment-demand-letter': 'Payment demand letter', 'offer-letter': 'Offer letter', 'employment-verification-letter': 'Employment verification letter', 'independent-contractor-agreement': 'Independent contractor agreement', 'statement-of-work': 'Statement of work', 'invoice': 'Invoice', 'quote': 'Price quote', 'purchase-order': 'Purchase order', 'payment-receipt': 'Payment receipt', 'two-weeks-notice-letter': 'Two weeks notice letter', 'hold-harmless-agreement': 'Hold harmless agreement', 'equipment-rental-agreement': 'Equipment rental agreement', 'cleaning-services-contract': 'Cleaning services contract', 'meeting-minutes': 'Meeting minutes', 'non-compete-agreement': 'Non-compete agreement', 'nanny-contract': 'Nanny contract', 'gift-letter': 'Gift letter for a mortgage', 'lease-termination-agreement': 'Lease termination agreement', 'severance-agreement': 'Severance agreement', 'job-description': 'Job description', 'catering-contract': 'Catering contract', 'board-resolution': 'Board resolution' };

export const GUIDES = [
  { slug: 'automate-word-templates', title: 'How to automate a Word template without uploading it anywhere',
    description: 'How to turn any Word document into a reusable fill-in template with questions, conditional clauses and lists, step by step, entirely in your browser.',
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
    description: 'Make parts of a Word document appear only when they apply: yes/no sections, either/or wording, and clauses based on amounts or dates. Free examples.',
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
    description: 'Send clients a questionnaire they fill in offline and return as a file, then generate documents from their answers, with no client portal or upload.',
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
<p>Clausery uses tags you type straight into Word, so your mail merge template is already most of the way there. Replace merge fields with tags like <code>{client_name}</code>, wrap optional paragraphs in <code>{#has_retainer}…{/has_retainer}</code>, and drop the file into <a href="${rel}app/">the app</a>. It is free for up to three of your own templates and nothing is uploaded. The <a href="${rel}guides/automate-word-templates.html">step-by-step guide</a> walks through it.</p>` },
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
    description: 'A checklist of questions to ask before putting client or employee data into any document tool: where data goes, who can see it, sub-processors.',
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
    description: 'What a statement of work needs: scope, deliverables, timeline, fees, assumptions, acceptance and change control, with examples of what goes wrong.',
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
    description: 'What an NDA should include: the definition of confidential information, exclusions, term, return of information and governing law, clause by clause.',
    body: (rel) => `
<p class="lead">A non-disclosure agreement is short, but each clause does a specific job. Here is what to check before you send or sign one.</p>
<h2>Mutual or one-way?</h2>
<p>If only one side is sharing information, such as a company showing a prototype or briefing an agency, a <a href="${rel}templates/one-way-nda.html">one-way NDA</a> is simpler. If both sides will share, as in partnership or acquisition talks, use a <a href="${rel}templates/mutual-nda.html">mutual NDA</a>. Employees, freelancers and business buyers each have their own version: see <a href="${rel}guides/mutual-vs-one-way-nda.html">mutual vs one-way NDA</a>.</p>
<h2>The clauses</h2>
<ol>
  <li><strong>Parties.</strong> Correct legal names and entity types. An NDA signed by the wrong group company may not protect the one that shares the information.</li>
  <li><strong>Purpose.</strong> What the information may be used for, described narrowly: "evaluating a possible distribution agreement", not "business purposes".</li>
  <li><strong>Definition of confidential information.</strong> Whether it covers only marked information or anything reasonably understood to be confidential. See the <a href="${rel}clauses/confidentiality-clause.html">confidentiality clause</a>.</li>
  <li><strong>Exclusions.</strong> Public information, information already known, information received from someone else, and independent development.</li>
  <li><strong>Obligations.</strong> Use only for the purpose, disclose only to people who need to know, and protect with reasonable care.</li>
  <li><strong>Compelled disclosure.</strong> What happens if a court or regulator requires disclosure.</li>
  <li><strong>Return or destruction.</strong> On request or when talks end, with an exception for automatic backups.</li>
  <li><strong>Term.</strong> How long the agreement lasts and how long the obligations <a href="${rel}clauses/survival-clause.html">survive</a> afterwards. See <a href="${rel}guides/how-long-should-an-nda-last.html">how long an NDA should last</a>.</li>
  <li><strong>No licence and no obligation to proceed.</strong> Sharing information does not grant rights in it or commit anyone to a deal.</li>
  <li><strong>Remedies.</strong> Acknowledging that an injunction may be appropriate, since damages rarely fix a leak.</li>
  <li><strong>Governing law and jurisdiction.</strong> See the <a href="${rel}clauses/governing-law-clause.html">governing law clause</a>.</li>
</ol>
<h2>Things to avoid</h2>
<ul>
  <li>Non-solicitation or non-compete terms hidden in an NDA, which the other side may not expect.</li>
  <li>Clauses that stop someone reporting wrongdoing to a regulator, which are unenforceable in many places. The <a href="${rel}templates/employee-nda.html">employee NDA</a> says so in plain words.</li>
  <li>An NDA that is later wiped out by the <a href="${rel}clauses/entire-agreement-clause.html">entire agreement clause</a> of the main contract.</li>
</ul>
<h2>Send one in two minutes</h2>
<p>All five <a href="${rel}nda-templates/">NDA templates</a> are free to download as Word files or fill in online. Clausery asks for the parties, purpose, term and governing law, includes the optional clauses you choose, and produces a finished document without uploading anything.</p>` },
  { slug: 'mutual-vs-one-way-nda', published: '2026-09-27', title: 'Mutual vs one-way NDA: which one do you need?',
    description: 'The difference between a mutual and a one-way (unilateral) NDA, when to use each, and the special cases: employees, freelancers and business sales.',
    body: (rel) => `
<p class="lead">The only question that matters is who will share confidential information. If just one side shares, a one-way NDA is enough. If both sides share, use a mutual NDA.</p>
<h2>The short answer</h2>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">Situation</th><th scope="col">Use</th></tr></thead><tbody>
  <tr><td>Partnership or joint venture talks</td><td><a href="${rel}templates/mutual-nda.html">Mutual NDA</a></td></tr>
  <tr><td>Evaluating a supplier or software vendor who will also see your data</td><td><a href="${rel}templates/mutual-nda.html">Mutual NDA</a></td></tr>
  <tr><td>Showing a prototype, pitching an idea or briefing an agency</td><td><a href="${rel}templates/one-way-nda.html">One-way NDA</a></td></tr>
  <tr><td>Hiring a freelancer or contractor</td><td><a href="${rel}templates/contractor-nda.html">Contractor NDA</a> (one-way)</td></tr>
  <tr><td>Hiring an employee</td><td><a href="${rel}templates/employee-nda.html">Employee NDA</a> (one-way)</td></tr>
  <tr><td>Selling a business to a buyer who wants to see the books</td><td><a href="${rel}templates/business-sale-nda.html">NDA for selling a business</a> (one-way)</td></tr>
</tbody></table></div>
<h2>What actually changes between the two</h2>
<ul>
  <li><strong>Who is protected.</strong> A one-way NDA names a disclosing party and a receiving party. A mutual NDA makes each party both, so every duty applies in both directions.</li>
  <li><strong>How it reads to the other side.</strong> A mutual NDA looks balanced, which often makes it quicker to sign. Sending a one-way NDA when both sides will share can start the talks with an argument.</li>
  <li><strong>What stays the same.</strong> The definition of confidential information, the exclusions, the term, return of information and governing law work the same way in both.</li>
</ul>
<h2>When a mutual NDA is the safer choice</h2>
<p>If you are not sure whether the other side will share anything, use a mutual NDA. It costs you nothing if they never do, and it protects you if a conversation that started one-way turns into a real exchange of plans or data.</p>
<h2>Three special cases</h2>
<ul>
  <li><strong>Employees.</strong> An employee NDA is one-way, but it needs more than a standard one-way NDA: wording that it does not stop reporting to regulators, and in the US the Defend Trade Secrets Act notice. The <a href="${rel}templates/employee-nda.html">employee NDA template</a> includes both.</li>
  <li><strong>Freelancers.</strong> A contractor NDA should limit use to the project, say whether subcontractors are allowed, and settle portfolio rights. Freelancers asked to sign a client's NDA can send the <a href="${rel}templates/contractor-nda.html">contractor NDA</a> back as a fairer starting point.</li>
  <li><strong>Investors.</strong> Many investors will not sign an NDA before a first meeting, because they see similar ideas every week. Share the pitch without the secrets, and use an NDA later, for due diligence.</li>
</ul>
<h2>Get the right one</h2>
<p>All five templates are free Word files, and you can fill any of them in online without uploading anything. <a href="${rel}nda-templates/">Compare the NDA templates</a>, or read <a href="${rel}guides/what-to-include-in-an-nda.html">what to include in an NDA</a> before you send one.</p>` },
  { slug: 'how-long-should-an-nda-last', published: '2026-09-27', title: 'How long should an NDA last? Typical terms explained',
    description: 'How long NDAs usually last: one to five years for most business information, longer for trade secrets. The two clocks in every NDA, and how to choose.',
    body: (rel) => `
<p class="lead">Most NDAs protect ordinary business information for one to five years. Trade secrets are usually protected for as long as they stay secret. The right number depends on how long the information stays valuable.</p>
<h2>Every NDA has two clocks</h2>
<ul>
  <li><strong>The term</strong> is the window in which information is shared under the agreement, for example the months of partnership talks.</li>
  <li><strong>The confidentiality period</strong> is how long the receiving side must keep the information secret, which often runs on after the term ends. This is what the <a href="${rel}clauses/survival-clause.html">survival clause</a> is for.</li>
</ul>
<p>Many short NDAs use a single number of years for both. That is fine, as long as the number is long enough for the information you are sharing.</p>
<h2>Typical lengths by situation</h2>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">Situation</th><th scope="col">Common confidentiality period</th></tr></thead><tbody>
  <tr><td>Early business talks, vendor evaluations</td><td>1 to 3 years</td></tr>
  <tr><td>Freelancers and contractors</td><td>2 to 5 years after the project ends</td></tr>
  <tr><td>Employees</td><td>During employment and 2 to 5 years after it ends</td></tr>
  <tr><td>Selling a business</td><td>2 to 3 years</td></tr>
  <tr><td>Trade secrets, such as formulas, source code or customer data</td><td>As long as they remain trade secrets</td></tr>
</tbody></table></div>
<p class="small muted">These are common choices in practice, not legal rules. Some countries and states have their own limits, especially for employees.</p>
<h2>Why not just say "forever"?</h2>
<p>Some courts have refused to enforce a never-ending duty for ordinary business information, because most information stops being valuable within a few years. The safer pattern is a fixed number of years, with an exception that keeps trade secrets protected for as long as they stay secret. All of Clausery's NDA templates are written that way.</p>
<h2>How to choose a number</h2>
<ol>
  <li>Ask how long the information would hurt you if a competitor had it. Pricing and plans go stale quickly; code and customer lists do not.</li>
  <li>Pick a period that covers that, and add a year for safety.</li>
  <li>Keep the trade secret exception for anything that should stay secret for longer.</li>
</ol>
<h2>Set it in the template</h2>
<p>Each NDA template asks for the number of years as one of its questions. The <a href="${rel}templates/employee-nda.html">employee NDA</a> counts from the end of employment, the <a href="${rel}templates/contractor-nda.html">contractor NDA</a> from the end of the project, and the <a href="${rel}templates/mutual-nda.html">mutual</a> and <a href="${rel}templates/one-way-nda.html">one-way</a> NDAs from signing. <a href="${rel}nda-templates/">See all NDA templates</a>.</p>` },
  { slug: 'nda-vs-confidentiality-agreement', published: '2026-09-27', title: 'NDA vs confidentiality agreement: is there a difference?',
    description: 'NDA and confidentiality agreement mean the same thing. How both differ from non-solicitation and non-compete agreements, and which one you need.',
    body: (rel) => `
<p class="lead">There is no legal difference. "Non-disclosure agreement" and "confidentiality agreement" are two names for the same kind of contract. What matters is what the agreement says, not what it is called.</p>
<h2>Why two names?</h2>
<p>Habit, mostly. Business deals tend to say "NDA", and employers often say "confidentiality agreement" because it sounds less adversarial to a new hire. You will also see "confidential disclosure agreement" (CDA) in research and pharma, and "proprietary information agreement" in tech. A court reads the terms either way.</p>
<p>Clausery's <a href="${rel}nda-templates/">five NDA templates</a> use both names: the employee and contractor versions are titled confidentiality agreements, the others NDAs.</p>
<h2>The agreements people confuse with an NDA</h2>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">Agreement</th><th scope="col">What it protects</th><th scope="col">What it stops</th></tr></thead><tbody>
  <tr><td>NDA or confidentiality agreement</td><td>Information</td><td>Using or sharing confidential information</td></tr>
  <tr><td>Non-solicitation agreement</td><td>Relationships</td><td>Actively poaching your customers or staff for a set time</td></tr>
  <tr><td>Non-compete agreement</td><td>Your market</td><td>Working for a competitor, or starting one, for a set time</td></tr>
</tbody></table></div>
<p>They are often combined in one employment document, which is why the names get mixed up. Keeping them separate makes each one easier to read and, if it comes to it, easier to enforce.</p>
<h2>Which one do you need?</h2>
<ul>
  <li><strong>Sharing plans, code, prices or customer data?</strong> An NDA. Pick the right one with <a href="${rel}guides/mutual-vs-one-way-nda.html">mutual vs one-way NDA</a>.</li>
  <li><strong>Worried a departing employee or contractor will take clients or colleagues with them?</strong> A <a href="${rel}templates/non-solicitation-agreement.html">non-solicitation agreement</a>, usually alongside an <a href="${rel}templates/employee-nda.html">employee NDA</a>.</li>
  <li><strong>Want to stop someone working for a competitor at all?</strong> A non-compete, but take advice first. California bans most of them, several other states limit them, and the US Federal Trade Commission's 2024 nationwide ban was set aside by a court and abandoned in 2025, so state law decides. See the <a href="${rel}clauses/non-compete-clause.html">non-compete clause</a> page for the basics.</li>
</ul>
<h2>What every version needs</h2>
<p>Whatever it is called, a confidentiality agreement needs clear parties, a narrow purpose, a definition of confidential information with the usual exclusions, a sensible length and a return-or-delete clause. The full list is in <a href="${rel}guides/what-to-include-in-an-nda.html">what to include in an NDA</a>.</p>` },
  { slug: 'how-to-write-an-employee-warning-letter', published: '2026-09-28', title: 'How to write a warning letter to an employee (free template)',
    description: 'What an employee warning letter should say, first vs final written warnings, how to deliver one fairly, and the mistakes that make a later dismissal harder.',
    body: (rel) => `
<p class="lead">A warning letter puts a problem on record: what happened, what needs to change, and what happens if it does not. Written well, it gives the employee a fair chance to improve, and gives you a clear record if they do not.</p>
<h2>Before you write it</h2>
<ul>
  <li><strong>Check your own procedure.</strong> If your handbook sets out disciplinary steps, follow them. Skipping steps you promised is one of the most common ways employers undermine their own decisions.</li>
  <li><strong>Collect the facts.</strong> Dates, times, what was said or done, and who saw it. Timesheets, emails and customer complaints carry more weight than impressions.</li>
  <li><strong>Hear the employee out.</strong> Meet before deciding on a warning. There may be an explanation, such as a health problem or caring responsibilities, that changes what you should do.</li>
</ul>
<h2>What to include</h2>
<ol>
  <li><strong>That it is a written warning</strong>, and whether it is a first or a final one.</li>
  <li><strong>What happened</strong>, as a dated list. Describe behaviour, not character: "arrived 45 minutes late on 14 September without calling in", not "is unreliable".</li>
  <li><strong>The rule or standard it breaks</strong>: the attendance policy, the code of conduct, or targets agreed at the last review.</li>
  <li><strong>Any earlier warning</strong> about the same issue, with its date.</li>
  <li><strong>What needs to change</strong>, specific enough that you will both know whether it has.</li>
  <li><strong>Support you will give</strong>, such as training, a different shift or regular check-ins.</li>
  <li><strong>A review date.</strong> The free <a href="${rel}free-tools/deadline-calculator.html">deadline calculator</a> works out a date a set number of days away.</li>
  <li><strong>How long the warning stays on file</strong>, commonly 6 to 12 months.</li>
  <li><strong>What happens if things do not improve</strong>: further action, up to a final warning or dismissal.</li>
  <li><strong>How to appeal</strong>, if your procedure allows it, and that the employee can add written comments.</li>
</ol>
<h2>Verbal, written or final?</h2>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">Stage</th><th scope="col">Usually used for</th><th scope="col">What the letter says</th></tr></thead><tbody>
  <tr><td>Verbal warning</td><td>A first, minor issue</td><td>Often just a note on file, sometimes confirmed in writing</td></tr>
  <tr><td>First written warning</td><td>A repeated issue, or a first one serious enough to write down</td><td>What must change and by when, and that further action may follow</td></tr>
  <tr><td>Final written warning</td><td>The issue continues after a written warning, or a serious first offence</td><td>That dismissal may follow if it happens again</td></tr>
</tbody></table></div>
<p>These stages are common practice, not a legal requirement in most US states, where employment is usually at will. In the UK, the Acas Code of Practice on disciplinary and grievance procedures sets out a fair process, and an employment tribunal can increase compensation by up to 25% if an employer unreasonably fails to follow it. UK employees also have the right to bring a colleague or trade union representative to a disciplinary meeting that could lead to a formal warning.</p>
<h2>Mistakes that cause trouble later</h2>
<ul>
  <li><strong>Vague accusations.</strong> "Attitude problems" gives the employee nothing to fix and gives you nothing to rely on.</li>
  <li><strong>Surprises.</strong> A warning that arrives with no conversation first feels unfair, and often is.</li>
  <li><strong>Inconsistency.</strong> Warning one person for something others do without comment invites a discrimination claim.</li>
  <li><strong>Protected reasons.</strong> Never base a warning on a disability, pregnancy, leave the employee is legally entitled to, union activity or a complaint they have made. Take advice before any warning that comes near these.</li>
  <li><strong>Asking the employee to agree.</strong> Their signature confirms they received the letter, nothing more. If they will not sign, note the date you gave it to them and who was there.</li>
</ul>
<h2>Deliver it in person, then in writing</h2>
<p>Give the letter in a private meeting, or send it straight after the meeting where you discussed it. Keep a copy on the personnel file and put the review date in your calendar.</p>
<h2>Use the free template</h2>
<p>The free <a href="${rel}templates/employee-warning-letter.html">employee warning letter template</a> covers everything above: first or final warning, a dated list of incidents, the standard not met, what must change, support, a review date, time on file, an optional appeal and an acknowledgement of receipt. Answer the questions and download a Word letter; employee details stay on your computer. If things do not improve, the <a href="${rel}templates/employment-termination-letter.html">termination letter</a> follows the same pattern. All the HR letters are on the <a href="${rel}for/hr-teams.html">free HR letter templates</a> page.</p>
<p class="small muted">General information, not legal advice. Employment law varies by country and state; take advice before dismissing anyone.</p>` },
  { slug: 'are-liability-waivers-enforceable', published: '2026-09-28', title: 'Are liability waivers enforceable? What makes one hold up',
    description: 'When a liability waiver protects a business and when courts ignore it: negligence wording, gross negligence, minors, states that refuse waivers, and UK rules.',
    body: (rel) => `
<p class="lead">Often, yes, but not always and not for everything. A waiver is a contract in which a participant agrees, before an activity, not to sue for injuries caused by its ordinary risks and, where the law allows, by the organizer's ordinary negligence. Whether a court enforces one depends on where you are and how it is written.</p>
<h2>What courts usually look for</h2>
<ol>
  <li><strong>Clear, conspicuous wording.</strong> A heading that says it is a waiver, plain language, readable type, and the release itself in bold or capitals rather than buried in small print.</li>
  <li><strong>The word "negligence".</strong> Many US states only enforce a release of the organizer's own negligence if the waiver says so expressly.</li>
  <li><strong>Specific risks.</strong> Listing the real risks of the activity shows the participant knew what they were accepting.</li>
  <li><strong>A voluntary, recreational activity.</strong> Courts enforce waivers for optional recreation, such as climbing, skiing or fitness classes, far more readily than for essential services such as medical care, where waivers are often void.</li>
  <li><strong>A signature from the right person</strong>, before the activity, with a real chance to read it first.</li>
</ol>
<h2>What a waiver cannot do</h2>
<ul>
  <li><strong>Excuse gross negligence, recklessness or intentional harm.</strong> Courts almost everywhere refuse to enforce a waiver against these.</li>
  <li><strong>Work in every state.</strong> Louisiana, Montana and Virginia treat waivers of personal injury claims signed in advance as void. Other states restrict them by statute: New York, for example, voids waivers of negligence for gyms, pools and places of recreation that charge a fee.</li>
  <li><strong>Exclude injury claims in the UK.</strong> A business cannot exclude or limit liability for death or personal injury caused by its negligence, under the Unfair Contract Terms Act 1977 and, for consumers, the Consumer Rights Act 2015. A signed form still shows the participant was told about the risks and accepted them, but it will not stop a negligence claim for injury.</li>
  <li><strong>Reliably bind children.</strong> Many US states will not enforce a parent's advance waiver of a child's own claims, at least against a commercial business, although some, such as California and Ohio, have enforced them in some situations. Collect a parent's signature anyway: it records their consent and that they were told the risks.</li>
</ul>
<h2>A waiver is not a substitute for safety or insurance</h2>
<p>Even a well-written waiver only helps with the ordinary risks of a properly run activity. Maintain equipment, train staff, keep incident records and carry liability insurance. Your insurer may require specific wording, so ask them before you finalize the form.</p>
<h2>Waiver or release?</h2>
<p>A waiver is signed <em>before</em> an activity, for injuries that have not happened yet. A release is signed <em>after</em> something has gone wrong, usually in exchange for a payment, to settle claims that already exist. For that, use the <a href="${rel}templates/general-release.html">general release template</a>.</p>
<h2>Use the free template</h2>
<p>The free <a href="${rel}templates/liability-waiver.html">liability waiver template</a> follows the points above: a clear warning at the top, the specific risks you list, assumption of risk, a release that names negligence in capitals, the limits the law sets, optional emergency medical and photo consent, and a parent or guardian section for minors. Fill it in online, or download the Word file and add your insurer's wording. Personal trainers can pair it with the <a href="${rel}templates/personal-training-agreement.html">personal training agreement</a>.</p>
<p class="small muted">General information, not legal advice. Waiver law varies a lot between states and countries; have a lawyer check your waiver for your activity and location.</p>` },
  { slug: 'how-to-write-a-termination-letter', title: 'How to write a termination letter (with a free template)', published: '2026-10-01',
    description: 'What an employee termination letter should say: the last day, notice, the reason, final pay, benefits and company property, plus what to leave out.',
    body: (rel) => `
<p class="lead">A termination letter confirms in writing that someone's employment is ending and what happens next. It does not replace the conversation; it records it. Keep it short, factual and consistent with what was said in the meeting.</p>
<h2>Before you write it</h2>
<ul>
  <li><strong>Check the contract and your own procedure.</strong> Notice periods, probation terms and any disciplinary steps you promised. If the reason is performance or conduct, there should already be a record, such as a <a href="${rel}guides/how-to-write-an-employee-warning-letter.html">written warning</a>.</li>
  <li><strong>Check the law where the employee works.</strong> Minimum notice, when final pay is due, and any notices you must give. These differ between countries and between US states.</li>
  <li><strong>Tell them first.</strong> Hold a short, private meeting in person or by video, then hand over the letter or send it straight afterwards. Nobody should learn they have lost their job from an email.</li>
</ul>
<h2>What to include</h2>
<ol>
  <li><strong>The date, and the employee's name and job title.</strong></li>
  <li><strong>That employment is ending, and the last day.</strong> One plain sentence.</li>
  <li><strong>Notice.</strong> Whether they will work their notice, be paid instead of working it, or be on garden leave (paid, but not required to work).</li>
  <li><strong>The reason, if you give one.</strong> One factual sentence that matches your records. See below.</li>
  <li><strong>Final pay.</strong> The date, and what it includes: salary to the last day and, where the law or your policy requires it, accrued but unused holiday or paid time off.</li>
  <li><strong>Severance, if any</strong>, and whether it depends on signing a separate agreement.</li>
  <li><strong>Benefits.</strong> When they end, and that information about continuing cover will follow. In the US, health plan continuation (COBRA) notices usually come separately from the plan.</li>
  <li><strong>Company property</strong> to return, such as a laptop, phone, keys and access cards, and by when.</li>
  <li><strong>Obligations that continue</strong>, such as a confidentiality or non-solicitation agreement they signed.</li>
  <li><strong>Who to contact</strong> with questions.</li>
</ol>
<h2>Should you give a reason?</h2>
<p>In most US states employment is at will and no reason is legally required, but some states require one on request: in Minnesota and Missouri, for example, a former employee can ask for the reason in writing. Some states also require a separation notice for unemployment benefits. In the UK, an employee with two years' service can ask for written reasons for dismissal, and must be given them within 14 days; anyone dismissed while pregnant or on maternity or adoption leave gets written reasons automatically.</p>
<p>If you give a reason, make it the real one and keep it consistent everywhere. A reason in the letter that differs from what you said in the meeting, or from what is on file, is one of the first things a lawyer looks for in a discrimination or unfair dismissal claim.</p>
<h2>Notice and final pay: two rules that catch employers out</h2>
<ul>
  <li><strong>Final pay deadlines.</strong> Some states are strict. In California, final pay is due immediately when the employer ends employment. Check your state before you set the date in the letter.</li>
  <li><strong>Minimum notice outside the US.</strong> In the UK, the legal minimum is one week after a month's service, rising to one week per full year of service after two years, up to 12 weeks. A contract can give more, but not less.</li>
</ul>
<h2>What to leave out</h2>
<ul>
  <li>Emotional or vague language, apologies that read as admissions, and comments about the person's character.</li>
  <li>New reasons that were never raised with them.</li>
  <li>Anything touching on a disability, pregnancy, family or medical leave, union activity or a complaint they have made. Take advice before any termination that comes near these.</li>
  <li>Promises you cannot keep. Many employers confirm only dates and job title in references, so do not promise a glowing one.</li>
</ul>
<h2>Layoffs are different</h2>
<p>Ending several jobs at once has extra rules. In the US, the federal WARN Act requires 60 days' notice of most plant closings and mass layoffs at employers with 100 or more employees, and some states add their own versions. In the UK, redundancies need fair selection and consultation, and collective consultation when 20 or more people are affected.</p>
<h2>Use the free template</h2>
<p>The free <a href="${rel}templates/employment-termination-letter.html">termination letter template</a> covers the list above: the last day, worked notice or pay instead of notice, optional garden leave, an optional reason, final pay, optional severance, benefits, company property and an HR contact. Answer the questions and download a Word letter; employee details stay on your computer. The other HR letters are on the <a href="${rel}for/hr-teams.html">free HR letter templates</a> page.</p>
<p class="small muted">General information, not legal advice. Employment law varies by country and state; take advice before dismissing anyone.</p>` },
  { slug: 'how-to-return-a-security-deposit', title: 'How to return a security deposit: deadlines and deductions', published: '2026-10-01',
    description: 'How long landlords have to return a security deposit, what they can and cannot deduct, how to itemize deductions, and a free deposit return letter.',
    body: (rel) => `
<p class="lead">Most deposit disputes come down to two things: the landlord missed the deadline, or kept money without a clear, itemized reason. Get both right and there is rarely an argument.</p>
<h2>The deadline</h2>
<p>Every US state sets its own deadline, counted from the day the tenant moves out and returns the keys. Some examples:</p>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">State</th><th scope="col">Deadline to return the deposit or send the itemized list</th></tr></thead><tbody>
  <tr><td>California</td><td>21 days</td></tr>
  <tr><td>New York</td><td>14 days</td></tr>
  <tr><td>Texas</td><td>30 days</td></tr>
  <tr><td>Massachusetts, New Jersey</td><td>30 days</td></tr>
  <tr><td>Florida</td><td>15 days if nothing is deducted; 30 days to give written notice of a claim</td></tr>
</tbody></table></div>
<p>Missing the deadline is expensive. In several states the landlord loses the right to keep any of the deposit, and a landlord who keeps money in bad faith can owe two or three times the amount withheld. Rules change, and some cities add their own, so check the current law for the property before you rely on any figure here. The free <a href="${rel}free-tools/deadline-calculator.html">deadline calculator</a> counts the days from move-out.</p>
<h2>What you can deduct</h2>
<ul>
  <li><strong>Unpaid rent</strong> and other charges the lease allows.</li>
  <li><strong>Damage beyond normal wear and tear</strong>: holes in walls, broken fixtures, burns or stains, pet damage.</li>
  <li><strong>Cleaning</strong> needed to bring the place back to how clean it was at move-in, not better.</li>
</ul>
<h2>What you cannot deduct</h2>
<p>Normal wear and tear from ordinary living: faded paint, light scuffs, carpet worn by foot traffic, loose door handles, a few small nail holes. Nor can you charge the tenant for upgrades, or for the cost of fixing damage that was there before they moved in. That is what the <a href="${rel}templates/move-in-checklist.html">move-in checklist</a> and photos are for.</p>
<h2>Itemize every deduction</h2>
<p>Send a letter that lists the deposit, any interest, each deduction with what it was for and how much, the total deducted and the refund. Attach receipts or estimates where you have them; California, for example, requires copies of receipts for repair or cleaning charges over $125. Send it to the tenant's forwarding address in a way you can prove, and keep a copy with your move-in and move-out photos.</p>
<h2>Two extras some places require</h2>
<ul>
  <li><strong>Interest.</strong> Some states and cities require interest on deposits, such as Massachusetts, and New York for buildings with six or more units.</li>
  <li><strong>A pre-move-out inspection.</strong> In California, the landlord must offer the tenant an inspection before they leave, so they can fix problems and avoid deductions.</li>
</ul>
<h2>Use the free template</h2>
<p>The free <a href="${rel}templates/security-deposit-return-letter.html">security deposit return letter</a> lists the deposit, any interest, each deduction with its amount, the total deducted and the refund. Fill it in online or download the Word file. The other landlord forms, including the move-in checklist and the notice to vacate, are on the <a href="${rel}for/landlords.html">landlord and tenant page</a>.</p>
<p class="small muted">General information, not legal advice. Deposit rules vary by state and city and change from time to time.</p>` },
  { slug: 'how-to-write-a-rent-increase-letter', title: 'How to write a rent increase letter: notice and wording', published: '2026-10-01',
    description: 'When a landlord can raise the rent, how much notice the letter needs, rent caps to check, what to put in the letter, and a free rent increase letter template.',
    body: (rel) => `
<p class="lead">A rent increase letter tells a tenant the new rent and the date it starts. The wording is simple. What matters is that the increase is allowed, the notice is long enough, and the letter is delivered properly.</p>
<h2>Can the rent go up yet?</h2>
<ul>
  <li><strong>Fixed-term lease:</strong> usually not until the lease ends, unless the lease itself allows an increase. At the end of the term, offer the new rent with a <a href="${rel}templates/lease-renewal-letter.html">lease renewal letter</a>.</li>
  <li><strong>Month-to-month:</strong> yes, with written notice, subject to any rent cap.</li>
  <li><strong>Never</strong> as retaliation for a complaint or a repair request, or for a discriminatory reason.</li>
</ul>
<h2>How much notice</h2>
<p>Many US states require at least 30 days' written notice for a month-to-month tenancy, and some require more for larger increases or longer tenancies:</p>
<ul>
  <li><strong>California:</strong> 30 days for an increase of 10% or less in a year, 90 days for more than 10%.</li>
  <li><strong>New York:</strong> for an increase of 5% or more, 30, 60 or 90 days, depending on whether the tenant has lived there less than a year, one to two years, or longer.</li>
  <li><strong>Oregon:</strong> 90 days, and no increase in the first year of a tenancy.</li>
</ul>
<p>The free <a href="${rel}free-tools/deadline-calculator.html">deadline calculator</a> works out the earliest date the new rent can start. Notice usually has to be served before the start of a rental period, so check the date against the rent due date too.</p>
<h2>Check for rent caps</h2>
<p>A growing number of places limit how much rent can rise each year. California's statewide cap applies to many properties more than 15 years old, Oregon has a statewide cap, and cities including New York, Los Angeles and San Francisco have rent stabilization or rent control for covered units. Look up the rules for the property before you choose the new figure.</p>
<p>Outside the US, rules differ. In England, for example, most private landlords must use a formal section 13 notice to raise the rent on a periodic tenancy, and the rules changed under the Renters' Rights Act, so check GOV.UK for the current form and notice period.</p>
<h2>What to put in the letter</h2>
<ol>
  <li>The date, and every tenant's name and the property address.</li>
  <li>The current rent and the new rent, as amounts, not just a percentage.</li>
  <li>The date the new rent starts.</li>
  <li>That all other terms of the tenancy stay the same, or what else is changing.</li>
  <li>How to pay, if that is changing.</li>
  <li>Optionally, a short reason, such as higher taxes or insurance. It is not usually required, but it helps.</li>
  <li>Who to contact with questions, and your signature.</li>
</ol>
<h2>Deliver it properly</h2>
<p>Use a method the lease or state law accepts, often in person or by mail, and keep proof of the date. If the notice is served late, the increase starts later, so allow a few extra days for mail.</p>
<h2>Use the free template</h2>
<p>The free <a href="${rel}templates/rent-increase-letter.html">rent increase letter template</a> sets out the current rent, the new rent, the start date and the notice given, with optional wording for a reason and a renewal offer. Fill it in online or download it as Word. All the landlord letters are on the <a href="${rel}for/landlords.html">landlord and tenant page</a>.</p>
<p class="small muted">General information, not legal advice. Rent rules vary by state and city and change often.</p>` },
  { slug: 'what-to-include-in-a-roommate-agreement', title: 'What to include in a roommate agreement (free template)', published: '2026-10-01',
    description: 'What a roommate agreement should cover: rent split, deposit, bills, chores, guests, quiet hours and moving out, plus whether it is legally binding.',
    body: (rel) => `
<p class="lead">A roommate agreement is a short contract between the people who share a home. It sits alongside the lease with the landlord and settles the questions that cause most flatmate arguments: money, mess, guests and what happens when someone leaves.</p>
<h2>What it does not change</h2>
<p>The agreement binds the roommates to each other, not the landlord. If you all signed the lease, each of you is usually liable to the landlord for the full rent, not just your share. A roommate agreement lets you recover a share from a roommate who does not pay; it does not stop the landlord coming to you for all of it.</p>
<h2>What to include</h2>
<ol>
  <li><strong>Who and where.</strong> Everyone's names, the address, and the lease dates.</li>
  <li><strong>Rent.</strong> Each person's share, the due date, and who pays the landlord. Splits based on room size are common; write the amounts down.</li>
  <li><strong>The deposit.</strong> What each person paid, and how deductions and the refund are shared at the end.</li>
  <li><strong>Bills.</strong> Electricity, gas, water, internet and streaming: who holds each account and how costs are split and paid back.</li>
  <li><strong>Shared supplies.</strong> Groceries, cleaning products and household items: shared or separate.</li>
  <li><strong>Cleaning.</strong> A rota for shared spaces, or a cleaner and how it is paid.</li>
  <li><strong>Quiet hours and guests.</strong> When it should be quiet, how much notice for guests, and how many nights a guest can stay. Check the lease too: many limit long-stay guests.</li>
  <li><strong>Pets, smoking and parking.</strong> Even if the lease covers them, agree the details between you.</li>
  <li><strong>Moving out.</strong> How much notice a roommate gives the others, whether they must find a replacement, and how their deposit share is handled. A replacement or a sublet usually needs the landlord's consent.</li>
  <li><strong>Settling disagreements.</strong> A house meeting first, then a neutral third party.</li>
</ol>
<h2>Is a roommate agreement legally binding?</h2>
<p>The money parts usually can be: an agreement to pay a share of rent, bills or the deposit is an ordinary contract, and a roommate who breaks it can be taken to small claims court. House rules such as chores and quiet hours are much harder to enforce in court. Their real value is that everyone agreed to them in writing before there was a problem.</p>
<h2>Tips that prevent most disputes</h2>
<ul>
  <li>Sign it before anyone moves in, not after the first argument.</li>
  <li>Pay each other by bank transfer or an expense app, so there is a record.</li>
  <li>Do the <a href="${rel}templates/move-in-checklist.html">move-in checklist</a> together, so damage at move-out is not blamed on the wrong person.</li>
  <li>If someone moves in partway through a month, the <a href="${rel}free-tools/prorated-rent.html">prorated rent calculator</a> works out their first payment.</li>
</ul>
<h2>Use the free template</h2>
<p>The free <a href="${rel}templates/roommate-agreement.html">roommate agreement template</a> covers rent shares, the deposit, bills, quiet hours, guests, cleaning and moving out. Fill it in online in a few minutes or download the Word file. When someone leaves, the <a href="${rel}templates/sublease-agreement.html">sublease agreement</a> and <a href="${rel}templates/notice-to-vacate.html">notice to vacate</a> cover the next steps.</p>
<p class="small muted">General information, not legal advice. Tenancy rules vary by state and country.</p>` },
  { slug: 'non-compete-vs-non-solicitation', title: 'Non-compete vs non-solicitation agreement: the difference', published: '2026-10-01',
    description: 'How a non-compete differs from a non-solicitation agreement, which one courts enforce, where non-competes are banned, and which one a small business needs.',
    body: (rel) => `
<p class="lead">A non-compete stops someone working for a competitor, or starting one. A non-solicitation agreement only stops them actively chasing your customers or staff. The second is narrower, which is exactly why courts and lawmakers treat it more kindly.</p>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col"></th><th scope="col">Non-compete</th><th scope="col">Non-solicitation</th></tr></thead><tbody>
  <tr><td>What it stops</td><td>Working for a competitor, or starting a competing business, in an area</td><td>Asking your customers to move their business, or your staff to leave</td></tr>
  <tr><td>What it allows</td><td>Work outside the restricted field or area</td><td>Working anywhere, including for a competitor, and serving customers who come unprompted</td></tr>
  <tr><td>Typical length</td><td>6 to 12 months for employees; longer on the sale of a business</td><td>6 to 24 months</td></tr>
  <tr><td>Enforceability</td><td>Banned or restricted in a growing number of places</td><td>Enforced in most places if limited to people the employee actually dealt with</td></tr>
</tbody></table></div>
<h2>Where non-competes are banned or limited</h2>
<ul>
  <li><strong>California</strong> treats almost all employee non-competes as void, including ones signed in other states, and generally treats employee non-solicits of customers as void too.</li>
  <li><strong>Minnesota</strong> banned new employee non-competes from July 2023, and <strong>North Dakota</strong> and <strong>Oklahoma</strong> have long refused to enforce most of them.</li>
  <li><strong>Several other states</strong>, including Illinois, Washington, Colorado and Massachusetts, ban them below a salary threshold, cap their length or require extra pay in return.</li>
  <li><strong>The US federal ban</strong> that the Federal Trade Commission adopted in 2024 was set aside by a court and never took effect, so state law decides.</li>
  <li><strong>In the UK</strong>, courts enforce restrictions only if they protect a legitimate business interest and go no further than necessary. Non-solicitation and non-dealing clauses are enforced far more often than outright non-competes.</li>
</ul>
<p>Almost everywhere, a non-compete given by the seller when a business is sold is treated differently and is much more likely to be enforced, because the buyer is paying for the goodwill.</p>
<h2>Which one does a small business need?</h2>
<p>For most employees and contractors: a confidentiality agreement to protect information, plus a non-solicitation agreement to protect customer and staff relationships. That combination covers what most owners actually worry about, and it is far more likely to hold up. Keep non-competes for senior people with genuine access to strategy, and for the sale of a business, and take local advice before using one.</p>
<h2>Make a non-solicit more likely to hold up</h2>
<ul>
  <li>Limit it to customers and staff the person actually dealt with, for example in their last 12 months.</li>
  <li>Keep it short.</li>
  <li>Allow customers who approach them unprompted, and general job adverts.</li>
  <li>Give something in return, especially for an existing employee.</li>
</ul>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/non-solicitation-agreement.html">non-solicitation agreement</a> follows those rules and says plainly that it is not a non-compete. Pair it with the <a href="${rel}templates/employee-nda.html">employee NDA</a>, or use the <a href="${rel}templates/employment-agreement.html">employment agreement</a>, which has an optional non-solicitation clause built in. For more on the clauses themselves, see the <a href="${rel}clauses/non-compete-clause.html">non-compete clause</a> and <a href="${rel}clauses/non-solicitation-clause.html">non-solicitation clause</a> pages.</p>
<p class="small muted">General information, not legal advice. Restrictive covenant law varies by state and country and is changing quickly.</p>` },
  { slug: 'how-to-write-a-freelance-contract', title: 'How to write a freelance contract: 10 clauses that prevent disputes',
    description: 'What a freelance contract should cover: scope, revisions, deadlines, payment, deposits, kill fees, ownership and termination, with free templates.',
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
    description: 'A kill fee is what a client pays to cancel a freelance project after work starts. How much to charge, how to word it in a contract, with examples.',
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
  { slug: 'how-to-write-an-invoice', title: 'How to write an invoice: what to include and how to number it', published: '2026-10-02',
    description: 'What an invoice must include, how to number invoices, payment terms such as net 30, sales tax and VAT, late fees, and how to send one that gets paid.',
    body: (rel) => `
<p class="lead">An invoice is a request for payment for goods or services you have delivered. A clear, complete invoice gets paid faster, because the client's accounts team can approve it without coming back to you with questions.</p>
<h2>What to include on an invoice</h2>
<ol>
  <li><strong>The word "Invoice"</strong> at the top, so it is not mistaken for a quote or a statement.</li>
  <li><strong>Your details:</strong> business name, address, email and phone, and your tax registration number if you are registered for VAT, GST or sales tax.</li>
  <li><strong>The client's details:</strong> the legal name of the business you are billing and its address, plus a contact or department if they asked for one.</li>
  <li><strong>A unique invoice number</strong> (see below).</li>
  <li><strong>The invoice date</strong>, and the date you delivered the goods or finished the work if it is different.</li>
  <li><strong>The client's purchase order number</strong>, if they gave you one. Many larger companies will not pay an invoice without it.</li>
  <li><strong>Line items:</strong> what you supplied, the quantity or hours, the rate and the amount for each line.</li>
  <li><strong>Subtotal, discounts and tax</strong>, each shown separately, and the total due.</li>
  <li><strong>Payment terms and the due date</strong>, such as "Net 30, due 15 November 2026".</li>
  <li><strong>How to pay:</strong> bank transfer details, a payment link or where to send a check.</li>
  <li><strong>Late payment terms</strong>, if your contract allows a late fee or interest.</li>
</ol>
<h2>How to number invoices</h2>
<p>Give every invoice its own number in a sequence you never reuse, such as 2026-001, 2026-002 and so on. A year prefix keeps numbers short, and some businesses add a client code (ACME-014). Do not reuse or skip numbers without a reason: gaps invite questions from an accountant or a tax inspector, and some tax systems require sequential numbering; EU VAT rules, for example, require a sequential number that identifies each invoice.</p>
<p>If an invoice you have sent is wrong, do not quietly edit it. Issue a credit note that cancels it, or part of it, and a new invoice with a new number, so every document in your records still matches what the client received.</p>
<h2>Payment terms and due dates</h2>
<p>Agree the payment terms in your contract before you start, and repeat them on every invoice. Common terms:</p>
<ul>
  <li><strong>Due on receipt:</strong> payable as soon as the client gets the invoice.</li>
  <li><strong>Net 7, net 14, net 30:</strong> payable within that many days of the invoice date.</li>
  <li><strong>EOM:</strong> payable at the end of the month the invoice is dated in, or a set number of days after it.</li>
  <li><strong>2/10 net 30:</strong> a 2% discount if paid within 10 days, otherwise the full amount within 30.</li>
</ul>
<p>Always print the actual due date as well as the terms, so nobody has to work it out. The <a href="${rel}free-tools/invoice-due-date.html">invoice due date calculator</a> does it for any of these terms, including early payment discounts.</p>
<h2>Sales tax, VAT and GST</h2>
<p>If you are registered for VAT, GST or sales tax, the tax authority decides what a valid tax invoice must show, usually your registration number, the tax rate and the amount of tax, and sometimes the client's details too. Check the rules where you are registered. In the US, sales tax is set by each state, and whether a service is taxable differs from state to state. If you are not registered, do not add tax to your invoices.</p>
<p>The details for the most common systems: <a href="${rel}guides/what-to-include-on-a-vat-invoice.html">VAT invoices in the UK</a>, <a href="${rel}guides/gst-hst-invoice-requirements-canada.html">GST/HST invoices in Canada</a> and <a href="${rel}guides/tax-invoice-requirements-australia.html">tax invoices in Australia</a>. For the payment section, see <a href="${rel}guides/what-bank-details-to-put-on-an-invoice.html">what bank details to put on an invoice</a>.</p>
<h2>Late fees and interest</h2>
<p>Only charge a late fee or interest your contract allows, and say on the invoice what it is. In the UK, a business invoicing another business can claim statutory interest on late payment at 8% above the Bank of England base rate, plus fixed compensation of £40 to £100 per invoice, even if the contract says nothing. The <a href="${rel}free-tools/late-payment-interest.html">late payment interest calculator</a> works it out.</p>
<h2>Sending the invoice</h2>
<ul>
  <li>Send it as soon as the work is delivered or the agreed milestone is reached. The payment clock starts when the client receives it.</li>
  <li>Send a PDF, so it cannot be changed by accident, to the person or accounts address the client named. Put the invoice number and amount in the email subject.</li>
  <li>Keep a copy of every invoice you send, and note when it was paid.</li>
  <li>If the due date passes, send a polite <a href="${rel}templates/payment-reminder-letter.html">payment reminder</a>. If that does not work, see <a href="${rel}guides/what-to-do-when-a-client-wont-pay.html">what to do when a client won't pay</a>.</li>
</ul>
<h2>Invoices, quotes and receipts</h2>
<p>A quote comes before the work and offers a price; an invoice comes after and asks for payment; a receipt confirms you were paid. The guide to the <a href="${rel}guides/quote-vs-estimate-vs-invoice.html">difference between a quote, an estimate and an invoice</a> explains when to use each one.</p>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/invoice.html">invoice template</a> asks for each item above, including line items, a discount, tax, any amount already paid and your bank details, and builds the invoice in your browser without an account. When the client pays, send a <a href="${rel}templates/payment-receipt.html">payment receipt</a>. Pricing a new job first? Start with the <a href="${rel}templates/quote.html">quote template</a>, and for repeat work a <a href="${rel}templates/retainer-agreement.html">retainer agreement</a> sets the monthly fee and payment terms once.</p>
<p class="small muted">General information, not tax or legal advice. Invoicing and tax rules differ between countries and states; check the rules that apply to your business.</p>` },
  { slug: 'quote-vs-estimate-vs-invoice', title: 'Quote vs estimate vs invoice: what is the difference?', published: '2026-10-02',
    description: 'The difference between a quote, an estimate, a pro forma invoice, a purchase order and an invoice, when to use each one, and which of them are binding.',
    body: (rel) => `
<p class="lead">A quote offers a fixed price before the work starts. An estimate gives an approximate price that can change. An invoice asks for payment once the work is done. Using the right one, and labelling it clearly, avoids the most common argument in small business: what the price actually was.</p>
<div class="table-wrap" tabindex="0"><table class="compare">
  <thead><tr><th scope="col">Document</th><th scope="col">Sent by</th><th scope="col">When</th><th scope="col">What it does</th></tr></thead>
  <tbody>
    <tr><td>Estimate</td><td>Seller</td><td>Before the work</td><td>Gives a best guess at the price, which can change</td></tr>
    <tr><td>Quote</td><td>Seller</td><td>Before the work</td><td>Offers a fixed price for defined work, until a set date</td></tr>
    <tr><td>Purchase order</td><td>Buyer</td><td>Before delivery</td><td>Orders goods or services at agreed prices</td></tr>
    <tr><td>Pro forma invoice</td><td>Seller</td><td>Before delivery</td><td>Shows what the invoice will be, for approval or an advance payment</td></tr>
    <tr><td>Invoice</td><td>Seller</td><td>After delivery</td><td>Asks for payment by a due date</td></tr>
    <tr><td>Receipt</td><td>Seller</td><td>After payment</td><td>Confirms that payment was received</td></tr>
  </tbody>
</table></div>
<h2>Quote</h2>
<p>A quote, or quotation, is a fixed price for work you have defined. It is an offer: if the customer accepts it, for example by signing it, it usually becomes a contract at that price. So describe the work precisely, list what is not included, and give a date the quote expires, so you are not held to an old price after your costs go up. The free <a href="${rel}templates/quote.html">quote template</a> includes each of these and a line for the customer to accept.</p>
<h2>Estimate</h2>
<p>An estimate is your best guess at the price when you cannot know it in advance, such as a repair where the problem only shows once the work starts. It is not normally binding as a fixed price, but a final bill far above the estimate, without warning, invites a dispute. Say on the estimate that it is an estimate, explain what could change the price, and agree to tell the customer before costs go beyond it by more than a set amount or percentage. Some places have rules for particular trades; several US states, for example, require written estimates for car repairs.</p>
<h2>Purchase order</h2>
<p>A purchase order (PO) comes from the buyer. It lists what they want, the quantities, prices and delivery date, and becomes a contract when the seller accepts it, by confirming it or by delivering. Larger customers often require a PO number on every invoice, so ask for it before you start. See the free <a href="${rel}templates/purchase-order.html">purchase order template</a>.</p>
<h2>Pro forma invoice</h2>
<p>A pro forma invoice looks like an invoice but is not a demand for payment. Sellers send one before delivery so the buyer can approve the cost, arrange an advance payment or, in international trade, prepare customs paperwork. It is not a tax invoice; the real invoice follows.</p>
<h2>Invoice</h2>
<p>An invoice is the bill. It is sent after the goods are delivered or the work is done, or at agreed milestones, and asks for payment by a due date. It should match the accepted quote or purchase order, with any agreed changes shown as separate lines. <a href="${rel}guides/how-to-write-an-invoice.html">How to write an invoice</a> lists what to include, and the free <a href="${rel}templates/invoice.html">invoice template</a> builds one.</p>
<h2>Receipt</h2>
<p>A receipt confirms payment. Send one when you are paid, especially in cash, and for a part payment show the balance still owed. See the free <a href="${rel}templates/payment-receipt.html">payment receipt template</a>.</p>
<h2>A typical sequence</h2>
<ol>
  <li>The customer asks for a price; you send an <strong>estimate</strong> if the scope is uncertain, or a <strong>quote</strong> if it is defined.</li>
  <li>The customer accepts the quote, or sends a <strong>purchase order</strong> that refers to it.</li>
  <li>For larger jobs, you agree a contract such as a <a href="${rel}templates/service-agreement.html">service agreement</a> or a <a href="${rel}templates/statement-of-work.html">statement of work</a>, and may take a deposit.</li>
  <li>You deliver, then send an <strong>invoice</strong> that quotes the quote or PO number.</li>
  <li>The customer pays, and you send a <strong>receipt</strong>.</li>
</ol>
<p>Using the same reference numbers through the chain lets everyone match the documents without a phone call. If the invoice goes unpaid, a <a href="${rel}templates/payment-reminder-letter.html">payment reminder letter</a> is the next step.</p>
<p class="small muted">General information, not legal advice. Contract and consumer protection rules differ between countries and states.</p>` },
  { slug: 'how-to-write-a-two-weeks-notice-letter', title: 'How to write a two weeks notice letter (free template)', published: '2026-10-02',
    description: 'What to put in a two weeks notice letter, how to count the two weeks, how to hand it in, and what happens to your final pay, vacation and benefits.',
    body: (rel) => `
<p class="lead">A two weeks notice letter tells your employer that you are resigning and when your last day will be. Keep it short and positive: it goes in your personnel file, and the people who read it may be your references later.</p>
<h2>Do you have to give two weeks' notice?</h2>
<p>In the US, most jobs are at will: either side can end the job at any time, and no federal law requires an employee to give notice. Two weeks is a professional custom, and leaving without it can cost you a good reference or a chance to be rehired. Some employment contracts, union agreements and handbooks require more notice, or make it a condition of being paid out for unused vacation, so check yours first.</p>
<p>Elsewhere the rules are set by law and contract. In the UK, for example, the legal minimum an employee must give is one week once they have worked for a month, but most contracts require more, often a month or longer for senior roles. Give whatever your contract requires; two weeks is only the norm where nothing longer applies.</p>
<h2>What to include</h2>
<ol>
  <li><strong>The date</strong> of the letter, and your manager's name.</li>
  <li><strong>A clear statement that you are resigning</strong>, and from which job title.</li>
  <li><strong>Your last working day.</strong> State the date itself, not just "two weeks from today".</li>
  <li><strong>An offer to help with the handover</strong>: finishing or passing on your work and training a replacement.</li>
  <li><strong>How you will return company property</strong>, such as a laptop, phone, badge or keys.</li>
  <li><strong>A short thank-you</strong>, if you want to include one.</li>
  <li><strong>A personal email address</strong> for your final pay slip and tax forms, if they might otherwise go to your work account.</li>
</ol>
<p>A reason is optional. "I have accepted a position elsewhere" is enough, and you do not have to say where.</p>
<h2>What to leave out</h2>
<p>Complaints about your manager, colleagues or pay, comparisons with your new job, and anything you would not want a future employer to read. If you want to give feedback, use an exit interview, and keep it constructive there too.</p>
<h2>How to count the two weeks</h2>
<p>Count from the day your manager receives the letter. If you hand it in on Friday 2 October, two weeks takes you to Friday 16 October. If you work shifts or part-time, make the last day the last day you are scheduled to work. The <a href="${rel}free-tools/deadline-calculator.html">deadline calculator</a> gives the date for any number of days or weeks.</p>
<h2>How to hand it in</h2>
<p>Tell your manager first, in person or on a call, then give them the letter or email it straight afterwards so there is a written record with a date. Send a copy to HR if your company has a process for resignations, and keep a copy yourself.</p>
<h2>What happens next</h2>
<ul>
  <li><strong>Your employer may end the job sooner.</strong> In an at-will job they can usually accept your resignation straight away instead of having you work the notice period, and are not always required to pay for the two weeks unless a contract or policy says so.</li>
  <li><strong>Final pay.</strong> Deadlines are set by state law. In California, for example, an employee who gives at least 72 hours' notice must be paid in full on their last day.</li>
  <li><strong>Unused vacation.</strong> Some states, including California, require earned vacation to be paid out when you leave; in many others it depends on the company's policy.</li>
  <li><strong>Health insurance</strong> often ends on your last day or at the end of that month. Employers with 20 or more employees must usually offer COBRA, which lets you keep the same coverage for a time if you pay the premiums.</li>
  <li><strong>Retirement plans and stock</strong> may have vesting dates; check whether waiting a little before your last day would make a difference.</li>
</ul>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/two-weeks-notice-letter.html">two weeks notice letter</a> asks for each detail above and builds the letter in your browser, with nothing uploaded. If your contract requires longer notice, use the general <a href="${rel}templates/resignation-letter.html">resignation letter</a>, which lets you set any notice period. Managers can use the <a href="${rel}templates/reference-letter.html">reference letter</a> and the <a href="${rel}templates/employment-verification-letter.html">employment verification letter</a> for staff who have left, and there are more on the <a href="${rel}for/hr-teams.html">HR templates page</a>.</p>
<p class="small muted">General information, not legal advice. Employment law differs between countries and states and changes over time; check the rules that apply to your job.</p>` },
  { slug: 'what-is-a-hold-harmless-agreement', title: 'What is a hold harmless agreement? Types, examples and limits', published: '2026-10-02',
    description: 'What a hold harmless agreement does, one-way and mutual versions, broad and limited forms, how it differs from indemnity and a waiver, and when it holds up.',
    body: (rel) => `
<p class="lead">A hold harmless agreement is a promise by one party not to hold another responsible for certain losses, and usually to cover the cost of claims that other people bring. It moves the risk of an activity onto the party best placed to control it.</p>
<h2>How it works: an example</h2>
<p>A caterer rents a hall for a wedding. The hall's owner asks the caterer to sign a hold harmless agreement. If a guest is injured by the caterer's equipment and sues the owner, the caterer must pay for the claim and the owner's legal costs. The owner, who had no control over the caterer's work, is protected; the caterer, who did, carries the risk and insures against it.</p>
<h2>Where they are used</h2>
<ul>
  <li>Renting a venue, premises or <a href="${rel}templates/equipment-rental-agreement.html">equipment</a>.</li>
  <li>Contractors and tradespeople working on someone else's property.</li>
  <li>Events, sponsorships and use of land, such as hunting, filming or a car show in a private car park.</li>
  <li>Lending a vehicle, a boat or tools.</li>
  <li>Subcontracts, where a contractor passes the risk of a subcontractor's work back to the subcontractor.</li>
</ul>
<h2>One-way or mutual</h2>
<p>In a <strong>one-way</strong> (unilateral) agreement only one party gives the promise, usually the one carrying out the activity. In a <strong>mutual</strong> (reciprocal) agreement each party covers the other for claims caused by its own acts. Mutual agreements are common between businesses of similar size, where each controls part of the risk.</p>
<h2>Broad, intermediate and limited forms</h2>
<p>In construction, hold harmless clauses are often described by how much risk they shift:</p>
<ul>
  <li><strong>Broad form:</strong> the indemnifying party covers claims even when they are caused entirely by the other party's negligence.</li>
  <li><strong>Intermediate form:</strong> it covers claims unless they are caused solely by the other party.</li>
  <li><strong>Limited (comparative) form:</strong> it covers only the share of the loss caused by its own fault.</li>
</ul>
<p>Many US states have anti-indemnity laws that make broad-form clauses unenforceable in construction contracts, and some limit intermediate ones too, so check the rules before you rely on one for building work.</p>
<h2>Hold harmless, indemnify and defend</h2>
<p>The words often appear together: "indemnify, defend and hold harmless". Some courts treat "indemnify" and "hold harmless" as meaning the same thing; others read "hold harmless" as also giving up claims against the protected party. A <strong>duty to defend</strong> is separate and valuable: it means the indemnifying party must pay for the defence of a claim as it happens, rather than reimbursing costs only after a court decides who was at fault.</p>
<h2>Hold harmless agreement or liability waiver?</h2>
<p>A <a href="${rel}templates/liability-waiver.html">liability waiver</a> is signed by a participant who gives up their own right to sue, for example before a climbing class. A hold harmless agreement usually goes further: the signer also covers the other party against claims by third parties. A gym might use a waiver for members and a hold harmless agreement for a personal trainer who rents space there. <a href="${rel}guides/are-liability-waivers-enforceable.html">Are liability waivers enforceable?</a> covers how waivers are tested.</p>
<h2>What makes one hold up</h2>
<ul>
  <li><strong>Clear wording.</strong> Say what activity is covered, which losses, and whether the protection extends to the protected party's own negligence. Courts read unclear indemnities narrowly.</li>
  <li><strong>Signatures from both parties</strong>, before the activity starts.</li>
  <li><strong>Sensible limits.</strong> Courts usually refuse to enforce an indemnity for gross negligence or deliberate wrongdoing, and some activities are protected by statute.</li>
  <li><strong>Insurance behind the promise.</strong> An indemnity is only worth what the indemnifying party can pay. Ask for liability insurance, to be named as an additional insured, and a certificate of insurance, and check that your own policy covers any liability you take on under a contract.</li>
</ul>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/hold-harmless-agreement.html">hold harmless agreement</a> can be one-way or mutual, with an optional duty to defend, insurance and additional insured status, and it excludes gross negligence and willful misconduct. For participants, use the <a href="${rel}templates/liability-waiver.html">liability waiver</a>; to settle a dispute that has already happened, the <a href="${rel}templates/general-release.html">general release</a>. The <a href="${rel}clauses/indemnification-clause.html">indemnification clause</a> page has sample wording to add to another contract.</p>
<p class="small muted">General information, not legal advice. Whether a hold harmless agreement is enforceable depends on local law and the facts; have it reviewed for significant risks.</p>` },
  { slug: 'are-non-competes-enforceable', title: 'Are non-compete agreements enforceable? The rules in 2026', published: '2026-10-03',
    sources: [['Federal Trade Commission: FTC files to accede to vacatur of Non-Compete Clause Rule (5 September 2025)', "https://www.ftc.gov/news-events/news/press-releases/2025/09/federal-trade-commission-files-accede-vacatur-non-compete-clause-rule"], ['Federal Trade Commission: FTC takes action to protect workers from noncompete agreements (4 September 2025)', "https://www.ftc.gov/news-events/news/press-releases/2025/09/ftc-takes-action-protect-workers-noncompete-agreements"], ['California Business and Professions Code § 16600.5', "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=16600.5"], ['Minnesota Statutes § 181.988: Covenants not to compete void', "https://www.revisor.mn.gov/statutes/cite/181.988"]],
    description: 'Where non-competes are banned or limited, what courts look for when they enforce one, what happened to the FTC rule, and the alternatives that hold up better.',
    body: (rel) => `
<p class="lead">A non-compete agreement stops a worker from joining or starting a competing business for a time after they leave. Whether one can be enforced depends mostly on the state where the worker works, and the trend is firmly towards fewer and narrower non-competes.</p>
<h2>States that ban or limit non-competes</h2>
<ul>
  <li><strong>Banned for most workers:</strong> California, Minnesota, North Dakota and Oklahoma. California also makes it unlawful to require one, and does not enforce non-competes signed elsewhere for work in California.</li>
  <li><strong>Banned below a pay level:</strong> Colorado, Illinois, Maine, Maryland, New Hampshire, Oregon, Rhode Island, Virginia, Washington and Washington, D.C. bar non-competes for workers who earn less than a set amount, and several add notice or other conditions.</li>
  <li><strong>Other conditions:</strong> Massachusetts, for example, bars them for non-exempt employees and requires garden leave pay or other agreed consideration during the restriction. Many states also restrict non-competes for doctors and other health workers.</li>
</ul>
<p>Thresholds and rules change often, so check the current law in the state where the worker will work before you rely on a non-compete.</p>
<h2>What happened to the FTC ban?</h2>
<p>In April 2024 the Federal Trade Commission adopted a rule that would have banned most non-competes nationwide. A federal court in Texas set it aside before it took effect, and in September 2025 the FTC dropped its appeals, so the rule is gone. The FTC has said it will still challenge particular non-competes it considers unfair, case by case, and state law continues to apply.</p>
<h2>What courts look for</h2>
<p>Where non-competes are allowed, courts generally enforce one only if it is reasonable. They ask:</p>
<ol>
  <li><strong>Is there a legitimate business interest?</strong> Trade secrets, confidential information and customer goodwill count. Simply avoiding competition does not.</li>
  <li><strong>Is the length reasonable?</strong> Six months to a year is common for employees; two years or more is harder to defend.</li>
  <li><strong>Is the area reasonable?</strong> It should match where the business actually operates and where the worker worked, not the whole country by default.</li>
  <li><strong>Is the scope reasonable?</strong> It should cover work that competes with what the person did, not any job in the industry.</li>
  <li><strong>Was there consideration?</strong> A job offer usually counts. For a current employee, some states, such as Pennsylvania, require something new, like a raise, a bonus or a promotion.</li>
</ol>
<p>When a non-compete goes too far, some courts cut it down to something reasonable, some strike out the offending words, and some refuse to enforce any of it. Non-competes signed as part of selling a business are treated much more generously, even in California.</p>
<h2>Alternatives that hold up better</h2>
<ul>
  <li><strong>A non-solicitation agreement</strong> stops a former worker poaching your customers or staff without stopping them working. See <a href="${rel}guides/non-compete-vs-non-solicitation.html">non-compete vs non-solicitation</a>.</li>
  <li><strong>A confidentiality agreement</strong> protects trade secrets and client information wherever the person works next. See the <a href="${rel}templates/employee-nda.html">employee NDA</a>.</li>
  <li><strong>Garden leave or a longer notice period</strong> keeps a departing employee on the payroll, and away from competitors, for a set time.</li>
</ul>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/non-compete-agreement.html">non-compete agreement</a> sets a restricted period, area and type of business, records what the employee receives for agreeing, can add pay during the restriction, and narrows itself wherever local law limits non-competes. In many cases the <a href="${rel}templates/non-solicitation-agreement.html">non-solicitation agreement</a> is the safer choice, and the <a href="${rel}clauses/non-compete-clause.html">non-compete clause</a> page explains the wording.</p>
<p class="small muted">General information, not legal advice. Non-compete law differs between states and changes often; have an agreement reviewed for the place where the worker works.</p>` },
  { slug: 'how-to-write-a-gift-letter-for-a-mortgage', title: 'How to write a gift letter for a mortgage', published: '2026-10-03',
    sources: [['Fannie Mae Selling Guide B3-4.3-04: Personal Gifts', "https://selling-guide.fanniemae.com/sel/b3-4.3-04/personal-gifts"], ['IRS: Tax inflation adjustments for tax year 2026 (annual gift exclusion and basic exclusion amount)', "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill"]],
    description: 'What a mortgage gift letter must say, who can give a down payment gift, how lenders check the money, and what the donor should know about gift tax.',
    body: (rel) => `
<p class="lead">If someone gives you money towards a home purchase, your lender will usually ask for a gift letter: a signed statement from the giver that the money is a gift, not a loan. It protects the lender, because a hidden loan would add to your debts.</p>
<h2>What the letter must say</h2>
<p>Lenders that follow Fannie Mae's rules ask the letter to include:</p>
<ol>
  <li><strong>The amount</strong> of the gift, or the most it will be.</li>
  <li><strong>A statement that no repayment is expected</strong>, in money or in any other form.</li>
  <li><strong>The donor's name, address and phone number.</strong></li>
  <li><strong>The donor's relationship to the borrower.</strong></li>
</ol>
<p>Most lenders also want the property address, the date the money was or will be transferred, and both signatures. If the gift will be pooled with the borrower's own money, Fannie Mae also asks the donor to confirm that they have lived with the borrower for the past 12 months and will live in the new home.</p>
<h2>Who can give a gift</h2>
<p>Usually a relative by blood, marriage or adoption, a spouse or partner, a fiancé, or someone with a long-standing family-like relationship with the buyer. The donor cannot be the seller, builder, developer, real estate agent or anyone else with an interest in the sale. FHA, VA and other loan programs have their own lists, so check with your lender.</p>
<h2>How lenders check the money</h2>
<p>Expect to show where the gift came from and where it went: a bank statement or wire record from the donor, and a statement showing the deposit into your account, or proof that the money went straight to the closing agent. Large deposits without a paper trail are what slow mortgage approvals down, so move the money in one traceable transfer and keep the records. Never put full account numbers in the letter itself.</p>
<h2>Gift tax</h2>
<p>In the US the person giving the gift, not the buyer, is responsible for any gift tax. In 2026 each person can give up to $19,000 to any one recipient without filing a gift tax return, so a couple can give $38,000 together. Gifts above that usually just need a return, because they count against a lifetime exemption of $15 million per person in 2026. A tax adviser can confirm the details for your situation.</p>
<h2>Free template</h2>
<p>The free <a href="${rel}templates/gift-letter.html">gift letter template</a> includes each item above, with the transfer date, an optional source bank (never an account number) and the shared residence statement, and builds the letter in your browser. The <a href="${rel}free-tools/amount-in-words.html">amount in words converter</a> writes the gift amount in words. Lending to family rather than giving? See <a href="${rel}guides/how-to-lend-money-to-family.html">how to lend money to family</a> and the <a href="${rel}templates/promissory-note.html">promissory note</a>.</p>
<p class="small muted">General information, not financial, tax or legal advice. Lender requirements and tax limits change; check with your lender and a tax adviser.</p>` },
  { slug: 'what-to-include-in-a-severance-agreement', title: 'What to include in a severance agreement', published: '2026-10-03',
    sources: [['29 U.S.C. § 626(f): Older Workers Benefit Protection Act waiver requirements', "https://www.law.cornell.edu/uscode/text/29/626"], ['U.S. EEOC: Understanding waivers of discrimination claims in employee severance agreements', "https://www.eeoc.gov/laws/guidance/qa-understanding-waivers-discrimination-claims-employee-severance-agreements"], ['California Civil Code § 1542 (release of unknown claims)', "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1542"], ['California Government Code § 12964.5 (separation agreement restrictions)', "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=12964.5"]],
    description: 'What a severance agreement needs: pay and benefits, the release, extra rules for employees 40 and over, and the mistakes that make one unenforceable.',
    body: (rel) => `
<p class="lead">A severance agreement pays a departing employee something they are not otherwise owed, in exchange for a release of legal claims. No US federal law requires severance, but when you offer it with a release, the release only holds if the agreement is done properly.</p>
<h2>What to include</h2>
<ol>
  <li><strong>The separation date</strong>, and a statement that final pay and other amounts the law requires are paid whether or not the employee signs.</li>
  <li><strong>The severance:</strong> the amount, lump sum or instalments, and when it is paid. Severance is treated as wages, so taxes are withheld.</li>
  <li><strong>Benefits:</strong> for example, paying health continuation (COBRA) premiums for a set number of months.</li>
  <li><strong>The release of claims</strong> the employee gives up, and the claims that are not released.</li>
  <li><strong>Protected rights:</strong> a clear statement that the employee can still contact government agencies.</li>
  <li><strong>Time to consider the agreement</strong>, advice to consult a lawyer, and, for employees aged 40 and over, a right to revoke.</li>
  <li><strong>Other terms:</strong> return of company property, confidentiality, non-disparagement, a neutral reference, and cooperation in any later legal matter.</li>
</ol>
<h2>Employees aged 40 and over</h2>
<p>To release claims under the Age Discrimination in Employment Act, the Older Workers Benefit Protection Act requires the agreement to:</p>
<ul>
  <li>be written in a way the employee can understand, and refer to the Age Discrimination in Employment Act by name;</li>
  <li>not waive claims that arise after the employee signs;</li>
  <li>give something of value beyond what the employee is already owed;</li>
  <li>advise the employee in writing to consult a lawyer;</li>
  <li>give at least 21 days to consider it, or 45 days when it is offered to a group, with information about who was selected and their ages; and</li>
  <li>allow 7 days after signing to revoke it.</li>
</ul>
<p>Miss one of these and the age discrimination release may not hold, even if the rest of the agreement does.</p>
<h2>What a release cannot take away</h2>
<p>An employee cannot give up the right to file a charge with the Equal Employment Opportunity Commission or another agency, or to take part in an investigation; the release can only waive their right to recover money for released claims. Claims for unemployment and workers' compensation benefits, vested retirement benefits and claims that arise later generally cannot be released either. Say so plainly in the agreement: overbroad confidentiality or non-disparagement terms can make parts of it unenforceable.</p>
<h2>State rules to check</h2>
<p>Some states add requirements. California, for example, requires specific wording to release unknown claims, and limits confidentiality and non-disparagement terms about unlawful workplace conduct. Check the rules where the employee works.</p>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/severance-agreement.html">severance agreement and release</a> covers each item above, including the 21-day and 7-day periods for employees 40 and over, and builds the agreement in your browser. Use the <a href="${rel}free-tools/deadline-calculator.html">deadline calculator</a> to work out the review and revocation dates. For the separation itself, see <a href="${rel}guides/how-to-write-a-termination-letter.html">how to write a termination letter</a> and the <a href="${rel}templates/employment-termination-letter.html">termination letter template</a>.</p>
<p class="small muted">General information, not legal advice. Have any severance agreement reviewed by an employment lawyer before it is signed.</p>` },
  { slug: 'how-to-write-a-job-description', title: 'How to write a job description that attracts the right people', published: '2026-10-03',
    sources: [['42 U.S.C. § 12111(8): written job descriptions as evidence of essential functions (ADA)', "https://www.law.cornell.edu/uscode/text/42/12111"], ['29 CFR § 1625.4: help wanted notices and age preferences (ADEA)', "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XIV/part-1625/section-1625.4"], ['New York State Department of Labor: Pay transparency', "https://dol.ny.gov/pay-transparency"], ['California Labor Code § 432.3 (pay scale in job postings)', "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=432.3"]],
    description: 'What to put in a job description, how to separate must-haves from nice-to-haves, where pay ranges are required, and wording that keeps good candidates applying.',
    body: (rel) => `
<p class="lead">A job description tells candidates what the job is, what it takes and what it offers. A clear one brings in better applications, and it is also the document you will come back to for the offer letter, performance reviews and, in a dispute, the essential functions of the role.</p>
<h2>What to include</h2>
<ol>
  <li><strong>A plain job title</strong> people actually search for, such as "Bookkeeper" rather than "Numbers Ninja".</li>
  <li><strong>Where and how the person will work:</strong> the location, remote or hybrid, full-time or part-time, and the team.</li>
  <li><strong>Who they report to.</strong></li>
  <li><strong>A short summary</strong> of why the role exists and what success looks like in the first year.</li>
  <li><strong>Five to eight responsibilities</strong>, most important first, each starting with a verb.</li>
  <li><strong>Requirements</strong> that are truly required, kept separate from nice-to-have skills.</li>
  <li><strong>The pay range</strong>, and the main benefits.</li>
  <li><strong>How to apply</strong>, and what happens next.</li>
</ol>
<h2>Must-haves and nice-to-haves</h2>
<p>Long lists of requirements put off good candidates who meet most but not all of them. Keep the requirements list to what someone truly needs on day one, and move the rest to a nice-to-have list. Ask whether a degree or a number of years is really needed, or whether you mean a skill that can be shown another way.</p>
<h2>Pay ranges</h2>
<p>A growing number of places require pay ranges in job postings, including California, Colorado, Illinois, New York and Washington, along with several cities. Even where it is optional, postings with a range tend to attract applicants who are a better fit for the budget.</p>
<h2>Wording to avoid</h2>
<ul>
  <li><strong>Age-coded phrases.</strong> Federal rules say job ads with terms such as "young" or "recent college graduate" violate the Age Discrimination in Employment Act unless an exception applies, and phrases like "digital native" can put older applicants off too.</li>
  <li><strong>Unnecessary physical requirements.</strong> List lifting or standing only if the job truly needs it; under the ADA, a written job description can be evidence of a job's essential functions.</li>
  <li><strong>Jargon and internal acronyms</strong> that outsiders will not understand.</li>
</ul>
<p>An equal opportunity statement and an offer of reasonable accommodations tell every candidate they are welcome to apply.</p>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/job-description.html">job description template</a> has sections for each item above, including lists of responsibilities, requirements, nice-to-haves and benefits, an optional pay range and an equal opportunity statement. When you have chosen someone, the <a href="${rel}templates/offer-letter.html">offer letter</a> and <a href="${rel}templates/employment-agreement.html">employment agreement</a> come next; see <a href="${rel}guides/how-to-write-an-offer-letter.html">how to write an offer letter</a>.</p>
<p class="small muted">General information, not legal advice. Employment and pay transparency laws differ between states and cities.</p>` },
  { slug: 'how-to-write-a-performance-improvement-plan', title: 'How to write a performance improvement plan (PIP) that works', published: '2026-10-04',
    sources: [['SHRM: 8 steps for effective performance improvement plans', 'https://www.shrm.org/in/topics-tools/news/employee-relations/8-steps-for-effective-performance-improvement-plans']],
    description: 'How to write a performance improvement plan: specific concerns, measurable goals, support, check-ins, how long a PIP should last and mistakes to avoid.',
    body: (rel) => `
<p class="lead">A performance improvement plan (PIP) tells an employee, in writing, what is not working, what good performance looks like, what help they will get and by when they need to improve. Done well, it gives a struggling employee a real chance. Done badly, it reads as a formality before a dismissal, and nobody improves.</p>
<h2>When a PIP makes sense</h2>
<p>Use a PIP when the problem is performance (missed targets, poor quality, slow work) and earlier informal feedback has not worked. Misconduct, such as harassment or theft, calls for a disciplinary process instead, and a one-off mistake usually needs a conversation, not a plan. If the manager does not believe the employee can improve, or will not make time for regular check-ins, a PIP is the wrong tool.</p>
<h2>What to include</h2>
<ol>
  <li><strong>The employee, the manager and the plan period</strong>, with start and end dates.</li>
  <li><strong>The concerns, with examples.</strong> Name dates, figures and work products: "three of the last five client reports were sent after the agreed deadline", not "needs to raise the bar".</li>
  <li><strong>Earlier discussions</strong>: when the issue was raised before, if it was.</li>
  <li><strong>Goals that can be measured.</strong> Each one says what will be done, how it will be measured and by when.</li>
  <li><strong>The support the company will give</strong>: training, closer supervision, clearer priorities, tools or time.</li>
  <li><strong>The check-in schedule</strong>, usually weekly or every two weeks, with written notes after each one.</li>
  <li><strong>The possible outcomes</strong>: the plan ends successfully, is extended, or further action follows, up to dismissal.</li>
  <li><strong>An acknowledgement</strong> that the employee received and discussed the plan, with room for their comments.</li>
</ol>
<h2>How long a PIP should last</h2>
<p>Long enough for the goals to be achievable and for improvement to show. Thirty days is a common minimum, and 60 or 90 days is typical for roles where results take longer to appear. Say in the plan that it can be extended, for example if the employee is on leave for part of it.</p>
<h2>Writing goals people can meet</h2>
<ul>
  <li>Tie every goal to one of the concerns above it.</li>
  <li>Use numbers or observable results where you can: response times, error rates, deadlines met.</li>
  <li>Keep to three to five goals. A plan with fifteen reads as a list of reasons to fail.</li>
  <li>Make sure the goals are the same standard others in the role are held to.</li>
</ul>
<h2>Running the plan</h2>
<p>Hold every check-in you promised, and write a short summary after each one: what went well, what did not, and what changes before the next meeting. Recognise progress when you see it. At the end, meet to confirm the outcome in writing.</p>
<h2>Mistakes to avoid</h2>
<ul>
  <li><strong>Vague concerns</strong> that the employee cannot act on.</li>
  <li><strong>Skipping check-ins</strong>, which leaves the employee guessing and weakens the record.</li>
  <li><strong>Asking the employee to agree</strong> rather than to acknowledge receipt. Disagreement does not stop the plan, and a refusal to sign can simply be noted.</li>
  <li><strong>Timing that looks like retaliation</strong>, such as starting a PIP straight after a complaint or a request for leave. Check with HR or a lawyer first in that situation.</li>
</ul>
<h2>Free template</h2>
<p>The free <a href="${rel}templates/performance-improvement-plan.html">performance improvement plan template</a> has each section above, with a list of goals (each with a measure and due date), a list of support items and an optional at-will statement for US employers. If the plan does not succeed, the <a href="${rel}templates/employee-warning-letter.html">employee warning letter</a> and <a href="${rel}templates/employment-termination-letter.html">termination letter</a> templates cover the next steps.</p>
<p class="small muted">General information, not legal advice. Employment law differs between countries and states.</p>` },
  { slug: 'what-is-a-credit-note', title: 'What is a credit note? When to issue one, what it must say', published: '2026-10-04',
    sources: [['HMRC VAT Traders Records Manual VATREC13040: conditions of a valid credit note', 'https://www.gov.uk/hmrc-internal-manuals/vat-trader-records/vatrec13040']],
    description: 'What a credit note is, when to issue one instead of editing an invoice, what it must include, how it handles tax, and refund versus credit.',
    body: (rel) => `
<p class="lead">A credit note is a document a seller issues to reduce or cancel an invoice it has already sent. It is the clean way to fix an overcharge, record a return or give a discount after the fact, without changing or deleting the original invoice.</p>
<h2>When to issue a credit note</h2>
<ul>
  <li>The customer returned goods, or part of an order.</li>
  <li>You charged the wrong price or quantity.</li>
  <li>You agreed a discount or a goodwill reduction after invoicing.</li>
  <li>The invoice should not have been issued at all, so it is cancelled in full.</li>
</ul>
<h2>Why not just edit the invoice?</h2>
<p>Invoices are numbered in sequence and often already sit in the customer's accounts and your tax records. Changing one after it has been sent breaks that trail. A credit note keeps the original intact and records the correction as its own numbered document, which is what accountants and tax authorities expect.</p>
<h2>What a credit note should include</h2>
<ol>
  <li>The words "Credit note" and its own number and date.</li>
  <li>Your business name and address, and your tax number if you are registered.</li>
  <li>The customer's name and address.</li>
  <li><strong>The number and date of the original invoice.</strong></li>
  <li>The reason for the credit.</li>
  <li>Each credited item and amount, and the total credit.</li>
  <li>Any tax being reversed, at the rate charged on the original invoice.</li>
  <li>Whether the credit will be refunded or applied to another invoice.</li>
</ol>
<h2>Credit notes and sales tax or VAT</h2>
<p>If the original invoice charged sales tax or VAT, the credit note should reverse the tax on the credited amount too, so both sides adjust what they report. In the UK, HMRC's rules say a valid VAT credit note must correct a genuine mistake or overcharge, or reflect an agreed reduction in the price; give value to the customer; and not be used for a bad debt. Other countries have their own rules, so check with your accountant.</p>
<h2>Refund or credit?</h2>
<p>A credit note does not move money by itself. Say on it what happens next: a refund by a set method and date, or a credit applied to an outstanding or future invoice. If you apply it, mention the credit note number on the invoice you apply it to.</p>
<h2>Credit note, debit note and refund</h2>
<p>A credit note reduces what the customer owes. A debit note works the other way: a buyer may send one to ask for a credit, or a seller may issue one to increase an amount already invoiced. A refund is the payment that may follow a credit note.</p>
<h2>Free template</h2>
<p>The free <a href="${rel}templates/credit-note.html">credit note template</a> links the credit to the original invoice and lists each credited item, optional tax and the total, and lets you choose a refund or a credit against another invoice. It sits alongside the <a href="${rel}templates/invoice.html">invoice</a>, <a href="${rel}templates/quote.html">quote</a> and <a href="${rel}templates/payment-receipt.html">payment receipt</a> templates.</p>
<p class="small muted">General information, not tax advice. Invoicing and VAT rules differ between countries.</p>` },
  { slug: 'what-is-a-change-order', title: 'What is a change order? How to handle scope changes', published: '2026-10-04',
    description: 'What a change order is, when freelancers, agencies and contractors need one, what it should include, and how it protects both sides when scope changes.',
    body: (rel) => `
<p class="lead">A change order is a short written agreement that changes the scope, price or schedule of a contract that is already signed. It lets both sides agree extra or different work, and what it costs, before the work is done, so the final invoice holds no surprises.</p>
<h2>When you need one</h2>
<ul>
  <li>The client asks for something the contract or statement of work does not cover.</li>
  <li>The client wants to remove part of the work, which should lower the price.</li>
  <li>Something outside your control, such as late content or a change in requirements, moves the deadline.</li>
  <li>The agreed approach turns out not to work and a different one costs more or less.</li>
</ul>
<p>A useful test: if the change affects the price, the deadline or what you hand over, put it in a change order.</p>
<h2>What a change order should include</h2>
<ol>
  <li><strong>A change order number and date</strong>, so several changes on one project stay in order.</li>
  <li><strong>The original contract</strong>: its name, date and the parties.</li>
  <li><strong>A description of the change</strong> in plain words.</li>
  <li><strong>The items added, removed or changed</strong>, each with its cost or saving.</li>
  <li><strong>The price change and the new contract total.</strong></li>
  <li><strong>How the change is paid</strong>, if not on the contract's normal terms.</li>
  <li><strong>Any new completion date.</strong></li>
  <li><strong>A statement that everything else stays the same</strong>, and signatures from both sides before work starts.</li>
</ol>
<h2>Why it matters</h2>
<p>Most scope disputes start with "I thought that was included". A signed change order records exactly what was agreed and when. It also makes it easier to say yes to clients: you do not have to refuse extra work, you just price it.</p>
<h2>Write the process into your contract</h2>
<p>Your contract or statement of work should say that changes need a written change order signed by both sides, how changes are priced (for example your hourly rate), and that the schedule moves with them. The change order then follows a process the client already agreed to.</p>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/change-order-form.html">change order form</a> lists each change with its amount, shows the price increase or decrease and the new total, and records any new completion date. Use it alongside the <a href="${rel}templates/statement-of-work.html">statement of work</a> that defines the original scope. If a project ends instead of changing, the <a href="${rel}templates/contract-termination-letter.html">contract termination letter</a> covers that.</p>
<p class="small muted">General information, not legal advice.</p>` },
  { slug: 'what-to-include-in-a-room-rental-agreement', title: 'Renting a room in your home: what the agreement should say', published: '2026-10-04',
    sources: [['42 U.S.C. § 3603(b)(2): Fair Housing Act exemption for owner-occupied buildings of up to four units', 'https://www.law.cornell.edu/uscode/text/42/3603']],
    description: 'What to put in a room rental agreement when you rent out a room in your home: rent, deposit, utilities, shared spaces, house rules, guests and notice.',
    body: (rel) => `
<p class="lead">Renting out a spare room is different from letting a whole home. You share a kitchen, a bathroom and a front door with the person, so the agreement needs to cover living together as well as rent. A short written agreement settles most of the questions that cause arguments later.</p>
<h2>Room rental agreement, lease or roommate agreement?</h2>
<p>A <strong>lease</strong> usually covers a whole home rented to a tenant. A <strong>room rental agreement</strong> is between the owner or head tenant and the person renting one room, with shared use of the rest. A <strong>roommate agreement</strong> is between co-tenants who are all on the same lease, and covers how they split rent and chores between themselves.</p>
<h2>What to include</h2>
<ol>
  <li><strong>The room and the shared areas</strong>: which room, whether it is furnished, and which parts of the home the renter may use.</li>
  <li><strong>The term</strong>: a fixed end date, or month to month with a notice period.</li>
  <li><strong>Rent</strong>: the amount, the due date, how it is paid and any late fee the law allows.</li>
  <li><strong>The deposit</strong> and how and when it is returned.</li>
  <li><strong>Utilities</strong>: included in the rent, or a set percentage of each bill.</li>
  <li><strong>House rules</strong>: quiet time, cleaning shared spaces, smoking, pets and overnight guests.</li>
  <li><strong>Parking and storage</strong>, if offered.</li>
  <li><strong>Entry</strong>: when you may enter the room, and how much notice you give.</li>
  <li><strong>Ending the arrangement</strong>: notice, moving out and returning keys.</li>
</ol>
<h2>Utilities: include them or split them?</h2>
<p>Including utilities in the rent is simpler and avoids monthly bill splitting, but you carry the risk of a high bill. A percentage share is fairer when usage varies; say which bills are shared and how quickly the renter pays their share once shown the bill.</p>
<h2>Guests and house rules</h2>
<p>Most disputes are about guests, noise and cleaning, not rent. Put a limit on overnight guests (for example a number of nights a month), set quiet hours, and say who cleans what. Clear rules written down at the start are easier to keep than rules made up after a problem.</p>
<h2>The law still applies</h2>
<p>Local rental law can still apply to a room in your own home, including rules on deposits, notice and eviction, and it can give the renter rights the agreement does not mention. In the US, the federal Fair Housing Act exempts some owner-occupied buildings with up to four units from parts of its rules, but not from its ban on discriminatory advertising, and state or city law may be stricter. Check the rules where you live.</p>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/room-rental-agreement.html">room rental agreement template</a> covers each item above, with options for a furnished room, parking, a fixed term or month to month, a late fee, and utilities included or shared. To screen applicants first, use the <a href="${rel}templates/rental-application.html">rental application</a>, and ask previous landlords to fill in a <a href="${rel}templates/landlord-reference-letter.html">landlord reference letter</a>.</p>
<p class="small muted">General information, not legal advice. Rental law differs between countries, states and cities.</p>` },
  { slug: 'how-to-write-a-remote-work-agreement', title: 'How to write a remote work agreement (free template)', published: '2026-10-04',
    sources: [['OSHA Directive CPL 02-00-125: Home-Based Worksites', 'https://www.osha.gov/enforcement/directives/cpl-02-00-125']],
    description: 'What a remote or hybrid work agreement should cover: work location, hours, equipment, home office costs, security, safety, expenses and how it ends.',
    body: (rel) => `
<p class="lead">A remote work agreement sets out how an employee works away from the office: where, when, with what equipment and under which rules. It sits alongside the employment contract and changes how the work is done, not the job itself.</p>
<h2>Fully remote, hybrid or occasional?</h2>
<p><strong>Fully remote</strong> means no regular office days. <strong>Hybrid</strong> means set office days each week, with the rest worked from home. Occasional work from home is often covered by a company policy instead of an individual agreement. Say which one applies, and name the office days for a hybrid arrangement.</p>
<h2>What to include</h2>
<ol>
  <li><strong>The arrangement</strong>: fully remote or hybrid, its start date and any trial period.</li>
  <li><strong>The work location</strong>, and a rule that the employee asks before working from anywhere else.</li>
  <li><strong>Hours and availability</strong>: working hours, any core hours, time zone, and how to reach the employee.</li>
  <li><strong>Equipment</strong>: what the company provides, who maintains it, and returning it when the arrangement ends.</li>
  <li><strong>Home office costs</strong>: any allowance, which expenses are reimbursed and how to claim them.</li>
  <li><strong>Security and confidentiality</strong>: company devices, secure connections, printed papers, and reporting a lost device.</li>
  <li><strong>Workspace and safety</strong>: a suitable place to work, and reporting injuries during work as at the office.</li>
  <li><strong>Review and ending</strong>: when the arrangement is reviewed, the notice either side gives, and the return to the office.</li>
</ol>
<h2>Why the work location matters</h2>
<p>An employee who works from another state or country can bring the employer new payroll tax registrations, a different set of employment laws and insurance questions, even for a few months. That is why the agreement should require approval before any change of work location, including long temporary stays.</p>
<h2>Hours and overtime</h2>
<p>Working from home does not change overtime rules. In the US, non-exempt employees must still be paid for all the hours they work, so say how hours are recorded and that overtime needs approval in advance. Core hours (for example 10:00 to 15:00 in the employee's time zone) keep meetings possible without fixing every working minute.</p>
<h2>Equipment and expenses</h2>
<p>List what the company provides, and say the employee uses it for work and returns it at the end. Some places require employers to reimburse necessary work expenses; California does so under Labor Code section 2802, which can include part of a personal phone or internet bill used for work. A fixed monthly allowance is simpler to run than itemised claims, but check it covers the real costs where reimbursement is required.</p>
<h2>Health and safety at home</h2>
<p>In the US, OSHA's policy is that it will not inspect employees' home offices and does not hold employers liable for them, but work-related injuries at home are still recorded like any other. Other countries can expect more, such as a workstation assessment. Either way, ask employees to keep a safe workspace and report any injury during work promptly.</p>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/remote-work-agreement.html">remote work agreement template</a> covers each item above, with options for hybrid office days, core hours, a home office allowance and the notice to end the arrangement. Use the <a href="${rel}templates/expense-reimbursement-form.html">expense reimbursement form</a> for claims, and the <a href="${rel}templates/employee-nda.html">employee NDA</a> if the role handles confidential information.</p>
<p class="small muted">General information, not legal advice. Employment, tax and safety rules differ between countries and states.</p>` },
  { slug: 'how-to-terminate-a-contract', title: 'How to terminate a contract: notice, cause and the letter', published: '2026-10-04',
    description: 'How to end a business contract properly: read the termination clause, choose cause or convenience, give notice the right way, and what the letter says.',
    body: (rel) => `
<p class="lead">Ending a contract is mostly about following the contract itself. Most business contracts say who may end them, for what reasons, with how much notice and how notice must be given. A termination letter that follows those rules ends the relationship cleanly. One that ignores them can itself be a breach.</p>
<h2>Step 1: read the contract</h2>
<p>Before writing anything, find these parts of the contract:</p>
<ul>
  <li><strong>The termination clause</strong>: whether either side may end the contract <a href="${rel}clauses/termination-for-convenience-clause.html">for convenience</a>, <a href="${rel}clauses/termination-for-cause-clause.html">for cause</a>, or both.</li>
  <li><strong>The notice period</strong>, and any cure period for breaches.</li>
  <li><strong>The <a href="${rel}clauses/notices-clause.html">notices clause</a></strong>: how notice must be sent, to which address and to whom.</li>
  <li><strong>Payment on termination</strong>: work done to date, early termination fees or a kill fee.</li>
  <li><strong>Terms that <a href="${rel}clauses/survival-clause.html">survive</a></strong>, such as confidentiality, payment and limits on liability.</li>
  <li><strong>The term</strong>: if the contract ends on a set date or renews automatically, a notice of non-renewal before the deadline may be all you need.</li>
</ul>
<h2>For convenience or for cause?</h2>
<p><strong>For convenience</strong> means ending the contract without giving a reason, as the contract allows, usually on notice and with payment for work done. <strong>For cause</strong> means ending it because the other side breached it. Many contracts require written notice of the breach and a chance to fix it, often 10 to 30 days, before you can terminate for cause.</p>
<p>Terminating for cause without a valid reason, or skipping the cure period, can let the other side claim that you are the one in breach. Where the contract allows it, some businesses terminate for convenience and reserve their rights over the breach instead.</p>
<h2>If the contract has no termination clause</h2>
<p>Ending a fixed-term contract early with no right to do so is usually a breach, unless the other side has seriously breached it first or both sides agree. A short written agreement to end the contract on agreed terms is often the cleanest route. Contracts with no end date can often be ended on reasonable notice, but the rules vary, so get advice before relying on that.</p>
<h2>What the termination letter should say</h2>
<ol>
  <li>The parties and the contract: its name, date and any reference number.</li>
  <li>That you are terminating it, and the clause you rely on.</li>
  <li>For cause: the breach, when you gave notice of it, and that it was not fixed in time.</li>
  <li>The effective date, and how it follows from the notice period.</li>
  <li>The final invoice or payment, and when it is due.</li>
  <li>Return or destruction of materials and confidential information.</li>
  <li>The terms that continue after termination.</li>
  <li>A reservation of your other rights, and a contact for questions.</li>
</ol>
<h2>Sending it</h2>
<p>Send the letter exactly as the notices clause requires: by email, courier or registered post, to the named address and person. Keep proof of when it was sent and received, because the notice period usually runs from then. The free <a href="${rel}free-tools/deadline-calculator.html">deadline calculator</a> gives the date a 30-day or other notice period ends.</p>
<p>Keep the tone neutral. A termination letter may later be read by a lawyer or a judge, so stick to dates, clauses and facts.</p>
<h2>Free template</h2>
<p>The free <a href="${rel}templates/contract-termination-letter.html">contract termination letter template</a> ends a client, vendor or supplier contract for convenience or for cause, with the clause relied on, the notice period, final payment, return of materials and surviving terms. To change a project instead of ending it, use a <a href="${rel}templates/change-order-form.html">change order</a>. Ending employment or a tenancy follows different rules: see the <a href="${rel}templates/employment-termination-letter.html">employment termination letter</a> and the <a href="${rel}templates/notice-to-vacate.html">notice to vacate</a>.</p>
<p class="small muted">General information, not legal advice. Contract law differs between countries and states.</p>` },
  { slug: 'how-does-consignment-work', title: 'How does consignment work? Commission, payouts and risk', published: '2026-10-04',
    sources: [['UCC § 9-102(a)(20): definition of consignment (Cornell LII)', 'https://www.law.cornell.edu/ucc/9/9-102']],
    description: 'How consignment works for owners and shops: who owns the goods, typical commission, payouts, unsold items, risk of loss, and what the agreement says.',
    body: (rel) => `
<p class="lead">In a consignment, the owner of goods (the consignor) leaves them with a shop, gallery or reseller (the consignee), which sells them and keeps a commission. The consignor keeps ownership until each item sells, and is paid only when it does.</p>
<h2>How it works, step by step</h2>
<ol>
  <li>Both sides agree the terms and list the items, each with a description and a minimum price.</li>
  <li>The shop displays and sells the items, in store and sometimes online.</li>
  <li>When an item sells, the shop keeps its commission and pays the rest to the consignor on an agreed schedule, with a statement of what sold.</li>
  <li>At the end of the consignment period, unsold items are collected, marked down or left for a further period.</li>
</ol>
<h2>Consignment or selling to the shop?</h2>
<p>If the shop buys your goods outright (wholesale), you are paid at once and the shop carries the risk of not selling, but you get a lower price. On consignment you usually get a larger share of the sale price, but only when an item sells, and unsold stock comes back to you. Consignment suits one-off, higher-value or slow-selling items; wholesale suits steady products a shop reorders.</p>
<h2>Typical commission</h2>
<p>It depends on the trade: often 20% to 40% for clothing and furniture consignment shops, and 40% to 50% for galleries. Just as important is what the commission is calculated on. Say whether it is a share of the price before or after sales tax, discounts and card fees.</p>
<h2>What the agreement should cover</h2>
<ol>
  <li><strong>The item list</strong>: description, condition and minimum price for each item.</li>
  <li><strong>Ownership</strong>: the consignor owns the items until they are sold.</li>
  <li><strong>Where items are sold</strong>, and whether online sales are allowed.</li>
  <li><strong>Discounts</strong>: whether the shop may mark items down after a set time, and never below the minimum without consent.</li>
  <li><strong>Commission and payout</strong>: the rate, what it is calculated on, and when the consignor is paid.</li>
  <li><strong>The consignment period</strong>, and collecting unsold items at the end.</li>
  <li><strong>Items left behind</strong>: what happens to them after written notice.</li>
  <li><strong>Care, risk of loss and insurance</strong>, and how either side can end the agreement early.</li>
</ol>
<h2>Theft, damage and insurance</h2>
<p>Items can be stolen, damaged or lost in a fire or flood while at the shop. The agreement should say who bears that risk, and whether the shop's insurance covers goods it holds for others. Consignors should check that it does, since consigned goods are someone else's property and may need to be named on the policy.</p>
<h2>If the shop goes out of business</h2>
<p>In the US, some consignments fall under Article 9 of the Uniform Commercial Code: broadly, goods worth $1,000 or more per delivery, that were not consumer goods, delivered to a merchant who is not an auctioneer and is not generally known by its creditors to sell other people's goods. In those cases, a consignor who has not filed a financing statement can lose the goods to the shop's creditors if the shop fails. Many states also have laws for artists who consign work to galleries, which often treat the work and the sale proceeds as held in trust for the artist. Check the rules where you sell.</p>
<h2>Free template</h2>
<p>The free <a href="${rel}templates/consignment-agreement.html">consignment agreement template</a> has an item list with minimum prices, the commission and payout timing, optional online sales and discounts, the consignment period, unsold items and the risk of loss. The free <a href="${rel}free-tools/sales-commission.html">sales commission calculator</a> shows the shop's cut and your payout. To sell an item outright instead, use the <a href="${rel}templates/bill-of-sale.html">bill of sale</a>.</p>
<p class="small muted">General information, not legal advice. Commercial law differs between countries and states.</p>` },
  { slug: 'how-to-set-up-a-rent-payment-plan', title: 'How to set up a rent payment plan with a tenant', published: '2026-10-04',
    description: 'How landlords and tenants can agree a payment plan for past-due rent: an affordable schedule, late fees, missed payments and what to put in writing.',
    body: (rel) => `
<p class="lead">When a tenant falls behind, a payment plan lets them catch up in instalments while they keep paying the regular rent. For a landlord it is usually quicker and cheaper than an eviction; for a tenant it keeps their home. It only works if the plan is realistic and written down.</p>
<h2>When a payment plan makes sense</h2>
<p>A plan works best after a temporary setback, such as a job loss, illness or reduced hours, when the tenant now has enough income to pay the current rent plus something extra. If the tenant cannot cover even the current rent, a plan only delays the problem; rental assistance or an agreed move-out may be better options.</p>
<h2>Work out an affordable schedule</h2>
<ol>
  <li>Agree the exact amount owed up to a set date, itemised: rent, late fees and any other charges.</li>
  <li>Look at what the tenant can pay on top of the regular rent each month.</li>
  <li>Spread the balance over enough instalments to make that possible, often three to six months.</li>
  <li>Set instalment dates that match the tenant's paydays.</li>
</ol>
<p>For example, $1,800 of past-due rent could be repaid at $300 a month for six months, on top of the regular rent. The free <a href="${rel}free-tools/late-payment-interest.html">late payment interest calculator</a> shows what the overdue amount has cost if your lease charges interest.</p>
<h2>What to put in writing</h2>
<ol>
  <li>The landlord, the tenant, the property and the lease.</li>
  <li>The past-due amount and the period it covers.</li>
  <li>Each instalment date and amount.</li>
  <li>That the regular rent stays due on time during the plan.</li>
  <li>How payments are made, and that the tenant may pay off the balance early.</li>
  <li>Whether late fees already charged are waived if the plan is kept.</li>
  <li>What happens if a payment is missed: any grace period, and the notice the landlord will give.</li>
  <li>That the landlord will not evict for the past-due amount while the plan is kept.</li>
  <li>That the lease otherwise stays the same, and both signatures.</li>
</ol>
<h2>Late fees during the plan</h2>
<p>Offering to waive late fees already charged if the tenant completes the plan gives them a reason to keep to it. Do not charge new late fees on instalments paid on time, and check any local limits on late fees.</p>
<h2>Eviction rules and partial payments</h2>
<p>In some places, accepting part of the rent can affect a landlord's right to continue an eviction that has already started, and some cities and states require particular notices or offer mediation first. If an eviction case has been filed, the plan may need to be agreed through the court. Check local rules before relying on the plan.</p>
<h2>Rental assistance</h2>
<p>Ask whether local emergency rental assistance is available. Some programmes pay part of the arrears straight to the landlord and set their own conditions, which the plan can then reflect.</p>
<h2>Keep records</h2>
<p>Give a receipt for every payment, showing what it was for: regular rent or an instalment. A short note of each payment against the plan avoids arguments about what is still owed.</p>
<h2>Free templates</h2>
<p>The free <a href="${rel}templates/rent-payment-plan-agreement.html">rent payment plan agreement template</a> sets out the past-due amount, each instalment, an optional late-fee waiver and what happens if a payment is missed. Use the <a href="${rel}templates/rent-receipt.html">rent receipt</a> for each payment, and the <a href="${rel}templates/late-rent-notice.html">late rent notice</a> if rent falls behind again.</p>
<p class="small muted">General information, not legal advice. Rental and eviction law differs between countries, states and cities.</p>` },  { slug: 'what-to-include-on-a-vat-invoice', title: 'What a VAT invoice must include (UK): full and simplified invoices', published: '2026-10-06',
    description: 'The details HMRC requires on a full VAT invoice and a simplified invoice of £250 or less, the 30-day deadline, the tax point and invoices in foreign currency.',
    sources: [['HMRC: Record keeping for VAT (VAT Notice 700/21), section 4: VAT invoices', 'https://www.gov.uk/guidance/record-keeping-for-vat-notice-70021'], ['HMRC: VAT guide (VAT Notice 700)', 'https://www.gov.uk/guidance/vat-guide-notice-700']],
    body: (rel) => `
<p class="lead">If you are registered for VAT and sell standard-rated or reduced-rated goods or services to another VAT-registered business, you normally have to issue a VAT invoice within 30 days of the supply. HMRC sets out what it must show, and your customer needs a valid VAT invoice to reclaim the VAT you charged.</p>
<h2>What a full VAT invoice must show</h2>
<ol>
  <li>A <strong>unique invoice number</strong> that follows on from the last one.</li>
  <li>The <strong>time of supply</strong>, also called the tax point, and the date of issue if it is different.</li>
  <li>Your <strong>name, address and VAT registration number</strong>.</li>
  <li>Your <strong>customer's name and address</strong>.</li>
  <li>A <strong>description</strong> that identifies the goods or services.</li>
  <li>For each item: the <strong>quantity</strong>, the <strong>unit price</strong>, the <strong>rate of VAT</strong> and the <strong>amount excluding VAT</strong>.</li>
  <li>The <strong>total excluding VAT</strong>.</li>
  <li>The rate of any <strong>cash discount</strong> you offer.</li>
  <li>The <strong>total VAT charged</strong>, shown in sterling.</li>
</ol>
<h2>Simplified VAT invoices for £250 or less</h2>
<p>If the total including VAT is £250 or less, you can issue a simplified invoice instead. It needs your name, address and VAT registration number, the time of supply, a description of what you supplied, and for each VAT rate, the total amount payable including VAT and the rate charged. Above £250, use a full invoice.</p>
<h2>The time of supply</h2>
<p>The time of supply is the date that decides which VAT return the sale belongs to. It is usually the date you deliver the goods or finish the service, but it can be earlier if you are paid or invoice first. When it differs from the date you issue the invoice, show both. HMRC's VAT guide, Notice 700, explains the rules in full.</p>
<h2>When you do not need a VAT invoice</h2>
<p>You do not have to issue a VAT invoice for sales that are only zero-rated or exempt, or under the second-hand margin schemes, among other cases set out in the notice. If you are not registered for VAT, do not show VAT on your invoices at all.</p>
<h2>Invoicing in another currency</h2>
<p>Prices and the total excluding VAT can be in any currency, but the total VAT must also be shown in sterling, so your customer can enter it on their return.</p>
<h2>Correcting a VAT invoice</h2>
<p>Do not edit an invoice you have already sent. Issue a <a href="${rel}guides/what-is-a-credit-note.html">credit note</a> that cancels it, or the wrong part of it, and a new invoice with a new number.</p>
<h2>Free template</h2>
<p>The free <a href="${rel}templates/invoice.html">invoice template</a> can show your VAT number and a separate date of supply, and works out the VAT from the rate you enter. It applies one VAT rate to the whole invoice, so it fits when every line is at the same rate; if you sell at more than one rate, put the rate in each line's description or issue separate invoices. The <a href="${rel}templates/credit-note.html">credit note template</a> reverses VAT the same way.</p>
<p class="small muted">General information, not tax advice. Check HMRC's current guidance or an accountant for your situation.</p>` },
  { slug: 'gst-hst-invoice-requirements-canada', title: 'GST/HST invoice requirements in Canada: what to show at each amount', published: '2026-10-06',
    description: 'What a Canadian invoice must show so customers can claim input tax credits: the CRA thresholds of $100 and $500, your registration number, and GST and HST rates.',
    sources: [['Canada Revenue Agency: Input tax credits, information you need', 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/calculate-prepare-report/input-tax-credit.html'], ['Canada Revenue Agency: GST/HST rates by province', 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html'], ['Input Tax Credit Information (GST/HST) Regulations, SOR/91-45', 'https://laws.justice.gc.ca/eng/regulations/SOR-91-45/page-1.html']],
    body: (rel) => `
<p class="lead">The Canada Revenue Agency does not prescribe an invoice layout. What it does set is the information a business customer needs to claim back the GST or HST you charged, as an input tax credit. That depends on the total, so a complete invoice is one that meets the highest threshold.</p>
<h2>What to show, by total amount</h2>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">Total of the sale</th><th scope="col">Information needed</th></tr></thead><tbody>
<tr><td>Under $100</td><td>Your business or trading name, the invoice date, and the total amount paid or payable.</td></tr>
<tr><td>$100 to $499.99</td><td>All of the above, plus your GST/HST registration number, the total GST or HST charged (or a statement that the price includes it, with the rate), and which items are taxable if some are not.</td></tr>
<tr><td>$500 or more</td><td>All of the above, plus your customer's name or trading name, a brief description of what you supplied, and the terms of payment.</td></tr>
</tbody></table></div>
<p>These thresholds were raised from $30 and $150 in 2021. Older guides on the web still quote the old figures.</p>
<h2>Your registration number</h2>
<p>Show your GST/HST number as your nine-digit business number followed by the program identifier, for example 123456789 RT0001. If you are a small supplier and have not registered, do not charge GST or HST, and do not show a registration number.</p>
<h2>Which rate to charge</h2>
<p>The rate depends on where the supply is made, usually where your customer is. Since 1 April 2025 the rates are:</p>
<ul>
  <li><strong>GST 5%</strong>: Alberta, British Columbia, Manitoba, Quebec, Saskatchewan, and the three territories (provincial sales tax, where it applies, is separate).</li>
  <li><strong>HST 13%</strong>: Ontario.</li>
  <li><strong>HST 14%</strong>: Nova Scotia, down from 15% on 1 April 2025.</li>
  <li><strong>HST 15%</strong>: New Brunswick, Newfoundland and Labrador, and Prince Edward Island.</li>
</ul>
<h2>Good practice beyond the minimum</h2>
<p>Give every invoice a unique number, show the due date and how to pay, and list the GST or HST as its own line rather than only saying it is included. Your customer's bookkeeper will thank you, and the invoice will meet every threshold whatever the amount.</p>
<h2>Free template</h2>
<p>The free <a href="${rel}templates/invoice.html">invoice template</a> shows your GST/HST number, the customer's details, a description of each item and the payment terms, and works out the tax from the rate you enter, such as 13 for Ontario HST. For a refund or correction, use the <a href="${rel}templates/credit-note.html">credit note template</a>.</p>
<p class="small muted">General information, not tax advice. Check the Canada Revenue Agency's current guidance or an accountant for your situation.</p>` },
  { slug: 'tax-invoice-requirements-australia', title: 'Tax invoice requirements in Australia: the seven details the ATO asks for', published: '2026-10-06',
    description: 'What an Australian tax invoice must show: the seven details for sales under $1,000, the buyer\'s identity or ABN from $1,000, and the 28-day rule.',
    sources: [['Australian Taxation Office: Tax invoices', 'https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/tax-invoices']],
    body: (rel) => `
<p class="lead">If you are registered for GST in Australia, a business customer needs a tax invoice from you to claim the GST back. If a customer asks for one, you must provide it within 28 days, unless the sale was $82.50 or less including GST.</p>
<h2>The seven details for sales under $1,000</h2>
<ol>
  <li>That the document is intended to be a <strong>tax invoice</strong>, usually by putting those words at the top.</li>
  <li>Your <strong>identity</strong>, such as your business name.</li>
  <li>Your <strong>Australian business number (ABN)</strong>.</li>
  <li>The <strong>date</strong> the invoice was issued.</li>
  <li>A brief <strong>description</strong> of what you sold, with the quantity if relevant, and the price.</li>
  <li>The <strong>GST amount</strong>, or a statement such as "Total price includes GST" when the GST is exactly one eleventh of the total.</li>
  <li>The <strong>extent to which each sale is taxable</strong>, when the invoice mixes taxable and GST-free items.</li>
</ol>
<h2>Sales of $1,000 or more</h2>
<p>Tax invoices for sales of $1,000 or more must also show the <strong>buyer's identity or ABN</strong>. An invoice that meets this higher standard is valid for smaller sales too, so it is simplest to always include the buyer.</p>
<h2>If you are not registered for GST</h2>
<p>Do not call the document a tax invoice and do not add GST. Issue an ordinary invoice that shows your ABN, if you have one.</p>
<h2>GST rate</h2>
<p>GST is 10%. On a GST-exclusive price of $1,000, the GST is $100 and the total $1,100; on a GST-inclusive total, the GST is one eleventh of it.</p>
<h2>Free template</h2>
<p>The free <a href="${rel}templates/invoice.html">invoice template</a> can be titled "Tax invoice", show your ABN, the buyer's details and each item with its quantity and price, and works out the GST when you enter a rate of 10. Untick the tax option for GST-free work, or use it without the tax invoice title if you are not registered.</p>
<p class="small muted">General information, not tax advice. Check the ATO's current guidance or a registered tax agent for your situation.</p>` },
  { slug: 'what-bank-details-to-put-on-an-invoice', title: 'What bank details to put on an invoice, and how to stop invoice fraud', published: '2026-10-06',
    description: 'The bank details clients need to pay an invoice in the UK, US, Canada, Europe and Australia, plus how to protect them from fake change-of-bank-details emails.',
    sources: [['FBI Internet Crime Complaint Center: 2025 Internet Crime Report', 'https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf'], ['Take Five to Stop Fraud (UK Finance): Invoice and mandate fraud', 'https://www.takefive-stopfraud.org.uk/protect-your-business/invoice-and-mandate/']],
    body: (rel) => `
<p class="lead">An invoice that tells the client exactly how to pay gets paid sooner. Put the full details on every invoice, in the format your client's bank expects, and add one line that protects them from the most common invoice scam.</p>
<h2>Always include</h2>
<ul>
  <li>The <strong>account name</strong>, exactly as the bank holds it. Banks increasingly check the name against the account before a payment goes through.</li>
  <li>The <strong>bank's name</strong>.</li>
  <li>The <strong>invoice number as the payment reference</strong>, so you can match the payment.</li>
</ul>
<h2>The details by country</h2>
<div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">Where your account is</th><th scope="col">Details clients need</th></tr></thead><tbody>
<tr><td>United Kingdom</td><td>Sort code (6 digits) and account number (8 digits). Add your IBAN and BIC for payments from abroad.</td></tr>
<tr><td>United States</td><td>ABA routing number (9 digits) and account number. Wire transfers can use a different routing number from ACH, so check with your bank. Add the SWIFT code for international payments.</td></tr>
<tr><td>Canada</td><td>Institution number (3 digits), transit number (5 digits) and account number, or the email address for Interac e-Transfer. Add the SWIFT code for payments from abroad.</td></tr>
<tr><td>Euro area (SEPA)</td><td>IBAN, and the BIC if your clients' banks ask for it.</td></tr>
<tr><td>Australia</td><td>BSB (6 digits) and account number. Add the SWIFT code for international payments.</td></tr>
</tbody></table></div>
<p>If you take card or online payments, a payment link works too. Whatever you use, show the due date beside it.</p>
<h2>Protect your clients from invoice fraud</h2>
<p>The bigger risk is not that someone sees your bank details. It is that a criminal sends your client an email, apparently from you, saying your bank details have changed. Business email compromise, which includes these scams, led to 24,768 complaints and over $3 billion in reported losses in the FBI's 2025 internet crime report.</p>
<ul>
  <li>Add a line to your invoices: <em>"Our bank details will never change by email. If you receive a message saying they have, call us on a number you already know before paying."</em></li>
  <li>If your details really do change, tell clients by phone as well as in writing, and expect them to check.</li>
  <li>Send invoices as PDFs from your usual email address, and do not let them circulate as editable documents.</li>
  <li>For a new client or a large first payment, suggest a small test payment, as the UK's Take Five campaign advises payers to do.</li>
</ul>
<h2>Free template</h2>
<p>The free <a href="${rel}templates/invoice.html">invoice template</a> has a bank details box and adds the fraud warning line for you, with the invoice number as the reference. Print it to PDF from the app before you send it. If a payment is late, the <a href="${rel}templates/payment-reminder-letter.html">payment reminder letter</a> is the next step.</p>
<p class="small muted">General information. Check with your bank for the exact details it needs for incoming payments.</p>` },
];

// Guides grouped by topic, for the guides index and the related-guides block at the foot of each guide.
export const GUIDE_TOPICS = [
  ['Automating Word templates', ['automate-word-templates', 'conditional-clauses-in-word', 'repeating-lists-and-tables-in-word', 'mail-merge-vs-document-automation', 'client-intake-without-a-portal', 'confidentiality-checklist-document-software']],
  ['NDAs and restrictive covenants', ['what-to-include-in-an-nda', 'mutual-vs-one-way-nda', 'how-long-should-an-nda-last', 'nda-vs-confidentiality-agreement', 'non-compete-vs-non-solicitation', 'are-non-competes-enforceable']],
  ['Hiring and HR letters', ['how-to-write-an-offer-letter', 'how-to-write-an-employee-warning-letter', 'how-to-write-a-termination-letter', 'how-to-write-a-two-weeks-notice-letter', 'how-to-write-a-job-description', 'what-to-include-in-a-severance-agreement', 'how-to-write-a-performance-improvement-plan', 'how-to-write-a-remote-work-agreement']],
  ['Freelancing and getting paid', ['how-to-write-a-freelance-contract', 'what-to-include-in-a-statement-of-work', 'quote-vs-estimate-vs-invoice', 'how-to-write-an-invoice', 'what-is-a-kill-fee', 'what-to-do-when-a-client-wont-pay', 'how-to-write-a-payment-demand-letter', 'what-is-a-change-order', 'what-is-a-credit-note', 'what-to-include-on-a-vat-invoice', 'gst-hst-invoice-requirements-canada', 'tax-invoice-requirements-australia', 'what-bank-details-to-put-on-an-invoice']],
  ['Landlords and tenants', ['what-to-include-in-a-lease-agreement', 'what-to-include-in-a-roommate-agreement', 'how-to-write-a-rent-increase-letter', 'how-to-write-a-notice-to-vacate', 'how-to-return-a-security-deposit', 'what-to-include-in-a-room-rental-agreement', 'how-to-set-up-a-rent-payment-plan']],
  ['Business deals, money and releases', ['is-an-mou-legally-binding', 'what-to-include-in-a-partnership-agreement', 'how-to-write-a-bill-of-sale', 'how-to-lend-money-to-family', 'how-to-write-a-gift-letter-for-a-mortgage', 'are-liability-waivers-enforceable', 'what-is-a-hold-harmless-agreement', 'do-i-need-a-model-release', 'how-to-terminate-a-contract', 'how-does-consignment-work']],
];
{
  const listed = GUIDE_TOPICS.flatMap(([, slugs]) => slugs);
  for (const g of GUIDES) if (listed.filter((x) => x === g.slug).length !== 1) throw new Error(`GUIDE_TOPICS: ${g.slug} must be listed exactly once`);
  for (const x of listed) if (!GUIDES.some((g) => g.slug === x)) throw new Error(`GUIDE_TOPICS: no guide ${x}`);
}
const GUIDE_BY = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));
const topicOf = (slug) => GUIDE_TOPICS.find(([, slugs]) => slugs.includes(slug));
const published = (g) => g.published || '2026-09-26';
const topicId = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const longDate = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const pages = [
  ...AUD.map((a) => ({
    path: `for/${a.slug}.html`, title: a.title, description: a.description || a.intro.slice(0, 290), extraHead: faqLd(a.faq),
    body: (rel) => `<section class="hero"><div class="wrap" style="display:block;max-width:52rem">
  <p class="eyebrow">For ${esc(lowerFirst(a.name))}</p>
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
  { path: 'guides/', title: 'Invoice, payment and business document guides', description: 'Practical guides to invoices, getting paid, contracts, HR letters and landlord forms. Worked explanations linked to free editable Word templates.',
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem"><h1>Invoice, payment and business document guides</h1><p class="lead">Plain-English answers to the questions people ask before they use a template, each linked to a free Word template you can fill in online.</p>
  <!--nav--><p><strong>Start with billing:</strong> <a href="${rel}guides/how-to-write-an-invoice.html">how to write an invoice</a>, <a href="${rel}invoice-templates/deposit-invoice.html">request a deposit</a>, <a href="${rel}invoice-templates/hourly-invoice.html">bill hours</a>, or <a href="${rel}invoice-templates/final-invoice.html">show the final balance</a>.</p><!--/nav-->
  <nav class="small" aria-label="Guide topics" style="margin-top:1.25rem">${GUIDE_TOPICS.map(([t]) => `<a href="#${topicId(t)}">${esc(t)}</a>`).join(' · ')}</nav>
${GUIDE_TOPICS.map(([t, slugs]) => `  <h2 id="${topicId(t)}" style="margin-top:2.5rem">${esc(t)}</h2>
  <ul class="guide-list">${slugs.map((x) => GUIDE_BY[x]).map((g) => `<li><a href="${rel}guides/${g.slug}.html">${esc(g.title)}</a><div class="small muted">${esc(g.description)}</div></li>`).join('')}</ul>`).join('\n')}
</div></section>` },
  ...GUIDES.map((g) => ({
    path: `guides/${g.slug}.html`, title: g.title, description: g.description, feed: true, published: published(g),
    extraHead: `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, datePublished: published(g), dateModified: LASTMOD, image: `${SITE}assets/og.png`, mainEntityOfPage: `${SITE}guides/${g.slug}.html`, ...(g.sources ? { citation: g.sources.map(([, u]) => u) } : {}), author: { '@type': 'Organization', name: 'Clausery', url: SITE }, publisher: { '@type': 'Organization', name: 'Clausery', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}assets/icon-512.png` } } })}</script>` + crumbsLd([['Home', ''], ['Guides', 'guides/'], [g.title, `guides/${g.slug}.html`]]),
    body: (rel) => {
      const [topic, slugs] = topicOf(g.slug);
      return `<section class="section"><div class="wrap prose"><nav class="small muted" aria-label="Breadcrumb"><a href="${rel}">Home</a> › <a href="${rel}guides/">Guides</a></nav><h1 style="margin-top:1rem">${esc(g.title)}</h1>
<p class="small muted guide-meta">Published <time datetime="${published(g)}">${longDate(published(g))}</time><!--upd--> · Updated <time datetime="${LASTMOD}">${LASTMOD_LONG}</time><!--/upd--> · <a href="${rel}guides/#${topicId(topic)}">${esc(topic)}</a></p>${g.body(rel)}${g.sources ? `
<h2>Sources</h2>
<ul class="sources">${g.sources.map(([label, url]) => `<li><a href="${esc(url)}" rel="noopener">${esc(label)}</a></li>`).join('')}</ul>` : ''}
<!--nav--><h2>More on ${esc(lowerFirst(topic))}</h2>
<ul>${slugs.filter((x) => x !== g.slug).map((x) => `<li><a href="${rel}guides/${x}.html">${esc(GUIDE_BY[x].title)}</a></li>`).join('')}</ul>
<h2>All guides</h2>
<div class="cat-lists">${GUIDE_TOPICS.filter(([t]) => t !== topic).map(([t, s]) => `<div><h3>${esc(t)}</h3><ul class="link-list">${s.map((x) => `<li><a href="${rel}guides/${x}.html">${esc(GUIDE_BY[x].title)}</a></li>`).join('')}</ul></div>`).join('')}</div><!--/nav--></div></section>`;
    },
  })),
];
