// Free drafting tools: small utilities people search for (amount in words, deadline calculator, template checker).
// Each runs entirely in the page from an external module (strict CSP friendly) and points to Clausery for the full job.
// The calculators also have bare embed pages (free-tools/embed/) that other sites can put in an iframe, with a credit link.
import { SITE, esc, faqLd, faqHtml } from '../tools/partials.mjs';
import { invoiceDue } from '../free-tools/invoice-due-date.js';
import { formatDate } from '../app/lib/expr.js';
const TOOL_CSS = `<style>
.tool { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; margin: 1.5rem 0; }
.tool label { display: block; font-weight: 600; margin-bottom: .3rem; }
.tool .row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
.tool input, .tool select, .tool textarea { width: 100%; padding: .55rem .65rem; border: 1px solid var(--border-strong); border-radius: var(--radius-sm); background: var(--bg); color: var(--text); font: inherit; }
.tool .out { font-size: 1.2rem; font-weight: 600; padding: 1rem; background: var(--accent-soft); color: var(--text); border-radius: var(--radius-sm); min-height: 3rem; }
.tool .out-row { display: flex; gap: .75rem; align-items: flex-start; margin-top: .75rem; } .tool .out-row .out { flex: 1; }
.tool .err, .bad { color: #b42318; } .ok { color: var(--ok); } .warn { color: var(--warn); }
#drop { border: 2px dashed var(--border-strong); border-radius: var(--radius); padding: 2rem; text-align: center; }
#drop.over { border-color: var(--accent); background: var(--accent-soft); }
#report table { width: 100%; border-collapse: collapse; font-size: .92rem; } #report th, #report td { text-align: left; padding: .5rem; border-bottom: 1px solid var(--border); vertical-align: top; }
#report .small { font-size: .85rem; color: var(--muted); }
.tool .check { display: flex; gap: .5rem; align-items: center; font-weight: 400; margin-bottom: 1rem; } .tool .check input { width: auto; }
.embed-code { width: 100%; font: .85rem/1.45 var(--mono); padding: .75rem; border: 1px solid var(--border-strong); border-radius: var(--radius-sm); background: var(--surface-2); color: var(--text); resize: vertical; }
.embed-tools { display: flex; gap: .75rem; align-items: center; flex-wrap: wrap; margin: .75rem 0 1rem; }
.schedule-wrap { max-height: 22rem; overflow: auto; margin-top: .5rem; } .tool details summary { cursor: pointer; font-weight: 600; }
.terms-table { width: 100%; border-collapse: collapse; font-size: .95rem; } .terms-table th, .terms-table td { text-align: left; padding: .55rem .5rem; border-bottom: 1px solid var(--border); vertical-align: top; }
</style>`;
const crumbs = (rel, name) => `<nav class="small muted" aria-label="Breadcrumb"><a href="${rel}">Home</a> › <a href="${rel}free-tools/">Free tools</a> › ${name}</nav>`;
const cta = (rel) => `<div class="feature" style="margin-top:2.5rem"><h2 style="font-size:1.15rem">Draft the whole document, not just one line</h2><p>Clausery turns your Word templates into questionnaires and builds the finished document in your browser, with amounts in words, dates and totals calculated for you. Free for up to three templates.</p><p style="margin-top:1rem"><a class="btn btn-primary" href="${rel}app/">Open Clausery</a> <a class="btn" href="${rel}templates/">Free templates</a></p></div>`;
const appLd = (name, desc, url) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name, description: desc, url: SITE + url, applicationCategory: 'BusinessApplication', operatingSystem: 'Any (web browser)', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } })}</script>`;

const TOOL_FAQ = [
  [['Why write an amount in both words and figures?', 'So that a typo in one is caught by the other. For cheques and promissory notes in the United States, the Uniform Commercial Code says that where words and numbers conflict, the words prevail, and many other countries follow the same rule.'],
  ['Should the amount include the word "and"?', 'British English usually writes "one hundred and fifty"; American cheque style often keeps "and" only before the cents, as in "and 50/100". Use the style your bank or contract template already uses.'],
  ['Is the amount I type sent anywhere?', 'No. The conversion runs entirely in this page, so nothing you type leaves your computer.']],
  [['How do you count days for a contract deadline?', 'The usual convention, used by this calculator, is to exclude the start day and count from the next day, so 10 days from 1 March is 11 March. Some contracts and court rules also move a deadline that falls on a weekend or holiday to the next business day; check the wording that applies to you.'],
  ['What happens when adding months to the end of a month?', 'If the target month is shorter, the date moves to its last day, so one month after 31 January is 28 February (29 in a leap year).'],
  ['What counts as a business day?', 'Monday to Friday, excluding any holidays you enter. Public holidays differ by country and state, so add the ones that apply to your contract.']],
  [['What does the checker look for?', 'It reads your .docx with the same engine as the Clausery app, including headers and footers, and reports tag problems such as a section that is opened but never closed or a tag name Clausery cannot use. If the template is valid, it shows the questionnaire Clausery would build from it.'],
  ['Is my document uploaded?', 'No. The file is read inside this page and never leaves your computer.'],
  ['What tag syntax does it expect?', 'Single curly braces: {client_name} for a value, {#has_retainer}…{/has_retainer} for optional text, {^has_retainer}…{/has_retainer} for the opposite, and {#items}…{/items} for repeating paragraphs or table rows.']],
  [['How is late payment interest calculated?', 'Usually as simple interest: the overdue amount × the yearly rate × the number of days late ÷ 365. This calculator counts days from the due date to the payment date.'],
    ['What is UK statutory interest?', 'Under the Late Payment of Commercial Debts (Interest) Act 1998, a business owed money by another business can usually claim interest at 8% above the Bank of England base rate, plus a fixed sum of £40, £70 or £100 depending on the size of the debt, unless the contract provides its own substantial remedy. It does not apply to consumers.'],
    ['Can I charge interest if my contract does not mention it?', 'It depends where you are. UK businesses have the statutory right above; elsewhere you may need a contract term or a court award. See the late payment interest clause in the clause library.']],
  [['How do freelancers calculate an hourly rate?', 'Start from the income you want to keep, add tax and business costs to get the revenue you need, then divide by the hours you can realistically bill in a year after holidays, sickness and admin time.'],
    ['How many billable hours should I assume?', 'Few freelancers bill 40 hours a week; finding work, admin and invoicing take time. 20 to 30 billable hours is a common planning range.'],
    ['Should I charge by the hour or by the project?', 'Use the hourly rate to price projects: estimate the hours, multiply, and add a margin for revisions. The freelance contract templates let you choose a flat fee or an hourly rate.']],
  [['What does net 30 mean?', 'Net 30 means the full invoice amount is due 30 calendar days after the invoice date. Net 15, net 60 and net 90 work the same way with a different number of days. If your contract says "30 days from receipt", count from the day the customer received the invoice instead.'],
    ['Does net 30 include weekends and holidays?', 'Yes. Payment terms count calendar days unless they say business days. If the due date falls on a weekend, many businesses pay on the next working day; tick the weekend option to see that date.'],
    ['What does 2/10 net 30 mean?', 'The customer can take 2% off if they pay within 10 days; otherwise the full amount is due in 30 days. Passing up that discount is expensive: it works out at about 37% a year, which is why finance teams usually take it.'],
    ['What do EOM and MFI mean on an invoice?', 'EOM means end of month: "net 30 EOM" is due 30 days after the end of the month the invoice is dated in. MFI means month following invoice: "15 MFI" is due on the 15th of the next month. Some suppliers treat invoices dated late in the month as next month\'s, so check your terms.'],
    ['Is there a legal limit on payment terms?', 'In the UK and the EU, if a business contract sets no payment date, statutory interest generally starts 30 days after the invoice (or delivery, if later), and agreed terms longer than 60 days must not be grossly unfair to the supplier. In the US, private business terms are set by contract; federal agencies generally pay within 30 days under the Prompt Payment Act.']],
  [['How is a loan repayment calculated?', 'For a loan repaid in equal instalments, the payment is P × i ÷ (1 − (1 + i)^−n), where P is the amount borrowed, i is the interest rate for one payment period (the yearly rate divided by the number of payments a year) and n is the number of payments. Each payment covers that period\'s interest first, and the rest reduces the balance.'],
    ['What is an amortization schedule?', 'A table of every payment showing how much goes to interest, how much repays the loan, and the balance left afterwards. Early payments are mostly interest; later ones are mostly repayment.'],
    ['Why is the last payment slightly different?', 'Payments are rounded to the cent, so the final payment is adjusted by a few cents to clear the balance exactly.'],
    ['Does this match my bank\'s figures?', 'Usually to within a few cents or dollars. Some lenders charge interest daily, add fees, or round differently, so their figures can differ slightly.']]
];

// `height` is the iframe's fallback height (px) in the embed code, for sites that strip the resize script: it fits the
// widget at about 520px wide and up, so a narrow column shows a scrollbar and a wide one some space below.
const TOOLS = [
  { slug: 'amount-in-words', name: 'Amount in words converter', desc: 'Write any amount in words for contracts, cheques and promissory notes, such as "One Thousand Two Hundred and Fifty Dollars and 50/100".', height: 540 },
  { slug: 'deadline-calculator', name: 'Contract deadline calculator', desc: 'Add or subtract days, business days, weeks, months or years from a date, with month-end handling and your own holidays.', height: 540 },
  { slug: 'invoice-due-date', name: 'Invoice due date calculator', desc: 'Find the due date for Net 30, Net 60, EOM, 15 MFI or 2/10 net 30 invoices, the days left to pay and what an early payment discount is worth.', height: 460 },
  { slug: 'late-payment-interest', name: 'Late payment interest calculator', desc: 'Work out interest on an overdue invoice at your contract rate, or UK statutory interest at 8% above base rate plus the fixed compensation sum.', height: 540 },
  { slug: 'loan-repayment', name: 'Loan repayment calculator', desc: 'Work out the payment on a loan repaid in equal instalments, the total interest and a full repayment schedule with dates, for weekly to yearly payments.', height: 500 },
  { slug: 'freelance-rate', name: 'Freelance rate calculator', desc: 'Work back from the income you want to keep to the hourly and day rate you need to charge, after tax, costs and time off.', height: 580 },
  { slug: 'template-checker', name: 'Word template tag checker', desc: 'Check a .docx template for broken {tags} and see the questionnaire it would produce. The file never leaves your computer.' },
];
const T = Object.fromEntries(TOOLS.map((t) => [t.slug, t]));

const TERMS = [['due on receipt', 'Due on receipt'], ['net 7', 'Net 7'], ['net 10', 'Net 10'], ['net 14', 'Net 14'], ['net 15', 'Net 15'], ['net 30', 'Net 30'], ['net 45', 'Net 45'], ['net 60', 'Net 60'], ['net 90', 'Net 90'],
  ['eom', 'End of month (EOM)'], ['net 30 eom', 'Net 30 EOM'], ['15 mfi', '15th of the following month (15 MFI)'], ['2/10 net 30', '2/10 net 30'], ['1/10 net 30', '1/10 net 30']];
const INVOICE_WIDGET = `<div class="tool">
  <div class="row">
    <div><label for="invoice">Invoice date</label><input id="invoice" type="date"></div>
    <div><label for="terms">Payment terms</label><select id="terms">${TERMS.map(([v, l]) => `<option value="${v}"${v === 'net 30' ? ' selected' : ''}>${l}</option>`).join('')}<option value="other">Other terms…</option></select></div>
    <div id="custom-row" hidden><label for="custom">Terms as written</label><input id="custom" value="3/15 net 45" autocomplete="off"></div>
    <div><label for="amount">Invoice amount (optional)</label><input id="amount" inputmode="decimal" value="4800" autocomplete="off"></div>
    <div><label for="currency">Currency</label><select id="currency"><option value="USD">US dollars</option><option value="GBP">Pounds sterling</option><option value="EUR">Euros</option><option value="CAD">Canadian dollars</option><option value="AUD">Australian dollars</option></select></div>
  </div>
  <label class="check"><input id="weekends" type="checkbox"> Move a due date that falls on a weekend to the Monday</label>
  <p id="error" class="err" role="alert" hidden></p>
  <div class="out" id="result" aria-live="polite"></div>
  <p class="small muted" id="result-note" style="margin-top:.5rem"></p>
  <p class="small" id="result-discount"></p>
</div>`;
// The payment terms table on the calculator page is worked out with the same code as the calculator.
const EXAMPLE_DATE = '2026-03-12';
const TERMS_TABLE = [
  ['Due on receipt', 'due on receipt', 'Payable as soon as the invoice arrives. Common for small one-off jobs.'],
  ['Net 7 / Net 14', ['net 7', 'net 14'], 'Due 7 or 14 days after the invoice date. Popular with freelancers who want to be paid quickly.'],
  ['Net 30', 'net 30', 'Due 30 days after the invoice date. The most common business term.'],
  ['Net 60 / Net 90', ['net 60', 'net 90'], 'Due 60 or 90 days after the invoice date. Asked for by large customers; some laws limit them.'],
  ['EOM', 'eom', 'Due on the last day of the month the invoice is dated in.'],
  ['Net 30 EOM', 'net 30 eom', 'Due 30 days after the end of the invoice month, so 30 to 60 days after the invoice date, depending on when in the month it is dated.'],
  ['15 MFI', '15 mfi', 'Due on the 15th of the month following the invoice.'],
  ['2/10 net 30', '2/10 net 30', 'Take 2% off if paid within 10 days; otherwise the full amount is due in 30 days.'],
];
const termsTable = () => `<div style="overflow-x:auto"><table class="terms-table"><thead><tr><th scope="col">Terms</th><th scope="col">What it means</th><th scope="col">Invoice dated ${formatDate(EXAMPLE_DATE, 'medium', 'en-US')} is due</th></tr></thead><tbody>${TERMS_TABLE.map(([name, terms, meaning]) => {
  const rs = [terms].flat().map((t) => invoiceDue({ invoiceDate: EXAMPLE_DATE, terms: t, today: EXAMPLE_DATE }));
  for (const r of rs) if (r.error) throw new Error(`terms table: ${name}: ${r.error}`);
  const disc = rs[0].discount;
  return `<tr><th scope="row">${name}</th><td>${meaning}</td><td>${rs.map((r) => formatDate(r.due, 'medium', 'en-US')).join(' or ')}${disc ? ` (${disc.pct}% off until ${formatDate(disc.by, 'medium', 'en-US')})` : ''}</td></tr>`;
}).join('')}</tbody></table></div>`;
// The calculator markup, shared by each tool page and its embed page.
const WIDGET = {
  'amount-in-words': `<div class="tool">
  <div class="row">
    <div><label for="amount">Amount</label><input id="amount" inputmode="decimal" value="1250.50" autocomplete="off"></div>
    <div><label for="currency">Currency</label><select id="currency"><option value="USD">US dollars</option><option value="EUR">Euros</option><option value="GBP">Pounds sterling</option><option value="CAD">Canadian dollars</option><option value="AUD">Australian dollars</option><option value="INR">Rupees</option><option value="ZAR">Rand</option><option value="NONE">No currency</option></select></div>
    <div><label for="style">Style</label><select id="style"><option value="legal">Contract (and fifty cents)</option><option value="cheque">Cheque (and 50/100)</option><option value="plain">Plain number</option></select></div>
    <div><label for="caps">Capitals</label><select id="caps"><option value="title">Title Case</option><option value="upper">UPPER CASE</option><option value="lower">lower case</option></select></div>
  </div>
  <p id="error" class="err" role="alert" hidden></p>
  <div class="out-row"><div class="out" id="result" aria-live="polite"></div><button class="btn" type="button" data-copy="result">Copy</button></div>
  <div class="out-row"><div class="out" id="result-figure"></div><button class="btn" type="button" data-copy="result-figure">Copy</button></div>
</div>`,
  'deadline-calculator': `<div class="tool">
  <div class="row">
    <div><label for="start">Start date</label><input id="start" type="date"></div>
    <div><label for="amount">Number</label><input id="amount" type="number" min="0" step="1" value="30"></div>
    <div><label for="unit">Unit</label><select id="unit"><option value="days">Calendar days</option><option value="business">Business days (Mon–Fri)</option><option value="weeks">Weeks</option><option value="months">Months</option><option value="years">Years</option></select></div>
    <div><label for="direction">Direction</label><select id="direction"><option value="after">After the start date</option><option value="before">Before the start date</option></select></div>
  </div>
  <label for="holidays">Holidays to skip for business days (optional, one date per line or comma-separated, YYYY-MM-DD)</label>
  <textarea id="holidays" rows="2" placeholder="2026-12-25, 2027-01-01"></textarea>
  <p id="error" class="err" role="alert" hidden></p>
  <div class="out" id="result" aria-live="polite" style="margin-top:1rem"></div>
  <p class="small muted" id="result-note" style="margin-top:.5rem"></p>
</div>`,
  'late-payment-interest': `<div class="tool">
  <div class="row">
    <div><label for="amount">Amount owed</label><input id="amount" inputmode="decimal" value="4800" autocomplete="off"></div>
    <div><label for="currency">Currency</label><select id="currency"><option value="USD">US dollars</option><option value="GBP">Pounds sterling</option><option value="EUR">Euros</option><option value="CAD">Canadian dollars</option><option value="AUD">Australian dollars</option></select></div>
    <div><label for="due">Payment was due</label><input id="due" type="date"></div>
    <div><label for="paid">Paid, or today</label><input id="paid" type="date"></div>
  </div>
  <div class="row">
    <div><label for="basis">Interest basis</label><select id="basis"><option value="year">Contract rate per year</option><option value="month">Contract rate per month</option><option value="uk">UK statutory (business debts)</option></select></div>
    <div id="rate-row"><label for="rate">Rate (%)</label><input id="rate" inputmode="decimal" value="10"></div>
    <div id="base-row" hidden><label for="base">Bank of England base rate (%)</label><input id="base" inputmode="decimal" value=""></div>
  </div>
  <p id="error" class="err" role="alert" hidden></p>
  <div class="out" id="result" aria-live="polite"></div>
  <p class="small muted" id="result-note" style="margin-top:.5rem"></p>
</div>`,
  'freelance-rate': `<div class="tool">
  <div class="row">
    <div><label for="income">Income you want to keep per year</label><input id="income" inputmode="decimal" value="60000"></div>
    <div><label for="expenses">Business costs per year</label><input id="expenses" inputmode="decimal" value="6000"></div>
    <div><label for="tax">Estimated tax rate (%)</label><input id="tax" inputmode="decimal" value="25"></div>
    <div><label for="currency">Currency</label><select id="currency"><option value="USD">US dollars</option><option value="GBP">Pounds sterling</option><option value="EUR">Euros</option><option value="CAD">Canadian dollars</option><option value="AUD">Australian dollars</option></select></div>
  </div>
  <div class="row">
    <div><label for="off">Weeks off per year</label><input id="off" type="number" min="0" max="51" value="6"></div>
    <div><label for="hpw">Billable hours per week</label><input id="hpw" type="number" min="1" max="80" value="25"></div>
    <div><label for="hpd">Hours in a working day</label><input id="hpd" type="number" min="1" max="16" value="8"></div>
  </div>
  <p id="error" class="err" role="alert" hidden></p>
  <div class="out" id="result" aria-live="polite"></div>
  <p class="small muted" id="result-note" style="margin-top:.5rem"></p>
</div>`,
  'invoice-due-date': INVOICE_WIDGET,
  'loan-repayment': `<div class="tool">
  <div class="row">
    <div><label for="amount">Loan amount</label><input id="amount" inputmode="decimal" value="12000" autocomplete="off"></div>
    <div><label for="currency">Currency</label><select id="currency"><option value="USD">US dollars</option><option value="GBP">Pounds sterling</option><option value="EUR">Euros</option><option value="CAD">Canadian dollars</option><option value="AUD">Australian dollars</option><option value="INR">Rupees</option></select></div>
    <div><label for="rate">Interest rate (% a year)</label><input id="rate" inputmode="decimal" value="5" autocomplete="off"></div>
  </div>
  <div class="row">
    <div><label for="payments">Number of payments</label><input id="payments" type="number" min="1" max="1200" step="1" value="24"></div>
    <div><label for="frequency">Paid</label><select id="frequency"><option value="weekly">Weekly</option><option value="fortnightly">Every two weeks</option><option value="monthly" selected>Monthly</option><option value="quarterly">Quarterly</option><option value="yearly">Yearly</option></select></div>
    <div><label for="first">First payment date (optional)</label><input id="first" type="date"></div>
  </div>
  <p id="error" class="err" role="alert" hidden></p>
  <div class="out" id="result" aria-live="polite"></div>
  <p class="small muted" id="result-note" style="margin-top:.5rem"></p>
  <details id="schedule-box"><summary>Repayment schedule</summary><div class="schedule-wrap" tabindex="0"><table id="schedule" class="terms-table"><thead><tr><th scope="col">#</th><th scope="col" id="date-col" hidden>Date</th><th scope="col">Payment</th><th scope="col">Interest</th><th scope="col">Principal</th><th scope="col">Balance</th></tr></thead><tbody></tbody></table></div></details>
</div>`,
};

// The code other sites paste to embed a calculator. The credit link sits outside the iframe so it counts as a normal
// link on their page; it uses the brand name, not keywords, as search engines ask for widget links. The script is
// optional: it fits the iframe to the calculator's height (sent by free-tools/embed/embed.js) and accepts nothing else.
const ORIGIN = new URL(SITE).origin;
const embedCode = (t) => `<iframe src="${SITE}free-tools/embed/${t.slug}.html" title="${t.name}" width="100%" height="${t.height}" style="border:0;max-width:760px" loading="lazy" allow="clipboard-write"></iframe>
<p style="font-size:13px;margin:4px 0 16px">${t.name} by <a href="${SITE}free-tools/${t.slug}.html">Clausery</a></p>
<script>window.addEventListener('message',function(e){if(e.origin!=='${ORIGIN}'||!e.data||!e.data.clauseryHeight)return;var f=document.getElementsByTagName('iframe');for(var i=0;i<f.length;i++)if(f[i].contentWindow===e.source)f[i].style.height=e.data.clauseryHeight+'px';});</script>`;
const embedSection = (slug) => `<h2 style="margin-top:2.5rem">Add this calculator to your website</h2>
<p>Free for blogs, accountants, law firms, trade associations and anyone who helps small businesses. Paste the code where you want the calculator to appear. It runs in your visitors' browsers, with no cookies, no tracking, and nothing they type sent anywhere.</p>
<label for="embed-code">Embed code</label>
<textarea id="embed-code" class="embed-code" rows="6" readonly>${esc(embedCode(T[slug]))}</textarea>
<div class="embed-tools"><button class="btn copy-btn" type="button" data-copy="embed-code">Copy the code</button><a class="btn" href="embed/${slug}.html" target="_blank" rel="noopener">Preview</a><span class="small muted copy-status" role="status"></span></div>
<p class="small muted">The last line of the code resizes the calculator to fit; if your site strips scripts, leave it out and the calculator still works at a fixed height. On a dark website, add <code>?theme=dark</code> after <code>${slug}.html</code>. Please keep the credit line under the calculator.</p>`;
const EMBED_CSS = `<style>
body.embed { background: transparent; }
.embed-wrap { padding: 2px; }
.embed-wrap .tool { margin: 0; padding: 1rem 1.1rem; }
.embed-wrap .tool .row { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: .75rem; }
.embed-wrap h1 { font-size: 1.15rem; margin: 0 0 .6rem; }
.embed-credit { font-size: .82rem; margin: .5rem 0 0; }
</style>`;
export const pages = [
  { path: 'free-tools/', title: 'Free drafting tools', description: 'Free tools for drafting and invoicing: amount in words, deadlines, invoice due dates, late payment interest, loan repayments, freelance rates and more.',
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem"><h1>Free drafting tools</h1><p class="lead">Small tools for everyday drafting and invoicing. They run entirely in your browser; nothing you type is sent anywhere. The calculators can also be <a href="#embed">added to your own website</a> for free.</p>
<div class="grid grid-3" style="margin-top:2rem">${TOOLS.map((t) => `<a class="feature" style="text-decoration:none;color:inherit" href="${rel}free-tools/${t.slug}.html"><h2 style="font-size:1.1rem">${t.name}</h2><p>${t.desc}</p></a>`).join('')}</div>
<h2 id="embed" style="margin-top:3rem">Put a calculator on your website</h2>
<p>Every calculator except the template checker can be embedded on another site with one line of code, free. Open a calculator and scroll to <strong>Add this calculator to your website</strong> to copy its code. The embedded calculators run in your visitors' browsers with no cookies or tracking, and carry a small credit link to Clausery.</p></div></section>` },

  { path: 'free-tools/amount-in-words.html', title: 'Amount in words converter for contracts and cheques', description: T['amount-in-words'].desc,
    extraHead: faqLd(TOOL_FAQ[0]) + TOOL_CSS + appLd(T['amount-in-words'].name, T['amount-in-words'].desc, 'free-tools/amount-in-words.html') + `<script type="module" src="amount-in-words.js"></script>`,
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem">${crumbs(rel, 'Amount in words')}
<h1 style="margin-top:1rem">Amount in words converter</h1>
<p class="lead">Contracts, promissory notes and cheques often state an amount twice, in words and in figures, so a typo in one is caught by the other. Type an amount to get the wording.</p>
${WIDGET['amount-in-words']}
<h2>How amounts are usually written</h2>
<ul><li>In contracts, the amount in words normally comes first, followed by the figure in brackets: <em>Five Thousand Dollars ($5,000)</em>.</li><li>On cheques, cents are written as a fraction: <em>Five Thousand and 00/100</em>.</li><li>Many agreements say which one wins if they differ; words usually do.</li></ul>
<p>In Clausery templates, the <code>words()</code> function does this automatically, for example <code>words(fee)</code>. See <a href="${rel}docs/logic.html">logic and calculations</a>.</p>
${embedSection('amount-in-words')}
<h2 style="margin-top:2.5rem">Questions</h2>
${faqHtml(TOOL_FAQ[0])}
${cta(rel)}</div></section>` },

  { path: 'free-tools/deadline-calculator.html', title: 'Contract deadline calculator (business days, months, years)', description: T['deadline-calculator'].desc,
    extraHead: faqLd(TOOL_FAQ[1]) + TOOL_CSS + appLd(T['deadline-calculator'].name, T['deadline-calculator'].desc, 'free-tools/deadline-calculator.html') + `<script type="module" src="deadline-calculator.js"></script>`,
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem">${crumbs(rel, 'Deadline calculator')}
<h1 style="margin-top:1rem">Contract deadline calculator</h1>
<p class="lead">Work out notice periods, payment due dates, renewal dates and response deadlines. Month arithmetic stops at month end, so January 31 plus one month is the last day of February.</p>
${WIDGET['deadline-calculator']}
<h2>Things to check</h2>
<ul><li><strong>Is the start day counted?</strong> This calculator counts from the day after the start date, which is the usual rule, but some contracts and courts say otherwise.</li><li><strong>Weekends and holidays.</strong> Many rules move a deadline that falls on a non-business day to the next business day.</li><li><strong>Time zones and cut-off times.</strong> "By 5pm" or "close of business" matters for filings and notices.</li></ul>
<p class="small muted">A calculation aid, not legal advice. Court and statutory deadlines follow their own rules.</p>
<p>Clausery templates can calculate these dates for you with <code>add_days</code>, <code>add_months</code> and <code>add_years</code>.</p>
${embedSection('deadline-calculator')}
<h2 style="margin-top:2.5rem">Questions</h2>
${faqHtml(TOOL_FAQ[1])}
${cta(rel)}</div></section>` },

  { path: 'free-tools/invoice-due-date.html', title: 'Net 30 calculator: invoice due date for any payment terms', description: T['invoice-due-date'].desc,
    extraHead: faqLd(TOOL_FAQ[5]) + TOOL_CSS + appLd(T['invoice-due-date'].name, T['invoice-due-date'].desc, 'free-tools/invoice-due-date.html') + `<script type="module" src="invoice-due-date.js"></script>`,
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem">${crumbs(rel, 'Invoice due date')}
<h1 style="margin-top:1rem">Invoice due date calculator</h1>
<p class="lead">Pick the payment terms on the invoice, such as net 30, net 30 EOM or 2/10 net 30, to see the exact due date, how many days are left, and what paying early is worth.</p>
${WIDGET['invoice-due-date']}
<p class="small muted">Choose <strong>Other terms</strong> to type terms as they appear on the invoice, for example <em>net 21</em>, <em>3/15 net 45</em> or <em>10th prox</em>.</p>
<h2>Payment terms explained</h2>
<p>Terms count calendar days from the invoice date unless they say otherwise. The last column shows each one for an invoice dated ${formatDate(EXAMPLE_DATE, 'long', 'en-US')}, before any weekend adjustment.</p>
${termsTable()}
<h2 style="margin-top:2rem">Choosing terms for your own invoices</h2>
<ul><li><strong>Shorter terms get paid sooner.</strong> Net 14 is common for freelancers and small jobs; net 30 is the usual default between businesses.</li><li><strong>Put the terms in the contract, not just the invoice.</strong> A customer who agreed to net 14 in writing is harder to stretch to net 60. See the <a href="${rel}clauses/payment-terms-clause.html">payment terms clause</a> for sample wording.</li><li><strong>Say what happens when payment is late.</strong> A <a href="${rel}clauses/late-payment-interest-clause.html">late payment interest clause</a> gives you a right to interest and to pause work.</li><li><strong>Offer a discount only if cash matters more than margin.</strong> 2/10 net 30 gets many customers paying in 10 days, but it costs you 2% of every invoice they pay early.</li></ul>
<h2>When the due date has passed</h2>
<p>Send a polite reminder the day after, then a firmer one a week later. The free <a href="${rel}templates/payment-reminder-letter.html">payment reminder letter</a> and <a href="${rel}templates/payment-demand-letter.html">payment demand letter</a> templates are ready to fill in, the <a href="${rel}free-tools/late-payment-interest.html">late payment interest calculator</a> shows what you can add, and the guide <a href="${rel}guides/what-to-do-when-a-client-wont-pay.html">what to do when a client won't pay</a> covers the steps after that.</p>
<p class="small muted">A calculation aid, not legal or tax advice. Your contract decides when payment is due.</p>
${embedSection('invoice-due-date')}
<h2 style="margin-top:2.5rem">Questions</h2>
${faqHtml(TOOL_FAQ[5])}
${cta(rel)}</div></section>` },

  { path: 'free-tools/late-payment-interest.html', title: 'Late payment interest calculator (contract or UK statutory)', description: T['late-payment-interest'].desc,
    extraHead: faqLd(TOOL_FAQ[3]) + TOOL_CSS + appLd(T['late-payment-interest'].name, T['late-payment-interest'].desc, 'free-tools/late-payment-interest.html') + `<script type="module" src="late-payment-interest.js"></script>`,
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem">${crumbs(rel, 'Late payment interest')}
<h1 style="margin-top:1rem">Late payment interest calculator</h1>
<p class="lead">Find out how much interest you can add to an overdue invoice, at the rate in your contract or at the UK statutory rate for business debts.</p>
${WIDGET['late-payment-interest']}
<p class="small muted">For UK statutory interest, use the base rate in force on the day the debt became overdue (check the Bank of England website). This is general information, not legal advice.</p>
<h2>Asking for payment</h2>
<p>Not sure when the invoice fell due? The <a href="${rel}free-tools/invoice-due-date.html">invoice due date calculator</a> works it out from terms such as net 30 or 15 MFI.</p>
<p>Send a clear written reminder or demand before adding interest. The free <a href="${rel}templates/payment-reminder-letter.html">payment reminder letter</a> has an optional late fee line, the <a href="${rel}templates/payment-demand-letter.html">payment demand letter</a> has an optional interest paragraph, and the <a href="${rel}clauses/late-payment-interest-clause.html">late payment interest clause</a> shows how to put a rate in your next contract.</p>
${embedSection('late-payment-interest')}
<h2 style="margin-top:2.5rem">Questions</h2>
${faqHtml(TOOL_FAQ[3])}
${cta(rel)}</div></section>` },

  { path: 'free-tools/freelance-rate.html', title: 'Freelance rate calculator: hourly and day rate', description: T['freelance-rate'].desc,
    extraHead: faqLd(TOOL_FAQ[4]) + TOOL_CSS + appLd(T['freelance-rate'].name, T['freelance-rate'].desc, 'free-tools/freelance-rate.html') + `<script type="module" src="freelance-rate.js"></script>`,
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem">${crumbs(rel, 'Freelance rate')}
<h1 style="margin-top:1rem">Freelance rate calculator</h1>
<p class="lead">Start from what you want to take home and work back to the hourly and day rate that gets you there, after tax, business costs and time off.</p>
${WIDGET['freelance-rate']}
<p class="small muted">The tax rate is a single estimate; real tax depends on your country, income and deductions.</p>
<h2>Put the rate in writing</h2>
<p>Once you know your rate, put it in the contract with the revisions and extras it covers. See the free <a href="${rel}for/freelancers.html">freelance contract templates</a> and the <a href="${rel}clauses/payment-terms-clause.html">payment terms clause</a>.</p>
${embedSection('freelance-rate')}
<h2 style="margin-top:2.5rem">Questions</h2>
${faqHtml(TOOL_FAQ[4])}
${cta(rel)}</div></section>` },

  { path: 'free-tools/loan-repayment.html', title: 'Loan repayment calculator with amortization schedule', description: T['loan-repayment'].desc,
    extraHead: faqLd(TOOL_FAQ[6]) + TOOL_CSS + appLd(T['loan-repayment'].name, T['loan-repayment'].desc, 'free-tools/loan-repayment.html') + `<script type="module" src="loan-repayment.js"></script>`,
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem">${crumbs(rel, 'Loan repayment')}
<h1 style="margin-top:1rem">Loan repayment calculator</h1>
<p class="lead">Lending to family, a friend or a business? Enter the amount, the interest rate and the number of payments to see the payment, the total interest, and a full schedule you can attach to the loan agreement.</p>
${WIDGET['loan-repayment']}
<p class="small muted">Interest is charged each period at the yearly rate divided by the number of payments a year. Enter 0% for an interest-free loan. A calculation aid, not financial or tax advice.</p>
<h2>Put the loan in writing</h2>
<p>Write the payment, the number of payments and the first and last payment dates into a signed agreement. The free <a href="${rel}templates/loan-agreement.html">loan agreement template</a> covers interest, instalments, a late fee, collateral and a guarantor; for a simple loan, a <a href="${rel}templates/promissory-note.html">promissory note</a> is enough. If you charge interest, check the legal maximum where the borrower lives, and for large family loans check the tax rules on interest-free lending.</p>
${embedSection('loan-repayment')}
<h2 style="margin-top:2.5rem">Questions</h2>
${faqHtml(TOOL_FAQ[6])}
${cta(rel)}</div></section>` },
  { path: 'free-tools/template-checker.html', title: 'Word template tag checker', description: T['template-checker'].desc,
    extraHead: faqLd(TOOL_FAQ[2]) + TOOL_CSS + appLd(T['template-checker'].name, T['template-checker'].desc, 'free-tools/template-checker.html') + `<script type="module" src="template-checker.js"></script>`,
    body: (rel) => `<section class="section"><div class="wrap" style="max-width:52rem">${crumbs(rel, 'Template checker')}
<h1 style="margin-top:1rem">Word template tag checker</h1>
<p class="lead">Check a Word template before you use it: unclosed tags, mismatched sections and invalid names are reported with a plain-English fix, and you see the exact questionnaire it would produce. The file is read in your browser and never uploaded.</p>
<div class="tool">
  <div id="drop"><p><strong>Drop a .docx file here</strong> or choose one</p><label for="file" class="sr-only">Word template</label><input id="file" type="file" accept=".docx"></div>
  <div id="report" aria-live="polite" hidden style="margin-top:1.5rem"></div>
</div>
<h2>What it checks</h2>
<ul><li>Tags that are opened but not closed, such as <code>{client_name</code></li><li>Sections that do not match, such as <code>{#has_retainer}</code> closed by <code>{/retainer}</code></li><li>Tag names with spaces, hyphens or dots</li><li>Tags in the body, headers, footers, footnotes and endnotes</li></ul>
<p>New to tags? Read <a href="${rel}guides/automate-word-templates.html">how to automate a Word template</a> or the full <a href="${rel}docs/templates.html">template syntax</a>.</p>
<h2 style="margin-top:2.5rem">Questions</h2>
${faqHtml(TOOL_FAQ[2])}
${cta(rel)}</div></section>` },
  // Bare calculator pages for other sites' iframes: no site header or footer, not indexed, light theme unless ?theme=dark.
  ...TOOLS.filter((t) => t.height).map((t) => ({
    path: `free-tools/embed/${t.slug}.html`, layout: 'embed', noindex: true, title: `${t.name} (embed)`, description: t.desc,
    extraHead: TOOL_CSS + EMBED_CSS + `<script type="module" src="../${t.slug}.js"></script>`,
    body: () => `<div class="embed-wrap"><h1>${t.name}</h1>
${WIDGET[t.slug]}
<p class="embed-credit muted">Free calculator by <a href="${SITE}free-tools/${t.slug}.html" target="_blank" rel="noopener">Clausery</a>. Nothing you type leaves your browser.</p></div>`,
  })),
];
