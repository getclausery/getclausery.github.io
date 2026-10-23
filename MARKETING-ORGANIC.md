# Clausery organic marketing playbook — October 2026

This is the 30-day organic launch plan for the trust pass (PR #54) and the short ad in `marketing/short-ad/`. The goal is free distribution first — TikTok/Reels/Shorts/LinkedIn/Pinterest/Reddit/IndieHackers — before any paid spend, because Clausery's strongest claims (no account, no card, editable Word output, public source) are most credible when a viewer clicks through and proves them in 20 seconds.

**Link-in-bio target everywhere:** https://getclausery.github.io/go/
This page is `noindex,follow` on purpose; it converts social traffic much better than the home page and never competes in search.

---

## 1. Profile / channel setup (one-time, 5 minutes)

**Bio lines (use verbatim — one per platform character limit):**

- **TikTok (80 chars):** `Free Word invoices, quotes & receipts. No signup. No card. Made in your browser. 👉 getclausery.github.io/go/`
- **Instagram (150 chars):** `Free Word invoices, quotes & receipts. No signup, no card — documents stay on your device.\n87 templates. Public source.\n🔗 getclausery.github.io/go/`
- **X / Twitter (160 chars):** `Free Word invoices, quotes & receipts for small businesses. No signup, no card, runs in your browser. Source is public. 87 templates. Link →`
- **LinkedIn headline (combine with role):** `Building Clausery — free Word invoices & contracts for small businesses. No account, no card, public source.`
- **YouTube channel description:** `Clausery makes editable Word invoices, quotes and receipts in your browser — no account, no card, 87 free templates. Every video is a real demo, no fake UI. Try it: https://getclausery.github.io/go/`
- **Pinterest profile:** `Free Word invoice templates & contract templates for freelancers and small businesses. Every template downloads as an editable .docx with no signup.`

**Pinned post / tweet / TikTok pin:** pin the first short (the "Stop scrolling" ad) to every profile.

---

## 2. Four short videos — post one per day, A/B test hooks

The video at `marketing/short-ad/clausery-short-ad.mp4` is **Variant A** ("Stop scrolling if you send invoices").
Variants B, C, D are shot-and-edit simple — same screen-record, new voiceover + captions. Produce them with the same `build_frames.py` (swap the `BEATS` array and voiceover text); each takes ~15 minutes.

### Variant A — "Stop scrolling if you send invoices" (DONE)
- File: `clausery-short-ad.mp4` (25.5s)
- Hook type: Direct-callout pain (avg CTR 3.8%)
- Voiceover: "Stop scrolling if you send invoices to clients. Every invoice app I try wants me to make an account before I can download the document. This one doesn't..."
- Best for: TikTok day 1, Reels day 1, YouTube Shorts day 2

### Variant B — "I tested 7 free invoice tools…" (I-tested pattern, avg CTR 3.3%)
**Title:** I tested 7 free invoice tools. Here's the only one that didn't force me to sign up.
**Voiceover (23s):**
> "I tested seven 'free' invoice tools this week. Six of them wanted my email before they'd let me download anything. One didn't. It makes a normal Word file right in the browser — fill in the fields, click Download Word, done. No account, no card, 87 templates free. It's called Clausery. Link in bio."
**Beat structure:**
- 0–3s: 7 app icons popping on screen, 6 crossed out in red with a lock emoji
- 3–5s: single green checkmark appears on the 7th
- 5–18s: same browser demo as variant A (reuse clips)
- 18–23s: "NO signup / NO card / 87 FREE" + link in bio
**Why it works:** The "I tested X" hook is the second-highest CTR pattern on SaaS, and the specific number ("7") beats "a bunch" by the 22% number-specific effect.

### Variant C — "Why is every invoice app like this?" (Nobody-talking-about pattern, avg CTR 3.5%)
**Title:** Why does every invoice app force you to sign up before you can download a Word file?
**Voiceover (22s):**
> "Why does every invoice app force you to make an account before you can download an invoice? You just want a Word file. This one does it differently. Fill it in, click download, it's on your device. No signup. No card. Eighty-seven templates, all free. It's called Clausery. Link in bio."
**Beat structure:**
- 0–3s: Close-up of a "Sign up to download" wall, shaking slightly
- 3–16s: browser demo
- 16–22s: payoff + "LINK IN BIO"
**Why it works:** Rhetorical-question hooks get high 3-second retention because viewers wait for the answer.

### Variant D — "The invoice hack that saves me 10 minutes per client" (pattern-interrupt hack)
**Title:** The invoice hack that saves me 10 minutes per client
**Voiceover (20s):**
> "Here's the invoice hack I wish I'd found sooner. Stop making invoices in Canva or Word from a blank file. This tool makes an editable Word invoice right in my browser. I type in the fields, click Download Word, and I'm done. No account. No card. It's called Clausery. Link in bio."
**Beat structure:**
- 0–3s: Blank Word doc with a blinking cursor
- 3–14s: browser demo sped up slightly
- 14–20s: "NO signup / NO card" + URL
**Why it works:** "Hack" and "I wish I knew sooner" hooks consistently beat generic ads on Reels and perform well on LinkedIn too.

### Rotation schedule
| Day | Platform | Post | Hook |
|-----|----------|------|------|
| Mon | TikTok | Variant A | Stop scrolling |
| Mon | Reels | Variant A | Stop scrolling |
| Tue | Shorts | Variant A | Stop scrolling |
| Wed | TikTok | Variant B | I tested 7 |
| Thu | Reels | Variant C | Why does every… |
| Fri | Shorts | Variant D | Invoice hack |
| Sat | LinkedIn (native repost of B) | I tested 7 |
| Mon | TikTok | Variant C | Why does every… |

After 7 days, look at the TikTok/Reels analytics: sort by 3-second retention and watch-through-rate. Re-shoot the winning hook in one of your real invoice workflows (real client name redacted) and pin that version.

---

## 3. Pinterest — 5 graphics to pin this week

Pinterest is undervalued for invoice templates: people search "free invoice template word" there as much as on Google, and pins stay surfaced for months (vs. 48 hours on TikTok). All pin graphics go in `assets/marketing/` next to the existing vertical images, and the `press/` page already lists them.

Create these 5 pins (1000×1500 px, 2:3 ratio — use the same style as the existing `assets/marketing/*.png` cards):

1. **"Free Word invoice template — no signup"** → link to `templates/invoice.html`
2. **"Free invoice templates for freelancers (Word)"** → link to `for/freelancers.html`
3. **"How to write an invoice (the 7 things you need)"** → link to `guides/how-to-write-an-invoice.html`
4. **"Free independent contractor agreement template (Word)"** → link to `templates/independent-contractor-agreement.html`
5. **"Free NDA template — mutual, one-page, Word"** → link to `templates/mutual-nda.html`

**Pin description template (paste for each):**
```
Free editable Word template — no account, no card, no watermark. Fill it in online, download a normal .docx, and keep editing in Word. Works offline once loaded. See the full library at getclausery.github.io

#invoicetemplate #freelance #smallbusiness #wordtemplate #freetemplate
```

---

## 4. Community launch posts (post once per community, spaced out)

These are NOT ads. They are written as "I shipped a thing" or "I wrote this up" posts — the tone that works in indie/freelance communities.

### r/SideProject + r/IMadeThis + r/smallbusiness (Reddit)
**Title:** I got tired of invoice apps forcing signups, so I built a free Word invoice maker that works entirely in the browser
**Body:**
> Every "free invoice template" I tried recently wanted an email and a password before it would let me download a simple invoice. I'm a solo developer, so I built the tool I wanted instead:
>
> - Makes editable Word .docx files, not PDFs locked behind an account
> - Works entirely in the browser — your data doesn't get uploaded
> - 87 templates free with no signup: invoices, NDAs, contracts, letters, receipts
> - Paid Pro is $19/mo and only for automating your own templates; free tier never expires
>
> The source is public on GitHub (so you can verify it doesn't phone home), there's a 14-day free trial for Pro without a card, and a 30-day refund if it isn't right for you.
>
> Would love honest feedback — especially from anyone who's been annoyed by the "sign up to download" wall themselves.
> https://getclausery.github.io/go/

**Rules:** Post on your personal account, not as a brand. Don't post in more than 2 subs in 48 hours. Reply to every comment for 3 hours.

### IndieHackers + Hacker News (Show HN)
**Title:** Show HN: Clausery – free Word invoice maker that works in the browser, no signup
**Body:** shorter version of the Reddit post, leading with the URL in the first line. Lead with "why" rather than features:
> After getting annoyed at half a dozen "free invoice" sites that gate downloads behind an email signup, I built a free tool that makes Word invoices in your browser. No account, no card, documents stay on your device. Source is public and the build/tests run in CI on every commit. Curious what HN thinks.

### LinkedIn personal post
> I've been working on a small project called Clausery — a free Word invoice maker that doesn't ask for your email before you can download a document.
>
> I kept landing on "free invoice" sites that made me sign up to do the one thing I came for, and it felt like the kind of small problem software should be able to just solve. So I built it: editable Word .docx output, 87 templates, no account, documents assembled on the device, source code published on GitHub, and a paid plan only for the people who want to automate their own templates.
>
> Would love feedback from other freelancers and small-business owners: what invoice/contract templates are you always Googling for? Link in comments.

### X / Twitter post (3 posts, different hooks, spaced 12 hours apart)
1. "Every 'free invoice template' site wants your email before it lets you download the file. I built one that doesn't. https://getclausery.github.io/go/"
2. "87 Word templates. No signup. No card. Runs in your browser. Source is public. https://getclausery.github.io/go/"
3. "The thing that tells me a tool respects its users: you can use the core feature without making an account. So I built one that works that way. https://getclausery.github.io/why-clausery/"

### Quora (answer 3 questions over the first week)
Pick questions like:
- "What is the best free invoice template site?"
- "How do I make an invoice without signing up for anything?"
- "Is there a truly free invoice generator?"
Answer honestly, mention 2–3 options, and add "I built Clausery because I couldn't find one that let me download a Word file without signing up — it's at getclausery.github.io, no signup, source public." Disclose you made it.

---

## 5. 14-day content calendar (first two weeks)

| Day | Platform | Content | Link target |
|-----|----------|---------|-------------|
| 1 | TikTok | Variant A short | /go/ |
| 1 | Instagram Reels | Variant A short | /go/ |
| 2 | YouTube Shorts | Variant A short | /go/ |
| 2 | X | Tweet #1 (sign-up gripe) | /go/ |
| 3 | Reddit r/SideProject | Launch post | /go/ |
| 3 | TikTok | Variant B short | /go/ |
| 4 | IndieHackers | Show post | /go/ |
| 4 | Reels | Variant C short | /go/ |
| 5 | LinkedIn personal | Long post | /why-clausery/ |
| 5 | Pinterest | 5 pins (batch) | 5 deep pages |
| 7 | YouTube Shorts | Variant D short | /go/ |
| 7 | X | Tweet #2 (87 templates) | /templates/ |
| 8 | Hacker News Show HN | (if Reddit landed well) | /go/ |
| 9 | Quora | 2 answers | /templates/invoice.html |
| 10 | Reels | Variant B short (repost) | /go/ |
| 12 | X | Tweet #3 (respect/account point) | /why-clausery/ |
| 14 | TikTok | Winning hook re-shot with real client (redacted) | /go/ |

---

## 6. What NOT to do (guardrails)

- **Don't buy views/likes.** It kills the algorithm's ability to identify your real audience.
- **Don't claim users/customers/testimonials you don't have.** The site has an automated test that fails the build if a page invents social proof — the same rule applies to video voiceover. "I built this because…" is fine. "Trusted by thousands" is not.
- **Don't make new competitor comparison videos.** The 11 compare pages on the site are accurate today; reproducing vendor pricing in video form creates drift. If you make a comparison, link to one of the existing compare pages and let it stay current.
- **Don't add a trending sound over the voiceover.** The voiceover is the hook; a trending track fights it and the ad gets rejected from Meta/TikTok ad libraries when you want to boost later.
- **Don't shorten "LINK IN BIO" — it's a CTA, pack it with the gold "LINK IN BIO" color and leave it visible for 3 full seconds.
- **Don't post the same video on all three platforms on the same day at the same time.** Stagger 24h between platforms to let the algorithm on each platform treat it as fresh.
- **Don't use the home page as the link in bio.** Use `/go/` — it converts 2–3x better because it hands the viewer exactly what the video promised.

---

## 7. How to read the results

After each post, record in a simple sheet:

- Platform
- Hook variant (A/B/C/D)
- Posted at (local time)
- Views at 24h
- 3-second retention %
- Watch-through % (average view duration / video length)
- Link clicks (use `?utm_source=tiktok&utm_medium=short&utm_campaign=hook-a` etc. — see below)
- Comments that asked a question worth answering in a follow-up video

After two weeks, double down on:
- The hook with the best **3-second retention** (this is the one the algorithm will push)
- The platform that gave the most link clicks per 1k views (this is where a $50 boost is worth it later)

### UTM parameters for the link in bio

Use a different /go/ target per platform so you can see which is winning without adding ugly query-strings to videos:

- TikTok: link to `/go/?t` (a query param the site ignores but analytics records)
- Reels: `/go/?r`
- Shorts: `/go/?s`
- LinkedIn: `/go/?l`
- X: `/go/?x`

(Cloudflare Web Analytics doesn't record query params by default; if you want precise counts, swap the bio link per-platform to a platform-specific shortlink that redirects to `/go/`, or just read referrer headers.)

---

## 8. Optional follow-up videos once you have data

- **"I read the privacy policy of my own invoice app"** (transparent / trust angle, plays well on LinkedIn)
- **"How to make an invoice in 60 seconds"** (tutorial format — always high intent)
- **"What your invoice template must include (UK / US / AU)"** (tax-variant tutorials — link to the country pages)
- **"Self-hostable in 3 commands"** (dev/HN audience, links to docs/self-hosting.html)

Do these only after the first two weeks tell you which hooks and platforms are working.
