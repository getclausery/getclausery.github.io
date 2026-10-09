// Each billing page has a distinct calculation, example and app starting point, rather than a renamed generic invoice.
import { esc, faqLd, LASTMOD, LASTMOD_LONG } from '../tools/partials.mjs';
import { WORKFLOW_PRESETS } from '../app/lib/presets.js';

export const WORKFLOWS = [
  {
    slug: 'deposit-invoice', name: 'Deposit invoice', title: 'Free deposit invoice template for Word',
    description: 'Make a deposit invoice in Word: calculate the percentage, request only the deposit, and keep the final balance clear. Free, editable .docx, no sign-up.',
    intro: 'Ask for an agreed upfront payment before the job starts. This deposit invoice opens with one deposit line ready for your project reference and amount, then gives you an editable Word file. It requests the deposit; it does not say that the money has already been paid.',
    when: 'Use this when your quote or agreement sets an upfront payment: for example, a design project, materials for a job, or a booking. Agree the amount and payment deadline with your client before you invoice. Once the payment arrives, send a payment receipt and keep the deposit invoice number with your records.',
    example: `<p>Illustrative example, before tax: a $2,000 project with an agreed 30% deposit.</p><table class="compare"><caption>Deposit requested now and balance to invoice later</caption><thead><tr><th scope="col">Calculation</th><th scope="col">Amount</th></tr></thead><tbody><tr><td>Agreed project price</td><td>$2,000.00</td></tr><tr><td>Deposit: $2,000 × 30%</td><td>$600.00</td></tr><tr><td>Remaining project amount</td><td>$1,400.00</td></tr></tbody></table><p>The deposit invoice has one line for <strong>$600</strong>, not a $2,000 line with $600 marked as paid. The latter would ask for the wrong balance before the client has paid anything.</p>`,
    steps: [
      ['Agree the deposit', 'Use the amount or percentage in your accepted quote. Identify the project, the full price and when the rest is due. The calculator below can split an agreed amount for you.'],
      ['Enter your business and client details', 'Use a new invoice number, an issue date and a due date. If the client has a purchase order or project reference, add it so the request reaches the right person.'],
      ['Invoice only the upfront amount', 'Keep Quantity at 1 and enter the agreed deposit as Unit price. Replace the line description with your project or quote reference. Check any tax settings before downloading.'],
      ['Track the payment and the final balance', 'When paid, make a payment receipt referencing this invoice. On the final invoice, enter the full project total and subtract payments actually received using Amount already paid.'],
    ],
    checks: ['Do not enter the deposit as already paid merely because you requested it.', 'Do not invoice the full project price when you only mean to request an upfront stage.', 'Keep the project reference consistent across the quote, deposit invoice, receipt and final invoice.', 'Check the tax treatment and timing that apply to your business; this percentage calculator only splits an amount.'],
    faq: [
      ['What is a deposit invoice?', 'An invoice requesting an agreed upfront part of a project price. It is different from a receipt, which confirms a payment that has already arrived.'],
      ['How do I invoice a 30% deposit?', 'Multiply the agreed project price by 0.30. For a $2,000 project, request $600 on the deposit invoice and keep a record of the $1,400 remaining before any further adjustments.'],
      ['Can I choose a different deposit percentage?', 'Yes. Use the percentage you agreed with your client. The calculator accepts 0% to 100%; Clausery does not prescribe a deposit policy.'],
      ['Is a deposit invoice the same as a pro forma invoice?', 'No. This page creates an invoice requesting an agreed deposit. It does not create a pro forma document or determine its accounting or tax treatment.'],
      ['How do I deduct the deposit on the final invoice?', 'Open the final invoice starter, enter the full project price, and put the deposit actually received in Amount already paid. The app calculates the balance due.'],
    ],
  },
  {
    slug: 'hourly-invoice', name: 'Hourly invoice', title: 'Free hourly invoice template for Word',
    description: 'Invoice hours in Word: enter work dates, tasks, hours and hourly rates, with line totals calculated. Free editable .docx for freelancers and consultants.',
    intro: 'Bill time clearly: show what you did, when you did it, how many hours it took and the agreed hourly rate. This starter opens an invoice with an hourly-service line, supports fractional hours, and calculates each amount before you download the Word file.',
    when: 'Use an hourly invoice for consulting, development, administration or other work billed by time. Keep your time record alongside the invoice. If some work is a fixed project fee, put it on a separate line with Quantity 1 rather than presenting it as hours.',
    example: `<p>Illustrative example, before tax: two tasks at different hourly rates.</p><table class="compare"><caption>Hours multiplied by the agreed rate</caption><thead><tr><th scope="col">Work</th><th scope="col">Hours</th><th scope="col">Rate</th><th scope="col">Amount</th></tr></thead><tbody><tr><td>Research, 5–7 October</td><td>3.5</td><td>$80.00</td><td>$280.00</td></tr><tr><td>Implementation, 8 October</td><td>6</td><td>$100.00</td><td>$600.00</td></tr><tr><th scope="row" colspan="3">Subtotal</th><td>$880.00</td></tr></tbody></table><p>Thirty minutes is <strong>0.5 hours</strong>, not 0.30 hours. Ninety minutes is 1.5 hours. Convert minutes to hours by dividing by 60, using the rounding rule you agreed with your client.</p>`,
    steps: [
      ['Match the agreement and time record', 'Check your agreed rate, billing period and any time-rounding rule. Include dates or a timesheet reference so the client can match the hours.'],
      ['Use Quantity for hours', 'Enter 3.5 for three hours and thirty minutes, for example. Put the hourly rate in Unit price. The app works out Quantity × Unit price.'],
      ['Separate tasks, rates and expenses', 'Add another line when the task or rate changes. For an agreed fixed fee or an expense charged as one amount, use Quantity 1 and a clear description.'],
      ['Review and download', 'Check dates, hours, amounts, tax if applicable, and the payment due date. Download the editable Word invoice or print it to PDF for sending.'],
    ],
    checks: ['Do not type 2.30 when you mean two hours and thirty minutes; use 2.5.', 'Do not combine different hourly rates into one unexplained total.', 'Do not add time the client did not agree to pay for; resolve a disputed entry before sending.', 'If you edit hours or rates in the downloaded Word file, update its printed totals too, or regenerate it from the saved draft.'],
    faq: [
      ['How do I show hours on an invoice?', 'Name the task and work dates in Description, enter hours in Quantity, and put the agreed hourly rate in Unit price. Each line amount is hours multiplied by rate.'],
      ['How do I invoice 45 minutes?', '45 divided by 60 is 0.75 hours. At $80 an hour, that line is $60, before any tax or adjustments.'],
      ['Can I use several hourly rates?', 'Yes. Add a separate line for each task or rate so the client can see how every amount was calculated.'],
      ['Does the Word file keep calculating when I edit it?', 'The downloaded file contains the amounts calculated by Clausery. If you change quantities or rates directly in Word, check and update the totals yourself, or change the saved Clausery draft and download it again.'],
    ],
  },
  {
    slug: 'final-invoice', name: 'Final invoice', title: 'Free final invoice template with balance due (Word)',
    description: 'Make a final invoice in Word: show the full project price, subtract deposits actually received, and calculate the remaining balance. Free, no sign-up.',
    intro: 'Close a job with a clear record of the full price and what is still owed. This final invoice starter switches on Amount already paid, so you can show the completed work, subtract actual payments and download an editable Word invoice with the balance due.',
    when: 'Use this full-project format when the final invoice is meant to reconcile the whole job. If you instead issue a separate invoice for each stage, check that your final stage bill does not charge for earlier stages again. Keep deposit and stage-invoice references in the note so both sides can follow the payment history.',
    example: `<p>Illustrative example, before tax: a completed $2,000 job with a $600 deposit already received.</p><table class="compare"><caption>Full project total less actual payment</caption><thead><tr><th scope="col">Invoice summary</th><th scope="col">Amount</th></tr></thead><tbody><tr><td>Completed project total</td><td>$2,000.00</td></tr><tr><td>Amount already paid</td><td>$600.00</td></tr><tr><th scope="row">Balance due</th><td>$1,400.00</td></tr></tbody></table><p>If the deposit was only requested and never paid, the amount already paid is <strong>$0</strong>. If you put only $1,400 in the project line and also deduct $600, you would understate the remaining balance as $800.</p>`,
    steps: [
      ['Confirm the final agreed price', 'Include approved changes and agreed adjustments. The line items should add up to the full amount this invoice is reconciling.'],
      ['Enter actual payments received', 'Keep The client has already paid part of it selected. Enter the combined payments received for this project in Amount already paid; do not include unpaid invoices.'],
      ['Identify the earlier paperwork', 'Use the note for the deposit invoice numbers and payment dates. Keep receipts alongside the invoice so the client can match every deduction.'],
      ['Check the balance and payment deadline', 'Review total minus amount paid, any tax settings, your new invoice number and the final due date. If payments exceed the final total, reconcile the overpayment before sending a payment request.'],
    ],
    checks: ['Do not deduct an unpaid deposit invoice as if the money had arrived.', 'Choose either a full-project reconciliation or separate stage bills; do not accidentally charge earlier stages twice.', 'Enter the combined actual payments, rather than only the most recent payment.', 'A paid invoice and a payment receipt are different records. Send the receipt when money arrives and keep both.'],
    faq: [
      ['How do I show a deposit already paid?', 'Enter the full project price in the items and the actual deposit received in Amount already paid. The app calculates and displays the balance due.'],
      ['Can I deduct several payments?', 'Yes. Add the payments actually received for this project and enter that combined amount. List the individual references in the invoice note for clarity.'],
      ['What if the deposit invoice is still unpaid?', 'Do not subtract it as a payment. Amount already paid should contain only money received. Reconcile the earlier request with your final invoice before sending.'],
      ['Can I reopen the invoice after another payment?', 'Yes. Open the saved draft, update Amount already paid, review the new balance and download the document again. Keep the original issued records as part of your bookkeeping.'],
    ],
  },
];
for (const w of WORKFLOWS) if (!WORKFLOW_PRESETS.invoice[w.slug]) throw new Error('Missing invoice workflow preset: ' + w.slug);

export const workflowLinks = (rel) => WORKFLOWS.map((w) => `<a href="${rel}invoice-templates/${w.slug}.html">${esc(w.name.toLowerCase())}</a>`).join(' · ');

export const invoiceWordHelp = (rel) => `<h2 id="make-invoice-in-word" style="margin-top:2.5rem">How to make an invoice in Word</h2>
<p>Choose the route that fits your work: fill this template in online to calculate the amounts first, or download the tagged Word template and replace its placeholders by hand. The completed online download is an editable .docx, so you can change the layout in Word.</p>
<ol><li><strong>Identify both businesses.</strong> Add your name and contact details, the client's billing details, a unique invoice number, the issue date and the due date.</li><li><strong>Itemize the work.</strong> For each line, enter a description, quantity and unit price. Use hours as the quantity for time-based work, and Quantity 1 for an agreed fixed fee.</li><li><strong>Review the amounts.</strong> The app calculates the subtotal, any discount, one tax rate and any balance after payments received. Check the tax settings that apply to your business.</li><li><strong>Download and send.</strong> Download the Word file for editing, or print it to PDF for sending. Keep the saved draft and a copy of the invoice you issued.</li></ol>
<div class="table-wrap" tabindex="0"><table class="compare"><caption>Choose how to prepare the invoice</caption><thead><tr><th scope="col">Route</th><th scope="col">What you get</th><th scope="col">How totals change</th></tr></thead><tbody><tr><td>Fill it in online</td><td>A completed editable Word file from your answers</td><td>Recalculated in Clausery as you enter quantities, prices and tax</td></tr><tr><td>Download the base template</td><td>A Word template with tags and optional sections to customize</td><td>Replace placeholders and check your arithmetic by hand</td></tr><tr><td>Edit the completed .docx</td><td>Your downloaded invoice with its calculated amounts</td><td>If you change prices or quantities in Word, update totals or regenerate the draft</td></tr></tbody></table></div>
<p>For the sending copy, follow <a href="${rel}guides/how-to-save-an-invoice-as-pdf.html">how to save an invoice as PDF from the app or Word</a>, including the layout and amount checks.</p>
<h2 style="margin-top:2.5rem">A simple invoice example</h2><p>Illustrative amounts, before tax: 3 hours at $80 is $240; one fixed-fee item at $60 makes the subtotal $300. If $100 has actually been received, the balance due is $200. A request for a deposit that has not been paid does not reduce that balance.</p>
<p>When the money arrives, <a href="${rel}guides/how-to-write-a-payment-receipt.html">write a payment receipt</a> that separates this payment from any remaining balance.</p>
<h2 style="margin-top:2.5rem">Pick the right billing task</h2><p>${workflowLinks(rel)}. Each opens the same invoice with the relevant starting lines or payment fields. For work-specific line items or country tax settings, <a href="${rel}invoice-templates/">browse all invoice starting points</a>.</p>`;

const calculator = (rel) => `<h2 id="deposit-calculator-heading">Work out your deposit and remaining balance</h2>
<p>Enter the agreed amount you want to split. Use the deposit result as the unit price in your deposit invoice. This calculator does not transfer the amount to the app or decide tax treatment.</p>
<div class="invoice-calculator"><form id="deposit-calculator" aria-labelledby="deposit-calculator-heading" class="grid grid-3" style="gap:1rem">
  <div><label for="deposit-amount">Agreed project amount</label><input id="deposit-amount" name="amount" type="number" min="0" max="1000000000000" step="0.01" value="2000" required></div>
  <div><label for="deposit-percentage">Deposit (%)</label><input id="deposit-percentage" name="percentage" type="number" min="0" max="100" step="0.01" value="30" required></div>
  <div><label for="deposit-currency">Currency</label><select id="deposit-currency" name="currency"><option value="USD">US dollars</option><option value="GBP">British pounds</option><option value="EUR">Euros</option><option value="CAD">Canadian dollars</option><option value="AUD">Australian dollars</option><option value="NZD">New Zealand dollars</option><option value="ZAR">South African rand</option></select></div>
</form>
<p id="deposit-result" role="status" aria-live="polite"><strong>$600.00 deposit · $1,400.00 remaining</strong></p>
<noscript><p>Without JavaScript: deposit = agreed amount × percentage ÷ 100. Remaining balance = agreed amount − deposit.</p></noscript></div>
<script type="module" src="${rel}invoice-templates/deposit-calculator.js"></script>`;

export const pages = WORKFLOWS.map((w) => ({
  path: `invoice-templates/${w.slug}.html`, title: w.title, description: w.description,
  extraHead: faqLd(w.faq) + (w.slug === 'deposit-invoice' ? `<style>
.invoice-calculator { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:1.5rem; margin:1.5rem 0; }
.invoice-calculator label { display:block; font-weight:600; margin-bottom:.5rem; }
.invoice-calculator input, .invoice-calculator select { width:100%; min-height:44px; padding:.55rem .65rem; border:1px solid var(--border-strong); border-radius:var(--radius-sm); background:var(--bg); color:var(--text); font:inherit; }
#deposit-result { font-size:1.1rem; font-weight:600; padding:1rem; margin:1rem 0 0; background:var(--accent-soft); border-radius:var(--radius-sm); }
</style>` : ''),
  body: (rel) => `<section class="section"><div class="wrap prose">
<nav class="small muted" aria-label="Breadcrumb"><a href="${rel}">Home</a> › <a href="${rel}invoice-templates/">Invoice templates</a> › ${esc(w.name)}</nav>
<h1>${esc(w.title)}</h1>
<p class="lead">${esc(w.intro)}</p>
<div class="actions" style="display:flex;gap:.75rem;flex-wrap:wrap;margin:1.5rem 0"><a class="btn btn-primary btn-lg" href="${rel}app/#/start/invoice/${w.slug}">Start this invoice, free</a><a class="btn btn-lg" href="${rel}samples/invoice.docx" download>Download the base Word template</a></div>
<p class="small muted">No sign-up. Editable .docx or print to PDF. Your answers stay in your browser. Updated <time datetime="${LASTMOD}">${LASTMOD_LONG}</time>.</p>
<p class="small">The online starter sets up this billing workflow. The base Word download uses the general invoice wording and tags; customize it by hand or use the starter to get a completed document.</p>
<nav class="small" aria-label="On this page"><a href="#when">When to use it</a> · <a href="#example">Worked example</a> · <a href="#steps">How to fill it in</a> · <a href="#checks">Before sending</a> · <a href="#questions">Questions</a></nav>
<h2 id="when">When to use a ${esc(w.name.toLowerCase())}</h2><p>${esc(w.when)}</p>
<h2 id="example">Worked example</h2><div class="table-wrap" tabindex="0">${w.example}</div>
${w.slug === 'deposit-invoice' ? calculator(rel) : ''}
<h2 id="steps">How to fill in this ${esc(w.name.toLowerCase())}</h2><ol>${w.steps.map(([h, p]) => `<li><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('')}</ol>
<h2 id="checks">Check these before sending</h2><ul>${w.checks.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
<h2>Word download or PDF?</h2><p>The Word file is editable: adjust layout or wording for your business. Its printed amounts are the values calculated when you downloaded it. Change amounts in your saved Clausery draft and download again to recalculate, or check the totals yourself after editing in Word. For a copy to send, follow the <a href="${rel}guides/how-to-save-an-invoice-as-pdf.html">invoice-to-PDF steps for the app or Word</a>. Check the saved file before sending it.</p>
<h2 id="questions">Questions about ${esc(w.name.toLowerCase())}s</h2><div class="faq">${w.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
<!--nav--><h2>The paperwork before and after this invoice</h2><ul><li><a href="${rel}templates/quote.html">Price quote: agree the scope, price and deposit before the job</a></li><li><a href="${rel}templates/invoice.html">General Word invoice template with tax and bank details</a></li><li><a href="${rel}templates/payment-receipt.html">Payment receipt: confirm money actually received</a></li><li><a href="${rel}templates/credit-note.html">Credit note: record a correction to an issued invoice</a></li><li><a href="${rel}guides/how-to-write-an-invoice.html">Invoice checklist, numbering and payment terms</a></li><li><a href="${rel}free-tools/invoice-due-date.html">Calculate the payment due date</a></li></ul>
<p>Send the finished invoice with a <a href="${rel}guides/invoice-email-template.html">short invoice email or payment reminder</a>.</p>
<h2>Choose another billing workflow</h2><p>${WORKFLOWS.filter((x) => x.slug !== w.slug).map((x) => `<a href="${rel}invoice-templates/${x.slug}.html">${esc(x.title)}</a>`).join(' · ')}</p><p><a href="${rel}invoice-templates/">Browse invoice templates by billing task, trade and country</a>.</p><!--/nav-->
</div></section>`,
}));
