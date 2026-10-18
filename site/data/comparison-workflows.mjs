// Product-specific evaluation tasks, not a claim that vendor plans or prices were checked today. Each scenario
// tests the real boundary between local Word assembly and the workflow a buyer might otherwise lose.
export const COMPARISON_WORKFLOWS = {
  'gavel-alternative': {
    heading: 'Decide whether you are replacing drafting or a hosted intake workflow',
    body: (rel) => `
<p>For a firm comparing Gavel with a local drafting tool, the first question is who collects the answers. A lawyer completing an engagement letter on a laptop is a different job from inviting a client into a hosted interview and routing the result to colleagues. Clausery addresses the first directly. Its optional client intake feature is a downloadable HTML form, not a continuously available client portal.</p>
<p>Try a small engagement containing a retainer and a list of lawyers. Use fictional details, produce a version with the retainer and one without, and compare the actual Word output. Then ask how the answers will reach the lawyer. If a client needs a web account, live status updates or an automated handoff, do not count a file attachment as an equivalent replacement.</p>
<ul>
  <li>Map each handoff: who sends the questionnaire, receives the answers, checks them and files the finished document?</li>
  <li>Check whether security policy permits an unencrypted answers file to travel by email, or requires an approved transfer channel.</li>
  <li>Identify any matter creation, notifications or payment steps that would still need another system.</li>
</ul>
<p>The <a href="${rel}docs/intake.html">client intake instructions</a> show the full file-based round trip, including what is and is not inside the form. Use the <a href="${rel}templates/engagement-letter.html">engagement letter template</a> for a drafting test. If hosted intake is central to the service your firm offers, keeping that workflow and using Clausery for a limited set of local documents may be safer than an all-at-once switch.</p>`,
    faq: [
      ['Can a client fill in a Clausery questionnaire without a portal?', 'Yes, with Pro client intake. You send a self-contained HTML form; the client saves an answers JSON file and returns it through an agreed channel. You import it into a draft. There is no hosted inbox, client login or automatic return of answers.'],
      ['Will a Gavel workflow import directly into Clausery?', 'There is no Gavel workflow importer. Start from a Word document you are entitled to use, add Clausery tags and recreate the relevant conditions. Test each path and keep any external workflow steps separately.'],
    ],
  },
  'clio-draft-alternative': {
    heading: 'Separate matter-data reuse from the document itself',
    body: (rel) => `
<p>If your practice already uses Clio, evaluate the value of its matter data before comparing template editors. Entering a client address once and reusing it across a matter is not the same as entering an address into a single Word questionnaire. Clausery has no connection to Clio Manage and does not automatically fetch contacts, matter references or filing information.</p>
<p>Take an authorised Word version of one routine letter. List every detail that currently comes from your practice-management system, including addresses, responsible lawyers and matter numbers. Decide who would enter or transfer each value in a local process, and how changes would be checked. Do not assume similar-looking field names create a live link between the systems.</p>
<ol>
  <li>Build the letter in Clausery using fictional matter details and retain the original letter for comparison.</li>
  <li>Change the client address and regenerate. Check the body, headers, signature block and any repeated references.</li>
  <li>Record where the final Word file will be stored and how colleagues will know which version is approved.</li>
</ol>
<p>For staff using the same wording, <a href="${rel}docs/teams.html">template packs</a> distribute the questionnaire and Word file; they do not synchronise client records. For facts handed from one person to another, use an answers export with appropriate confidentiality controls. Keep official court forms and filing requirements outside this test unless a qualified reviewer has confirmed the specific document. A local <a href="${rel}templates/engagement-letter.html">engagement letter</a> can be a useful independent drafting aid without replacing a firm's matter-management workflow.</p>`,
    faq: [
      ['Does Clausery pull client or matter details from Clio Manage?', 'No. There is no Clio integration or automatic matter-data synchronisation. Enter the answers locally or use supported answers files and spreadsheets with a deliberate review process.'],
      ['Does Clausery replace a court-form library?', 'No. The library contains general Word templates, not an official jurisdiction-specific court-form service. Use the required official form or a suitable legal platform when a filing must follow a prescribed format.'],
    ],
  },
  'hotdocs-alternative': {
    heading: 'Test the difficult branches before migrating a document set',
    body: (rel) => `
<p>A large HotDocs deployment can embody years of drafting decisions, not just a folder of Word documents. Before replacing any part of it, inventory the component logic, shared variables, interview dependencies and documents produced together. Clausery does not import a HotDocs component library or reproduce an enterprise assembly workflow automatically.</p>
<p>Select one self-contained document rather than the most interconnected set. Create a small acceptance matrix: one party and several parties; an optional guarantee on and off; a missing amount; a date at a month boundary; and an empty repeating list. Keep an approved expected result for each case. A successful ordinary example is not evidence that the exceptions work.</p>
<ul>
  <li>Translate a condition into the documented expression language, then check its true, false and unanswered states.</li>
  <li>Inspect numbering and table rows when a section disappears or a list grows. Compare the downloaded Word file, not only the browser preview.</li>
  <li>Assign ownership for template updates, regression checks and distribution of the approved version.</li>
</ul>
<p>The <a href="${rel}docs/logic.html">logic reference</a> defines the operators and functions available in Clausery, while the <a href="${rel}guides/repeating-lists-and-tables-in-word.html">repeating-table guide</a> covers the row structure. Reject a migration if a critical rule has no suitable representation or the organisation depends on central administration that is not being replaced. Local assembly may fit a smaller subset of routine forms, but it should not be presented as a drop-in conversion of a complex enterprise installation.</p>`,
    faq: [
      ['Can Clausery open a HotDocs component library?', 'No. Use an authorised original Word document and rebuild the questions and logic with Clausery tags and expressions. A component library and its integration code do not convert automatically.'],
      ['How should we validate a converted template?', 'Compare downloaded Word outputs with approved examples for ordinary and exceptional inputs. Include optional clauses, repeating groups, missing values, calculations and dates. Keep a reviewer responsible for the resulting legal wording.'],
    ],
  },
  'docassemble-alternative': {
    heading: 'Choose between a maintained web interview and local Word assembly',
    body: (rel) => `
<p>docassemble and Clausery solve different deployment problems. A public legal-help interview may need a website, custom code and a maintained service that many people can use. A staff member generating a familiar Word letter may need none of that. Decide which outcome you are buying before treating the absence of a server as a universal advantage.</p>
<p>Write down any Python calculations, external data lookups, uploaded evidence and multi-step processes your interview depends on. Clausery does not execute Python, call your APIs or import YAML interviews. Its expression evaluator operates on the answers in the browser, and its output starts from a tagged Word template. Missing integrations have to remain elsewhere; renaming questions does not replace them.</p>
<ol>
  <li>Choose a document whose questions can be answered from facts already available to the drafter.</li>
  <li>Make the variables explicit in Word, build the questionnaire and test the generated document without a connection.</li>
  <li>Compare the operational responsibility: distributing a template pack is different from maintaining a public server and its interview code.</li>
</ol>
<p>Use <a href="${rel}docs/templates.html">the Word tag reference</a> to assess the document side and <a href="${rel}docs/self-hosting.html">the static self-hosting instructions</a> to assess deployment. Self-hosting Clausery still does not add server-side interviews or a shared case database. If an existing docassemble service reaches the public and performs essential custom logic, keep it unless the complete service has a replacement. For a small internal drafting task, local Word assembly can be a simpler separate tool.</p>`,
    faq: [
      ['Can I import docassemble YAML or run Python in Clausery?', 'No. Clausery uses Word tags and a restricted expression language, not YAML interviews or Python execution. Rebuild only the portions that fit that model and test the resulting documents.'],
      ['Does self-hosting Clausery create a shared interview server?', 'No. A static host serves the app files. Templates and answers still live in each user’s browser; hosting the files does not create a central database or public case-management service.'],
    ],
  },
  'lawdepot-alternative': {
    heading: 'Check jurisdictional coverage before comparing download costs',
    body: (rel) => `
<p>A free editable file and a document selected for a particular jurisdiction are different benefits. If you are evaluating LawDepot for a lease, first list the disclosures, deposit rules and tenancy terms that apply to the property. Clausery's residential lease is a general sample. It does not become state-specific because you put a state name in an address field.</p>
<p>Compare the scope of the actual documents, not just the download button. Is the form intended for the correct transaction and location? Who is responsible for checking mandatory language? Does the final version include all schedules and disclosures? A lower software cost does not compensate for using an unsuitable legal document.</p>
<ul>
  <li>Choose one transaction and identify whether a prescribed form or local professional review is required.</li>
  <li>Check the vendor's current terms for available formats, charges, renewal conditions and the right to reuse the wording.</li>
  <li>If you have an authorised Word file, retain its approved legal text while replacing only the changing facts with tags.</li>
</ul>
<p>The <a href="${rel}guides/what-to-include-in-a-lease-agreement.html">residential lease checklist</a> explains the questions to resolve before using the <a href="${rel}templates/residential-lease-agreement.html">general lease template</a>. For a document outside the library, do not force a roughly similar template to do the job. Keep the appropriate jurisdiction-specific document or obtain advice, and use Clausery only for a drafting process that has been approved for your situation.</p>`,
    faq: [
      ['Are Clausery templates tailored automatically to my state?', 'No. They are general samples that you must adapt and review for the transaction and jurisdiction. Entering a state or country does not add every required disclosure or make the wording locally compliant.'],
      ['Can I automate a Word document I downloaded elsewhere?', 'Yes, if you are entitled to use and adapt it. Add tags to an authorised .docx copy and review the questionnaire and output. Clausery does not bypass another provider’s download charges or licence terms.'],
    ],
  },
  'rocket-lawyer-alternative': {
    heading: 'Decide whether you need drafting software or professional advice',
    body: (rel) => `
<p>When considering a Rocket Lawyer membership, separate access to legal help from the task of producing a file. Clausery is software, not a law firm. Its free templates and questionnaires do not include an attorney reviewing your terms, advising on a dispute or accepting responsibility for a document's suitability.</p>
<p>For a straightforward recurring letter, a reviewed Word master may be enough. For a settlement, a disputed termination or a transaction whose consequences you do not understand, obtaining advice is a separate decision. Do not treat a free download as a substitute for a legal service you actually need.</p>
<ol>
  <li>List what you used during a typical month: drafting, legal questions, signing, storage and any business services.</li>
  <li>Check which of those services your proposed replacement really supplies, and confirm the provider's current membership and cancellation terms directly.</li>
  <li>Test a non-sensitive document in Clausery, then identify who will review, sign and retain the finished version.</li>
</ol>
<p>The <a href="${rel}templates/service-agreement.html">service agreement template</a> can illustrate the drafting process. The <a href="${rel}clauses/limitation-of-liability-clause.html">liability-clause explanation</a> also shows why selecting a clause involves judgment rather than simply filling every blank. Keep existing signed records and any signature evidence in their original storage system. Clausery outputs editable Word files and can print to PDF, but it does not transfer a legal-service relationship or recreate an external signature audit trail.</p>`,
    faq: [
      ['Does Clausery include attorney consultations or legal review?', 'No. It supplies drafting software and general templates. A lawyer’s advice, local review and any legal-service relationship must be arranged separately.'],
      ['Will moving a document preserve its electronic signature evidence?', 'Not as a new Clausery record. Keep the original signed document and the signing provider’s audit evidence. An editable Word copy for future drafting is not a replacement for that signed record.'],
    ],
  },
  'eforms-alternative': {
    heading: 'Compare a blank form with a reusable questionnaire',
    body: (rel) => `
<p>The useful distinction in an eForms comparison is often the starting file. A blank form can be exactly what you need if you intend to type into it once or complete a prescribed layout. A reusable questionnaire solves a different problem: the same names and dates appear in several places, optional paragraphs must disappear, or a table needs a varying number of rows.</p>
<p>Take a form you are allowed to adapt and inspect its format. Clausery accepts Word .docx templates; it is not a PDF form-field filler, OCR service or automatic PDF-to-Word converter. A scanned signature page or fixed government PDF should not be recreated casually just to fit a different app.</p>
<ul>
  <li>Confirm the correct transaction and jurisdiction before editing any legal wording.</li>
  <li>If a suitable Word version is available, tag the changing details and preserve the required layout and instructions.</li>
  <li>Test an optional section both ways and compare the completed file with the blank form and any official requirements.</li>
</ul>
<p>For a general example, the <a href="${rel}templates/bill-of-sale.html">bill of sale template</a> demonstrates conditional details without claiming to replace a motor-vehicle authority's required form. The <a href="${rel}free-tools/template-checker.html">template tag checker</a> helps find unmatched Word tags before you build the questionnaire. If a blank PDF already meets the need, there may be no reason to change tools. Use automation when repeat drafting and conditional wording are the problem, not merely because another download format exists.</p>`,
    faq: [
      ['Can Clausery fill an existing PDF form?', 'No. It assembles Word .docx templates. You can print the resulting document to PDF, but this is different from importing a fixed PDF and completing its existing form fields.'],
      ['Does a general bill of sale replace an official vehicle form?', 'Not necessarily. A registering authority may require its own form, title transfer, disclosures or other steps. Check the applicable requirements rather than assuming a general template is sufficient.'],
    ],
  },
  'honeybook-alternative': {
    heading: 'Keep the booking-to-payment chain intact',
    body: (rel) => `
<p>A photographer comparing HoneyBook with Clausery should map an entire booking, not just a contract. An inquiry becomes a date reservation, agreed coverage, signed terms, a deposit and a final balance. Preparing the contract locally covers only part of that chain. Clausery does not collect payments, reserve dates or maintain a hosted client portal.</p>
<p>Use a fictional booking to test the document work. Start with the photography contract, switch travel and cancellation provisions on or off as appropriate, and check the downloaded Word file. Then prepare a quote and a deposit invoice. Those billing documents can show the agreed figures, but they do not create a payment link or confirm that the client has paid.</p>
<ul>
  <li>Choose where signatures and their evidence will be collected and retained.</li>
  <li>Record who sends the deposit request, checks the bank or payment provider and marks the booking confirmed.</li>
  <li>Keep scheduling, reminders and final-balance tracking in a system that actually provides them.</li>
</ul>
<p>The <a href="${rel}templates/photography-contract.html">photography contract</a>, <a href="${rel}guides/how-to-write-a-photography-contract.html">shoot and image-rights checklist</a> and <a href="${rel}invoice-templates/deposit-invoice.html">deposit invoice workflow</a> let you test this narrower approach. Existing clients' records and signed contracts should remain accessible before any subscription is changed. If online booking and payment automation are the features you rely on, free Word drafting alone is not a like-for-like replacement. It may instead be a useful supplement for unusual contracts that need your own formatting.</p>`,
    faq: [
      ['Can Clausery make invoices as well as contracts?', 'Yes. Free library templates include invoices, quotes, purchase orders and payment receipts, with calculated totals in the relevant templates. They produce editable Word documents; Clausery does not collect payments or maintain a hosted billing account.'],
      ['Does sending a deposit invoice reserve a booking or collect money?', 'No. It creates a document requesting the agreed deposit. You still need a booking process, an external payment method and a record of the payment actually received.'],
    ],
  },
  'bonsai-alternative': {
    heading: 'Follow hours from the time record to the final invoice',
    body: (rel) => `
<p>For a consultant evaluating Bonsai, the contract may be only one part of a recurring job. Hours are recorded, approved, billed and eventually paid. Clausery can prepare a consulting agreement and a Word invoice, but it does not run a timer, synchronise a project timesheet or turn recorded hours into invoices automatically.</p>
<p>Test a real billing structure with fictional details. Suppose an agreed engagement has a day rate for workshops and an hourly rate for follow-up. Keep the time record in your chosen system, confirm which entries were approved, and then enter the quantities and rates into the invoice. Check the result against the original record rather than assuming an imported total is correct.</p>
<ol>
  <li>Write the scope, fee basis and approval contact into the engagement terms.</li>
  <li>Produce a sample invoice showing descriptions, quantities, rates, tax and the due date.</li>
  <li>Identify how corrections, part payments and unbilled work will be tracked outside the document generator.</li>
</ol>
<p>The <a href="${rel}templates/consulting-agreement.html">consulting agreement template</a> covers the engagement, and the <a href="${rel}invoice-templates/hourly-invoice.html">hourly invoice workflow</a> shows how hours become line items. A small practice with an existing time-recording process may only need these documents. A team that relies on connected project records, approvals or payment reporting needs a replacement for those functions as well. Free library documents do not mean every advanced Clausery feature is free: Pro remains an optional per-user plan.</p>`,
    faq: [
      ['Does Clausery include time tracking or a project-management workspace?', 'No. Record and approve hours elsewhere, then enter the agreed quantities and rates into a Word invoice. There is no automatic timesheet-to-invoice synchronisation.'],
      ['Is Clausery free for an entire team?', 'Every user can use the free library templates and the Free plan. Advanced features such as unlimited own templates, intake and encryption require Pro or another suitable paid plan. Pro pricing is per user, not an unlimited-team licence.'],
    ],
  },
  'dubsado-alternative': {
    heading: 'Inventory every trigger before replacing an automated workflow',
    body: (rel) => `
<p>For a service business considering Dubsado, make a list of the actions that happen without someone remembering to do them. A completed inquiry might trigger a response, appointment link, contract or follow-up. A Word generator is not a replacement for that chain just because it produces one of the documents in it.</p>
<p>Choose one existing client process and draw each step with its owner. Mark whether the step is automatic, manual or dependent on a payment or signature. Clausery does not watch an inbox, schedule appointments, send reminders or detect that a client completed an external action. Every such dependency needs a deliberate new home.</p>
<ul>
  <li>Separate approved contract wording from the workflow that chooses when to send it.</li>
  <li>Use a fictional project to check optional terms and the handoff to your existing signing service.</li>
  <li>If using client intake, test downloading and returning the answers file; do not treat it as a hosted lead form or automatic CRM update.</li>
</ul>
<p>The <a href="${rel}guides/client-intake-without-a-portal.html">file-based intake guide</a> explains that distinction. A <a href="${rel}templates/service-agreement.html">service agreement</a> provides a small drafting trial without rebuilding the whole business process. Keep existing scheduling and reminder systems until the replacement process is proven. If you need only occasional editable contracts, local drafting can be enough; if most value comes from the triggers around those contracts, assess the complete workflow before changing a subscription.</p>`,
    faq: [
      ['Does a Clausery intake form automatically update a CRM?', 'No. The client saves an answers file and sends it back. You import it into a draft. Clausery has no hosted submissions inbox, webhooks or automatic CRM synchronisation.'],
      ['Will Clausery send reminders when a contract is unsigned?', 'No. Signature collection, status tracking and reminders belong in your external signing or workflow system. Clausery prepares the document but does not monitor what happens after it is sent.'],
    ],
  },
  'pandadoc-alternative': {
    heading: 'Separate Word document quality from sales approvals and signatures',
    body: (rel) => `
<p>For a sales team evaluating PandaDoc, define where the document ends and the deal workflow begins. A quote may need approved prices, a legal review, a customer signature and a CRM status update. Clausery can assemble an editable Word quote or contract, but it does not route approval requests, track document opens or update a sales pipeline.</p>
<p>Take a quotation with two line items, an optional service and a tax calculation. Generate the ordinary version and the version without that service. Inspect totals, page breaks, headings and the final file in Word. This tests document assembly. It says nothing about whether a customer has viewed, accepted or signed the offer.</p>
<ol>
  <li>Name the person who approves prices and non-standard terms before a document is sent.</li>
  <li>Choose an external signing route if an electronic signature and audit evidence are required.</li>
  <li>Record where the signed version and approval record are filed and who updates the deal status.</li>
</ol>
<p>Use the <a href="${rel}templates/quote.html">free Word quote template</a> for the numbers and the <a href="${rel}docs/questionnaire.html">questionnaire designer instructions</a> for the questions. Do not describe this as a replacement for configure-price-quote software or an integrated approval service. It can suit a business whose approved workflow already handles those steps and needs editable files, while a team relying on connected sales automation should compare the full service rather than only the per-document drafting cost.</p>`,
    faq: [
      ['Does Clausery include electronic signatures or document-open tracking?', 'No. Send the Word file or a printed PDF through an appropriate external signing service. Keep the signed document and audit evidence there; Clausery does not track views or signing status.'],
      ['Can Clausery calculate a quote without a paid sales platform?', 'The free quote template calculates line items and tax locally and produces editable Word output. That is not a CRM connection, product catalogue, approval workflow or automatic quote-to-payment system.'],
    ],
  },
};
