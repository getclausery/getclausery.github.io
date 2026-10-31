// Hub / variant pages that target high-intent long-tail keywords and link back into the template pages.
import { esc, faqLd, faqHtml, LASTMOD, LASTMOD_LONG, crumbsLd } from '../tools/partials.mjs';

// Each hub: path, title (<60 chars), description (<160), eyebrow, h1, lead intro, sections, faq.
const HUBS = [
  {
    path: 'invoice-templates/blank-invoice.html', section: 'invoice-templates', sectionLabel: 'Invoice templates',
    title: 'Blank Invoice Template | Fillable PDF/Word (Free, No Signup)',
    description: 'Free blank invoice template. Fill in online, download as printable PDF or editable Word, and send to clients. Calculates totals for you.',
    h1: 'Blank invoice template',
    lead: 'Start with an empty invoice: add your business details, your client, the line items and your payment terms. Fill it in online to have totals and tax calculated for you, then download the blank invoice as a printable PDF or an editable Word file.',
    introParagraphs: [
      'A blank invoice only needs a few pieces of information: who you are, who you are billing, what the charge is for, and how to pay. The fields stay empty until you fill them in, so you can reuse the same blank invoice template for every client or job.',
      'This blank invoice template calculates line amounts, subtotal, one tax rate, any discount and the balance due as you type. It saves your business details in your browser for the next invoice, but never uploads anything.',
    ],
    bullets: [
      ['Invoice number and dates', 'A unique invoice number, the issue date, the due date (for example NET 30 or due on receipt), and an optional date of supply.'],
      ['Your and the client details', 'Business name, address, email, phone and an optional tax number such as a VAT or GST/HST ID.'],
      ['Line items', 'Description of the goods or services, quantity, unit price and amount. Use hours as quantity for time-based work; use Quantity 1 for a fixed fee.'],
      ['Totals and tax', 'Subtotal, optional discount, one tax rate and total. If you have already received part payment, subtract it to show the balance due.'],
      ['How to pay', 'Bank details or other payment methods and the payment deadline. Add late-fee wording if your policy requires it.'],
    ],
    howTo: [
      ['Open the blank template', 'Start the blank invoice free below. Your business details are pre-filled if you have used Clausery before.'],
      ['Add your client and the invoice numbers', 'Use a new invoice number, today\'s date, and the agreed due date. Use the invoice due date calculator for common terms.'],
      ['Fill in the line items', 'Enter each item or task with its quantity and rate. Add a separate line when the rate or description changes.'],
      ['Check totals, tax and discount', 'Review the subtotal, any discount, tax and total. If a deposit has been paid, mark the client as already having paid part and enter the amount.'],
      ['Download as PDF or Word', 'Download an editable Word file to adjust the layout, or print to PDF for sending. Always open the saved copy and check it before emailing.'],
    ],
    related: [
      ['Simple invoice template', 'invoice-templates/simple-invoice.html', 'A minimal one-page invoice for small jobs and one-off sales.'],
      ['Proforma invoice template', 'invoice-templates/proforma-invoice.html', 'A proforma document sent before supply, not a demand for payment.'],
      ['Freelance invoice template', 'invoice-templates/freelance-invoice.html', 'Tailored line items for freelance work billed by the hour or by the project.'],
      ['General free invoice template', 'templates/invoice.html', 'The full template with tax, discount, payment terms and bank details.'],
      ['Invoice due date calculator', 'free-tools/invoice-due-date.html', 'Work out the due date for NET 30, end-of-month and other terms.'],
      ['How to write an invoice', 'guides/how-to-write-an-invoice.html', 'Checklist of every detail required by law or by your client.'],
    ],
    faq: [
      ['Is a blank invoice a legal document?','An invoice is a commercial document requesting payment. It is not itself a contract, but a signed contract, quote or PO shows why the invoice was raised. Keep the invoice and any paperwork that supports the charge.'],
      ['Can I fill in the blank invoice by hand?','You can print the PDF and write on it by hand, but totals are easier to get right if you fill it in online and then print or download.'],
      ['Can I add my logo?','Yes. Upload a logo before you download and it appears in the header of the finished PDF or Word file.'],
      ['Does the blank invoice add up totals?','When filled in online, yes - line amounts, subtotal, tax, discount and any balance are calculated as you type.'],
      ['Can I use it for a cash sale?','You can, but after cash is received the right document to give the customer is a payment receipt, which confirms that payment was made.'],
    ],
    cta: { label: 'Start your blank invoice', href: 'app/#/start/invoice' },
  },
  {
    path: 'invoice-templates/simple-invoice.html', section: 'invoice-templates', sectionLabel: 'Invoice templates',
    title: 'Simple Invoice Template | One-Page Free PDF/Word',
    description: 'Free simple invoice template: one page, no clutter. Fill in, download as PDF or Word, and send. For freelancers and small businesses.',
    h1: 'Simple invoice template',
    lead: 'A minimal one-page invoice for small jobs, one-off sales and freelancers who want to bill clearly without extra fields. Fill in the basics, get the totals calculated, and download it as a printable PDF or editable Word file.',
    introParagraphs: [
      'Sometimes you do not need purchase order numbers, discounts, deposits and bank details on the page. The simple invoice strips everything down to the required fields: your name and contact, the client, a short list of items, the total and how to pay.',
      'It uses the same calculation engine as the full invoice, so quantities, rates, tax and totals are worked out for you. If you later need the extra fields, switch to the full free invoice template.',
    ],
    bullets: [
      ['Who it is for', 'Freelancers, sole traders, small businesses and anyone doing a straightforward job with no deposits, discounts or part payments.'],
      ['What it leaves out', 'No discount field, no amount-already-paid, no separate date of supply. The tax field is still there for VAT or GST when you need it.'],
      ['What stays', 'A unique invoice number, issue date, due date, line items with description/quantity/rate, subtotal, optional tax, total, and a short how-to-pay line.'],
      ['Download formats', 'Editable Word (.docx) to tweak wording, or a print-to-PDF version ready to email to the client.'],
    ],
    howTo: [
      ['Fill in your details', 'Add your business name, how the client can contact you, and your tax number if you need to show one.'],
      ['Add the client and invoice numbers', 'Use a unique invoice number, the date you issue it, and the due date - for small jobs often due on receipt or NET 7.'],
      ['List the items', 'Add one line per item or task with quantity and rate. The simple template calculates each line for you.'],
      ['Set how to pay', 'Add one short line such as "Please pay by bank transfer to [sort code / account]" or "PayPal: [email]".'],
      ['Download and send', 'Preview it, download as Word or PDF, and send it with your short invoice email. Save a copy for your records.'],
    ],
    related: [
      ['Blank invoice template', 'invoice-templates/blank-invoice.html', 'The empty starting point for any invoice.'],
      ['Freelance invoice template', 'invoice-templates/freelance-invoice.html', 'Hourly and project line items for freelance work.'],
      ['Proforma invoice template', 'invoice-templates/proforma-invoice.html', 'A proforma sent before supply, not a demand for payment.'],
      ['Invoice PDF download', 'invoice-templates/invoice-template-pdf.html', 'How to get a PDF copy to send by email.'],
      ['How to write an invoice', 'guides/how-to-write-an-invoice.html', 'Checklist of the legal and practical details.'],
    ],
    faq: [
      ['What makes a simple invoice different?','It leaves out fields that most small jobs do not need (discounts, deposits, purchase order number, separate dates) so the page is one short document. The essentials - who, what, how much, by when - are still there.'],
      ['Do I still need an invoice number?','Yes. Every invoice you issue should have a unique number so you and your client can track payment for tax and record keeping.'],
      ['Can I add tax to a simple invoice?','Yes. Turn on the tax option and enter the rate - the simple template adds it for you, just like the full one.'],
      ['Is one page enough?','For most one-off and small-business invoices, yes. If you need many line items or extra clauses, use the full invoice template.'],
      ['Can I use it as a cash receipt?','No. An invoice asks for payment; a receipt confirms payment was made. Use the payment receipt template when money has already been paid.'],
    ],
    cta: { label: 'Make a simple invoice', href: 'app/#/start/invoice' },
  },
  {
    path: 'invoice-templates/proforma-invoice.html', section: 'invoice-templates', sectionLabel: 'Invoice templates',
    title: 'Proforma Invoice | Free Word/PDF (Ready to Send)',
    description: 'Free proforma invoice template. Show prices before supply, for customs or quotes. Download as Word or PDF. No sign-up.',
    h1: 'Proforma invoice template',
    lead: 'A proforma invoice shows prices and details before the goods or services are supplied. It is not a demand for payment and not a VAT or tax invoice. Fill it in online and download it as an editable Word file or printable PDF.',
    introParagraphs: [
      'Use a proforma invoice to give a buyer the final expected cost before you supply goods, or for customs paperwork to state the value of a shipment. Unlike a sales invoice, it does not ask for payment and does not go into your accounts as an amount owed.',
      'This template starts from the same invoice layout and adds clear "Proforma invoice" wording, with a note that it is not a VAT/tax invoice. You can still add line items, tax, shipping and any other detail the buyer or customs needs.',
    ],
    bullets: [
      ['Clear proforma label', 'Titled Proforma invoice so it is not mistaken for a demand for payment.'],
      ['Buyer and seller details', 'Your business details and the customer details, same as a sales invoice.'],
      ['Line items and totals', 'Description, quantity, unit price, line amount and totals with optional tax and shipping.'],
      ['Currency and validity', 'State the currency and how long the proforma prices are valid for - useful when material prices change.'],
      ['Optional customs fields', 'Reason for export, HS codes, country of origin and incoterms when you use the proforma for shipping.'],
    ],
    howTo: [
      ['Start from the proforma template', 'Open it using the button below. The heading is already set to Proforma invoice.'],
      ['Add buyer and seller details', 'Your business information, the customer and any reference they gave you.'],
      ['List the goods and prices', 'Enter each item with quantity and price. Include shipping and any other charges as separate lines.'],
      ['Add validity and terms', 'Set an expiry date for the prices and any notes about shipping or customs.'],
      ['Download and send', 'Download as Word or PDF. When the buyer confirms and you are ready to bill, create a normal sales invoice for the actual charge.'],
    ],
    related: [
      ['Free invoice template (sales)', 'templates/invoice.html', 'The sales invoice you send when payment is due.'],
      ['Quote template', 'templates/quote.html', 'A fixed price offer that becomes binding on acceptance.'],
      ['Blank invoice template', 'invoice-templates/blank-invoice.html', 'Starting point for any invoice.'],
      ['Simple invoice template', 'invoice-templates/simple-invoice.html', 'One-page simple sales invoice for small jobs.'],
      ['Quote vs estimate vs invoice', 'guides/quote-vs-estimate-vs-invoice.html', 'Which document to send at each stage of a job.'],
    ],
    faq: [
      ['Is a proforma invoice legally binding?','It is not usually a demand for payment and not normally a binding contract. The buyer is agreeing to the price and details when they place an order or pay on the back of it, but your terms and conditions govern any commitment.'],
      ['Do I pay tax on a proforma invoice?','No. You do not normally account for VAT/GST/sales tax on a proforma. Issue a proper tax invoice when the supply happens and payment is due, following local rules.'],
      ['Can I turn it into a real invoice?','The cleanest way is to create a sales invoice for the confirmed order using the same line items. Simply changing the title later can confuse records.'],
      ['Do I need a proforma for international shipping?','Many customs authorities ask for a proforma (or commercial) invoice stating the value, origin and reason for export when goods cross a border.'],
      ['How long should the prices stay valid?','Long enough for the buyer to decide, short enough that your costs will not change - 14 to 30 days is common. State the date the prices expire.'],
    ],
    cta: { label: 'Make a proforma invoice', href: 'app/#/start/invoice' },
  },
  {
    path: 'invoice-templates/freelance-invoice.html', section: 'invoice-templates', sectionLabel: 'Invoice templates',
    title: 'Freelance Invoice | Free Word/PDF (Hours & Projects)',
    description: 'Free freelance invoice template for designers, writers, consultants and developers. Bill by the hour or project, download as PDF or Word.',
    h1: 'Freelance invoice template',
    lead: 'Bill freelance work clearly, whether you charge by the hour, by the project or a mix. Fill the invoice in online, get totals calculated, and download it as an editable Word file or printable PDF. Designed for freelancers and sole traders.',
    introParagraphs: [
      'Freelance invoices often need to show hours worked, project milestones, expenses and purchase order numbers, without looking like a big corporate bill. This template keeps the layout simple but gives you all those fields when you need them.',
      'It calculates line amounts, subtotal, any tax and any balance after a deposit, and includes short standard late-payment wording you can edit. Your client details are saved in your browser for repeat work.',
    ],
    bullets: [
      ['Hourly or project lines', 'Use hours as quantity for time-based work, or Quantity 1 for a fixed project fee. You can mix both on the same invoice.'],
      ['Expenses as separate lines', 'Show reimbursable expenses on their own line so the client can see what you spent on their behalf.'],
      ['Deposit and balance', 'If the client already paid a deposit, enter it in Amount already paid; the template works out the balance due.'],
      ['Late payment wording', 'Optional short clause about late fees at 2% per month (or your rate) - edit to match your terms.'],
      ['Reference and PO number', 'Add a project reference or the client\'s purchase order number so the invoice reaches finance quickly.'],
    ],
    howTo: [
      ['Pick how you bill', 'For hourly work, use hours as quantity. For a fixed fee, set Quantity to 1 and enter the fee as the unit price.'],
      ['Add client and project', 'Fill in the client, the project reference and any purchase order number they gave you.'],
      ['Itemise the work', 'List each task or milestone with its date range or description so the client can approve it at a glance.'],
      ['Add expenses and deposit if any', 'Show reimbursable expenses on separate lines, and subtract any deposit already received.'],
      ['Send with a short note', 'Download as PDF or Word and attach it to a short invoice email. The invoice email generator has a template for the message itself.'],
    ],
    related: [
      ['Independent contractor agreement', 'templates/independent-contractor-agreement.html', 'The contract to set scope, rate and IP before the work starts.'],
      ['Hourly invoice', 'invoice-templates/hourly-invoice.html', 'Billing hours with fractional-hour support.'],
      ['Deposit invoice', 'invoice-templates/deposit-invoice.html', 'Request an upfront deposit before the work starts.'],
      ['Retainer agreement', 'templates/retainer-agreement.html', 'For ongoing monthly retainer work.'],
      ['Invoice email template', 'guides/invoice-email-template.html', 'Short sending, reminder and thank-you emails.'],
      ['How to write a freelance contract', 'guides/how-to-write-a-freelance-contract.html', 'Ten clauses that matter.'],
    ],
    faq: [
      ['Do I need a contract with an invoice?','An invoice is a request for payment, not a contract. For any non-trivial freelance job, agree a simple contract before work starts so scope, payment terms and IP are clear.'],
      ['How do I bill both hours and a fixed fee?','Use separate lines: one line for hours (quantity = hours, rate = hourly rate) and one line for the fixed fee (quantity = 1, rate = fee).'],
      ['Should I show expenses?','Yes, on separate lines. If you pass on costs, label the line clearly (for example "Train tickets, 12 Oct") and attach receipts where your client asks for them.'],
      ['How do I number freelance invoices?','Use a simple sequence (INV-001, INV-002 …) or prefix with the client code. Just keep the numbers unique across all clients.'],
      ['When is payment due?','Agree terms up front - common options are due on receipt, NET 7, NET 14 or NET 30. Put the due date on the invoice, not just the term.'],
    ],
    cta: { label: 'Make a freelance invoice', href: 'app/#/start/invoice' },
  },
  {
    path: 'invoice-templates/invoice-template-pdf.html', section: 'invoice-templates', sectionLabel: 'Invoice templates',
    title: 'Invoice Template PDF | Free Download (Print & Email)',
    description: 'Free invoice template you can download and print as a PDF. Fill in online, calculate totals, save as PDF or Word. No sign-up.',
    h1: 'Invoice template PDF',
    lead: 'Create a PDF invoice you can email or print. Fill it in online - totals and tax are calculated as you type - then save it as a PDF or download an editable Word file. Free, with no sign-up.',
    introParagraphs: [
      'Most clients prefer invoices as a PDF because the layout stays the same on every device and the file is hard to edit accidentally. Start from the invoice template, fill it in, and either print it to PDF from your browser or download the Word file and export a PDF from Word or Google Docs.',
      'The PDF copy you send should show all the fields required for your tax jurisdiction: invoice number, date, supplier and customer details, line items, totals and the tax number you are required to display. This template shows those fields when they apply.'],
    bullets: [
      ['Fill in online', 'Quantities, rates, tax, discount and any balance are calculated for you before you save.'],
      ['Print to PDF', 'Use your browser\'s print dialog, choose "Save as PDF" and you get a clean, paginated copy.'],
      ['Or download Word', 'Download the .docx file, tweak wording or layout in Word or Google Docs, and export to PDF.'],
      ['Clean layout', 'No ads, no watermarks, no extra pages. The header, table and payment section fit on one page for most invoices.'],
      ['Reusable', 'Your business details are saved in your browser so the next PDF invoice starts with them already filled in.'],
    ],
    howTo: [
      ['Open the template', 'Click Start below and fill in your business and client details, items and prices.'],
      ['Check the preview', 'Use the on-screen preview to make sure line items fit and totals look right.'],
      ['Download or print to PDF', 'If you want to go straight to a PDF, use your browser\'s print function and choose Save as PDF. If you want to edit first, download the Word file, edit, then export as PDF.'],
      ['Check before sending', 'Open the saved PDF and check that the total is right, no lines are cut off, and bank details or payment methods are correct.'],
      ['Send and save', 'Email the PDF to your client and keep a copy in your records.'],
    ],
    related: [
      ['Free invoice template (Word)', 'templates/invoice.html', 'The main editable Word invoice.'],
      ['Blank invoice template', 'invoice-templates/blank-invoice.html', 'Empty starting point, save to PDF when filled.'],
      ['Invoice email template', 'guides/invoice-email-template.html', 'What to write when you send the PDF.'],
      ['How to save an invoice as PDF', 'guides/how-to-save-an-invoice-as-pdf.html', 'Step-by-step, including the layout checks.'],
      ['Payment receipt PDF', 'templates/payment-receipt.html', 'Once the client pays, send a receipt as PDF.'],
    ],
    faq: [
      ['Is the PDF really free?','Yes. Fill the invoice in online and print or download it as PDF for free, with no watermark and no account.'],
      ['Can I add my logo to the PDF?','Yes. Upload a logo before saving and it appears in the header of the printed PDF.'],
      ['Will the PDF be editable?','A PDF saved directly from the browser is not meant to be edited. If you want to edit later, download the Word file, make your changes, then export a fresh PDF.'],
      ['Does the PDF include tax?','Tax appears on the PDF when you have switched on the tax option and entered a rate.'],
      ['Is there a watermark?','No. The PDF you send is clean, with no Clausery branding on the invoice body.'],
    ],
    cta: { label: 'Make a PDF invoice', href: 'app/#/start/invoice' },
  },
  {
    path: 'nda-templates/simple-nda.html', section: 'nda-templates', sectionLabel: 'NDA templates',
    title: 'Simple NDA | Short Non-Disclosure Form (Word)',
    description: 'Free simple NDA template: short, plain-English mutual or one-way non-disclosure agreement. Download as Word or PDF.',
    h1: 'Simple NDA template',
    lead: 'A short, plain-English non-disclosure agreement (NDA) for protecting confidential information shared in a meeting, with a supplier, contractor or potential partner. Fill it in online and download as an editable Word file or PDF.',
    introParagraphs: [
      'Not every deal needs a long NDA. For a first conversation, a freelance engagement, or a supplier review, a simple short form is often enough: it defines what is confidential, how long it stays protected, and what the other side can do with it.',
      'Use this simple NDA as a mutual form (both sides disclose) or edit it down to a one-way NDA (only one side shares). Download the Word file to change the wording or term, or fill it in online and print it for signature.'
    ],
    bullets: [
      ['Definition of confidential information', 'Written information marked confidential, plus things said in meetings that a reasonable person would treat as confidential.'],
      ['What the recipient can do', 'Use it only to evaluate or carry out the deal, and share it only with staff who need to know.'],
      ['Exclusions', 'Information that is already public, already known, independently developed, or required to be disclosed by law.'],
      ['Time period', 'Choose your term (commonly 2 to 5 years for business information; trade secrets for as long as they stay secret).'],
      ['Return of information', 'On request, return or destroy copies when the project is over.'],
    ],
    howTo: [
      ['Choose mutual or one-way', 'Mutual protects both sides. One-way is for when only one party discloses (use the employee or contractor NDA for staff work).'],
      ['Name the parties and the project', 'Add the full legal names of the people or companies signing, and the name or purpose of the project.'],
      ['Set the term', 'Two to five years is common for most business discussions. Trade-secret wording can last longer.'],
      ['Edit the clauses if needed', 'Download the Word file to change wording, but keep the basics - definition, exclusions, permitted use, length and return of information.'],
      ['Sign two copies', 'Both sides sign; each keeps a copy before confidential information is shared.'],
    ],
    related: [
      ['Mutual NDA template', 'templates/mutual-nda.html', 'The full mutual NDA with optional clauses.'],
      ['Employee NDA template', 'templates/employee-nda.html', 'One-way NDA for staff.'],
      ['Contractor NDA template', 'templates/contractor-nda.html', 'One-way NDA for freelancers and contractors.'],
      ['One-way NDA template', 'templates/one-way-nda.html', 'Unilateral NDA when only one side discloses.'],
      ['What to include in an NDA', 'guides/what-to-include-in-an-nda.html', 'Clause-by-clause guide.'],
      ['Mutual vs one-way NDA', 'guides/mutual-vs-one-way-nda.html', 'Which one to pick.'],
    ],
    faq: [
      ['Is a simple NDA enforceable?','A short, clear NDA that says what is confidential, who it binds and for how long is usually enforceable if it protects a legitimate business interest and is not unreasonably broad. Have unusual terms reviewed in your jurisdiction.'],
      ['Can I use a simple NDA with employees?','For a new hire or contractor whose work exposes them to ongoing confidential information, use the dedicated employee NDA or contractor NDA - they cover employment-specific clauses.'],
      ['How many pages should an NDA be?','One to three pages is normal for a simple NDA. Longer NDAs add extra clauses (non-solicitation, IP, jurisdiction) which you can add when the deal needs them.'],
      ['Does it need to be notarized?','No. NDAs are typically signed by both parties and do not need a notary unless your jurisdiction or the other side asks for one.'],
      ['Can I change the wording?','Yes. Download the Word file and edit any clause to fit your deal. Keep the basics - definition, exclusions, obligations, term and return/destruction - so the agreement is clear.'],
    ],
    cta: { label: 'Make a simple NDA', href: 'app/#/start/mutual-nda' },
  },
  {
    path: 'receipts/cash-receipt.html', section: null,
    title: 'Cash Receipt | Free Printable PDF/Word (Sign & Go)',
    description: 'Free cash receipt template: record cash payments for sales, rent or personal loans. Printable PDF, editable Word, no sign-up.',
    h1: 'Cash receipt template',
    lead: 'Issue a clear receipt when someone pays you in cash. A cash receipt records who paid, how much, what for and on what date, so both sides have proof of payment. Download it as a printable PDF or editable Word file.',
    introParagraphs: [
      'Cash is hard to trace, so a written receipt matters for both payer and payee. A typical cash receipt names the payer and payee, the amount in numbers and words, what the payment was for and the date. Both sides keep a signed copy.',
      'Use this template for cash sales, cash rent, small loans repaid in cash, or any other cash payment where you want a paper record. It includes an amount-in-words line so the amount cannot be altered easily.',
    ],
    bullets: [
      ['Who paid and who received', 'Full name (and business name if applicable) of both the payer and the payee.'],
      ['Amount', 'Numeric amount and the amount written in words, to reduce the risk of later alteration.'],
      ['What it was for', 'For example "Cleaning services, 12 October" or "Monthly rent, October 2026".'],
      ['Date and method', 'Date paid and a clear "cash" marker, optionally with the exact cash breakdown.'],
      ['Signature', 'The recipient signs. Two copies - one for the payer, one for the payee.'],
    ],
    howTo: [
      ['Open the receipt template', 'Start from the cash receipt below - it pre-ticks cash as the payment method.'],
      ['Add payer and payee details', 'Name of the person or business handing over the cash, and the recipient\'s details.'],
      ['Write the amount twice', 'Enter the numeric amount and write it out in words (for example, "Two hundred and fifty dollars only").'],
      ['Describe what it is for', 'Short description so either side can match the receipt to the sale or obligation.'],
      ['Sign and give a copy', 'The recipient signs and gives one copy to the payer, keeping one for their records.'],
    ],
    related: [
      ['Payment receipt template', 'templates/payment-receipt.html', 'Receipt for card, cheque, bank transfer or digital payments.'],
      ['Rent receipt template', 'templates/rent-receipt.html', 'For rent payments - often required for tax purposes.'],
      ['Bill of sale', 'templates/bill-of-sale.html', 'For selling a car, boat or other personal property.'],
      ['Promissory note', 'templates/promissory-note.html', 'For a personal loan with repayment terms.'],
      ['Amount in words converter', 'free-tools/amount-in-words.html', 'Convert figures to words automatically.'],
    ],
    faq: [
      ['Is a handwritten cash receipt valid?','Yes. A signed, dated note saying who paid whom, how much and what for is a valid proof of payment. This template just gives you a clean printed version.'],
      ['Do I need a cash receipt for tax?','Cash income is still income and must be recorded. A cash receipt helps you evidence income or expenses to a tax authority if asked.'],
      ['Should I keep the carbon copy?','Sign two copies and give one to the payer. Keep your own copy with your records - it is the paper trail if anyone later disputes the payment.'],
      ['How do I write the amount in words?','Write the full amount in the currency of the payment, ending with "only" to prevent additions. The amount-in-words converter can do this for you.'],
      ['Can I use it for rent received in cash?','Yes. For rent specifically, use the rent receipt template which already includes the rental period and property fields.'],
    ],
    cta: { label: 'Make a cash receipt', href: 'app/#/start/payment-receipt' },
  },
  {
    path: 'invoice-templates/contractor-invoice.html', section: 'invoice-templates', sectionLabel: 'Invoice templates',
    title: 'Contractor Invoice | Free Word/PDF (Labour & Materials)',
    description: 'Free contractor invoice template. Bill for contract work, materials, hours and change orders. Download as Word or PDF, no sign-up.',
    h1: 'Contractor invoice template',
    lead: 'Invoice contract work clearly - whether you are a general contractor, electrician, plumber, landscaper or other trade. Show hours, materials, change orders and any retention, then download the invoice as a printable PDF or editable Word file.',
    introParagraphs: [
      'Contractor invoices usually need to show more than a simple freelancer bill: line items for labour and materials, any change orders approved on the job, retention held back, and a clear schedule of values for progress draws. This template supports all of that using the same line-item table and calculation engine.',
      'Fill it in online to have each line and the tax calculated for you, or download the blank Word file and fill it in Word, Google Docs or LibreOffice.'
    ],
    bullets: [
      ['Labour and materials', 'Separate lines for hours at a rate and for materials used on the job.'],
      ['Change orders', 'Add a clear line per approved change so the client sees what they are being billed for.'],
      ['Retention / holdback', 'Use the discount or a negative line only when you must; usually show retention as a separate line at the bottom.'],
      ['Project and PO reference', 'Include the project address, permit or job number and any purchase order number the client issued.'],
      ['Progress payment schedule', 'For draws, reference the schedule of values stage this invoice covers (for example, Rough-in - Stage 3 of 5).'],
    ],
    howTo: [
      ['Identify the job', 'Put the client name, project address, job number or permit number, and a new invoice number.'],
      ['Bill labour and materials separately', 'Use Quantity × Rate for labour hours and per-item materials. Add change orders as their own lines.'],
      ['Add tax and any retention', 'Apply sales tax if required. If retention is held back, list it clearly so both sides see what is owed now vs at the end.'],
      ['Set payment terms', 'Due on receipt is common for smaller jobs; progress draws are usually due within 7 to 14 days.'],
      ['Download and attach lien paperwork if any', 'Send the PDF invoice, attaching any required preliminary notice or lien waiver for your jurisdiction.'],
    ],
    related: [
      ['Freelance invoice template', 'invoice-templates/freelance-invoice.html', 'Simpler format for non-trade freelance work.'],
      ['Independent contractor agreement', 'templates/independent-contractor-agreement.html', 'The contract to set terms before work starts.'],
      ['Bill of sale', 'templates/bill-of-sale.html', 'When the job is selling equipment or other personal property.'],
      ['Handyman invoice', 'invoice-templates/handyman.html', 'Short jobs and smaller trades.'],
      ['Construction contractor invoice', 'invoice-templates/construction-contractor.html', 'Larger builds with progress draws.'],
      ['How to write an invoice', 'guides/how-to-write-an-invoice.html', 'Full checklist of required fields.'],
    ],
    faq: [
      ['Do I need a separate invoice per trade?','No. You can list different trades (labour, materials, subcontractor costs) on one invoice as long as each line is clear.'],
      ['How do I show sales tax?','Turn on the tax field and enter your jurisdiction rate. In most US states contractors charge sales tax on materials and in some on labour; follow local rules.'],
      ['How do I show a deposit already paid?','Use the Amount already paid field so the balance due is shown automatically, and reference the deposit invoice number in the note.'],
      ['Can I attach a lien waiver?','Issue the invoice first; when payment arrives you can send a signed lien waiver along with the payment receipt for that draw.'],
      ['What if a change order adds scope?','Add it as a clearly labelled line item referencing the approved change order number so the client can match it to their approval.'],
    ],
    cta: { label: 'Make a contractor invoice', href: 'app/#/start/invoice' },
  },
  {
    path: 'invoice-templates/estimate-template.html', section: 'invoice-templates', sectionLabel: 'Invoice templates',
    title: 'Estimate Template | Free Editable Word/PDF',
    description: 'Free estimate template: give a client an informed price quote they can accept. Download as Word or PDF, no sign-up.',
    h1: 'Estimate template',
    lead: 'Give a customer an informed estimate for work before they commit. An estimate is not a fixed price - it says what you expect the job to cost and how you will tell them if the price changes. Fill it in online and download as Word or PDF.',
    introParagraphs: [
      'Use an estimate when you cannot yet give a fixed quote - for example when you do not know how long the work will take, or when material prices are moving. A quote commits you to a price; an estimate sets expectations and says how you will confirm changes.',
      'The template covers the expected scope, assumptions the price depends on, exclusions, an expiry date, and a short acceptance signature line so the customer can say go ahead.'
    ],
    bullets: [
      ['Scope of work', 'What you are expecting to do, based on what the customer has told you.'],
      ['Estimated price', 'Expected total and how it is calculated (hourly rate, materials at cost, etc.).'],
      ['Assumptions and exclusions', 'What the price depends on - for example access, hidden damage, material costs on the day.'],
      ['How changes are handled', 'State that you will tell the customer before exceeding the estimate, and get written approval for changes.'],
      ['Expiry and acceptance', 'How long the estimate is valid for, and a signature line for the customer to approve.'],
    ],
    howTo: [
      ['Describe the job clearly', 'Cover what the estimate includes and, more importantly, what it does not.'],
      ['Give the expected price', 'Break it into labour, materials and any subcontractor costs. State whether tax is included.'],
      ['List assumptions', 'Access, condition of the property, prices on the day, and anything else the customer should know.'],
      ['Set an expiry date', '14 or 30 days is typical; shorter when material prices are volatile.'],
      ['Send and get acceptance', 'Email the PDF estimate, ask the customer to sign or reply in writing to accept, and convert it to a quote or invoice when the work is confirmed.'],
    ],
    related: [
      ['Free quote template', 'templates/quote.html', 'A fixed price that binds you once accepted.'],
      ['Quote vs estimate vs invoice', 'guides/quote-vs-estimate-vs-invoice.html', 'Which document to send when.'],
      ['Proforma invoice template', 'invoice-templates/proforma-invoice.html', 'For pre-shipment customs paperwork.'],
      ['Blank invoice template', 'invoice-templates/blank-invoice.html', 'Use once the work is done and you need to bill.'],
      ['Independent contractor agreement', 'templates/independent-contractor-agreement.html', 'Set ongoing terms in a contract instead.'],
    ],
    faq: [
      ['What is the difference between an estimate and a quote?','A quote is a fixed price you stick to once accepted. An estimate is an informed guess that can change if the work turns out differently - but you must tell the customer before going over it.'],
      ['Is an estimate legally binding?','Not in the same way a quote or contract is. Once the customer accepts in writing and you start the work on that basis, the scope and change terms you wrote down become part of the agreement.'],
      ['Can I change the price later?','Yes, within reason, but tell the customer as soon as you know the work will exceed the estimate and get their written approval for any extra cost. That is what the assumptions section is for.'],
      ['Should I include tax?','State whether the estimate includes tax or shows it separately so there are no surprises.'],
      ['How long is an estimate valid?','14 to 30 days is typical. State the expiry clearly so material-price movement does not leave you out of pocket.'],
    ],
    cta: { label: 'Make an estimate', href: 'app/#/start/quote' },
  },
  {
    path: 'nda-templates/non-disclosure-agreement.html', section: 'nda-templates', sectionLabel: 'NDA templates',
    title: 'NDA (Non-Disclosure Agreement) | Free Word Template',
    description: 'Free non-disclosure agreement template: mutual or one-way NDA to protect confidential information. Download Word/PDF.',
    h1: 'Non-disclosure agreement (NDA)',
    lead: 'A non-disclosure agreement (NDA) keeps shared business information confidential. Pick a mutual NDA when both sides share, or a one-way NDA when only one side discloses, fill it in online and download a ready-to-sign Word file or PDF.',
    introParagraphs: [
      'An NDA (non-disclosure agreement, sometimes called a confidentiality agreement) is a contract that says what information is shared, who can see it, how long it must stay private, and what happens if someone leaks it. Most early business conversations, supplier reviews, fundraising talks and freelance engagements use one.',
      'Clausery ships five NDA templates tuned to different situations. This page helps you pick the right one.'
    ],
    bullets: [
      ['Mutual NDA', 'For meetings, partnerships, M&A talks or any situation where both sides share confidential information.'],
      ['One-way NDA', 'For when only one side discloses - for example a founder sharing plans with an advisor or investor.'],
      ['Employee NDA', 'For staff, covering confidentiality of company information during and after employment.'],
      ['Contractor / freelancer NDA', 'For outside workers who will see client lists, code or proprietary processes.'],
      ['NDA for selling a business', 'For sharing financials and customer lists during a business sale.'],
    ],
    howTo: [
      ['Decide mutual vs one-way', 'Mutual when both sides disclose; one-way when only one side does.'],
      ['Name the parties and the project', 'Use the full legal names of the people or companies signing and briefly describe the purpose.'],
      ['Define what is confidential', 'Written material marked confidential, plus things said in meetings that a reasonable person would understand to be private.'],
      ['Set the term', 'Two to five years is common for ordinary business information; trade secrets can be protected for longer.'],
      ['Sign before sharing', 'Both sides sign and each keeps a copy before confidential information is handed over.'],
    ],
    related: [
      ['Simple NDA template', 'nda-templates/simple-nda.html', 'A short plain-English version for quick conversations.'],
      ['Mutual NDA template', 'templates/mutual-nda.html', 'Full mutual NDA with optional clauses.'],
      ['One-way NDA template', 'templates/one-way-nda.html', 'Unilateral NDA when only one side discloses.'],
      ['Employee NDA', 'templates/employee-nda.html', 'For staff confidentiality.'],
      ['Contractor NDA', 'templates/contractor-nda.html', 'For freelancers and outside contractors.'],
      ['What to include in an NDA', 'guides/what-to-include-in-an-nda.html', 'Clause-by-clause walk-through.'],
    ],
    faq: [
      ['Is an NDA the same as a non-disclosure agreement?','Yes - NDA is short for non-disclosure agreement. You may also hear it called a confidentiality agreement (CDA) or proprietary information agreement (PIA).'],
      ['Is a mutual NDA different from a one-way NDA?','Yes. A mutual NDA protects both sides; a one-way NDA protects only the disclosing party.'],
      ['Does an NDA need to be notarized?','No. A signed NDA is normally binding without a notary, unless your jurisdiction specifically requires one.'],
      ['How long should it last?','Two to five years is common for business information; trade secrets are typically protected for as long as they stay secret.'],
      ['Can I write my own NDA?','Yes. Start from one of the templates above, edit the wording to match your deal, and have a lawyer review anything unusual or high-stakes.'],
    ],
    cta: { label: 'Make an NDA', href: 'app/#/start/mutual-nda' },
  },
  {
    path: 'receipts/donation-receipt.html', section: null,
    title: 'Donation Receipt | Free PDF/Word (Tax-Ready)',
    description: 'Free donation receipt template: issue a gift acknowledgement for tax purposes. Printable PDF, editable Word, no sign-up.',
    h1: 'Donation receipt template',
    lead: 'Issue a clear donation receipt when someone gives money or goods to your organisation, charity or fundraiser. A written receipt helps the donor with tax records and gives your records proof of the gift. Download it as a printable PDF or editable Word file.',
    introParagraphs: [
      'In many jurisdictions a donor needs a written acknowledgement from the charity to claim a tax deduction for gifts above a threshold. The receipt usually names the donor, the charity, the date, the amount (or description of goods), and a statement about whether any goods or services were given in return.',
      'This template covers cash donations and donations of goods, with a short value-description field and the standard no-goods-or-services statement you can edit.'
    ],
    bullets: [
      ['Charity details', 'Legal name, tax ID / EIN / charity number and address.'],
      ['Donor details', 'Name of the person or organisation making the gift.'],
      ['Date and amount', 'Date the gift was received and the cash amount, or a description of goods donated.'],
      ['Value of goods given in return', 'If the donor received anything in return (a dinner, tickets, merchandise), state its value; only the excess is tax-deductible.'],
      ['Statement and signature', 'A short statement that the receipt is for tax purposes, signed by an authorised person.'],
    ],
    howTo: [
      ['Add the charity and donor', 'Full legal name of the charity and the donor, with addresses where your jurisdiction requires.'],
      ['Record the gift', 'Date received and the amount (for cash) or a detailed description (for goods), with an estimated fair-market value for goods.'],
      ['Note anything given in return', 'If the donor got tickets, a meal or other benefit, state that and its value.'],
      ['Use the right statement', 'Most tax authorities require a sentence that no goods or services were provided in return, or a value statement if they were.'],
      ['Sign and send', 'An authorised officer signs; send one copy to the donor and keep one with your gift records.'],
    ],
    related: [
      ['Cash receipt template', 'receipts/cash-receipt.html', 'For cash payments where no tax-deductible donation is involved.'],
      ['Payment receipt template', 'templates/payment-receipt.html', 'For payments for goods and services.'],
      ['Rent receipt template', 'templates/rent-receipt.html', 'For rent payments, often required for tax purposes.'],
      ['Gift letter for mortgage', 'templates/gift-letter.html', 'For gifts used towards a mortgage down payment.'],
    ],
    faq: [
      ['Does a donation receipt need to say no goods were provided?','In the US, IRS rules require a statement that no goods or services were provided in exchange for the gift (or a description and good-faith estimate of their value) for donations over $250. Other jurisdictions have similar rules.'],
      ['Can I issue one receipt for the whole year?','Yes. Many charities issue a single annual summary of gifts rather than a receipt per gift. The template can be adapted to list multiple donations.'],
      ['Do I need a receipt for non-cash donations?','Yes. For non-cash gifts above a threshold, the donor typically needs a written acknowledgement describing the property; for larger gifts a qualified appraisal may be required.'],
      ['Who signs it?','An officer or authorised person at the charity - often the treasurer, executive director or gift officer.'],
      ['Is the template tax advice?','No. The receipt covers the common fields; check the exact wording and value-threshold rules for your jurisdiction and tax authority.'],
    ],
    cta: { label: 'Make a donation receipt', href: 'app/#/start/payment-receipt' },
    download: { href: 'samples/payment-receipt.docx', label: 'Download Word' },
  },
  {
    path: 'invoice-templates/quotation-template.html', section: 'invoice-templates', sectionLabel: 'Invoice templates',
    title: 'Quotation Template | Free Quote Format (Word/PDF)',
    description: 'Free quotation template in Word/PDF. Send a formal price quotation clients can accept, with expiry date and terms.',
    h1: 'Quotation template',
    lead: 'Send a formal written quotation showing the price, scope, exclusions, validity and terms. A quotation is the same as a fixed price quote: once the customer accepts it in writing, you hold to that price. Fill it in online and download as PDF or Word.',
    introParagraphs: [
      'In many businesses "quotation" is used interchangeably with "quote" - a fixed price you will stick to, as distinct from an estimate which is an informed guess that can change. Use this template to issue a formal quotation with line items, terms and an expiry date.',
      'The template is the same quote layout, with "Quotation" in the heading, a quotation number, itemised lines, what is not included, an expiry date, and an acceptance signature line. Download as an editable Word file or printable PDF.'
    ],
    bullets: [
      ['Quotation number and date', 'Unique quotation number, the date you issue it, and an expiry date (commonly 14 or 30 days).'],
      ['Customer details', 'The customer name, billing address and any reference they provided.'],
      ['Itemised pricing', 'Each item or task with description, quantity, unit price and line total.'],
      ['What is not included', 'Clear list of exclusions so the customer cannot assume scope you did not price.'],
      ['Terms and acceptance', 'Payment terms, delivery, warranty (if any) and a short signature line the customer signs to accept.'],
    ],
    howTo: [
      ['Open the quotation template', 'Start from the button below; the heading is already set to Quotation.'],
      ['Add your business and the customer', 'Your name, contact details and tax number, plus the customer details and any quotation reference.'],
      ['List items and prices', 'One line per item or task with quantity and rate; the template calculates line totals and subtotal for you.'],
      ['Set the expiry and terms', '14 or 30 days is typical. State payment terms (for example 50% deposit on acceptance, balance on completion).'],
      ['Send and get acceptance', 'Email the PDF and ask the customer to sign or reply in writing to accept. Once accepted you hold to the price unless they change the scope.'],
    ],
    related: [
      ['Free quote template', 'templates/quote.html', 'The standard quote this quotation template is based on.'],
      ['Estimate template', 'invoice-templates/estimate-template.html', 'Use an estimate when the price may change rather than a fixed quotation.'],
      ['Proforma invoice template', 'invoice-templates/proforma-invoice.html', 'For pre-supply pricing, common for international shipping.'],
      ['Quote vs estimate vs invoice', 'guides/quote-vs-estimate-vs-invoice.html', 'Which document to send at each stage.'],
      ['Purchase order template', 'templates/purchase-order.html', 'The buyer usually replies to a quotation with a PO.'],
    ],
    faq: [
      ['Is a quotation the same as a quote?','Yes. In most English-speaking business use, "quotation" and "quote" mean the same thing: a fixed price offer you stick to once accepted.'],
      ['What is the difference between a quotation and an estimate?','A quotation is a fixed price you commit to; an estimate is an informed guess that can change. If you do not want to be held to a price, send an estimate and say how you will tell the customer if it changes.'],
      ['Is a quotation legally binding?','Once the customer accepts it in writing (by signing or replying with a go-ahead), a quotation typically becomes a binding fixed-price contract for the scope described.'],
      ['How long should a quotation be valid?','14 to 30 days is typical; shorter when material prices are moving quickly. The expiry date protects you from having to honour old prices.'],
      ['Do I need to show tax?','State whether the prices include VAT/GST/sales tax or show it separately, following local rules.'],
    ],
    cta: { label: 'Make a quotation', href: 'app/#/start/quote' },
    download: { href: 'samples/quote.docx', label: 'Download Word' },
  },
  {
    path: 'templates/freelance-contract.html', section: 'templates', sectionLabel: 'Templates',
    title: 'Freelance Contract | Free Agreement (Word/PDF)',
    description: 'Free freelance contract template for designers, writers, developers and consultants. Download as Word or PDF, no sign-up.',
    h1: 'Freelance contract template',
    lead: 'A simple freelance contract covering scope, fee, payment terms, IP, revisions, late fees, confidentiality and termination. Fill it in online and download it as an editable Word file or printable PDF, ready to sign.',
    introParagraphs: [
      'A freelance contract sets out what you will do, how much you will be paid, who owns the work, and how either side can end it. It prevents the arguments that come from handshake deals - especially around scope creep, revisions and late payment.',
      'This template is based on the independent contractor agreement, tuned for single-engagement freelance work (rather than ongoing arrangements). It has a clear scope section, optional kill fee, IP assignment on payment, and a short confidentiality clause.'
    ],
    bullets: [
      ['Scope of work', 'What you will deliver, plus how many rounds of revisions are included and what counts as extra work.'],
      ['Fee and payment', 'Project fee or hourly rate, payment schedule (deposit / milestones / on completion), late fee wording.'],
      ['Intellectual property', 'Work transfers to the client once invoices are paid; you keep portfolio rights.'],
      ['Revisions and scope changes', 'Number of included revision rounds, and how change orders are priced and approved.'],
      ['Confidentiality and termination', 'Each side keeps information private; either side can end on written notice with payment for work done.'],
    ],
    howTo: [
      ['Name both parties and the project', 'Your name (or business name) and the client, plus a short project title and the date.'],
      ['Describe the deliverables', 'Be specific about what is and is not included - vague scope is the #1 reason for freelance disputes.'],
      ['Set the fee and schedule', 'Total fee or hourly rate, deposit amount, milestone payments and the due date for each.'],
      ['Add IP, revisions and kill-fee terms', 'IP transfers on payment; set included revision rounds; choose whether either side can kill the project mid-way and what is owed.'],
      ['Sign and start work', 'Both sides sign (e-signature or wet signature); each keeps a copy before work begins.'],
    ],
    related: [
      ['Independent contractor agreement', 'templates/independent-contractor-agreement.html', 'For ongoing contractor engagements.'],
      ['Freelance invoice template', 'invoice-templates/freelance-invoice.html', 'Bill against the contract once work is done or milestones hit.'],
      ['Consulting agreement', 'templates/consulting-agreement.html', 'For advisory and consulting engagements.'],
      ['Retainer agreement', 'templates/retainer-agreement.html', 'For ongoing monthly work.'],
      ['How to write a freelance contract', 'guides/how-to-write-a-freelance-contract.html', 'Ten clauses that matter.'],
    ],
    faq: [
      ['Do I need a contract for every freelance job?','For small jobs with repeat clients you might skip it, but any project with real money, IP or deadlines deserves a written contract. Verbal agreements are hard to prove.'],
      ['Who owns freelance work before payment?','Until invoices are paid, you usually own the copyright. The contract should state that IP transfers on final payment, which gives you leverage if the client does not pay.'],
      ['Can I use this for ongoing work?','Use the retainer agreement or independent contractor agreement for ongoing work; this template is for a defined single project.'],
      ['Should I ask for a deposit?','Yes for most freelance projects - 25% to 50% upfront is standard. It secures your schedule and reduces exposure if the client pulls out.'],
      ['Do I need a lawyer?','For standard freelance engagements this template covers the key clauses. Have it reviewed by a lawyer for high-value work, unusual terms, or if your jurisdiction has specific rules.'],
    ],
    cta: { label: 'Make a freelance contract', href: 'app/#/start/independent-contractor-agreement' },
    download: { href: 'samples/independent-contractor-agreement.docx', label: 'Download Word' },
  },
  {
    path: 'nda-templates/nda-form.html', section: 'nda-templates', sectionLabel: 'NDA templates',
    title: 'NDA Form | Free Non-Disclosure Agreement (Word/PDF)',
    description: 'Free NDA form: a printable non-disclosure agreement you can fill in online, download and sign. Word and PDF.',
    h1: 'NDA form',
    lead: 'A ready-to-sign non-disclosure form for protecting confidential information shared between two parties. Fill it in online in a few minutes and download it as a printable PDF or editable Word file.',
    introParagraphs: [
      'An NDA form (non-disclosure form) is the same document as an NDA or confidentiality agreement - a short contract that sets out what information is confidential, how long it must stay private, and who can see it. The word "form" is often used when you want a document you can print, fill in and sign quickly.',
      'Pick mutual or one-way depending on who is sharing, then fill in the names, the project, and the length of confidentiality. Download the Word file if you want to edit the wording further.'
    ],
    bullets: [
      ['Parties', 'Full legal names of the people or companies signing, with addresses.'],
      ['Purpose', 'What the confidential information will be used for (for example "evaluating a partnership").'],
      ['Definition of confidential information', 'Written information marked confidential, plus things said in meetings.'],
      ['Term', 'How long the duty lasts (commonly 2-5 years; trade secrets for as long as they stay secret).'],
      ['Return or destruction', 'What happens to copies when the project ends or either side asks.'],
    ],
    howTo: [
      ['Choose mutual or one-way', 'Mutual when both sides share information; one-way when only one side discloses.'],
      ['Fill in the parties and purpose', 'Full legal names of both sides and a short description of the project.'],
      ['Set the term', 'Typically 2 to 5 years for ordinary business information.'],
      ['Edit if needed', 'Download the Word file to add or remove clauses - keep the basics (definition, exclusions, obligations, term).'],
      ['Sign two copies', 'Both sides sign before confidential information is shared; each keeps a copy.'],
    ],
    related: [
      ['Simple NDA template', 'nda-templates/simple-nda.html', 'Short plain-English NDA for quick conversations.'],
      ['Mutual NDA template', 'templates/mutual-nda.html', 'Full mutual NDA with optional clauses.'],
      ['One-way NDA template', 'templates/one-way-nda.html', 'Unilateral NDA when only one side discloses.'],
      ['Non-disclosure agreement (NDA)', 'nda-templates/non-disclosure-agreement.html', 'Which NDA to pick for your situation.'],
      ['What to include in an NDA', 'guides/what-to-include-in-an-nda.html', 'Clause-by-clause walk-through.'],
    ],
    faq: [
      ['Is an NDA form different from an NDA?','No - "NDA form" is just another name for a non-disclosure agreement you fill in and sign. The content is the same.'],
      ['Can I print it and fill it in by hand?','Yes. Fill it in online to get the names in the right places, then print and sign; or print the blank Word file and fill it in by hand.'],
      ['Does it need to be notarized?','No. NDAs generally do not need a notary to be valid, unless your jurisdiction or the other side specifically asks for one.'],
      ['How long should an NDA last?','Two to five years is common for ordinary business information. Trade secret wording lasts for as long as the information remains secret.'],
      ['Can I edit the form?','Yes. Download the Word file to change any clause. Keep the definition of confidential information, the exclusions, the obligations and the term to make it enforceable.'],
    ],
    cta: { label: 'Start the NDA form', href: 'app/#/start/mutual-nda' },
    download: { href: 'samples/mutual-nda.docx', label: 'Download Word' },
  },
  {
    path: 'invoice-templates/google-docs-invoice.html', section: 'invoice-templates', sectionLabel: 'Invoice templates',
    title: 'Google Docs Invoice | Free Editable Template',
    description: 'Free Google Docs invoice template: open, edit, share and download as PDF. Works in Google Drive, no Word needed.',
    h1: 'Google Docs invoice template',
    lead: 'Make an invoice in Google Docs. Fill in the template, share a view-only link with your client, or download it as a PDF to attach to email. Editable directly in Google Drive - no Microsoft Word required.',
    introParagraphs: ['A Google Docs invoice works the same as a Word invoice, but you edit it in your browser through Google Drive and share a link instead of emailing a file. This template is set up as a .docx that opens cleanly in Google Docs, so you can add your own logo, line items and terms without fighting formatting.','For invoices where you want totals calculated automatically, fill it in on this page first and download the Word file, then upload it to Google Docs to share. The resulting invoice keeps clean headings, a proper table for line items and print-friendly layout.'],
    bullets: [['Opens directly in Google Docs','Upload the downloaded .docx to Drive and double-click to edit - no reformatting needed.'],['Share as a link or PDF','Send a view-only Google Docs link, or download as PDF from the File menu to email an attachment.'],['Your logo and branding','Insert your logo in the header and set your brand colours using Docs formatting.'],['Editable later','If prices or items change, edit the same document and resend - no need to regenerate from scratch.'],['Works offline','Enable Google Docs offline access to fill in invoices without internet.']],
    howTo: [['Start the invoice here','Fill in your business, client, line items and payment terms online. Totals and tax are calculated for you.'],['Download the Word file','Click Download Word to get a .docx file with all your answers filled in.'],['Upload to Google Drive','Drag the file into Google Drive or use New > File upload. Double-click and choose Open with Google Docs.'],['Add your logo and polish','Insert your logo and tweak colours or fonts if you want. Check that the totals match your online version.'],['Share or download PDF','Share a view-only link (turn on link sharing and set to Viewer) or download as PDF from File > Download.']],
    related: [['Free invoice template (Word)','templates/invoice.html','The editable Word invoice this Google Docs version is based on.'],['Blank invoice template','invoice-templates/blank-invoice.html','Empty starting point for any invoice.'],['Simple invoice template','invoice-templates/simple-invoice.html','One-page layout for small jobs.'],['Invoice template PDF','invoice-templates/invoice-template-pdf.html','How to save a PDF copy ready to email.'],['Invoice email template','guides/invoice-email-template.html','What to write when you send the invoice.']],
    faq: [['Does Google Docs have a free invoice template?','Google Docs has a small template gallery, but most built-in templates are generic. Our template opens cleanly in Google Docs with the right fields for a proper invoice.'],['Can I edit it in Google Docs without Word?','Yes. Download the .docx, upload to Google Drive, open with Google Docs and edit like any Google document.'],['Can clients pay from a Google Docs invoice?','A Google Doc is just the document - add your bank details, a payment link (PayPal, Stripe, Wise) or payment instructions in the How to pay section.'],['Can I share it as a link?','Yes. Click Share, set General access to Anyone with the link can view, and send the link. For a proper record you may still want to email a PDF.'],['Do totals calculate in Google Docs?','No - Google Docs is a word processor, not a spreadsheet. Fill the invoice in on this page first to have totals calculated, then upload to Docs for sharing.']],
    cta: { label: 'Make an invoice for Google Docs', href: 'app/#/start/invoice' },
  },
  {
    path: 'invoice-templates/excel-invoice-template.html', section: 'invoice-templates', sectionLabel: 'Invoice templates',
    title: 'Excel Invoice | Free Editable Spreadsheet',
    description: 'Free Excel invoice template with auto-calculating totals, tax and balance. Download as .xlsx or fill in online first.',
    h1: 'Excel invoice template',
    lead: 'An invoice that adds line totals, subtotal, tax and balance due automatically. Fill it in online to get a Word or PDF invoice with all the maths done for you, or download the structure and rebuild it in Excel using the column layout described here.',
    introParagraphs: ['Excel is popular for invoices because cells do the arithmetic. Clausery does not currently produce a native .xlsx file, but the online invoice does everything an Excel invoice does - line totals, subtotal, one tax rate, optional discount, and any balance after part payment - and downloads as an editable Word file or print-ready PDF.','If you must work in Excel, this page shows the column layout and formulas to build a solid invoice spreadsheet, and lets you preview how a properly calculated invoice looks before you build your own.'],
    bullets: [['Auto-calculated line totals','Quantity x Unit Price for each row, just like an Excel formula.'],['Subtotal, discount and tax','The app works out subtotal, any discount, tax at your rate, and total.'],['Balance due after part payment','Enter amount already paid and the balance is calculated automatically.'],['Next invoice number remembered','Your business details, number sequence and last-used terms are saved in your browser.'],['Clean, print-ready layout','Same professional layout as Word and PDF versions - no messy grid lines.']],
    howTo: [['Fill in the invoice online','Enter your business, client, items and tax rate. Totals recalculate as you type.'],['Check the amounts','Verify line totals, subtotal, tax, discount and balance due before downloading.'],['Download Word or PDF','Get a print-ready PDF or editable Word file. If you want to build it in Excel, use the column order: Description | Quantity | Unit Price | Amount.'],['Excel formula reference','In Excel, Amount = Quantity*Unit Price, Subtotal = SUM(Amount column), Tax = Subtotal*Rate, Total = Subtotal-Discount+Tax.'],['Send and save','Send the PDF with your invoice email and save a copy for your records.']],
    related: [['Free invoice template (Word)','templates/invoice.html','The main invoice with tax, discount and bank details.'],['Google Docs invoice template','invoice-templates/google-docs-invoice.html','Use the invoice in Google Docs instead of Excel.'],['Invoice due date calculator','free-tools/invoice-due-date.html','Calculate NET 30, EOM and other terms.'],['Hourly invoice','invoice-templates/hourly-invoice.html','Bill hours at a rate, like time-based Excel sheets.'],['How to write an invoice','guides/how-to-write-an-invoice.html','Required fields checklist.']],
    faq: [['Does Clausery produce an .xlsx file?','No. The online invoice calculates everything for you and downloads as an editable Word document or PDF, which is what most clients prefer to receive.'],['Can I open the download in Excel?','The Word file is not designed for Excel, but you can copy the line-item table into Excel and it will paste with columns intact.'],['How do I write Excel formulas for an invoice?','Line total = Quantity*Unit Price; Subtotal = SUM(line totals); Tax = Subtotal*Rate; Total = Subtotal - Discount + Tax; Balance due = Total - Paid.'],['Do I need Excel to invoice?','No. Most small businesses use Word or PDF invoices, and many clients prefer them because the totals cannot be accidentally changed by a formula error.'],['Will totals recalculate if I change a quantity?','When filled in online, yes. In the downloaded Word file, change amounts in your saved Clausery draft and download again, or edit by hand.']],
    cta: { label: 'Make a calculated invoice', href: 'app/#/start/invoice' },
  },
];

function hubBody(h, rel) {
  const crumbs = [['Home', '']];
  if (h.section) crumbs.push([h.sectionLabel, h.section + '/']);
  crumbs.push([h.h1, h.path]);
  const linksHtml = h.related.map(([label, href, desc]) =>
    `<a class="feature" href="${rel}${href}"><h3>${esc(label)}</h3><p>${esc(desc)}</p></a>`
  ).join('');
  const bulletsHtml = h.bullets.map(([t, d]) => `<li><strong>${esc(t)}.</strong> ${esc(d)}</li>`).join('');
  const stepsHtml = h.howTo.map(([t, d], i) => `<li><h3>Step ${i+1}: ${esc(t)}</h3><p>${esc(d)}</p></li>`).join('');
  const intro = h.introParagraphs.map(p => `<p>${esc(p)}</p>`).join('');
  return `
<section class="section"><div class="wrap prose">
<nav class="small muted" aria-label="Breadcrumb">${crumbs.slice(0,-1).map(([l,href])=>`<a href="${rel}${href}">${esc(l)}</a> › `).join('')}${esc(h.h1)}</nav>
<h1>${esc(h.h1)}</h1>
<p class="lead">${esc(h.lead)}</p>
<div class="actions" style="display:flex;gap:.75rem;flex-wrap:wrap;margin:1.5rem 0">
<a class="btn btn-primary btn-lg" href="${rel}${h.cta.href}">${esc(h.cta.label)} <span class="arr">→</span></a>
<a class="btn btn-lg" href="${rel}${(h.download||{href:'samples/invoice.docx'}).href}" download>${esc((h.download||{label:'Download Word'}).label)}</a>
</div>
<p class="small muted">No sign-up. Editable Word (.docx) or print to PDF. Your answers stay in your browser. Updated <time datetime="${LASTMOD}">${LASTMOD_LONG}</time>.</p>
${intro}
<h2>What to include</h2>
<ul>${bulletsHtml}</ul>
<h2>How to fill it in</h2>
<ol>${stepsHtml}</ol>
<h2>Related templates and guides</h2>
<div class="grid grid-3 related-cards">${linksHtml}</div>
<h2 id="questions">Questions</h2>
${faqHtml(h.faq)}
<p><a href="${rel}${h.section ? h.section + '/' : 'templates/'}">Browse all ${h.section ? esc(h.sectionLabel.toLowerCase()) : 'free templates'} →</a></p>
<p class="small muted" style="margin-top:2rem">These are general templates, not legal or tax advice. Have anything unusual reviewed for your jurisdiction.</p>
</div></section>`;
}


export const pages = HUBS.map((h) => ({
  path: h.path, title: h.title, description: h.description, _toc: true,
  extraHead: faqLd(h.faq) + crumbsLd(h.section ? [['Home', ''], [h.sectionLabel, h.section + '/'], [h.h1, h.path]] : [['Home', ''], [h.h1, h.path]]),
  body: (rel) => hubBody(h, rel),
}));
