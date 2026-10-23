# Contributing

Thanks for helping. Clausery is plain HTML, CSS and ES modules with no framework and no build step at runtime, so the bar for contributing is low: a text editor and Node 22+. The build and check tools use `fs.globSync`, which requires Node 22.

## Getting started

1. `npm ci`, then `npm run build` once (vendor bundle, samples, site pages).
2. Make your change. Keep document processing on the device and bundle scripts/fonts locally. Preserve the configured cookieless analytics and license checks; never send templates, answers or generated documents with them.
3. `npm run verify` (lint, HTML/link, SEO and syndication checks, unit tests) and `npm run test:e2e`.
4. If you touched `site/` or `tools/build-vendor.mjs`, run `npm run build` and commit the generated output; CI fails when it is stale.
5. Open a pull request with a short description of the change and, for UI changes, a screenshot.

Please add a unit test for logic changes (`tests/unit`) and extend an e2e spec for user-visible behaviour (`tests/e2e`).

## License of contributions

Clausery is published under the **GNU Affero General Public License v3 or later** (see [LICENSE](LICENSE)), with the Clausery name and logos held as trademarks (see [TRADEMARKS.md](TRADEMARKS.md)). By opening a pull request you agree that:

1. Your contribution is offered under the same AGPL-3.0-or-later license as the project, and
2. You have the right to contribute it (it is your original work, or you have permission from the copyright holder).

You do not need to sign a CLA. Submitting a PR on GitHub is taken as your agreement to these terms, consistent with the default GitHub Terms of Service (inbound=outbound licensing). If you want to contribute a larger feature under different terms, open an issue first.

## What contributions are welcome

- Bug fixes and correctness improvements (especially in document generation and calculations — those hit real money).
- New templates, clauses, country variants and setups (see `site/library.mjs`, `tools/make-samples.mjs`, `site/countries.mjs`).
- Documentation and guide improvements.
- Accessibility and UI polish.
- Performance and bundle-size wins.
- Security hardening (please disclose critical issues privately first — see [SECURITY.md](SECURITY.md)).

## Out of scope for the public repo

Features that upload document contents or answers to a server, require an account to generate a .docx, phone home beyond the existing cookieless analytics and license check, or ship third-party trackers will not be accepted. They break the value proposition of the tool.

For commercial licensing, white-label or self-hosted support beyond the AGPL, contact getclausery@gmail.com.
