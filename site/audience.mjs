// Pages for each buyer, and how-to guides that answer the searches those buyers make.
import { esc, faqLd, faqHtml } from '../tools/partials.mjs';

const AUD = [
  { slug: 'law-firms', name: 'Law firms', title: 'Document automation for small law firms, without uploading client files',
    intro: 'Engagement letters, NDAs, demand letters, wills and leases: most firms draft the same documents every week from Word files that already exist. Clausery turns those files into questionnaires and assembles the finished document on the lawyer\'s own computer.',
    points: [['Confidentiality you can explain in one sentence', 'Client information is typed into the browser and the document is built there. It is never sent to Clausery or anyone else, so there is no vendor holding client data.'], ['Keep your precedents', 'Your Word templates keep their styles, numbering and letterhead. Add tags where details change; nothing is re-created in a new editor.'], ['Clients answer without a portal', 'Send a questionnaire as a single file. The client fills it in offline and returns an answers file you import into the draft.'], ['Encrypted on the device', 'Turn on a passphrase and everything stored in the browser is encrypted, with automatic locking when you step away.']],
    templates: ['engagement-letter', 'mutual-nda', 'one-way-nda', 'cease-and-desist-letter', 'promissory-note', 'payment-demand-letter'],
    related: [['compare/gavel-alternative.html', 'Clausery compared with Gavel'], ['compare/clio-draft-alternative.html', 'Clausery compared with Clio Draft'], ['compare/hotdocs-alternative.html', 'Clausery compared with HotDocs'], ['guides/confidentiality-checklist-document-software.html', 'Confidentiality checklist for document software'], ['guides/client-intake-without-a-portal.html', 'Client intake without a portal'], ['clauses/', 'Contract clauses explained']],
    faq: [['Is Clausery suitable for confidential client matters?', 'Documents are assembled in the browser on the lawyer\'s own computer, and nothing you type or generate is sent to Clausery. On the Pro plan you can also encrypt everything stored in the browser with a passphrase. Check the set-up against your own IT policies and professional rules.'],
      ['Can we use our existing Word precedents?', 'Yes. Add {tags} where details change, wrap optional clauses in a section, and upload the file. Styles, numbering, headers and letterhead are kept exactly.'],
      ['How is it different from Gavel, Clio Draft or HotDocs?', 'Those products run on a vendor\'s servers or need installing, and offer more, such as hosted client portals and practice management integrations. Clausery does the core job, templates into questionnaires into finished documents, in the browser with no server involved. The comparison pages set out the trade-offs honestly.'],
      ['What does it cost?', 'Free for up to three templates with unlimited documents. Pro, with unlimited templates, calculations, encryption and client intake forms, is $19 per user per month.']] },
  { slug: 'hr-teams', name: 'HR teams', title: 'Generate offer letters and HR documents in minutes, privately',
    intro: 'Offer letters, verification letters and contractor agreements contain salaries, addresses and personal data. Clausery produces them from your approved templates without putting that data in another cloud service.',
    points: [['Approved wording, every time', 'HR owns the template; managers answer questions. Optional clauses such as equity, bonus or relocation only appear when they apply.'], ['Personal data stays on the device', 'Salary and personal details are never uploaded, which keeps your records of processing and vendor reviews simple.'], ['Share templates across the team', 'Export a template pack to your shared drive; colleagues import it and draft from the same approved version.'], ['No per-document fees', 'Generate as many letters as you need on every plan.']],
    templates: ['offer-letter', 'internship-offer-letter', 'salary-increase-letter', 'employment-verification-letter', 'reference-letter', 'employment-termination-letter', 'independent-contractor-agreement'],
    related: [['guides/how-to-write-an-offer-letter.html', 'How to write a job offer letter'], ['clauses/at-will-employment-clause.html', 'At-will employment clause'], ['clauses/non-compete-clause.html', 'Non-compete clause'], ['clauses/confidentiality-clause.html', 'Confidentiality clause']],
    faq: [['Does employee data leave our computers?', 'No. Names, salaries and addresses are typed into the browser and the letter is generated there. Nothing is sent to Clausery or any other service.'],
      ['Can managers use it without training?', 'Yes. HR sets up the template once; managers answer plain-language questions and download the finished letter. Optional wording only appears when it applies.'],
      ['How do we keep records of the letters we send?', 'Every draft is saved in the browser and can be backed up to a file. Keep the final signed letters in your HR system as you do today.'],
      ['What does it cost?', 'Free for up to three templates with unlimited letters. Pro, with unlimited templates, calculations, encryption and template packs, is $19 per user per month.']] },
  { slug: 'consultants', name: 'Consultants and agencies', title: 'Proposals, SOWs and contractor agreements without another subscription',
    intro: 'Statements of work, contractor agreements and client letters follow the same pattern every time. Clausery turns your Word versions into a two-minute questionnaire and keeps client details on your laptop.',
    points: [['Repeat deliverables and line items', 'List as many deliverables, milestones or fee lines as you need; the document repeats the paragraph or table row for each one.'], ['Totals calculated for you', 'Add computed fields such as a sum of line items, a date 30 days after signing, or an amount in words.'], ['Works on the road', 'Once loaded, Clausery works offline, including on a train or a client site without Wi-Fi.'], ['Your branding, untouched', 'Your template keeps its logo, fonts and layout.']],
    templates: ['consulting-agreement', 'statement-of-work', 'service-agreement', 'retainer-agreement', 'subcontractor-agreement', 'independent-contractor-agreement', 'payment-reminder-letter', 'payment-demand-letter'],
    related: [['guides/what-to-include-in-a-statement-of-work.html', 'What to include in a statement of work'], ['guides/how-to-write-a-payment-demand-letter.html', 'How to write a demand letter for unpaid invoices'], ['clauses/payment-terms-clause.html', 'Payment terms clause'], ['clauses/intellectual-property-clause.html', 'Intellectual property clause'], ['free-tools/deadline-calculator.html', 'Contract deadline calculator'], ['guides/what-to-do-when-a-client-wont-pay.html', 'What to do when a client won\'t pay'], ['compare/pandadoc-alternative.html', 'Clausery compared with PandaDoc']],
    faq: [['Can I add a table of deliverables or fees?', 'Yes. Put the repeat tags in a table row and the row repeats for each deliverable or line item, keeping your borders and shading.'],
      ['Can it calculate totals and dates?', 'Yes, on the Pro plan: computed fields can add up line items, work out a date 30 days after signing, or write an amount in words.'],
      ['Does it work without an internet connection?', 'Yes. Once the app has loaded, it works offline, so you can draft on a train or at a client site.'],
      ['What does it cost?', 'Free for up to three templates with unlimited documents. Pro is $19 per user per month.']] },
  { slug: 'freelancers', name: 'Freelancers', title: 'Free freelance contract templates you can fill in online',
    intro: 'Designers, photographers, videographers, virtual assistants, planners, trainers, tutors and writers all need a signed contract before work starts. Clausery turns a free Word contract into a two-minute questionnaire, so each client gets the right terms without you editing the document by hand.',
    points: [['Contracts written for your trade', 'Page lists for web projects, concepts and file formats for designers, retainers and usage rights for photographers, platforms and posting schedules for social media, word counts and bylines for writers.'], ['Stop scope creep in writing', 'Revision rounds, content deadlines, hourly rates for extra work and kill fees are built in, so the conversation is already settled when a client asks for "one more change".'], ['Client details stay on your laptop', 'Names, fees and addresses are typed into your browser and the contract is built there. Nothing is uploaded, and it works offline.'], ['Free for your first three templates', 'Use up to three contracts free with unlimited documents; Pro removes the limit for $19 a month.']],
    templates: ['web-design-contract', 'graphic-design-contract', 'photography-contract', 'video-production-contract', 'social-media-management-contract', 'freelance-writing-contract', 'virtual-assistant-agreement', 'event-planning-contract', 'personal-training-agreement', 'tutoring-agreement', 'retainer-agreement', 'subcontractor-agreement', 'independent-contractor-agreement', 'payment-reminder-letter', 'payment-demand-letter'],
    related: [['guides/how-to-write-a-freelance-contract.html', 'How to write a freelance contract'], ['guides/what-to-do-when-a-client-wont-pay.html', 'What to do when a client won\'t pay'], ['guides/what-is-a-kill-fee.html', 'What is a kill fee?'], ['free-tools/freelance-rate.html', 'Freelance rate calculator'], ['free-tools/late-payment-interest.html', 'Late payment interest calculator'], ['clauses/intellectual-property-clause.html', 'Who owns the work: intellectual property clause'], ['clauses/payment-terms-clause.html', 'Payment terms clause'], ['clauses/late-payment-interest-clause.html', 'Late payment interest clause'], ['guides/how-to-write-a-payment-demand-letter.html', 'How to write a demand letter for unpaid invoices'], ['free-tools/deadline-calculator.html', 'Contract deadline calculator'], ['compare/honeybook-alternative.html', 'Clausery compared with HoneyBook'], ['compare/bonsai-alternative.html', 'Clausery compared with Bonsai'], ['compare/dubsado-alternative.html', 'Clausery compared with Dubsado']],
    faq: [['Do I need a contract for small freelance jobs?', 'A short written agreement avoids most disputes about scope, revisions, payment and ownership, whatever the size of the job. Email acceptance of a clear contract is often enough, though some documents need a signature.'], ['Can I reuse the same contract for every client?', 'Yes. Answer the questions for each client and download a finished Word contract. Optional terms, such as a deposit, kill fee or maintenance plan, only appear when you switch them on.'], ['Are these contracts legally binding?', 'They are general templates. Whether a contract is enforceable depends on your country or state and how it is agreed, so have one reviewed for your situation, especially for large projects.'], ['Can I add my own clauses?', 'Yes. Download the Word file, edit anything, keep the {tags}, and upload it to Clausery. Your formatting is kept exactly.']] },
];
const NAMES = { 'payment-reminder-letter': 'Payment reminder letter', 'subcontractor-agreement': 'Subcontractor agreement', 'retainer-agreement': 'Retainer agreement', 'video-production-contract': 'Video production contract', 'virtual-assistant-agreement': 'Virtual assistant agreement', 'event-planning-contract': 'Event planning contract', 'personal-training-agreement': 'Personal training agreement', 'tutoring-agreement': 'Tutoring agreement', 'web-design-contract': 'Web design contract', 'graphic-design-contract': 'Graphic design contract', 'photography-contract': 'Photography contract', 'social-media-management-contract': 'Social media management contract', 'freelance-writing-contract': 'Freelance writing contract',  'one-way-nda': 'One-way NDA', 'cease-and-desist-letter': 'Cease and desist letter', 'promissory-note': 'Promissory note', 'internship-offer-letter': 'Internship offer letter', 'salary-increase-letter': 'Salary increase letter', 'reference-letter': 'Reference letter', 'employment-termination-letter': 'Termination letter', 'consulting-agreement': 'Consulting agreement', 'service-agreement': 'Service agreement', 'engagement-letter': 'Engagement letter', 'mutual-nda': 'Mutual NDA', 'payment-demand-letter': 'Payment demand letter', 'offer-letter': 'Offer letter', 'employment-verification-letter': 'Employment verification letter', 'independent-contractor-agreement': 'Independent contractor agreement', 'statement-of-work': 'Statement of work' };

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
  <li>Does it show the amount, what it is for, the due date and how to pay?</li>
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
    extraHead: `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, datePublished: '2026-09-26', author: { '@type': 'Organization', name: 'Clausery' } })}</script>`,
    body: (rel) => `<section class="section"><div class="wrap prose"><nav class="small muted" aria-label="Breadcrumb"><a href="${rel}">Home</a> › <a href="${rel}guides/">Guides</a></nav><h1 style="margin-top:1rem">${esc(g.title)}</h1>${g.body(rel)}
<h2>More guides</h2>
<ul>${GUIDES.filter((x) => x.slug !== g.slug).map((x) => `<li><a href="${rel}guides/${x.slug}.html">${esc(x.title)}</a></li>`).join('')}</ul></div></section>`,
  })),
];
