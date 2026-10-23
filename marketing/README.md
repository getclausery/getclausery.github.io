# Clausery growth playbook

How to get Clausery more visitors, more users and more paying customers. This folder is not linked from the site and `robots.txt` keeps it out of search results, but it is still publicly readable (at `/marketing/` on the site and in the GitHub repository), so never put anything private here.

- [`launch-posts.md`](launch-posts.md): ready-to-post copy for Hacker News, Product Hunt, Reddit, Indie Hackers, LinkedIn, X, Pinterest and YouTube
- [`directories.md`](directories.md): where to list Clausery, in order, with the copy to paste
- [`outreach.md`](outreach.md): emails for resource pages, template roundups, embeds and partners
- [`../MARKETING-ORGANIC.md`](../MARKETING-ORGANIC.md): organic short-form launch playbook — 30-day plan, 6 short ad variants, 15 Pinterest pins, bio copy, rotation schedule, UTM conventions, 20 ready-to-post Q&A answers
- [`short-ad/`](short-ad/): 6 vertical short ads (A–F hooks), covers, build scripts — for TikTok/Reels/Shorts/LinkedIn/X, all link to `/go/`
- [`build_variants.py`](build_variants.py): re-renders the B–F short ads; `build_pins.py` renders the 15 Pinterest graphics into `../assets/marketing/pin-*.png`

## The diagnosis (October 2026)

1. **Traffic is low because nobody has been told about the site yet.** Clausery launched on 24 September 2026 with 237 pages in its sitemap and solid technical SEO: sitemaps, structured data, IndexNow, fast static pages. But a new site usually takes several months to earn real Google traffic, and the only promotion so far is one Fazier launch. Search traffic will come with time. Distribution is faster: put the free invoice maker and templates where small businesses and freelancers already are.
2. **Paying users: the free plan gave invoice users everything they need.** Pro sold limits that invoice users never reach (more than three of your own templates, calculations in your own templates). Most people never saw a reason to upgrade or a way to try it.
3. **Trust.** Clausery is a new brand on a `github.io` address with a Gmail contact. Before this release it also showed a "Most popular" badge on a plan nobody had bought yet, offered a trial only by email, and gave refunds only for purchases made by mistake.

## What version 1.34.0 changes in the product

| Change | Why it matters |
| --- | --- |
| A small linked "Made with Clausery" line at the end of Free-plan documents made from library templates. Templates people upload themselves never get it. | Every invoice a free user sends now shows Clausery to their client. That is free acquisition that grows with usage. It is also the first Pro benefit an invoice user actually notices. |
| A one-click 14-day Pro trial in the app: no card, no account, nothing renews. | People can try Pro on their real documents. The app offers it when someone wants a Pro feature: in the upgrade dialog, in the credit notice on the Review step, in Settings and on the pricing page. |
| A 30-day money-back guarantee on first payments, now in the Terms. | It takes away the risk of paying a brand people have never heard of. **You issue the refunds yourself in Lemon Squeezy** (Orders → the order → Refund). |
| A more honest pricing page. | The trial and the guarantee are shown up front. "Most popular" is replaced by "Free for 14 days", and the Free plan's credit line is disclosed. |
| Funnel counts. | The app now counts `upgrade-shown/<feature>`, `checkout-click/<plan>`, `trial-started` and `trial-ended`. These counts are anonymous and contain nothing anyone types, as the privacy policy describes. |
| A one-time Lifetime Pro option (hidden). | It is built and appears once you create the product (see "Lifetime Pro" below). Many small-business buyers dislike subscriptions, and one-time deals bring in cash early. |

## Measure: the numbers to check every Monday

Write these in a spreadsheet once a week. Without a baseline you can't tell which channel works.

| Stage | What to count | Where | First target (suggested) |
| --- | --- | --- | --- |
| Visit | Visits to the site, and which sites sent them | Cloudflare Web Analytics → the site → Referrers | Double the weekly visits within 30 days |
| Try | `app-opened` | GoatCounter | Rising week over week |
| Activate | `draft-started/*`, `document-download/*`, `document-print/*` | GoatCounter | At least 4 in 10 drafts end in a downloaded or printed document |
| Spread | Visits to `/made-with/` (people who clicked the credit line in a document) | Cloudflare → Paths | Rising week over week |
| Want | `upgrade-shown/<feature>`: which Pro feature people reach for | GoatCounter | Shows which feature to lead with |
| Trial | `trial-started`, `trial-ended` | GoatCounter | — |
| Buy | `checkout-click/<plan>`, then orders | GoatCounter, then Lemon Squeezy → Orders | The first 10 paying customers |
| Keep | Refunds and cancellations | Lemon Squeezy | Read every refund reason |

Three ratios tell you where the funnel leaks:

- **Trials ÷ documents made**: how many people who got value go on to try Pro. If it's low, they aren't seeing the offer.
- **Checkout clicks ÷ trials ended**: whether Pro is worth paying for after people have used it. If it's low, ask a few trial users why (see `outreach.md`).
- **Orders ÷ checkout clicks**: friction in checkout. If it's low, test leading with the yearly plan or switching on Lifetime Pro.

## The 30-day plan

### Week 1: foundations (about 4 hours)

- [ ] Merge 1.34.0. On your own browser, start the trial from the pricing page, download an invoice, and check the Settings badge and the pricing page.
- [ ] **Decide on a custom domain now** (see below). The longer you wait, the more links, rankings and saved user data the move puts at risk.
- [ ] Google Search Console: check that `sitemap_index.xml` is submitted and that Pages → "Why pages aren't indexed" shows nothing unexpected. Then add the site to Bing Webmaster Tools; it can import from Search Console.
- [ ] Add GitHub topics to the repository (for example `invoice-generator`, `word-templates`, `docx`, `pwa`, `document-automation`, `privacy`). This is free discovery in GitHub search.
- [ ] List Clausery on the batch 1 directories in [`directories.md`](directories.md).
- [ ] Create a Pinterest business account and pin the seven vertical images from the press kit (`assets/marketing/`). Each pin links to its page; pin text is in [`launch-posts.md`](launch-posts.md#pinterest). People search Pinterest for invoice and receipt templates, and pins keep sending visitors for months.

### Week 2: communities (about an hour a day)

- [ ] Post a Show HN on a weekday morning, US Eastern time, and stay around for a few hours to answer every comment.
- [ ] Post the Indie Hackers story.
- [ ] Reddit: post in r/SideProject, and in r/webdev on Showoff Saturday. In r/freelance, r/smallbusiness, r/sweatystartup and similar subreddits, answer questions about invoicing, quoting and getting paid. Only link a page that directly answers the question, and only where the subreddit's rules allow it.
- [ ] Record two short screen videos: "How to make an invoice in Word in 2 minutes (free template)" and "How to write a price quote (free Word template)". Put them on YouTube and as Shorts. How-to searches on YouTube keep sending visitors for years.

### Week 3: outreach (about 30 minutes a day)

- [ ] Send 20 resource-page emails (`outreach.md`, email 1) to small business development centres, SCORE chapters, public library small-business guides, university career centres' freelancing pages and coworking spaces.
- [ ] Email 10 authors of "free invoice template" roundups (email 2).
- [ ] Offer the embeddable calculators (invoice due date, late payment interest, freelance rate and others) to 10 bloggers who write for freelancers (email 3). Every embed carries a credit link back to Clausery.

### Week 4: Product Hunt, then review

- [ ] Launch on Product Hunt (copy in `launch-posts.md`). Lifetime Pro, if it's live, makes a good launch-week hook.
- [ ] Review the weekly numbers. Which referrers sent people who actually made documents? Put month 2 into the two best channels and drop the rest.
- [ ] Check `upgrade-shown/<feature>`. If one feature dominates, lead the pricing page and the upgrade dialog with it.
- [ ] Email five people who started a trial but didn't buy, if they gave you their address through support. Ask what was missing.

## Custom domain

**Why:** a business sending invoices trusts a tool with its own domain more than a `github.io` address. A domain is easier to remember, it can move to any host, and it makes a domain email possible (below). A `.com` usually costs roughly $10–20 a year.

**The catch, and why to do it early:** the app keeps every draft, template, license and trial in the browser, and browsers tie that storage to the address. After a move, people's old data still sits under `getclausery.github.io` but the app on the new domain can't see it. Paid users would need to re-activate, which the receipt button does, with up to five activations. Clausery has few users today, so the move costs little now and more every month.

**Steps:**

1. Buy the domain from any registrar.
2. About a week before the switch, tell users in the app and changelog to download a backup (Settings → Download backup) so they can restore it on the new address.
3. DNS: point the apex domain's A records at GitHub Pages (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and add a `www` CNAME to `getclausery.github.io`. Check GitHub's "Managing a custom domain for your GitHub Pages site" page for current values.
4. Verify the domain in your GitHub account settings (Pages → Verified domains). This stops anyone else taking it over.
5. In the repository, go to Settings → Pages → Custom domain. Because the site deploys from the branch, this commits a `CNAME` file. Then turn on "Enforce HTTPS".
6. Change `SITE` in `tools/partials.mjs`, and `SITE_URL` and `USAGE_COUNTER.host` in `app/config.js`, then run `npm run build` and commit. The credit line in documents and its link update by themselves.
7. In Lemon Squeezy, change the confirmation and receipt button links to `https://<new domain>/app/activate.html?key=[license_key]`.
8. Google Search Console: add and verify the new domain, then use Settings → Change of address. GitHub redirects the old `github.io` address to the new domain.

**Domain email:** replace the Gmail address with something like `hello@<domain>`. Cloudflare Email Routing forwards it to Gmail for free, and Gmail's "Send mail as" lets you reply from it. Some directories (G2, Capterra) and many partners take a domain email more seriously. Update `CONTACT_EMAIL` in `app/config.js` and rebuild.

## Lifetime Pro: switching it on

1. In Lemon Squeezy, create a product "Clausery Lifetime Pro" with a **single payment** price (the site assumes $99; change `PRICES.lifetime` in `app/config.js` if you choose another).
2. Turn on **license keys** for it, with an activation limit of **5** and no expiry.
3. Set the confirmation and receipt button link to `https://getclausery.github.io/app/activate.html?key=[license_key]`, like the other products.
4. Put the checkout link in `CHECKOUT_URLS.lifetime` and the product ID in `LICENSE_SERVICE.products` (mapped to `pro`) in `app/config.js`, then run `npm run build` and commit. The pricing page, Settings and the FAQ show it from then on.

## Ground rules

- Never buy links, reviews or upvotes. Never post from fake accounts or ask friends to upvote: Hacker News, Product Hunt and Reddit all detect it and bury or ban the post.
- Say what Clausery is plainly, including what it doesn't do (no e-signatures, no live co-editing). The trade-offs are part of why people trust it.
- Clausery's source is public on GitHub but the license is "all rights reserved", so call the code **public** or **readable**, never "open source".
- Answer every comment, review and email within a day during a launch. Early on, being responsive is the best marketing you have.
- [`build_linkedin_carousel.py`](build_linkedin_carousel.py): renders the 8-slide 1080×1080 LinkedIn carousel "7 things every freelancer invoice needs" into `../assets/marketing/linkedin-carousel-00.png` … `-07.png`; post as a document/PDF carousel linking to `/go/`.
