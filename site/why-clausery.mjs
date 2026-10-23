// Why Clausery: the differentiation, proof and decision guide in one page. This is a trust and positioning page,
// not a new marketing claim: every statement here is either a fact about how the app works, a link to a document
// that shows it, or a link to a comparison page. It deliberately avoids customer quotes, user counts and vendor
// claims, because none of those can be verified from this repository.
import { esc, faqLd, faqHtml, REPO_URL } from '../tools/partials.mjs';
import { LIB } from './library.mjs';
import { CLAUSES } from './data/clauses.mjs';
import { TOOLS } from './free-tools.mjs';
import { COMPETITORS } from './compare.mjs';
import { PRICES, TRIAL_DAYS, REFUND_DAYS } from '../app/config.js';
import { PLANS } from '../app/lib/license.js';

const bySlug = Object.fromEntries(COMPETITORS.map((c) => [c.slug, c]));
const link = (rel, slug) => `<a href="${rel}compare/${slug}.html">Clausery vs ${esc(bySlug[slug].name)}</a>`;

// The decision table says what each kind of product is for, which is what the comparison pages already establish.
// It does not restate a vendor's features or prices: those are checked on the vendor's own site.
const decisions = (rel) => [
  ['A Word file you can still edit after you send it', 'Clausery. Every library template is an ordinary .docx with your own formatting, and the free plan has no time limit.'],
  ['A hosted client intake, matter list and practice workflow', `${link(rel, 'gavel-alternative')} or ${link(rel, 'clio-draft-alternative')}, if a hosted service is a requirement rather than a preference.`],
  ['A document-assembly system for a whole organisation', `${link(rel, 'hotdocs-alternative')} or ${link(rel, 'docassemble-alternative')}.`],
  ['A ready-made legal form for one jurisdiction', `${link(rel, 'lawdepot-alternative')}, ${link(rel, 'rocket-lawyer-alternative')} or ${link(rel, 'eforms-alternative')}. Clausery's templates are general samples that you adapt.`],
  ['Booking, proposals, e-signatures and payment collection', `${link(rel, 'honeybook-alternative')}, ${link(rel, 'bonsai-alternative')}, ${link(rel, 'dubsado-alternative')} or ${link(rel, 'pandadoc-alternative')}.`],
];

const FAQ = [
  ['Is Clausery free to use?',
    `Yes for the whole library. All ${LIB.length} Word templates, ${CLAUSES.length} clause explanations, the guides and ${TOOLS.length} calculators are free, with no sign-up and no time limit. You can also automate up to ${PLANS.free.maxTemplates} of your own Word templates free. Pro is $${PRICES.pro} per user per month when you want more.`],
  ['What does Clausery do that other invoicing tools do not?',
    'The output is a normal Word file you keep editing, the document is assembled on your own device rather than on a vendor server, and there is no account to create before you start. A free plan that does not expire is also unusual among tools that put the library behind a trial.'],
  ['Do I have to sign up or give a card?',
    `No. Every library template can be downloaded or filled in without an account. The ${TRIAL_DAYS}-day Pro trial starts in the app with no card, nothing renews and you keep everything you made.`],
  ['What if it is not right for me?',
    `Email within ${REFUND_DAYS} days of your first payment and the amount is refunded in full, with no form and no reason required. The Free plan costs nothing, so there is nothing to cancel there either.`],
  ['Can my clients see my documents or my business data?',
    'No. Reading templates, evaluating answers and assembling the .docx happen in the browser. Document contents are not uploaded, and a saved draft stays in the browser database until you delete it or move it with a backup file.'],
  ['Is this legal or financial advice?',
    'No. Clausery is software that fills in templates you can read and adapt. It is not a law firm, it does not give legal advice, and it does not collect payments. Have a document reviewed for your situation before you rely on it.'],
];

export const pages = [
  {
    path: 'why-clausery/', title: 'Why Clausery — no signup, no card, real Word files',
    description: 'See why Clausery is different from invoice apps and cloud document tools: editable Word output, no uploads, no account to start, a free tier that never expires, public source code and a money-back guarantee.',
    extraHead: faqLd(FAQ),
    body: (rel) => `<section class="section"><div class="wrap prose">
<h1>Why Clausery</h1>
<p class="lead">Most tools that make invoices, quotes and contracts want your documents, or your time, or both. Clausery does neither: it makes a Word file on your own computer, gives the whole library away for free, and publishes the code so you can check it.</p>

<h2>The difference in one line</h2>
<div class="table-wrap" tabindex="0"><table class="compare">
<thead><tr><th scope="col">&nbsp;</th><th scope="col">Clausery</th><th scope="col">A typical paid alternative</th></tr></thead>
<tbody>
<tr><th scope="row">What you get</th><td>An editable Word file (.docx)</td><td>A PDF, or a document inside the vendor's account</td></tr>
<tr><th scope="row">Where it is made</th><td>Your browser</td><td>The vendor's servers</td></tr>
<tr><th scope="row">To start</th><td>No account, no card</td><td>An account, usually a card, sometimes a sales call</td></tr>
<tr><th scope="row">The free tier</th><td>The whole library, with no time limit</td><td>A trial, a document cap, or a watermark</td></tr>
<tr><th scope="row">Your own templates</th><td>Up to ${PLANS.free.maxTemplates} free, unlimited on Pro</td><td>Usually a paid plan</td></tr>
<tr><th scope="row">The code</th><td>Published, readable and self-hostable</td><td>Closed</td></tr>
<tr><th scope="row">If it is not for you</th><td>${REFUND_DAYS}-day money-back guarantee, no questions</td><td>Depends on the contract</td></tr>
</tbody></table></div>
<p class="small muted">Vendor features depend on the plan you select and change over time. Check the provider's own site for what it does today; the links below do the same for each product.</p>

<h2>Choose by what you actually need</h2>
<p>Most people are not choosing between eleven products. They have one problem, and the honest answer is sometimes "not this one". Start from the job:</p>
<div class="table-wrap" tabindex="0"><table class="compare">
<thead><tr><th scope="col">If your priority is</th><th scope="col">Look at</th></tr></thead>
<tbody>
${decisions(rel).map(([need, answer]) => `<tr><th scope="row">${esc(need)}</th><td>${answer}</td></tr>`).join('\n')}
</tbody></table></div>
<p>Each comparison is written as a decision, not a sales pitch: what the other tool is built for, what you would give up, and what to check on their site before you rely on it. Start from the <a href="${rel}compare/">full comparison index</a>.</p>

<h2>Proof you can check yourself</h2>
<p>Trust is easier to judge from evidence than from adjectives. These are the checks this site is built to survive:</p>
<ul>
<li><strong>Read the code.</strong> The document engine, the app and this website are published on <a href="${REPO_URL}" rel="noopener">GitHub</a>, so you can see what runs when you press a button.</li>
<li><strong>Watch every release.</strong> Each version is listed with what changed in the <a href="${rel}changelog.html">changelog</a>, including the ones that fixed something.</li>
<li><strong>Watch the network.</strong> The <a href="${rel}docs/security.html">security overview</a> lists every request the app makes, and the <a href="${rel}legal/privacy.html">privacy policy</a> lists every data flow, in plain words.</li>
<li><strong>Host it yourself.</strong> The <a href="${rel}docs/self-hosting.html">self-hosting guide</a> covers running a copy on your own domain or intranet if your policies require it.</li>
<li><strong>Run the checks.</strong> The same build and test suite that produces this site is public, so the claims above can be reproduced rather than taken on trust.</li>
<li><strong>Leave if it does not fit.</strong> Start free with no card, try Pro for ${TRIAL_DAYS} days, and if it still is not right, ask for a refund within ${REFUND_DAYS} days. The details are on the <a href="${rel}pricing/">pricing page</a>.</li>
</ul>

<h2>What Clausery does not do</h2>
<p>Being clear about the edges is more useful than a longer feature list. Clausery does not:</p>
<ul>
<li>collect payments, or act as a bank;</li>
<li>provide electronic signatures, so sign with the service you already use or on paper;</li>
<li>host a client portal, schedule meetings or keep a CRM;</li>
<li>give legal, tax or financial advice, and it is not a law firm;</li>
<li>promise a document is right for your jurisdiction: the templates are general samples you review and adapt.</li>
</ul>
<p>What remains outside Clausery is a decision about your own process, not a missing feature. The <a href="${rel}docs/">documentation</a> explains the handoffs, and the <a href="${rel}about/">about page</a> covers the commercial model.</p>

<h2>What it costs</h2>
<p>The library is free: all ${LIB.length} Word templates, ${CLAUSES.length} clause explanations, the guides and ${TOOLS.length} calculators, with no sign-up. Automating up to ${PLANS.free.maxTemplates} of your own templates is free too. Pro is $${PRICES.pro} per user per month ($${PRICES.proYearly} per year) and adds unlimited own templates, calculations in them, documents from a spreadsheet, an encrypted workspace and client intake forms. Team is $${PRICES.team} a month for five seats. The <a href="${rel}pricing/">pricing page</a> has the full plan matrix.</p>

<h2>Who it is for</h2>
<p>If you want the detail for a particular job, these pages set out the workflow, the wording and the limits:</p>
<ul>
<li><a href="${rel}for/freelancers.html">Freelancers</a>: quotes, statements of work, invoices and chasing payment.</li>
<li><a href="${rel}for/consultants.html">Consultants</a>: proposals, scopes of work and contractor agreements.</li>
<li><a href="${rel}for/law-firms.html">Law firms</a>: client questionnaires, matter documents and local processing.</li>
<li><a href="${rel}for/hr-teams.html">HR teams</a>: offer letters, warnings, promotions and handovers.</li>
<li><a href="${rel}for/landlords.html">Landlords and tenants</a>: leases, notices, receipts and deposits.</li>
</ul>

<h2>Questions</h2>
${faqHtml(FAQ)}

<p style="margin-top:2rem"><a class="btn btn-primary btn-lg" href="${rel}app/#/start/invoice">Make an invoice, free</a> <a class="btn btn-lg" href="${rel}templates/">Browse ${LIB.length} free templates</a></p>
<p class="small muted" style="margin-top:1rem">Clausery is software, not a law firm, and does not give legal advice. Features and prices are described on the <a href="${rel}pricing/">pricing page</a> and configured in one place, so the app and this site cannot disagree.</p>
</div></section>`,
  },
];
