// About and contact pages: who runs Clausery, how it makes money, and how to reach the people behind it.
import { SITE, REPO_URL, KEY_REQUEST_URL, CONTACT_EMAIL, mailto, ANALYTICS_ON, ONLINE_KEYS } from '../tools/partials.mjs';
import { LIB } from './library.mjs';

const ld = (o) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...o })}</script>`;
const ORG = { '@type': 'Organization', name: 'Clausery', url: SITE, logo: `${SITE}assets/icon-512.png`, email: CONTACT_EMAIL, sameAs: [REPO_URL] };
const issue = (form) => `${REPO_URL}/issues/new?template=${form}`;

// The ways to get in touch, in the order people most often need them. All of them start an email; bug reports can also
// go to the public issue tracker, and security reports to GitHub's private reporting.
const CHANNELS = [
  ['Ask a question or send feedback', 'Questions about the app, a template or a calculator, feature ideas, and press or partnership enquiries.', mailto('Question about Clausery'), 'Email a question'],
  ['Request a Pro or Team key', 'Buy a license, ask for a 14-day trial key, or claim the nonprofit, legal aid or education discount.', KEY_REQUEST_URL, 'Request a key'],
  ['Request a template', 'Tell us which document you draft again and again. The most requested templates are built first.', mailto('Template request'), 'Request a template'],
  ['Report a problem', 'Something in the app, a template, a calculator or the website does not work as it should. Developers can also <a href="' + issue('bug-report.yml').replace(/&/g, '&amp;') + '" rel="noopener">open a GitHub issue</a>.', mailto('Problem report'), 'Report a problem'],
];

export const pages = [
  {
    path: 'about/', title: 'About Clausery',
    description: `Why Clausery exists, how it is built and how it makes money: free Word templates and browser-only document automation, with no uploads, no tracking and no ads.`,
    extraHead: ld({ '@type': 'AboutPage', name: 'About Clausery', url: `${SITE}about/`, mainEntity: ORG }),
    body: (rel) => `<section class="section"><div class="wrap prose">
<h1>About Clausery</h1>
<p class="lead">Clausery makes the documents people draft every week faster to produce, without asking them to upload anything. Your templates, answers and finished documents stay on your own computer.</p>
<h2>Why it exists</h2>
<p>Law firms, HR teams, landlords and freelancers fill in the same documents over and over: NDAs, offer letters, leases, invoices and contracts. Document automation saves hours, but the established tools are cloud services, typically priced from about $83 to $417 a month, and they work by uploading your templates and your clients' details to the vendor. For anyone with a duty of confidentiality, that upload is the problem.</p>
<p>Clausery removes it. The app is a folder of static files that runs in your browser: it reads an ordinary Word template, asks you its questions, and builds the finished .docx on your device. There is no vendor database, so there is nothing of yours for us to lose, sell or hand over.</p>
<h2>What is free, and how Clausery makes money</h2>
<ul>
  <li><strong>The template library is free.</strong> All ${LIB.length} <a href="${rel}templates/">Word templates</a>, the <a href="${rel}clauses/">clause library</a>, the <a href="${rel}guides/">guides</a> and the <a href="${rel}free-tools/">calculators</a> are free, with no sign-up. Library templates never count towards any plan limit.</li>
  <li><strong>Automating your own templates is free for three.</strong> Upload up to three of your own Word templates and generate unlimited documents from them.</li>
  <li><strong>Pro pays for the work.</strong> Firms that automate more of their own documents, or need calculations, encryption or client intake forms, buy a <a href="${rel}pricing/">Pro or Team license</a>.</li>
</ul>
<p>${ANALYTICS_ON ? 'There are no ads, no affiliate links and no tracking cookies, and we never sell or share data. The app has no analytics at all; this website counts anonymous page views with Cloudflare Web Analytics, which uses no cookies and does not track individual visitors.' : 'There are no ads, no affiliate links, no analytics and no tracking cookies, and we never sell or share data.'} That is not a policy we could quietly change: the app has no server to send your data to.</p>
<h2>How it is built</h2>
<ul>
  <li>Plain HTML, CSS and JavaScript modules, with no framework and no third-party requests at runtime.</li>
  <li>Served as static files by GitHub Pages, and installable as an offline app.</li>
  <li>The code is published on <a href="${REPO_URL}" rel="noopener">GitHub</a>, so anyone can check what it does, and every release is listed in the <a href="${rel}changelog.html">changelog</a>.</li>
  <li>Optional encryption of everything stored in the browser (AES-256-GCM)${ONLINE_KEYS ? ', and license checks that send only the key' : ', and license keys verified offline with a signature'}. See the <a href="${rel}docs/security.html">security overview</a>.</li>
</ul>
<h2>What Clausery is not</h2>
<p>Clausery is software, not a law firm, and it does not give legal advice. The templates are general samples written in plain English; laws differ between countries and states, so have a document reviewed for your situation before you rely on it.</p>
<h2>Get in touch</h2>
<p>Questions, template requests, key requests and bug reports all go through the <a href="${rel}contact/">contact page</a>. Writers and directories will find facts, descriptions and images in the <a href="${rel}press/">press kit</a>.</p>
</div></section>`,
  },
  {
    path: 'contact/', title: 'Contact Clausery',
    description: 'Contact Clausery: ask a question, request a Pro key or a 14-day trial, suggest a template, report a problem, or report a security issue privately.',
    extraHead: ld({ '@type': 'ContactPage', name: 'Contact Clausery', url: `${SITE}contact/`, about: ORG }),
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem">
<h1>Contact Clausery</h1>
<p class="lead">Email <a href="${mailto('')}">${CONTACT_EMAIL}</a>. A person reads every message, and no account is needed. The buttons below start an email with the right subject line:</p>
<div class="grid grid-2" style="margin-top:1.5rem">
${CHANNELS.map(([h, p, href, cta]) => `  <div class="feature"><h2 style="font-size:1.15rem;margin-top:0">${h}</h2><p>${p}</p><p style="margin-top:1rem"><a class="btn" href="${href.replace(/&/g, '&amp;')}">${cta}</a></p></div>`).join('\n')}
  <div class="feature"><h2 style="font-size:1.15rem;margin-top:0">Report a security issue</h2><p>Report vulnerabilities privately with GitHub's private reporting. Please do not open a public issue for them.</p><p style="margin-top:1rem"><a class="btn" href="${REPO_URL}/security/advisories/new" rel="noopener">Report privately</a></p></div>
  <div class="feature"><h2 style="font-size:1.15rem;margin-top:0">Press and listings</h2><p>Product facts, short and long descriptions, screenshots and the logo, free to use.</p><p style="margin-top:1rem"><a class="btn" href="${rel}press/">Open the press kit</a></p></div>
</div>
<h2 style="margin-top:2.5rem">Before you write</h2>
<ul>
  <li><strong>Leave out client details and confidential documents.</strong> We never need them to help, and Clausery is built so they never leave your computer.</li>
  <li><strong>If the buttons do not open your email app,</strong> copy the address: ${CONTACT_EMAIL}.</li>
  <li><strong>Many answers are already written:</strong> see the <a href="${rel}docs/faq.html">FAQ</a>, the <a href="${rel}docs/">documentation</a> and the <a href="${rel}pricing/#faq">pricing questions</a>.</li>
</ul>
<p class="small muted" style="margin-top:2rem">Clausery is software, not a law firm, and cannot advise on your legal situation. The code and public issues are on <a href="${REPO_URL}" rel="noopener">GitHub</a>.</p>
</div></section>`,
  },
];
