import { esc, faqLd, SITE, LASTMOD, LASTMOD_LONG } from '../tools/partials.mjs';

const PATH = 'guides/how-to-save-an-invoice-as-pdf.html';
const TITLE = 'How to save an invoice as PDF from Word or Clausery';
const DESCRIPTION = 'Make an invoice PDF from your Word file or the free Clausery app. Follow the export steps, check the layout and totals, and keep an editable copy.';
const SOURCES = [
  ['Microsoft: save or convert to PDF in Office desktop apps', 'https://support.microsoft.com/en-au/office/collab-files/save-or-convert-to-pdf-or-xps-in-office-desktop-apps'],
  ['Microsoft: save or convert to PDF on your Mac', 'https://support.microsoft.com/en-us/word/save-or-convert-to-pdf-on-your-mac'],
  ['Google: print from Chrome', 'https://support.google.com/chrome/answer/1069693?hl=en'],
];
const FAQ = [
  ['Can I make a PDF invoice for free?', 'Yes. Fill in a free Clausery library invoice, go to Review & generate and choose Print / Save as PDF. Select a PDF destination in your browser or system print dialog. Availability and wording depend on your device; no Clausery account or paid plan is needed.'],
  ['Can I still edit the invoice after saving a PDF?', 'Keep the .docx and the saved Clausery draft. Change the draft and generate a new Word file or PDF. Editing the PDF does not update the draft, and exporting a Word file does not recalculate amounts you changed by hand.'],
  ['Why does the browser PDF look different from Word?', 'Clausery renders an approximate document preview in the browser. Fonts, page breaks, headers and margins can differ from Word. For a layout you have checked in Word, export the downloaded .docx to PDF from Word instead.'],
  ['Does saving a PDF mean the invoice is paid?', 'No. A PDF is a file format, not proof of payment. Enter only payments actually received, and make a separate payment receipt when money arrives.'],
  ['Does the history prove that a PDF was saved or sent?', 'No. The history records the print action and the answers used. The browser does not tell Clausery whether you saved a file, printed it or cancelled the dialog. Keep the actual issued PDF and your sending record.'],
];

export const pages = [{
  path: PATH, title: TITLE, description: DESCRIPTION, feed: true, published: '2026-10-09',
  extraHead: faqLd(FAQ) + `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: TITLE, description: DESCRIPTION, datePublished: '2026-10-09', dateModified: LASTMOD, image: `${SITE}assets/og.png`, mainEntityOfPage: `${SITE}${PATH}`, citation: SOURCES.map(([, url]) => url), author: { '@type': 'Organization', name: 'Clausery', url: SITE }, publisher: { '@type': 'Organization', name: 'Clausery', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}assets/icon-512.png` } } })}</script>`,
  body: (rel) => `<section class="section"><div class="wrap prose">
<nav class="small muted" aria-label="Breadcrumb"><a href="${rel}">Home</a> › <a href="${rel}guides/">Guides</a></nav>
<h1>${TITLE}</h1>
<p class="small muted guide-meta">Published <time datetime="2026-10-09">9 October 2026</time><!--upd--> · Updated <time datetime="${LASTMOD}">${LASTMOD_LONG}</time><!--/upd--></p>
<p class="lead">Prepare and check your invoice first, then save a PDF copy for your client. You can export a completed Word invoice from Word, or use Print / Save as PDF in the free Clausery app. Keep the editable file as well.</p>
<p><a class="btn btn-primary" href="${rel}app/#/start/invoice">Make an invoice, free</a> · <a href="${rel}templates/invoice.html">See the Word invoice template</a></p>
<nav class="small" aria-label="On this page"><a href="#choose">Choose a route</a> · <a href="#app-pdf">Save from Clausery</a> · <a href="#word-pdf">Export from Word</a> · <a href="#check">Check the PDF</a> · <a href="#questions">Questions</a></nav>
<h2 id="choose">Word file or PDF invoice: which should you keep?</h2>
<p>A Word file is useful when you need to change wording, letterhead or layout. A PDF gives your client a copy to open and read without working in your Word template. Keep both: for example, <code>INV-0042.docx</code> for editing and <code>INV-0042.pdf</code> for the version you issue.</p>
<div class="table-wrap" tabindex="0"><table class="compare"><caption>Two ways to create the invoice PDF</caption><thead><tr><th scope="col">Route</th><th scope="col">Useful when</th><th scope="col">Check before sending</th></tr></thead><tbody><tr><th scope="row">Clausery → print to PDF</th><td>You want a quick copy from your completed answers</td><td>The browser preview, page size, margins and every page of the saved file</td></tr><tr><th scope="row">Clausery → .docx → Word → PDF</th><td>You want to edit or check the layout in Word first</td><td>Any changed totals, comments, tracked changes and the exported file</td></tr></tbody></table></div>
<h2 id="app-pdf">Save an invoice as PDF from Clausery</h2>
<ol><li><strong>Fill in the invoice.</strong> Enter business and client details, a unique invoice number, issue and due dates, descriptions, quantities and prices. Set any discount, tax and payments received that apply.</li><li><strong>Review the answers and amounts.</strong> Open <em>Review &amp; generate</em>. Resolve missing answers before issuing the invoice; generating with missing answers leaves blanks.</li><li><strong>Choose Print / Save as PDF.</strong> The app prepares the document preview before opening your browser's print dialog.</li><li><strong>Select a PDF destination.</strong> In desktop Chrome, choose <em>Save as PDF</em>. Other browsers and operating systems may offer a different PDF option. Review paper size, orientation and margins; turn off browser headers and footers if they add the page URL or date to the invoice.</li><li><strong>Save and reopen the file.</strong> Give it a clear invoice reference, then inspect every page of the saved PDF before attaching it to a message.</li></ol>
<p>The app's document preview is an approximation of the Word file. If your logo, letterhead or page breaks need adjustment, download the .docx and use the Word route below. PDF saving happens through the browser or system dialog; Clausery does not upload your invoice contents to an online converter.</p>
<h2 id="word-pdf">Convert the completed Word invoice to PDF</h2>
<p>Choose <em>Download .docx</em> in Clausery and open that completed file in Word. This is different from the base template download, which contains placeholder tags rather than your finished answers.</p>
<ul><li><strong>Word on Windows:</strong> use File → Save As or Save a Copy, choose a local folder, select PDF as the file type and save. Menu wording depends on your Word version.</li><li><strong>Word on Mac:</strong> use File → Save As, give the PDF a name, select PDF under File Format and choose Export.</li></ul>
<p>Keep the original .docx. Before exporting, check the document view, page breaks and whether comments or tracked changes are included. If you changed quantities, rates or tax directly in Word, update the totals yourself or regenerate the invoice from your Clausery draft; the downloaded amounts do not keep calculating in Word.</p>
<h2 id="check">Check the finished PDF before sending</h2>
<p>For an illustrative invoice before tax, three hours at $80 produces $240; a $60 fixed-fee item makes a $300 subtotal. If $100 has actually arrived, the balance is $200. Confirm those values in the saved PDF, not just in the questionnaire. An unpaid deposit request does not reduce the balance.</p>
<ul><li>Match the client name, invoice number and project or purchase-order reference to the job.</li><li>Check issue date, due date, currency, line amounts, tax settings and the final balance.</li><li>Read bank details carefully and check any payment links.</li><li>Inspect page breaks, cropped tables, tiny text and unexpected blank pages.</li><li>Remove unfinished tags, draft comments and browser-added headers if present.</li><li>Save the issued PDF, the editable Word file and a backup of your draft.</li></ul>
<p>If you correct an issued invoice, retain the original record and follow your bookkeeping process rather than silently replacing it. A PDF is not a payment receipt, an e-signature service or a guarantee against editing.</p>
<h2 id="questions">Questions about invoice PDFs</h2><div class="faq">${FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
<h2>Sources</h2><ul class="sources">${SOURCES.map(([label, url]) => `<li><a href="${esc(url)}" rel="noopener">${esc(label)}</a></li>`).join('')}</ul>
<!--nav--><p>Your PDF is ready? Use the <a href="${rel}guides/invoice-email-template.html">invoice email generator</a> to write the sending message or a polite payment reminder.</p><h2>Choose the invoice for your job</h2><p><a href="${rel}invoice-templates/deposit-invoice.html">Request a deposit</a> · <a href="${rel}invoice-templates/hourly-invoice.html">Bill by the hour</a> · <a href="${rel}invoice-templates/final-invoice.html">Show the final balance</a></p><p><a href="${rel}business-document-kit/">Get the six-template business document kit</a> or read <a href="${rel}guides/how-to-write-an-invoice.html">what to include in an invoice</a>.</p><!--/nav-->
</div></section>`,
}];
