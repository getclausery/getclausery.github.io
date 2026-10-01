// "Alternative to X" pages. They state plainly where the other product is the better choice: buyers comparing tools
// trust a page that admits trade-offs, and every claim here must stay accurate.
import { esc, faqLd, faqHtml } from '../tools/partials.mjs';
import { LIB } from './library.mjs';

const ROWS = ['Where your documents are processed', 'Account needed', 'Works offline', 'Uses your own Word templates', 'Conditional clauses and repeating lists', 'Calculations', 'Client questionnaires', 'Integrations with practice management', 'Price'];
const CLAUSERY = ['Your browser only; nothing is uploaded', 'No', 'Yes', 'Yes', 'Yes', 'Yes (Pro)', 'Offline intake file you email to the client', 'None: files in, files out', 'Free for 3 templates; Pro $19 per user per month'];
// All-in-one freelancer tools compete on different things (payments, portals), so their table asks different questions.
const FREELANCE_ROWS = ['Where contracts are created', 'Account needed', 'Works offline', 'Free contract templates', 'Use your own Word contract', 'Contract download', 'E-signature', 'Invoicing and payments', 'Client portal, scheduling and CRM', 'Price'];
const CLAUSERY_FREELANCE = ['Your browser only; nothing is uploaded', 'No', 'Yes', `Yes, ${LIB.length} Word templates`, 'Yes: add {tags} to any .docx', 'Word (.docx), or print to PDF', 'No: sign on paper or with any e-signature service', 'No', 'No', 'Free for 3 templates; Pro $19 per user per month'];

// Online legal form sites sell finished documents by subscription or per document, so their table asks about downloads,
// ongoing charges and lawyer access.
const FORMS_ROWS = ['Where documents are created', 'Account needed', 'Free Word download', 'Ongoing subscription', 'Use your own Word templates', 'Lawyer help', 'E-signature', 'State-specific forms', 'Price'];
const CLAUSERY_FORMS = ['Your browser only; nothing is uploaded', 'No', `Yes, all ${LIB.length} templates, with no sign-up`, 'No: the free plan has no time limit', 'Yes: add {tags} to any .docx', 'No: Clausery is software, not a law firm', 'No: sign on paper or with any e-signature service', 'No: general templates you adapt', 'Free for 3 templates; Pro $19 per user per month'];

export const COMPETITORS = [
  { slug: 'gavel-alternative', name: 'Gavel', title: 'Gavel alternative that keeps client data on your computer', group: 'legal', bestFor: 'Law firms that want hosted client portals and workflows',
    intro: 'Gavel is a well-regarded cloud platform for legal document automation and client workflows. Clausery does the core job, turning Word templates into guided questionnaires, without sending client data to a vendor.',
    them: ['Vendor cloud', 'Yes', 'No', 'Yes', 'Yes', 'Yes', 'Hosted, branded client portal', 'Yes, including Clio', 'Lite from about $83 to $99 per month; higher tiers about $250 to $417 per month'],
    chooseThem: ['You want a hosted client portal with payments and online workflows', 'You rely on its integrations with your practice management system', 'Your firm is comfortable with cloud processing of client data'],
    chooseUs: ['Client confidentiality rules or client instructions make uploads hard to justify', 'You want to start in minutes with the Word files you already have', 'You want a free tier with unlimited documents, or a flat low price per user'] },
  { slug: 'clio-draft-alternative', name: 'Clio Draft', title: 'Clio Draft alternative for firms that cannot upload client files', group: 'legal', bestFor: 'Firms that run on Clio Manage',
    intro: 'Clio Draft (formerly Lawyaw) is document automation that lives inside the Clio ecosystem. Clausery is independent of any practice management system and never uploads the documents it builds.',
    them: ['Vendor cloud', 'Yes', 'No', 'Yes', 'Yes', 'Yes', 'Hosted forms', 'Deep Clio Manage integration', 'Quote-based; third-party 2026 guides report roughly $49 to $149 per user per month'],
    chooseThem: ['Your firm runs on Clio Manage and wants matter data to fill documents automatically', 'You want its court form library', 'You prefer one vendor for practice management and drafting'],
    chooseUs: ['You do not use Clio, or want drafting that works without it', 'You need client data to stay on firm devices', 'You want predictable pricing without a practice management subscription'] },
  { slug: 'hotdocs-alternative', name: 'HotDocs', title: 'HotDocs alternative: lightweight document automation in the browser', group: 'legal', bestFor: 'Large organisations automating complex document sets',
    intro: 'HotDocs has been a standard for enterprise document assembly for decades. Clausery is a much lighter tool: no installation, no server, and no component library to learn, for firms that need the essentials.',
    them: ['Desktop authoring with server or cloud deployment', 'Yes', 'Authoring on desktop', 'Yes', 'Yes, very advanced', 'Yes', 'Yes, through its interview platform', 'Enterprise integrations', 'Quote-based enterprise pricing'],
    chooseThem: ['You automate hundreds of complex, interlinked documents', 'You need enterprise administration, auditing and integrations', 'You have dedicated template authors'],
    chooseUs: ['You want to automate your ten most-used documents this afternoon', 'Nobody on the team should have to learn a template language', 'Budget or procurement rules out an enterprise contract'] },
  { slug: 'docassemble-alternative', name: 'docassemble', title: 'docassemble alternative that needs no server', group: 'legal', bestFor: 'Teams with developers building public web interviews',
    intro: 'docassemble is a powerful, free, open-source platform for guided interviews, widely used in access-to-justice projects. It runs on a server you host. Clausery runs in the browser with nothing to install or host.',
    them: ['Your own server', 'Depends on your setup', 'No', 'Yes, plus its own formats', 'Yes, very advanced', 'Yes, with Python', 'Yes, web interviews', 'Through code and APIs', 'Free, open source; you pay for hosting and maintenance'],
    chooseThem: ['You need public-facing web interviews at scale', 'You have developers comfortable with Python and YAML', 'You need logic beyond what a form designer offers'],
    chooseUs: ['You have no server, no developer and no IT budget', 'Your templates live in Word and should stay there', 'You want a questionnaire from a template in minutes, without code'] },
  { slug: 'lawdepot-alternative', description: 'LawDepot charges to print or download after a 7-day trial. Clausery\'s templates download free as Word files you fill in on your computer. An honest comparison.', name: 'LawDepot', title: 'LawDepot alternative with free Word downloads', group: 'forms', bestFor: 'Documents tailored to a state, province or country',
    intro: 'LawDepot builds legal documents from an online questionnaire, and many are tailored to your state, province or country. Printing or downloading needs a trial, a single-document purchase or a plan. Clausery\'s templates are free to download as Word files, and you fill them in on your own computer.',
    context: 'LawDepot\'s 7-day trial takes payment details and renews into the $35 monthly plan unless you cancel, so set a reminder if you only need one document.',
    them: ['LawDepot\'s online editor; documents kept in your account', 'Yes, to print or download', 'No: printing or downloading needs the trial, a single-document purchase or a plan', '7-day trial with payment details, then monthly unless you cancel', 'No: you answer questions about LawDepot\'s own documents', 'Through a partner service (JustAnswer)', 'Yes, LawDepot eSign', 'Yes, many documents vary by state, province or country', '$35 a month after a 7-day trial, or $107.88 a year; single documents from $0 to $139'],
    chooseThem: ['You need a document tailored to a particular state, province or country', 'You want e-signature and document storage in the same account', 'You need a document Clausery does not offer, such as a will'],
    chooseUs: ['You want the Word file free, with no trial to remember to cancel', 'You reuse the same documents and want to fill them in again whenever you like', 'Personal and client details should stay on your own computer', 'You also want to automate your own Word documents'] },
  { slug: 'rocket-lawyer-alternative', description: 'Rocket Lawyer bundles documents with attorney help in a membership. If you only need the documents, Clausery\'s Word templates are free. An honest comparison.', name: 'Rocket Lawyer', title: 'Rocket Lawyer alternative: free templates, no membership', group: 'forms', bestFor: 'Documents plus attorney help in one membership',
    intro: 'Rocket Lawyer combines legal documents, e-signatures and access to attorneys in a membership. If the documents are what you need, Clausery has free Word templates that you fill in from a short questionnaire in your browser, with no membership.',
    context: 'Rocket Lawyer\'s 7-day trial rolls into the membership you chose, billed monthly or yearly, unless you cancel before it ends.',
    them: ['Rocket Lawyer\'s online editor; documents stored in your account', 'Yes', 'No: a free account downloads only documents already paid for, as PDF', '7-day trial, then the membership you chose unless you cancel', 'Upload them to store or sign, not to build questionnaires', 'Yes, attorney consultations and questions with a membership', 'Yes, RocketSign', 'Yes, many documents vary by state', 'Standard, Plus and Pro memberships after a 7-day trial; 2026 reviews report $34.99 to $64.99 a month, or $149 to $349 a year'],
    chooseThem: ['You want to ask a lawyer questions as part of a membership', 'You want documents, e-signatures and legal help in one account', 'You need state-specific documents or business formation services'],
    chooseUs: ['You only need the document, not a membership', 'You want an editable Word file for free, not only a PDF of what you paid for', 'Personal and client details should stay on your own computer', 'You want to turn your own Word documents into questionnaires'] },
  { slug: 'eforms-alternative', description: 'eForms has free blank forms and paid plans after a 7-day trial. Clausery fills in its free templates in your browser, with no account, card or trial.', name: 'eForms', title: 'eForms alternative: fill in documents without an account', group: 'forms', bestFor: 'Free blank forms written for a particular state',
    intro: 'eForms has a large library of state-specific forms, with free blank downloads and paid plans after a 7-day trial. Clausery turns each of its free templates into a short questionnaire in your browser and gives you a finished Word document, with no account, card or trial.',
    context: 'eForms\' 7-day trial needs a card and bills $49 for the monthly plan when it ends, unless you cancel.',
    them: ['eForms\' online editor; forms saved to your account', 'Yes, to fill in forms online', 'Yes, blank forms as PDF, Word or ODT', '7-day trial with a card, then $49 a month unless you cancel', 'No', 'No attorney service listed', 'Yes, on your device', 'Yes, many forms written for each state', '$49 a month after a 7-day trial, or $144 a year; single documents $45'],
    chooseThem: ['You want a free blank form for your state, to fill in by hand', 'You need a form written for a particular state\'s rules', 'You prefer a blank PDF to a questionnaire'],
    chooseUs: ['You want to answer questions and get a finished document, not a blank form', 'You do not want an account, a card or a trial', 'Details you type should stay on your own computer', 'Optional clauses should appear only when they apply'] },
  { slug: 'honeybook-alternative', description: 'Only use HoneyBook for contracts? Clausery has free Word contract templates you fill in on your own computer. An honest comparison of features and price.', name: 'HoneyBook', title: 'HoneyBook alternative when you only need contracts', group: 'freelance', bestFor: 'Booking, contracts, invoices and payments in one client flow',
    intro: 'HoneyBook is an all-in-one client platform that takes a booking from inquiry to contract, invoice and payment. If contracts are the part you actually use, Clausery gives you free Word contract templates that you fill in on your own computer, with no monthly subscription.',
    context: 'HoneyBook raised its prices in February 2025; the Starter plan went from $19 to $36 a month on monthly billing. If you mostly use it to send contracts, that is worth a second look.',
    them: ['HoneyBook\'s cloud', 'Yes', 'No', 'Yes', 'Add your wording in HoneyBook\'s contract editor', 'PDF', 'Yes', 'Yes, with a fee on each card or bank payment', 'Yes; scheduling and automations from the Essentials plan', 'No free plan. Starter $36, Essentials $59 and Premium $129 a month; $29, $49 and $109 a month billed yearly'],
    chooseThem: ['You want clients to sign, get invoiced and pay in one flow', 'You use a branded client portal, scheduling or automated follow-ups every week', 'You would rather pay for one subscription than combine separate tools'],
    chooseUs: ['You mainly need a solid contract for each client, not a whole client platform', 'You want contracts as editable Word files that you keep', 'You would rather not pay monthly for features you rarely use', 'Client details should stay on your own computer'] },
  { slug: 'bonsai-alternative', description: 'Only use Bonsai for contracts? Get free freelance contracts in Word, filled in on your own computer. An honest comparison of features, price and trade-offs.', name: 'Bonsai', title: 'Bonsai alternative: free freelance contracts in Word', group: 'freelance', bestFor: 'Freelancers who want proposals, contracts, invoices and time tracking in one app',
    intro: 'Bonsai is all-in-one business software for freelancers and small agencies, covering proposals, contracts, invoices, time tracking and more. If you mainly use it for contracts, Clausery does that job for free, in your browser, with Word files you keep.',
    context: 'Zoom agreed to buy Bonsai in November 2025 and plans to bring its features into Zoom over time, so some freelancers are reviewing what they use it for.',
    them: ['Bonsai\'s cloud', 'Yes', 'No', 'Yes, a large library', 'Add your wording in Bonsai\'s contract editor', 'PDF', 'Yes', 'Yes', 'Yes, depending on the plan', 'Paid plans, priced per user, after a 7-day free trial; current prices are on Bonsai\'s pricing page'],
    chooseThem: ['You want proposals, contracts, invoices and time tracking in one app', 'Clients should sign and pay online from the same link', 'Your team shares client records and projects'],
    chooseUs: ['Contracts are the part you use, and the rest of the subscription goes unused', 'You want editable Word contracts rather than PDFs', 'You do not want to pay per user', 'Client details should stay on your own computer'] },
  { slug: 'dubsado-alternative', description: 'Dubsado is powerful but slow to set up. If you mainly need contracts, Clausery takes you from a Word template to a finished contract in minutes, for free.', name: 'Dubsado', title: 'Dubsado alternative: contracts without the setup', group: 'freelance', bestFor: 'Service businesses that want automated client workflows',
    intro: 'Dubsado is a CRM and workflow platform for service businesses, with forms, contracts, invoices and automations. It is powerful, but it takes time to set up. If contracts are the part you need, Clausery gets you from a Word template to a finished contract in minutes.',
    context: 'Dubsado raised its prices on 1 December 2025; Starter went from $20 to $35 a month. Dubsado says existing paid subscribers keep their previous price.',
    them: ['Dubsado\'s cloud', 'Yes', 'No', 'Yes', 'Add your wording in Dubsado\'s contract editor', 'PDF', 'Yes', 'Yes', 'Client portal and CRM on both plans; scheduling and workflows on Premier', 'Starter $35 and Premier $55 a month, or $335 and $525 a year, after a 21-day free trial'],
    chooseThem: ['You want automated workflows from first inquiry to final payment', 'You use lead forms, a client portal and scheduling linked to your contracts', 'You prefer flat pricing to per-user seats'],
    chooseUs: ['You want a contract today, without building workflows first', 'You want contracts as Word files you can edit anywhere', 'You do not use forms, a portal or automations enough to pay for them every month', 'Client details should stay on your own computer'] },
  { slug: 'pandadoc-alternative', description: 'Compare PandaDoc with Clausery for Word contract templates: guided questionnaires, .docx output, no per-seat pricing and no upload. Honest trade-offs.', name: 'PandaDoc', title: 'PandaDoc alternative for Word contract templates', group: 'freelance', bestFor: 'Sales teams sending proposals and quotes for e-signature',
    intro: 'PandaDoc is document workflow software for proposals, quotes and contracts, with e-signature, approvals and CRM integrations, priced per seat. Clausery is narrower: it turns your own Word templates into questionnaires and builds the finished .docx in your browser, with no seats and no upload.',
    them: ['PandaDoc\'s cloud', 'Yes', 'No', 'Yes', 'Import a Word file; complex formatting may not carry over', 'PDF; Word (.docx) on paid plans', 'Yes, including a free plan', 'Payments on the Business plan and above', 'CRM integrations on Business and above; no client portal or scheduling', 'Free eSign plan (60 documents a year, 5 templates). Starter $35 and Business $65 per seat a month; $19 and $49 billed yearly'],
    chooseThem: ['You need e-signatures with an audit trail in the same tool', 'Your sales team sends quotes with pricing tables and syncs them with a CRM', 'You want to know when a client opens a document, and route it for approval'],
    chooseUs: ['Your contracts already live in Word and should keep their exact formatting', 'You want each document built from a short questionnaire, with optional clauses switched on or off by the answers', 'You do not want to pay per seat', 'Client details should stay on your own computer'] },
];
const GROUPS = [['legal', 'Legal document automation'], ['forms', 'Online legal form sites'], ['freelance', 'All-in-one tools for freelancers']];
const price = (c) => c.them[c.them.length - 1];

// Questions every comparison page answers; the answers only state facts about Clausery.
const compareFaq = (c) => [
  [`Can I use Clausery and ${c.name} together?`, c.group === 'forms'
    ? `Yes. You could use ${c.name} for a state-specific form or a question to a lawyer, and Clausery for the documents you fill in again and again. Clausery produces an ordinary Word file, so nothing needs to connect.`
    : c.group === 'freelance'
    ? `Yes. You could keep ${c.name} for the parts you use, such as invoicing and payments, and prepare contracts in Clausery. Clausery needs no integration: it produces a Word file you can send, sign and store however you like.`
    : `Yes. Many firms keep a platform like ${c.name} for the workflows it does best and use Clausery for documents whose details should not leave the office. Clausery needs no integration to run alongside it.`],
  [`How much does Clausery cost compared with ${c.name}?`, `Clausery is free for up to three templates with unlimited documents, and Pro is $19 per user per month. The table above summarises ${c.name}'s published pricing as of 2026; check the vendor for current prices.`],
  c.group === 'forms'
    ? ['Is there a trial that turns into a subscription?', 'No. The free plan has no time limit and asks for no card, and every template can be downloaded as a Word file without an account. You only pay if you choose to buy Pro.']
    : c.group === 'freelance'
    ? ['Can clients sign a Clausery contract?', 'Clausery does not collect signatures itself. Send the Word file, or a PDF printed from it, through any e-signature service, or sign on paper. Several e-signature services have a free plan for a limited number of documents.']
    : ['Does Clausery need IT to set up?', 'No. It runs in any modern browser with nothing to install, and firms that prefer can host the files on their own server.'],
  ['What happens to my templates if I stop using Clausery?', 'They are ordinary Word files with tags, and your data exports as plain JSON. Nothing is locked into Clausery.'],
];

const moveSteps = (c, rel) => (c.group === 'forms' ? `  <h2 style="margin-top:2.5rem">Moving a document from ${esc(c.name)}</h2>
  <ol>
    <li>Download the finished document from ${esc(c.name)} as a Word file if your plan allows it, or start from the matching <a href="${rel}templates/">free template</a>.</li>
    <li>Replace each detail that changes with a tag such as <code>{buyer_name}</code>, and wrap optional paragraphs in <code>{#is_vehicle}…{/is_vehicle}</code>.</li>
    <li>Check the file with the free <a href="${rel}free-tools/template-checker.html">template tag checker</a>, then drop it into the app. Next time, you answer the questions instead of editing the document.</li>
  </ol>
  <h2 style="margin-top:2.5rem">What Clausery deliberately leaves out</h2>
  <p>Clausery is software, not a law firm. It has no lawyers to call, no state-specific court or motor vehicle forms, no e-signature and no cloud storage of your documents. If you need legal advice or an official form, ${esc(c.name)} or a local lawyer may be the better choice. If you need a sound general document that you can fill in again whenever you like, a free template may be all it takes.</p>` : c.group === 'freelance' ? `  <h2 style="margin-top:2.5rem">Moving your contracts from ${esc(c.name)}</h2>
  <ol>
    <li>Copy your contract wording out of ${esc(c.name)} into a Word document, or start from one of the <a href="${rel}for/freelancers.html">free freelance contract templates</a>.</li>
    <li>Replace each detail that changes with a tag such as <code>{client_name}</code>, and wrap optional terms, such as a deposit or kill fee, in <code>{#has_deposit}…{/has_deposit}</code>.</li>
    <li>Check the file with the free <a href="${rel}free-tools/template-checker.html">template tag checker</a>, then drop it into the app.</li>
    <li>Send each finished contract for signature the way you prefer. Keep ${esc(c.name)} or another tool for invoices if you use it.</li>
  </ol>
  <h2 style="margin-top:2.5rem">What Clausery deliberately leaves out</h2>
  <p>Clausery only prepares documents, and it never holds your clients' details. It has no invoicing, payments, scheduling, client portal, CRM or built-in e-signature. If you use those every week, ${esc(c.name)} may be worth its subscription. If what you need is a good contract for each client, a template and a questionnaire may be all it takes.</p>` : `  <h2 style="margin-top:2.5rem">Moving a template from ${esc(c.name)}</h2>
  <ol>
    <li>Start from the original Word version of the document, before it was converted for ${esc(c.name)}.</li>
    <li>Replace each detail that changes with a tag such as <code>{client_name}</code>, and wrap optional clauses in <code>{#has_retainer}…{/has_retainer}</code>. Lists of parties or line items use a repeating section.</li>
    <li>Check the file with the free <a href="${rel}free-tools/template-checker.html">template tag checker</a>, then drop it into the app.</li>
    <li>Recreate any rules you built in ${esc(c.name)}'s own editor as show-when conditions or calculations in the Clausery designer. Allow about an hour for a complex template.</li>
  </ol>
  <h2 style="margin-top:2.5rem">What Clausery deliberately leaves out</h2>
  <p>Because nothing leaves your computer, Clausery has no hosted client portal, no built-in e-signature, no practice management integration and no cloud AI drafting. If you need those, ${esc(c.name)} or a similar platform may suit you better, and the two can run side by side.</p>`);

export const pages = [
  { path: 'compare/', title: 'Compare document automation tools',
    description: 'How Clausery compares with LawDepot, Rocket Lawyer, eForms, Gavel, Clio Draft, HotDocs, HoneyBook, Bonsai, Dubsado and PandaDoc on privacy, features and price.',
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem">
  <h1>How Clausery compares</h1>
  <p class="lead">Every tool on this list is good at something. The main difference with Clausery is architectural: your documents are built on your own computer, so there is no vendor that holds your clients' data.</p>
${GROUPS.map(([g, label]) => `  <h2 style="margin-top:2rem">${esc(label)}</h2>
  <ul>${COMPETITORS.filter((c) => c.group === g).map((c) => `<li><a href="${rel}compare/${c.slug}.html">Clausery vs ${esc(c.name)}</a></li>`).join('')}</ul>`).join('\n')}
  <h2 style="margin-top:2.5rem">Prices at a glance</h2>
  <div class="table-wrap" tabindex="0"><table class="compare"><thead><tr><th scope="col">Tool</th><th scope="col">Best for</th><th scope="col">Price</th></tr></thead><tbody>
    <tr><td>Clausery</td><td>Private drafting from your own Word templates</td><td>${esc(CLAUSERY[CLAUSERY.length - 1])}</td></tr>
    ${COMPETITORS.map((c) => `<tr><td><a href="${rel}compare/${c.slug}.html">${esc(c.name)}</a></td><td>${esc(c.bestFor)}</td><td>${esc(price(c))}</td></tr>`).join('')}
  </tbody></table></div>
  <p class="small muted">Published prices checked in September 2026, in US dollars. Vendors change prices and plans; check their pricing pages before you decide.</p>
</div></section>` },
  ...COMPETITORS.map((c) => {
    const [rows, us] = c.group === 'freelance' ? [FREELANCE_ROWS, CLAUSERY_FREELANCE] : c.group === 'forms' ? [FORMS_ROWS, CLAUSERY_FORMS] : [ROWS, CLAUSERY];
    if (rows.length !== c.them.length) throw new Error(`${c.slug}: ${c.them.length} table cells for ${rows.length} rows`);
    return {
      path: `compare/${c.slug}.html`, title: c.title, extraHead: faqLd(compareFaq(c)),
      description: c.description || `${c.intro}`.slice(0, 290),
      body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem">
  <nav class="small muted" aria-label="Breadcrumb"><a href="${rel}">Home</a> › <a href="${rel}compare/">Compare</a> › ${esc(c.name)}</nav>
  <h1 style="margin-top:1rem">${esc(c.title)}</h1>
  <p class="lead">${esc(c.intro)}</p>
${c.context ? `  <p>${esc(c.context)}</p>\n` : ''}  <div class="table-wrap" tabindex="0" style="margin-top:2rem"><table class="compare"><thead><tr><th scope="col"></th><th scope="col">Clausery</th><th scope="col">${esc(c.name)}</th></tr></thead><tbody>
    ${rows.map((r, i) => `<tr><td>${esc(r)}</td><td>${esc(us[i])}</td><td>${esc(c.them[i])}</td></tr>`).join('')}
  </tbody></table></div>
  <p class="small muted">${c.group !== 'legal' ? 'Based on public information checked in September 2026. Products and prices change; check with the vendor.' : 'Based on public information as of 2026. Products change; check with the vendor.'}</p>
  <div class="grid grid-2" style="margin-top:2rem">
    <div class="feature"><h2 style="font-size:1.15rem">Choose ${esc(c.name)} if</h2><ul>${c.chooseThem.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <div class="feature"><h2 style="font-size:1.15rem">Choose Clausery if</h2><ul>${c.chooseUs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
  </div>
${moveSteps(c, rel)}
  <h2 style="margin-top:2.5rem">Questions</h2>
  ${faqHtml(compareFaq(c))}
  <h2 style="margin-top:2.5rem">Try it with your own template</h2>
  <p>Open the app, drop in a Word document with tags like <code>{client_name}</code>, and you have a questionnaire. Or start from one of the <a href="${rel}templates/">free templates</a>.</p>
  <p><a class="btn btn-primary btn-lg" href="${rel}app/">Open Clausery, free</a></p>
</div></section>`,
    };
  }),
];
