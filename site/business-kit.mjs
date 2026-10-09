import { LIB } from './library.mjs';
import { faqLd, esc } from '../tools/partials.mjs';

const SLUGS = ['quote', 'statement-of-work', 'invoice', 'payment-receipt', 'purchase-order', 'credit-note'];
const PURPOSES = ['Agree the prices, tax settings and quote validity.', 'Set out the deliverables, scope, milestones and responsibilities.', 'Request payment with line items, totals and a due date.', 'Confirm a payment actually received and record its reference.', 'Tell a supplier what you are ordering and where it should go.', 'Record a credit or correction against an earlier invoice.'];
const ITEMS = SLUGS.map((slug, i) => ({ ...LIB.find((t) => t.slug === slug), purpose: PURPOSES[i] }));
if (ITEMS.some((t) => !t.file)) throw new Error('Business kit: missing library template');
const FAQ = [
  ['Is the kit really free?', 'Yes. The six library templates are free to download and fill in online, with no account or email signup. They do not count toward the three-own-template limit.'],
  ['Are these finished documents or templates?', 'They are ordinary Word templates containing placeholder tags. Use the linked online questionnaire to create a completed document, or edit the tags and optional sections carefully in Word. The download includes instructions.'],
  ['Can I edit the output in Word?', 'Yes. The online questionnaire produces an editable .docx. You can reopen the draft, change the answers and generate it again, or edit the downloaded document in Word.'],
  ['Where are my answers saved?', 'In the browser on your device. They are not synced to other devices. Download a backup from app Settings before clearing browser data or moving to another device.'],
];
export const pages = [{
  path: 'business-document-kit/', title: 'Free small business Word document kit: 6 templates',
  description: 'Download six free Word templates for small businesses: quote, invoice, payment receipt, purchase order, credit note and statement of work. No email signup.',
  ogImage: 'assets/marketing/business-kit-social.png', extraHead: faqLd(FAQ),
  body: (rel) => `<section class="section"><div class="wrap prose">
<h1>Six free Word templates for your next business job</h1>
<p class="lead">Keep the quote, scope and payment paperwork together. Download six editable Word templates in one kit, or fill in each one online and get a completed .docx. No account and no email signup.</p>
<div class="actions" style="display:flex;gap:.75rem;flex-wrap:wrap;margin:1.5rem 0"><a class="btn btn-primary btn-lg" href="${rel}samples/clausery-small-business-kit.zip" download>Download the free Word kit (.zip)</a><a class="btn btn-lg" href="${rel}app/#/start/invoice">Make an invoice online</a></div>
<p class="small muted">Includes six .docx templates and a README with setup instructions. Online totals use the amounts and tax settings you choose.</p>
<h2>What is in the kit?</h2><div class="table-wrap"><table class="compare"><thead><tr><th scope="col">Document</th><th scope="col">Use it to</th><th scope="col">Start online</th></tr></thead><tbody>${ITEMS.map((t) => `<tr><th scope="row"><a href="${rel}templates/${t.slug}.html">${esc(t.name)}</a></th><td>${esc(t.purpose)}</td><td><a href="${rel}app/#/start/${t.slug}">Fill it in free</a></td></tr>`).join('')}</tbody></table></div>
<h2>A simple document sequence</h2><ol><li><strong>Before the job:</strong> send a price quote and define the work in a statement of work.</li><li><strong>When payment is due:</strong> issue an invoice with the agreed reference and deadline.</li><li><strong>When money arrives:</strong> send a payment receipt and save the payment reference.</li><li><strong>When something changes:</strong> record an appropriate credit note against the original invoice. Use a purchase order when you need to order from a supplier.</li></ol>
<p>For staged projects, start with a <a href="${rel}invoice-templates/deposit-invoice.html">deposit invoice</a>, bill time with an <a href="${rel}invoice-templates/hourly-invoice.html">hourly invoice</a>, or close the project with a <a href="${rel}invoice-templates/final-invoice.html">final balance invoice</a>.</p>
<p>After a payment arrives, follow <a href="${rel}guides/how-to-write-a-payment-receipt.html">the payment receipt guide</a> to record the amount received and check any remaining balance.</p>
<h2>How to use the Word files</h2><p>The download contains template tags such as <code>{client_name}</code>, optional sections and repeating line items. The quickest route to a completed document is the online questionnaire linked above. If you edit a template directly in Word, replace its tags, remove conditional markers, check repeated rows and calculate the totals yourself. The README explains those steps.</p>
<p>Need a PDF copy for your client? Follow <a href="${rel}guides/how-to-save-an-invoice-as-pdf.html">the invoice-to-PDF guide</a> to save from the app or Word and keep the editable original.</p>
<!--nav--><p>Write the message with the <a href="${rel}guides/invoice-email-template.html">free invoice email generator and payment reminder examples</a>.</p><!--/nav-->
<h2>Before you send a document</h2><ul><li>Check the business and client names, reference number, dates and payment details.</li><li>Use the scope, rates, deadlines and deposit terms actually agreed with the client.</li><li>Check totals, discounts and any tax settings that apply to your business.</li><li>Record payments as received only after the money has arrived.</li><li>Keep the editable document and a record of the final version you sent.</li></ul>
<p class="small muted">These are general document samples. You remain responsible for their content and for requirements that apply to your business and location.</p>
<h2>Questions</h2><div class="faq">${FAQ.map(([q,a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
<p style="margin-top:2rem"><a class="btn btn-primary" href="${rel}samples/clausery-small-business-kit.zip" download>Get all six templates</a> · <a href="${rel}templates/">Explore the full free library</a></p>
</div></section>`,
}];
