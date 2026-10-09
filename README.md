# Clausery

**Invoices, quotes and receipts in Word, with the maths done for you.**

Clausery helps small businesses and freelancers make invoices, quotes and receipts, with calculated totals and editable Word output. It also turns existing Word templates into guided questionnaires and assembles `.docx` documents entirely client-side. Document contents stay on the device; the static app stores drafts in IndexedDB and works offline. Anonymous app usage counts go to GoatCounter, website page views use cookieless Cloudflare Web Analytics, and online licenses can be checked with Lemon Squeezy.

- **Live site:** https://getclausery.github.io/
- **App:** https://getclausery.github.io/app/
- **Free Word templates:** https://getclausery.github.io/templates/
- **Docs:** https://getclausery.github.io/docs/
- **Contact:** https://getclausery.github.io/contact/

## Free templates

Every template in the library can be downloaded as a normal Word file or filled in online, free and without an account, and none of them count towards a plan limit. A few of the most used:

| Business and money | Freelance and services | HR | Landlords and tenants | Legal |
| --- | --- | --- | --- | --- |
| [Invoice](https://getclausery.github.io/templates/invoice.html) | [Freelance contracts](https://getclausery.github.io/for/freelancers.html) | [Offer letter](https://getclausery.github.io/templates/offer-letter.html) | [Residential lease](https://getclausery.github.io/templates/residential-lease-agreement.html) | [Mutual NDA](https://getclausery.github.io/templates/mutual-nda.html) |
| [Price quote](https://getclausery.github.io/templates/quote.html) | [Independent contractor agreement](https://getclausery.github.io/templates/independent-contractor-agreement.html) | [Employment agreement](https://getclausery.github.io/templates/employment-agreement.html) | [Rent receipt](https://getclausery.github.io/templates/rent-receipt.html) | [Hold harmless agreement](https://getclausery.github.io/templates/hold-harmless-agreement.html) |
| [Purchase order](https://getclausery.github.io/templates/purchase-order.html) | [Statement of work](https://getclausery.github.io/templates/statement-of-work.html) | [Two weeks notice letter](https://getclausery.github.io/templates/two-weeks-notice-letter.html) | [Notice to vacate](https://getclausery.github.io/templates/notice-to-vacate.html) | [Liability waiver](https://getclausery.github.io/templates/liability-waiver.html) |
| [Payment receipt](https://getclausery.github.io/templates/payment-receipt.html) | [Cleaning services contract](https://getclausery.github.io/templates/cleaning-services-contract.html) | [Employee warning letter](https://getclausery.github.io/templates/employee-warning-letter.html) | [Rental application](https://getclausery.github.io/templates/rental-application.html) | [Bill of sale](https://getclausery.github.io/templates/bill-of-sale.html) |

See [all templates](https://getclausery.github.io/templates/), the [clause library](https://getclausery.github.io/clauses/), [guides](https://getclausery.github.io/guides/) and [free calculators](https://getclausery.github.io/free-tools/).

## Why

Small businesses and freelancers repeatedly prepare quotes, invoices and receipts. Clausery keeps document contents on the device, calculates the totals from the values supplied and produces ordinary Word output. The [free business document kit](https://getclausery.github.io/business-document-kit/) brings six common templates together, with online questionnaires and setup instructions.

## Features

- Word `.docx` templates with `{tags}`, conditional and inverted sections, repeating groups (paragraphs, bullets, table rows)
- Questionnaire inferred from the template: types from tag names, sections from prefixes, nested tags auto-hidden
- Template designer: labels, help, types, options, formats, required, show-when rules, computed fields, sections
- Interview with section stepper, autosave, validation, review, on-screen preview, `.docx` download, print to PDF
- Safe expression language for logic and calculations (no `eval`)
- Optional encryption at rest (AES-256-GCM, PBKDF2) with auto-lock
- Offline client intake forms: a single HTML file the client fills in and returns as an answers file
- Backups, answer files, template packs for teams
- Offline-capable installable PWA, strict CSP, local document processing
- Deposit, hourly and final-balance invoice starters, with worked examples and a local deposit calculator
- Offline license keys (Ed25519) for Free / Pro / Team / Enterprise plans
- Free template library (Word), clause library, guides and calculators; every page records when its content last changed (`site/data/page-dates.json`)

## Repository layout

```
clausery/
  index.html, pricing/, docs/, legal/, 404.html   generated static pages (from site/*.mjs)
  app/                the application (ES modules, no framework, no build step)
    lib/              expr, schema, logic, render, store, vault, license, backup, form, intake, plan
    ui/               dom helpers, router, views
  vendor/             bundled document engine (docxtemplater, pizzip, docx-preview) – built by tools/build-vendor.mjs
  samples/            sample templates – built by tools/make-samples.mjs
  site/               page modules for the static site generator
  tools/              build, license CLI, dev server, checks, screenshots
  tests/unit          node:test suites
  tests/e2e           Playwright suites (app flow, security, intake, site accessibility)
  sw.js               service worker
```

## Development

```bash
cd clausery
npm ci
npm run build        # vendor bundle, samples, site pages, sitemap, release stamp
npm run serve        # http://127.0.0.1:4173/
npm run verify       # lint + HTML + SEO checks + unit tests
npm run check:seo    # canonical/sitemap consistency, unique titles, structured data, crawlable page paths
npm run test:e2e     # Playwright (needs Chromium: npx playwright install chromium)
npm run screenshots  # regenerate marketing images and icons
npm run release      # after bumping "version" in package.json: stamps sw.js and app/config.js, regenerates the precache list
```

Everything committed is what gets deployed: GitHub Pages serves the folder as-is. CI (`.github/workflows/clausery.yml`) lints, tests, checks HTML/links, verifies that generated files are up to date, and runs the end-to-end suite.

## Licensing keys

```bash
npm run license -- keygen                 # writes keys/private.pem (never commit) and prints the public key
npm run license -- issue --key keys/private.pem --plan pro --name "Jane Doe" --email jane@example.com --expires 2027-12-31
npm run license -- verify --public <publicKey> <key>
```

Put the public key in `app/config.js` (`LICENSE_PUBLIC_KEY`). Keys are verified in the browser with WebCrypto; no server is involved. The public deployment uses live Lemon Squeezy checkout links in `CHECKOUT_URLS` (Pro monthly, Pro yearly and Team), with `CHECKOUT_SINCE` recording when billing opened. Lemon Squeezy confirmation and receipt buttons use `https://getclausery.github.io/app/activate.html?key=[license_key]`, matching the merchant's accepted link-variable format. The access credential is cleared from the address before activation, the purchase is verified automatically, and the app opens with the paid plan ready. The no-referrer activation page has no visitor analytics; the initial URL is still sent to the website host. Fragment links are also supported. Customers do not copy keys or create a separate account. `LICENSE_SERVICE.products` maps the published live product IDs to their plans, excluding test products. For your own deployment, replace those values with your store and product IDs, or leave the checkout links empty for key requests (`KEY_REQUEST_URL`), then rebuild. Never put a Lemon Squeezy private API key in the static app.

## Contact and support

Questions, key requests and template requests go to [getclausery@gmail.com](mailto:getclausery@gmail.com). Public bug reports can use the [issue forms](https://github.com/getclausery/getclausery.github.io/issues/new/choose). Report security issues privately through [GitHub's private vulnerability reporting](https://github.com/getclausery/getclausery.github.io/security/advisories/new); see `SECURITY.md`.

## Security

See `SECURITY.md` and the [security overview](https://getclausery.github.io/docs/security.html).

## License

Copyright © 2026 Clausery. All rights reserved. Third-party components are used under their own licenses: docxtemplater (MIT), pizzip (MIT), jszip (MIT), docx-preview (Apache-2.0).
