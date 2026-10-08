// Press kit: facts, boilerplate and assets for journalists, directories and bloggers.
import { LIB } from './library.mjs';
import { REPO_URL, CONTACT_EMAIL, mailto } from '../tools/partials.mjs';
import { MARKETING_ASSETS } from './data/marketing-assets.mjs';
export const pages = [{
  path: 'press/', title: 'Press kit',
  description: 'Clausery press kit: free Word invoices, quotes and receipts for small businesses, with product facts, pricing, reusable images and contact details.',
  body: (rel) => `<section class="section"><div class="wrap prose">
<h1>Press kit</h1>
<p class="lead">Everything you need to write about or list Clausery. All text on this page may be quoted freely.</p>
<h2>In one sentence</h2>
<p>Clausery helps small businesses and freelancers make invoices, quotes and receipts in editable Word files, with calculated totals and document contents kept on their device.</p>
<h2>Short description</h2>
<p>Clausery makes invoices, quotes and receipts in Word for small businesses and freelancers. Answer the questions, check the calculated totals and download an editable .docx. Library templates are free, no account is required, and document contents stay in your browser. Deposit, hourly and final invoice starters support different billing stages.</p>
<h2>Long description</h2>
<p>Small businesses repeatedly prepare quotes, invoices and receipts. Clausery turns those documents into guided questions and creates editable Word output. Its invoice templates calculate line items, discounts, tax and balances from the values the user enters. Repeat documents can reuse the business details and continue the numbering saved in the same browser.</p>
<p>The <a href="${rel}invoice-templates/deposit-invoice.html">deposit invoice</a> requests an agreed upfront amount, the <a href="${rel}invoice-templates/hourly-invoice.html">hourly invoice</a> uses hours as quantities, and the <a href="${rel}invoice-templates/final-invoice.html">final invoice</a> deducts payments actually received. A <a href="${rel}business-document-kit/">free business document kit</a> brings six Word templates together in one download.</p>
<p>Document processing happens locally in the browser, and saved drafts stay in that browser's storage. The app works offline once its required files are available. Anonymous usage counts and online license checks are separate from document processing; neither receives document contents. Users can also automate their own Word templates. Pro adds unlimited own templates, calculations in those templates, workspace encryption, client intake forms and unlimited documents per spreadsheet.</p>
<h2>Facts</h2>
<table><tbody>
<tr><th scope="row">Launched</th><td>September 2026</td></tr>
<tr><th scope="row">Website</th><td><a href="${rel}">getclausery.github.io</a></td></tr>
<tr><th scope="row">Source and issues</th><td><a href="${REPO_URL}" rel="noopener">github.com/getclausery</a></td></tr>
<tr><th scope="row">Pricing</th><td>Free: every library template plus 3 of your own; Pro $19 per user per month; Team $49 per month for 5 seats; Enterprise on request</td></tr>
<tr><th scope="row">For</th><td>Small businesses, freelancers, consultants, agencies and service businesses</td></tr>
<tr><th scope="row">Platform</th><td>Any modern browser on desktop or mobile; installable; works offline</td></tr>
<tr><th scope="row">Free resources</th><td><a href="${rel}templates/">${LIB.length} Word templates</a>, <a href="${rel}free-tools/">drafting tools</a>, <a href="${rel}guides/">guides</a></td></tr>
<tr><th scope="row">Document privacy</th><td>Templates, answers and generated documents are processed on the user's device. Pro includes optional workspace encryption. Cookieless website analytics, anonymous app usage counts and online license checks are explained in the <a href="${rel}legal/privacy.html">privacy policy</a>.</td></tr>
<tr><th scope="row">Paid checkout</th><td>Keys are currently requested by email. Published prices are in USD; hosted checkout is not yet linked on the site.</td></tr>
</tbody></table>
<h2>Images</h2>
<ul>
<li><a href="${rel}assets/screenshot-invoice.png">Screenshot: invoice questionnaire with calculated document preview</a> (1200×800 PNG)</li>
<li><a href="${rel}assets/screenshot-designer.png">Screenshot: template designer</a> (1200×800 PNG)</li>
<li><a href="${rel}assets/og.png">Social card</a> (1200×630 PNG)</li>
<li><a href="${rel}assets/icon.svg">Logo mark</a> (SVG) and <a href="${rel}assets/icon-512.png">512×512 PNG</a></li>
</ul>
<h2>Images for resource lists and Pinterest</h2>
<p>These original graphics may be reused when linking to the matching Clausery resource. Worked amounts are illustrative examples before tax. Each vertical image is 1000×1500 pixels.</p>
<div class="grid grid-3">${MARKETING_ASSETS.map((a) => `<figure style="margin:0"><a href="${rel}assets/marketing/${a.slug}.png"><img src="${rel}assets/marketing/${a.slug}.png" width="1000" height="1500" alt="${a.alt}" loading="lazy" style="width:100%;height:auto;border-radius:12px"></a><figcaption><a href="${rel}${a.path}">${a.title}</a> · <a href="${rel}assets/marketing/${a.slug}.png" download>Download PNG</a></figcaption></figure>`).join('')}</div>
<h2>Useful links to share</h2>
<ul><li><a href="${rel}business-document-kit/">Six free business Word templates in one kit</a></li><li><a href="${rel}templates/invoice.html">Free Word invoice template</a></li><li><a href="${rel}invoice-templates/">Invoice templates by trade, country and billing task</a></li><li><a href="${rel}templates/quote.html">Price quote template</a></li><li><a href="${rel}templates/payment-receipt.html">Payment receipt template</a></li></ul>
<h2>Contact</h2>
<p>Press, listings and partnerships: <a href="${mailto('Clausery press or partnership enquiry')}">${CONTACT_EMAIL}</a>, or use the <a href="${rel}contact/">contact page</a>. You may link to any resource page and embed the <a href="${rel}free-tools/">free calculators</a> without asking.</p>
</div></section>`,
}];
