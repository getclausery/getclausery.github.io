# Clausery Trademarks and Brand Policy

The Clausery source code is released under the GNU Affero General Public
License v3 (see [LICENSE](LICENSE)). That license covers **code**. It does
**not** grant permission to use the Clausery name, logos, icons, marketing
copy, social accounts, product screenshots or other brand assets — those
are reserved, even in copies and forks of the source code.

This is the standard FOSS model (same as Mozilla/Firefox, WordPress,
GitLab, Nextcloud, Discourse): the code is free, the brand is protected
so users know they are on the real project and not a clone, scam or
rebranded competitor.

## What is covered

The following are trademarks or trade dress of the Clausery project and
may not be used in public or redistributed forks without written
permission, except for nominative fair use ("this uses code from
Clausery" / "forked from Clausery", not "Clausery" by itself):

- The word mark **Clausery** (in any spelling, capitalisation or domain
  that is confusingly similar, including clauseryapp, clausery.co,
  clausery-free, clausery-pro, myclausery, goclausery, etc.).
- The clausery.github.io domain, the GitHub organisation `getclausery`,
  and official social accounts.
- The logo / app icon (`assets/icon.svg`, `assets/icon-192.png`,
  `assets/icon-512.png`, `assets/og/*.png`), favicon and splash screens.
- Marketing assets in `assets/marketing/` (Pinterest pins, short-ad
  videos and covers, the LinkedIn carousel) and the copy in
  `MARKETING-ORGANIC.md`.
- The tagline phrasing on the home page, hero and CTA buttons where it
  identifies the product.
- The "Made with Clausery" credit line at the foot of free-plan
  documents — that line doubles as a trademark attribution and may not
  be altered to link elsewhere or be reworded.

## What you may do without asking

- **Fork the code** on GitHub for your own use or to contribute back,
  with "forked from getclausery/getclausery.github.io" visible in the
  GitHub UI and in your README. Your fork must use its own name and its
  own logo — not "Clausery" with a modifier.
- **Talk about Clausery** in articles, reviews, tutorials, comparison
  pages, videos and podcasts. Use the name and a screenshot, say who you
  are, and link back. Nominative fair use.
- **Self-host Clausery** inside your company for internal use. The
  AGPL's source-offer obligation applies when you let people OUTSIDE
  your organisation interact with a modified version over a network
  (see section 13); pure internal use does not trigger it.
- **Link to getclausery.github.io** from your site, newsletter, or
  product directory.
- **Use the template library** (the `.docx` files in `samples/` and the
  rendered output) for your own business documents. That's the whole
  point of the product.

## What needs a commercial license

Contact getclausery@gmail.com to arrange a separate commercial license
if you want to do any of the following — these are the things the
AGPL+v3 does not permit by itself, and the things a competitor would
need a brand license for:

- White-label Clausery inside a closed-source or SaaS product.
- Sell or distribute a rebranded version ("Powered by X", not Clausery)
  to paying customers as your own tool.
- Embed the editor inside another product under a different name.
- Run a hosted public instance under the Clausery name or anything
  confusingly similar.
- Use the logo, hero copy, ad creative or Pinterest pins to drive
  traffic to a competing product.

Commercial license revenue funds maintenance, new templates and the
perpetual public AGPL release of the core product.

## How to credit Clausery in your fork or deployment

If you run a public AGPL-compliant instance or ship a modified copy:

1. Keep this `TRADEMARKS.md` file and the `LICENSE` file.
2. Name your fork something that is not confusingly similar.
3. On the public-facing site and in the app footer, add one line such as:

   > Built on [Clausery](https://getclausery.github.io/) (AGPL-3.0).
   > [View source](link-to-your-fork).

4. Offer the complete corresponding source of your modified version to
   every user of your network service, as section 13 requires.
5. Replace the Clausery logo (`assets/icon.svg`) and app icons with your
   own branding. The credit line is enough — you do not need to keep
   the logo.

For Pro/Team/Enterprise deployments licensed from Clausery, the
branding and credit rules in your commercial agreement supersede this
document.

## Reporting misuse

If you see a copy, clone or SaaS offering that uses the Clausery name
or logo without permission, email getclausery@gmail.com with the URL
and a screenshot. We will send a friendly reminder first; most cases
are accidental forks that just need a rename.

## Enforcement

Where a friendly reminder does not resolve the issue, we enforce these
rights through the cheapest effective channel for the host:

- **Code hosts (GitHub, GitLab, Bitbucket):** DMCA takedown under
  17 U.S.C. §512 for copies that remove the CMI (copyright management
  information) banners, or that republish the code under a different
  license. We always offer 14 days to restore notices or rename before
  filing, except for outright malware redistributions.
- **Domains:** UDRP complaint against confusingly-similar domain names
  registered in bad faith (e.g. "clausery-app.com" offering the same
  product, or typosquatters).
- **App stores (Chrome Web Store, Apple App Store, Google Play,
  Microsoft Edge Add-ons):** trademark/impersonation report through the
  store's standard brand-owner channel.
- **Search engines (Google, Bing):** spam / scraped-content report and
  DMCA search-result removal for sites that republish our marketing
  pages verbatim to capture brand search traffic.
- **Ad platforms (Google Ads, Bing Ads, Meta, LinkedIn, X,
  Pinterest):** trademark-infringement report against ads bidding on
  the "Clausery" keyword to redirect to a competing product.
- **Social platforms:** impersonation report against accounts
  presenting themselves as the official Clausery project or support.
- **Hosting/CDN providers (Cloudflare, Vercel, Netlify, Cloudflare
  Pages, AWS CloudFront):** DMCA §512 takedown for hosted clones that
  keep the brand and strip attribution.

The CMI banners stamped into every JS, CSS and SVG file at build time
(see `tools/stamp-cmi.mjs`) are copyright management information under
17 U.S.C. §1202. Removing them in a copy that you redistribute or host
publicly is itself a civil violation, separate from any trademark or
AGPL claim, and carries statutory damages under the CASE Act. That is
deliberate: a competitor who tries to "scrape the site" and re-host it
has to remove several layers of attribution, each of which is a
separate cause of action.

If you receive a takedown notice you believe was sent in error, reply
to the sending address. Legitimate AGPL-compliant forks that have
renamed the product, published their source and are not holding
themselves out as "Clausery" will never be targeted; those are the
open-source uses the license is designed to encourage.
