# Launch posts, ready to paste

Edit anything that no longer matches the product before posting. Use plain links (each community's rules differ; some strip or distrust tracking parameters). Cloudflare Web Analytics shows which site sent each visitor.

Facts used below (check them before posting): 87 free Word templates, 9 free calculators, Free plan with no time limit, Pro $19 a month or $190 a year, Team $49 a month for 5 seats, 14-day Pro trial with no card, 30-day money-back guarantee.

---

## Hacker News: Show HN

Post on a weekday morning, US Eastern time. Answer every comment. Don't ask anyone to upvote: HN penalises it.

**Title** (80 characters max):

```
Show HN: Clausery – Fill in Word invoices and templates in-browser, no uploads
```

**URL:** `https://getclausery.github.io/`

**Text** (post it as the first comment):

```
Hi HN. I built Clausery for small businesses and freelancers who still send invoices, quotes and contracts as Word files.

You answer a few questions and download a normal .docx you can keep editing. Totals, tax and discounts are calculated, and the next invoice starts with your details and the next number. Everything happens in the browser: templates are parsed, logic is evaluated and the .docx is assembled client-side, drafts live in IndexedDB, and nothing you type is sent anywhere. You can check this in the Network panel. It works offline as a PWA.

Under the hood:
- No framework and no build step for the app: plain ES modules
- docxtemplater/pizzip for assembly, docx-preview for the on-screen preview
- A small safe expression language for conditions and calculations (no eval)
- Optional AES-256-GCM encryption of the local database (PBKDF2), with auto-lock
- Client intake forms exported as a single self-contained HTML file that the client fills in offline and sends back as an answers file
- Strict CSP; offline license keys are Ed25519 and verified with WebCrypto

Any Word file with {tags} becomes a guided questionnaire, with conditional sections, repeating table rows and calculations.

There are 87 free Word templates with no account. Pro is $19/month for heavier use of your own templates, and you can try it for 14 days with no card. The source is public on GitHub so you can see what it does, though it isn't open-source licensed.

I'd love feedback, especially on the template syntax and on anything that makes you not trust a tool like this with client data.
```

---

## Product Hunt

Launch at 12:01 am Pacific time, when the day's ranking resets. Line up a few people who genuinely use Clausery to leave honest comments, but never ask for upvotes.

**Name:** Clausery

**Tagline** (60 characters max):

```
Invoices and Word templates, filled in privately in-browser
```

**Description** (260 characters max):

```
Make invoices, quotes and receipts in Word with totals, tax and numbering done for you, plus 87 free templates. No sign-up, and nothing you type leaves your browser. Turn any Word file with {tags} into a guided questionnaire. Pro is free for 14 days, no card.
```

**Topics:** Productivity, Invoicing, Freelance, Privacy, Small Business

**Gallery:** `assets/screenshot-invoice.png`, `assets/screenshot-designer.png`, `assets/og.png`, plus a 30–60 second screen recording: open the invoice, type a line item, watch the total update, download, open in Word.

**Maker comment:**

```
Hi Product Hunt! 👋

I made Clausery because small businesses still live in Word: invoices, quotes, receipts, contracts. Online invoice tools want an account and your clients' details on their servers, and blank Word templates leave you doing the maths and the numbering by hand.

Clausery sits in between:
✅ Answer a few questions, download a normal .docx you can still edit (or print to PDF)
✅ Totals, tax, discounts and invoice numbers are worked out for you
✅ Your next invoice remembers your details and continues the numbering
✅ It all runs in your browser. Nothing you type is uploaded, there's no account, and it works offline
✅ 87 free Word templates: invoices, quotes, receipts, NDAs, leases, HR letters and more

If you already have your own Word templates, add {tags} and Clausery turns them into a guided questionnaire with conditional clauses, repeating rows and calculations.

Free has no time limit. Pro ($19/month) adds unlimited own templates, calculations, bulk documents from a spreadsheet, encryption and client intake forms, and removes the small "Made with Clausery" line from documents. Try Pro free for 14 days, no card, with a 30-day money-back guarantee if you buy.

What would make this useful for your business? I read every comment.
```

---

## Indie Hackers (story post)

**Title:** `I launched a privacy-first invoice and Word template tool. Here's month one.`

```
Three weeks ago I launched Clausery (https://getclausery.github.io/): a browser app that makes invoices, quotes and receipts as editable Word files, with the maths done for you, and turns any Word template into a guided questionnaire. Nothing is uploaded; it's a static site on GitHub Pages with no backend.

What went right:
- Shipping 87 free Word templates and 9 calculators as indexable pages. Search is slow for a new domain, but every page is a long-term entry point.
- Zero infrastructure cost. The whole product is static files, so the free plan costs me nothing to give away.

What I got wrong:
- The free plan gave invoice users everything, and the paid plan sold limits they never hit. Traffic was low and paying users were lower.
- I promoted it once and then waited for SEO.

What I changed this week:
- Free documents made from library templates now carry a small "Made with Clausery" line. Every invoice a user sends introduces the tool to their client, and removing it is the first Pro benefit invoice users actually care about.
- A one-click 14-day Pro trial with no card, offered at the moment someone wants a Pro feature.
- A 30-day money-back guarantee. A new brand has to carry the risk, not the buyer.
- Anonymous funnel counts (upgrade shown → trial → checkout) so I can see where people drop off.

I'll post the numbers in a month. If you sell to freelancers or small businesses, I'd love to know where they actually hang out.
```

---

## Reddit

Read each subreddit's rules first: most ban self-promotion outside specific threads. Post from an account with a real history, reply to every comment, and never cross-post the same text to many subreddits on the same day.

### r/SideProject

**Title:** `I built a free invoice maker that fills in Word templates in your browser (no sign-up, nothing uploaded)`

```
Clausery makes invoices, quotes and receipts as normal Word files: answer a few questions, and the totals, tax and invoice number are done for you. The next invoice remembers your details.

It's a static site with no backend. Everything runs in the browser, drafts are saved locally, and it works offline. There are also 87 free Word templates (NDAs, leases, HR letters and more) you can fill in the same way.

https://getclausery.github.io/

Free with no time limit; there's a paid plan for heavier template automation. Feedback very welcome, especially on what feels confusing the first time.
```

### r/webdev (Showoff Saturday only)

**Title:** `[Showoff Saturday] A Word (.docx) document generator that runs entirely client-side: no framework, no build step`

```
Clausery assembles .docx files in the browser from Word templates with {tags}: conditions, repeating table rows and calculations, evaluated by a small safe expression language instead of eval.

Stack: plain ES modules, docxtemplater + pizzip, docx-preview for rendering, IndexedDB for drafts, an optional AES-256-GCM encrypted store, a service worker for offline use, and a strict CSP. It's hosted as static files on GitHub Pages.

https://getclausery.github.io/ (the invoice is the quickest demo)

Happy to go into the details: the preview pipeline, the offline intake forms (a single self-contained HTML file), or the license verification with WebCrypto Ed25519.
```

### Helpful answers (r/freelance, r/smallbusiness, r/sweatystartup and similar)

Don't post announcements there. Answer questions such as "how do I write an invoice?", "what do I put on a quote?" or "my client won't pay". Write a complete answer in the comment itself, and add a link only when a page directly helps and the rules allow it:

- How to write an invoice: `https://getclausery.github.io/guides/how-to-write-an-invoice.html`
- A client won't pay: `https://getclausery.github.io/guides/what-to-do-when-a-client-wont-pay.html`
- Deposits: `https://getclausery.github.io/invoice-templates/deposit-invoice.html`
- Late payment interest: `https://getclausery.github.io/free-tools/late-payment-interest.html`

---

## LinkedIn

```
Small businesses still run on Word: invoices, quotes, receipts, contracts.

I built Clausery so you can fill them in by answering a few questions, with totals, tax and invoice numbers worked out for you, and download a normal Word file you can still edit.

Two things I cared about:
→ Nothing you type leaves your browser. No account, no upload, and it works offline.
→ It's genuinely free for everyday use, with 87 Word templates.

If you send invoices or quotes, I'd love you to try it and tell me what's missing: https://getclausery.github.io/
```

## X / Twitter thread

```
1/ I built a free invoice maker that runs entirely in your browser.

Answer a few questions → download a Word invoice with the totals, tax and numbering done. No sign-up, nothing uploaded. https://getclausery.github.io/

2/ Your next invoice starts with your details, the next number and today's date. Only the client and the items are new.

3/ It's not just invoices: 87 free Word templates, including quotes, receipts, NDAs, leases and HR letters, all filled in the same way.

4/ Got your own Word templates? Add {tags} and Clausery turns them into a guided questionnaire with conditional clauses, repeating rows and calculations.

5/ Free has no time limit. Pro is free to try for 14 days, no card. Feedback welcome!
```

---

## Pinterest

Make a business account, create a board called "Free invoice and receipt templates", and pin each image from `assets/marketing/` with its link:

| Image | Link | Pin title | Description |
| --- | --- | --- | --- |
| `word-invoice.png` | `/templates/invoice.html` | Free Word invoice template (with totals done for you) | Fill in a free Word invoice online: line items, discount, VAT, GST or sales tax and balance due are calculated. Download an editable .docx. No sign-up. |
| `deposit-invoice.png` | `/invoice-templates/deposit-invoice.html` | Deposit invoice template | Request an agreed deposit before the work starts. Free Word template, filled in online, with the amounts worked out. |
| `hourly-invoice.png` | `/invoice-templates/hourly-invoice.html` | Hourly invoice template for freelancers | Bill hours × rate with the totals and tax calculated. Free editable Word invoice. |
| `final-invoice.png` | `/invoice-templates/final-invoice.html` | Final invoice template (deduct the deposit) | Bill the balance after a deposit, with payments received deducted. Free Word template. |
| `price-quote.png` | `/templates/quote.html` | Free price quote template (Word) | Itemised prices with tax, a valid-until date and a deposit. Fill it in online, download as Word. |
| `payment-receipt.png` | `/templates/payment-receipt.html` | Payment receipt template | Proof of payment with the amount in words, partial payments and the balance left. Free Word template. |
| `business-document-kit.png` | `/business-document-kit/` | Free small business document kit | Six Word templates in one kit: price quote, statement of work, invoice, payment receipt, purchase order and credit note. No email sign-up. |

Prefix each link with `https://getclausery.github.io`. Pin one or two a day rather than all at once.

---

## YouTube and Shorts

Screen-record with a voice-over, 2–4 minutes each, and put the page link first in the description.

1. **"How to make an invoice in Word (free template, totals done for you)"**: open `/templates/invoice.html`, select "Fill in online", fill in your business, a client and two line items, show the tax and total, then download and open it in Word.
2. **"How to write a price quote that clients accept"**: walk through `/templates/quote.html`, including the valid-until date and deposit.
3. **"Deposit, then final invoice: how to bill a project in two parts"**: use `/invoice-templates/deposit-invoice.html`, then `/invoice-templates/final-invoice.html`.

Cut a 30–45 second vertical version of each for Shorts, TikTok and Instagram Reels.
