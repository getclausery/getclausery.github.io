// Comparisons should help someone choose a workflow, not just repeat the same alternative-to-X sales pitch.
// Clausery prices/features come from product configuration. Vendor prices and plan limits are deliberately linked
// to official sites instead of reproducing an unverified or stale third-party pricing snapshot.
import { readFileSync } from 'node:fs';
import { esc, faqLd, faqHtml, collectionLd, longDate } from '../tools/partials.mjs';
import { LIB } from './library.mjs';
import { PRICES, TRIAL_DAYS } from '../app/config.js';
import { PLANS } from '../app/lib/license.js';
import { COMPARISON_WORKFLOWS } from './data/comparison-workflows.mjs';
const DATES = JSON.parse(readFileSync(new URL('./data/page-dates.json', import.meta.url), 'utf8'));
const shortMonth = (iso) => { const d = new Date(iso + 'T00:00:00Z'); return d.toLocaleDateString('en-GB', { month:'short', year:'numeric', timeZone:'UTC' }); };
const cardUpdated = (path) => { const d = DATES[path]; if (!d) return ''; return `<span class="card-updated" title="Last updated ${longDate(d.date)}">Updated ${shortMonth(d.date)}</span>`; };

const OUR_PRICE = `Free library templates, plus ${PLANS.free.maxTemplates} of your own; Pro $${PRICES.pro} per user per month`;
const ROWS = ['Where documents are assembled', 'Account needed', 'Works offline', 'Uses your own Word templates', 'Conditional clauses and repeating lists', 'Calculations', 'Client questionnaires', 'Practice-management connection', 'Pricing and plan checks'];
const CLAUSERY = ['Your browser; document contents are not uploaded', 'No account for drafting', 'Yes, after the app files are loaded', 'Yes', 'Yes', 'Included in billing templates; own-template computed fields need Pro', 'Pro: an HTML form and answers file, not a hosted portal', 'None: deliberate file handoffs', OUR_PRICE];
const FREELANCE_ROWS = ['Where documents are prepared', 'Account needed', 'Works offline', 'Word template library', 'Use your own Word contract', 'Document output', 'E-signature', 'Invoicing and payments', 'Client portal, scheduling and CRM', 'Pricing and plan checks'];
const CLAUSERY_FREELANCE = ['Your browser; document contents are not uploaded', 'No account for drafting', 'Yes, after the app files are loaded', `Yes, ${LIB.length} free Word templates`, 'Yes: add {tags} to an authorised .docx', 'Editable Word (.docx), or print to PDF', 'Use an external signing service or sign on paper', 'Word invoices, quotes and receipts; no payment collection', 'No hosted portal, scheduling or CRM', OUR_PRICE];
const FORMS_ROWS = ['Where documents are prepared', 'Account needed', 'Word download', 'Subscription commitment', 'Use your own Word templates', 'Legal advice', 'E-signature', 'Jurisdiction-specific wording', 'Pricing and plan checks'];
const CLAUSERY_FORMS = ['Your browser; document contents are not uploaded', 'No account for drafting', `All ${LIB.length} library templates are free to download`, 'Free plan has no time limit; paid features are optional', 'Yes: add {tags} to an authorised .docx', 'No: software and general samples, not a law firm', 'Use an external signing service or sign on paper', 'General templates you must adapt and review', OUR_PRICE];

export const COMPETITORS = [
  {
    slug: 'gavel-alternative', name: 'Gavel', group: 'legal', vendorUrl: 'https://www.gavel.io/',
    title: 'Gavel alternative that keeps client data on your computer',
    description: 'Compare Gavel with local Word drafting: hosted intake versus file-based questionnaires, client-data handling, migration checks and a practical trial.',
    bestFor: 'Firms evaluating hosted legal intake and document workflows',
    intro: 'Gavel focuses on legal document automation and client workflows. Clausery offers a narrower alternative: assemble Word documents on your own computer, without uploading the document contents. The important comparison is the whole intake-to-document process.',
    them: ['Hosted platform', 'Check the chosen service', 'Check the chosen deployment', 'Word-based document automation', 'Document-automation features', 'Check supported logic and plan', 'Hosted client-interview workflow', 'Check available integrations'],
    planCheck: 'Confirm the intake, integration and authoring features included in a current Gavel quote.',
    chooseThem: ['A hosted client interview is part of the service your firm delivers', 'You depend on supported matter-management integrations', 'You have approved the provider and deployment for client data'],
    chooseUs: ['The immediate task is a local Word document, not a hosted workflow', 'Client instructions restrict uploading document contents', 'Your firm can manage the remaining handoffs explicitly'],
  },
  {
    slug: 'clio-draft-alternative', name: 'Clio Draft', group: 'legal', vendorUrl: 'https://www.clio.com/',
    title: 'Clio Draft alternative for firms that cannot upload client files',
    description: 'A Clio Draft alternative for independent Word drafting. Compare matter-data reuse, manual handoffs, court-form limits and local document assembly.',
    bestFor: 'Firms assessing drafting alongside the Clio ecosystem',
    intro: 'Clio Draft is a document-automation option in the Clio ecosystem. Clausery is independent of practice-management software and assembles Word files locally. Check what you would lose in matter-data reuse before comparing the document editors alone.',
    them: ['Hosted service', 'Check the chosen Clio service', 'Check supported offline behavior', 'Word-template workflows', 'Document-automation features', 'Check supported fields and plan', 'Check client-form features', 'Evaluate the connection to your Clio matter data'],
    planCheck: 'Ask Clio which drafting features, users and related subscriptions the quote covers.',
    chooseThem: ['Reusing matter information from Clio is a central requirement', 'A required form or workflow is covered by your selected service', 'You want drafting administered alongside practice management'],
    chooseUs: ['You need a drafting tool that works independently of Clio', 'Manual entry or controlled file handoffs fit the matter process', 'Keeping document contents on firm devices is the priority'],
  },
  {
    slug: 'hotdocs-alternative', name: 'HotDocs', group: 'legal', vendorUrl: 'https://www.hotdocs.com/',
    title: 'HotDocs alternative: lightweight document automation in the browser',
    description: 'Evaluate a HotDocs alternative with a branch-testing checklist: component migration, repeating tables, calculations and local Word output.',
    bestFor: 'Organisations maintaining complex document-assembly systems',
    intro: 'HotDocs is associated with complex document-assembly deployments and specialist authoring. Clausery is a smaller Word-template tool with no server component. Assess the logic and operational requirements of your document set before treating one as a replacement for the other.',
    them: ['Depends on desktop, server or cloud deployment', 'Deployment and licensing dependent', 'Depends on deployment and authoring setup', 'Document-template authoring', 'Component-based assembly features', 'Check the functions used in your installation', 'Interview and assembly workflow', 'Depends on the installed enterprise system'],
    planCheck: 'Price the actual authoring, deployment, support and migration requirements with the vendor.',
    chooseThem: ['Your documents depend on a large shared component library', 'Central administration and enterprise integrations are essential', 'Specialist authors maintain a tested assembly system'],
    chooseUs: ['A self-contained subset of documents fits the available Word tags', 'Authors prefer to keep approved wording in ordinary Word files', 'You do not need a central assembly service for this task'],
  },
  {
    slug: 'docassemble-alternative', name: 'docassemble', group: 'legal', vendorUrl: 'https://docassemble.org/',
    title: 'docassemble alternative that needs no server',
    description: 'Compare docassemble interviews with local Word assembly: Python and YAML boundaries, hosting responsibilities and a focused migration test.',
    bestFor: 'Developers building and maintaining public web interviews',
    intro: 'docassemble is an open-source guided-interview platform that you host. Clausery is a browser-based Word-template tool with no interview server to maintain. Choose according to whether the job is a public custom service or local document assembly.',
    them: ['Your hosted server', 'Depends on the interview and deployment', 'Server-based interviews need the service', 'Word templates and other supported formats', 'Programmable interviews and document logic', 'Custom Python logic', 'Web interviews', 'Custom code and integrations'],
    planCheck: 'Open-source software; budget separately for hosting, development, security and maintenance.',
    chooseThem: ['The public needs an accessible, maintained web interview', 'Python logic or external data is fundamental to the process', 'Developers are responsible for deployment and ongoing support'],
    chooseUs: ['The drafter already has the facts needed for one document', 'A tagged Word file and local questionnaire cover the requirements', 'You want static hosting rather than an interview server'],
  },
  {
    slug: 'lawdepot-alternative', name: 'LawDepot', group: 'forms', vendorUrl: 'https://www.lawdepot.com/',
    title: 'LawDepot alternative with free Word downloads',
    description: 'Compare LawDepot with free Word templates: jurisdictional coverage, document reuse, download terms and a practical lease-drafting checklist.',
    bestFor: 'Buyers selecting a legal document for their jurisdiction',
    intro: 'LawDepot offers legal-document questionnaires. Clausery supplies general Word templates that you can download or fill in locally for free. Compare the suitability of the document and the provider’s current download terms, not only the advertised starting price.',
    them: ['Provider-hosted questionnaire', 'Check document and download requirements', 'Confirm the format offered for your document', 'Check purchase, trial and renewal terms', 'Evaluate the provider’s supported workflow', 'Check any advice service and its separate terms', 'Confirm signing options for the selected service', 'Check the exact document and jurisdiction'],
    planCheck: 'Confirm download rights, reuse, one-off purchase options and renewal conditions directly.',
    chooseThem: ['Its selected document covers a location or transaction you need', 'The provider’s workflow and document terms fit your requirements', 'The form is outside Clausery’s general template library'],
    chooseUs: ['A reviewed general template is appropriate for the transaction', 'You need an editable Word file and repeated local drafting', 'You are prepared to check mandatory local terms separately'],
  },
  {
    slug: 'rocket-lawyer-alternative', name: 'Rocket Lawyer', group: 'forms', vendorUrl: 'https://www.rocketlawyer.com/',
    title: 'Rocket Lawyer alternative: free templates, no membership',
    description: 'Compare Rocket Lawyer with free local templates. Separate attorney advice, signature evidence and membership services from document generation.',
    bestFor: 'Buyers considering documents alongside legal-help services',
    intro: 'Rocket Lawyer combines document-related tools with legal-service offerings. Clausery does not replace legal advice: it prepares general Word documents locally. Separate the services you actually use before deciding whether free drafting meets the need.',
    them: ['Provider-hosted document workflow', 'Check the selected service', 'Confirm available export formats', 'Check membership and cancellation terms', 'Check upload, reuse and editing options', 'Check the legal-help service and eligibility', 'Confirm signing and record-retention features', 'Check the selected form and applicable location'],
    planCheck: 'Compare the membership services you need, not just the cost of producing a file.',
    chooseThem: ['You want a qualifying legal-help service as well as drafting', 'A selected membership covers services you regularly use', 'You need advice about the transaction rather than only a template'],
    chooseUs: ['Approved wording and local document generation cover the task', 'You arrange any legal review and signing separately', 'You want the editable file without a drafting membership'],
  },
  {
    slug: 'eforms-alternative', name: 'eForms', group: 'forms', vendorUrl: 'https://eforms.com/',
    title: 'eForms alternative: fill in documents without an account',
    description: 'Compare eForms with a reusable Word questionnaire: blank forms, PDF limits, local requirements, conditional wording and a practical test.',
    bestFor: 'People choosing a blank form for a specific transaction',
    intro: 'eForms is a legal-form library and document service. Clausery focuses on turning general Word templates into reusable local questionnaires. First decide whether you need an existing blank or prescribed form, or a document you will assemble repeatedly.',
    them: ['Online forms and downloadable files', 'Check online completion and download options', 'Check formats for the exact form', 'Confirm any purchase, trial and renewal terms', 'Check supported editing and reuse', 'Do not assume a form download includes advice', 'Confirm the selected signing method', 'Check the form’s location and legal requirements'],
    planCheck: 'Check blank downloads separately from online completion, export and subscription charges.',
    chooseThem: ['An available blank form already matches the requirement', 'You need a prescribed layout rather than a new questionnaire', 'Its form and format are suitable for the intended authority'],
    chooseUs: ['Repeat data entry and optional clauses are the actual problem', 'You have a Word template you are authorised to adapt', 'The required document is not a fixed PDF form'],
  },
  {
    slug: 'honeybook-alternative', name: 'HoneyBook', group: 'freelance', vendorUrl: 'https://www.honeybook.com/',
    title: 'HoneyBook alternative when you only need contracts',
    description: 'Compare HoneyBook with local Word drafting: contracts, deposit invoices, signatures and the booking-to-payment steps you would still need.',
    bestFor: 'Client businesses assessing a connected booking and payment flow',
    intro: 'HoneyBook is a client-business platform associated with bookings, contracts and payments. Clausery prepares editable Word contracts and billing documents locally, without providing the hosted booking-to-payment workflow. Compare those boundaries before switching.',
    them: ['Hosted client platform', 'Check the selected service', 'Confirm offline behavior for your process', 'Check the current template library', 'Review the contract editor and export workflow', 'Confirm available formats and retained records', 'Check signing features and evidence', 'Evaluate invoicing, collection and transaction fees', 'Check portal, scheduling and automation features'],
    planCheck: 'Compare the full subscription, payment fees and booking features you actually use.',
    chooseThem: ['Clients need a connected booking, signing and payment experience', 'Scheduling and automated follow-ups are part of each job', 'One hosted client record is operationally important'],
    chooseUs: ['You primarily need editable contracts and Word billing documents', 'Your existing process already handles booking and payments', 'You are willing to manage signing and records separately'],
  },
  {
    slug: 'bonsai-alternative', name: 'Bonsai', group: 'freelance', vendorUrl: 'https://www.hellobonsai.com/',
    title: 'Bonsai alternative: free freelance contracts in Word',
    description: 'Compare Bonsai with free Word contracts and invoices. Follow hours through approval and billing, and check what remains outside local drafting.',
    bestFor: 'Freelancers assessing connected jobs, time records and billing',
    intro: 'Bonsai is business software for freelancers and service teams. Clausery covers a narrower task: prepare contracts and billing documents as editable Word files in your browser. Test how time records, approvals and payments would be handled before changing tools.',
    them: ['Hosted business platform', 'Check the chosen plan', 'Confirm offline behavior for the tasks you use', 'Check templates for the intended service', 'Review supported contract editing', 'Confirm current export options', 'Check signing and record availability', 'Evaluate billing and payment features', 'Check job, time-recording and client features'],
    planCheck: 'Confirm the users, client jobs, time-recording and billing features included in your plan.',
    chooseThem: ['Client records and time tracking need to connect with billing', 'Shared client and approval processes are essential', 'Your selected plan covers the connected workflow you rely on'],
    chooseUs: ['Time and client-job records already have a reliable home', 'Free Word contracts and invoices meet the immediate drafting need', 'You understand that optional Pro features are priced per user'],
  },
  {
    slug: 'dubsado-alternative', name: 'Dubsado', group: 'freelance', vendorUrl: 'https://www.dubsado.com/',
    title: 'Dubsado alternative: contracts without the setup',
    description: 'Compare Dubsado with local Word contracts. Inventory workflow triggers, reminders and client handoffs before replacing an automated process.',
    bestFor: 'Service businesses evaluating automated client workflows',
    intro: 'Dubsado is a client-management and workflow platform. Clausery does not recreate that automation; it turns Word templates into local questionnaires. An occasional contract and an automated client journey are different requirements.',
    them: ['Hosted workflow platform', 'Check the selected plan', 'Confirm offline behavior for your workflow', 'Check templates and form-building options', 'Review contract editing and export', 'Confirm available formats', 'Check signing and status features', 'Evaluate billing and payment handling', 'Check lead forms, scheduling and workflow triggers'],
    planCheck: 'Map the automations you use to the current plan and billing terms before deciding.',
    chooseThem: ['Automatic actions after inquiries, payments or signing are essential', 'The client portal and scheduling are part of your normal service', 'You need a managed workflow, not just the document inside it'],
    chooseUs: ['A short manual handoff is appropriate for the volume of work', 'You want to maintain contract wording in an editable Word master', 'A hosted lead form or CRM is not part of the requirement'],
  },
  {
    slug: 'pandadoc-alternative', name: 'PandaDoc', group: 'freelance', vendorUrl: 'https://www.pandadoc.com/',
    title: 'PandaDoc alternative for Word contract templates',
    description: 'Compare PandaDoc with local Word quotes and contracts: document formatting, approvals, signatures and CRM handoffs, with clear limits.',
    bestFor: 'Sales teams assessing proposals, approvals and electronic signatures',
    intro: 'PandaDoc focuses on sales-document workflows. Clausery assembles editable Word quotes and contracts locally, with a free template library and optional per-user Pro features. It does not supply electronic signatures, sales approvals or CRM synchronisation.',
    them: ['Hosted document-workflow platform', 'Check the chosen service', 'Confirm offline behavior and restrictions', 'Check the current template offering', 'Review Word import, editing and formatting behavior', 'Confirm the export formats in your plan', 'Check signatures and the audit evidence provided', 'Evaluate payment features in the chosen plan', 'Check CRM, approval and workflow connections'],
    planCheck: 'Confirm seats, document allowances, export formats and the approval integrations you need.',
    chooseThem: ['A connected signing and approval service is the main requirement', 'The sales pipeline depends on document events and CRM updates', 'Your team needs the workflow around a proposal, not only its file'],
    chooseUs: ['Approved prices and terms are already handled outside the generator', 'You need editable Word output from a local questionnaire', 'Free library drafting fits, with Pro optional and priced per user'],
  },
];

const GROUPS = [['legal', 'Legal document automation'], ['forms', 'Legal form services'], ['freelance', 'Client and sales workflow platforms']];
const compareFaq = (c) => [
  [`Can I use Clausery and ${c.name} together?`, `Yes, where the separate roles fit your process. Clausery creates editable Word documents locally; it does not need an integration to produce a file. Keep ${c.name} or another suitable service for the workflow, advice or record-keeping that you still need.`],
  [`How should I compare Clausery pricing with ${c.name}?`, `Clausery library templates are free, plus ${PLANS.free.maxTemplates} of your own templates with unlimited documents. Pro is $${PRICES.pro} per user per month, with an optional ${TRIAL_DAYS}-day trial that needs no card and simply ends. Free library output includes a small Made with Clausery line; Pro removes it. Check ${c.name}'s official site for current prices, limits, billing terms and the services included.`],
  ...COMPARISON_WORKFLOWS[c.slug].faq,
];

const moveSteps = (c, rel) => `<section aria-labelledby="migration-checklist">
  <h2 id="migration-checklist" style="margin-top:2.5rem">Before moving a ${c.group === 'forms' ? 'document' : 'template'} from ${esc(c.name)}</h2>
  <ol>
    <li>Keep existing signed records and any external audit evidence. Work from an authorised editable Word master, not the only copy of a signed document.</li>
    <li>Replace changing facts with <code>{tags}</code> and check them with the <a href="${rel}free-tools/template-checker.html">Word template checker</a>. There is no automatic importer for ${esc(c.name)}'s rules or workflow.</li>
    <li>Build and test the questionnaire, including optional clauses and unusual inputs. Compare the downloaded .docx with your approved wording.</li>
    <li>Assign responsibility for any signing, legal review, payments, client communication and filing that remain outside the document generator.</li>
  </ol>
  <p>For repeat drafting, use <a href="${rel}docs/templates.html">the tag syntax</a> and keep a <a href="${rel}docs/backups.html">workspace backup</a>. Move a limited, reviewed process first; do not cancel another service until the required records and replacement workflow are in place.</p>
</section>`;

for (const c of COMPETITORS) if (!COMPARISON_WORKFLOWS[c.slug]) throw new Error(`Missing comparison evaluation: ${c.slug}`);
for (const slug of Object.keys(COMPARISON_WORKFLOWS)) if (!COMPETITORS.some((c) => c.slug === slug)) throw new Error(`Unknown comparison evaluation: ${slug}`);

const description = 'Compare local Word drafting with legal form services, document automation and client platforms. Practical workflow tests, clear limits and official vendor links.';
export const pages = [
  {
    path: 'compare/', title: 'Compare document automation tools', description,
    extraHead: collectionLd({ path: 'compare/', name: 'Compare document automation tools', description, items: COMPETITORS.map((c) => [c.title, `compare/${c.slug}.html`]) }),
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem">
  <h1>Compare document automation tools</h1>
  <p class="lead">Choose the workflow before comparing subscriptions. Clausery assembles editable Word documents locally; it is not a hosted client portal, law firm, electronic-signature service or payment processor.</p>
  <h2>What are you trying to replace?</h2>
  <ul>
    <li><strong>Local drafting:</strong> reusable Word wording, questions, optional clauses and calculated billing documents.</li>
    <li><strong>A managed client process:</strong> hosted intake, reminders, scheduling, signing and payment collection need their own service.</li>
    <li><strong>Legal expertise or prescribed forms:</strong> a general template does not replace professional advice or required local wording.</li>
  </ul>
  <p><strong>Not sure which category you need?</strong> <a href="${rel}why-clausery/">Why Clausery</a> starts from the job rather than the product: one table of differences, a decision guide that names the right alternative for each kind of work, and the proof you can check yourself, including the source code, the changelog and the security overview.</p>
${GROUPS.map(([g, label]) => `  <h2 style="margin-top:2rem">${esc(label)}</h2>
  <ul>${COMPETITORS.filter((c) => c.group === g).map((c) => `<li><a href="${rel}compare/${c.slug}.html">Clausery vs ${esc(c.name)}</a>: ${esc(c.bestFor)}</li>`).join('')}</ul>`).join('\n')}
  <h2 style="margin-top:2.5rem">Compare the scope and current plan terms</h2>
  <div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">Tool</th><th scope="col">Decision to test</th><th scope="col">Price or plan check</th></tr></thead><tbody>
    <tr><th scope="row">Clausery</th><td>Local Word assembly and editable billing documents</td><td>${esc(OUR_PRICE)}. <a href="${rel}pricing/">See the plan details</a>.</td></tr>
    ${COMPETITORS.map((c) => `<tr><th scope="row"><a href="${rel}compare/${c.slug}.html">${esc(c.name)}</a></th><td>${esc(c.bestFor)}</td><td>${esc(c.planCheck)} <a href="${esc(c.vendorUrl)}" rel="noopener">Official ${esc(c.name)} site</a></td></tr>`).join('')}
  </tbody></table></div>
  <p class="small muted">No current competitor price quote is reproduced here. Confirm plans, limits, export rights and renewal terms directly with the provider. Clausery prices shown above come from the same configuration as the app and pricing page.</p>
  <!--nav--><div class="feature" style="margin-top:2rem"><h2 style="font-size:1.15rem;margin-top:0">Test one small document first</h2><p>Use fictional details, compare the downloaded Word output, then check every handoff that remains outside drafting. No account is required to try Clausery's library templates.</p><p><a class="btn btn-primary" href="${rel}app/">Open Clausery</a> <a class="btn" href="${rel}templates/">Free Word templates</a></p></div><!--/nav-->
</div></section>`,
  },
  ...COMPETITORS.map((c) => {
    const [rows, us] = c.group === 'freelance' ? [FREELANCE_ROWS, CLAUSERY_FREELANCE] : c.group === 'forms' ? [FORMS_ROWS, CLAUSERY_FORMS] : [ROWS, CLAUSERY];
    const them = [...c.them, c.planCheck];
    if (rows.length !== them.length) throw new Error(`${c.slug}: ${them.length} table cells for ${rows.length} rows`);
    const workflow = COMPARISON_WORKFLOWS[c.slug];
    const faq = compareFaq(c);
    return {
      path: `compare/${c.slug}.html`, title: c.title, description: c.description, _toc: true,
      // WebPage schema for the comparison itself (search understands the page is about an alternative to
      // Clausery without us asserting any competitor prices/ratings we cannot verify — we intentionally
      // avoid SoftwareApplication for competitors because that would require a fabricated Offer price).
      // The page's <a rel="noopener" href="vendorUrl"> links already signal the sameAs relationship via the
      // "Official product and plan details" block.
      extraHead: faqLd(faq),
      body: (rel) => `<section class="section"><div class="wrap prose">
  <nav class="small muted" aria-label="Breadcrumb"><a href="${rel}">Home</a> › <a href="${rel}compare/">Compare</a> › ${esc(c.name)}</nav>
  <h1 style="margin-top:1rem">${esc(c.title)}</h1>
  <p class="lead">${esc(c.intro)}</p>
  <div class="table-wrap" tabindex="0" style="margin-top:2rem"><table class="compare"><thead><tr><th scope="col">Feature or decision</th><th scope="col">Clausery</th><th scope="col">${esc(c.name)}</th></tr></thead><tbody>
    ${rows.map((r, i) => `<tr><th scope="row">${esc(r)}</th><td>${esc(us[i])}</td><td>${esc(them[i])}</td></tr>`).join('')}
  </tbody></table></div>
  <p class="small muted">Vendor features depend on the selected plan and deployment. Confirm them using the official link below; this page does not claim a new pricing or plan verification.</p>
  <section class="comparison-workflow" aria-labelledby="workflow-fit"><h2 id="workflow-fit">${esc(workflow.heading)}</h2>${workflow.body(rel)}</section>
  <div class="grid grid-2" style="margin-top:2rem">
    <div class="feature"><h2 style="font-size:1.15rem">Choose ${esc(c.name)} if</h2><ul>${c.chooseThem.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <div class="feature"><h2 style="font-size:1.15rem">Choose Clausery if</h2><ul>${c.chooseUs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
  </div>
${moveSteps(c, rel)}
  <h2>What stays outside Clausery</h2>
  <p>Clausery prepares Word documents, including contracts, invoices, quotes and receipts. It does not collect signatures or payments, provide legal advice, maintain a hosted client portal or synchronise a CRM. Keep the systems needed for those tasks.</p>
  <h2 style="margin-top:2.5rem">Free templates to start with</h2>
  <p>Every library template is a free Word download with a guide to what belongs in it:</p>
  <ul>
    <li><a href="${rel}templates/invoice.html">Invoice template</a> — <a href="${rel}templates/invoice.html" class="small muted">what to include</a></li>
    <li><a href="${rel}templates/independent-contractor-agreement.html">Independent contractor agreement</a> — <a href="${rel}templates/independent-contractor-template.html" class="small muted">what to include</a></li>
    <li><a href="${rel}templates/mutual-nda.html">Mutual NDA</a> — <a href="${rel}templates/mutual-nda-template.html" class="small muted">what to include</a></li>
    <li><a href="${rel}templates/offer-letter.html">Offer letter</a> — <a href="${rel}templates/offer-letter-template.html" class="small muted">what to include</a></li>
    <li><a href="${rel}templates/residential-lease-agreement.html">Residential lease agreement</a> — <a href="${rel}templates/residential-lease-agreement-template.html" class="small muted">what to include</a></li>
  </ul>
  <p class="small muted"><a href="${rel}templates/">Browse the full template library</a> — 87 free Word templates covering invoices, contracts, NDAs, HR letters and landlord forms.</p>
  <h2 style="margin-top:2.5rem">Questions</h2>
  ${faqHtml(faq)}
  <h2 id="official-details" style="margin-top:2.5rem">Official product and plan details</h2>
  <p><a class="vendor-source" href="${esc(c.vendorUrl)}" rel="noopener">${esc(c.name)}'s official site</a> is the place to confirm current features, prices, billing terms and export rights. For this side of the comparison, see <a href="${rel}pricing/">Clausery pricing</a> and <a href="${rel}docs/">the product documentation</a>. A changed page date is not a claim that a vendor's prices were rechecked.</p>
  <!--nav--><p><a class="btn btn-primary btn-lg" href="${rel}app/">Try Clausery with a free template</a> <a class="btn" href="${rel}compare/">Browse all comparisons</a></p><!--/nav-->
</div></section>`,
    };
  }),
];
