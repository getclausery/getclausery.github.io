# Contributing

Thanks for helping. Clausery is plain HTML, CSS and ES modules with no framework and no build step at runtime, so the bar for contributing is low: a text editor and Node 20+.

1. `npm ci`, then `npm run build` once (vendor bundle, samples, site pages).
2. Make your change. Keep document processing on the device and bundle scripts/fonts locally. Preserve the configured cookieless analytics and license checks; never send templates, answers or generated documents with them.
3. `npm run verify` (lint, HTML/link checks, unit tests) and `npm run test:e2e`.
4. If you touched `site/` or `tools/build-vendor.mjs`, run `npm run build` and commit the generated output; CI fails when it is stale.
5. Open a pull request with a short description of the change and, for UI changes, a screenshot.

Please add a unit test for logic changes (`tests/unit`) and extend an e2e spec for user-visible behaviour (`tests/e2e`).
