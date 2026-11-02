# Handoff prompt — paste this into the new chat

Copy everything inside the block below as your first message. It assumes the new chat is already connected to GitHub **with write access to the book's own repository**; if it isn't, the final section says what to do.

---

## THE PROMPT

> You are finishing the publication of a finished book. Read this whole brief before touching anything.
>
> **The book.** *The Hidden and the Manifest* — a Catholic theological research project harmonizing the manifestation / New Thought tradition with Catholic doctrine using Aquinas's own Aristotelian method. It is **finished and verified**, not to be rewritten: 6 parts, 40 chapters, 8 appendices (A–H), **75,803 words**, **314 pages**, author **Kidus Yared**, imprint **Clausery**, first edition MMXXVI, © 2026 Kidus Yared, UUID `8f3c1a52-6b64-5d1e-9a77-2f4e0c9b7d31`. Its verification script passes **161/161 checks**. It is not authoritative and says so, in the book and in all marketing; it presents itself as written with the help of the Holy Spirit by a researcher, not by the Church. Never write or imply ecclesiastical authority, invented credentials, reviews or sales claims.
>
> **The source.** The manuscript and build system live in the repo `getclausery/getclausery.github.io`, branch `arena/09f8871f-getclausery-github-io`, under `book/`. That repository is the *product* site for a different thing called Clausery — the book must never be published under it. Work only on that branch; do not push to `main` there and do not create other branches.
> Key paths: `book/build.py` (manuscript + metadata: `META['url']` and the copyright/imprint rows), `book/make-pdf.py`, `book/make-cover.py`, `book/publish.sh` (runs the whole build then `verify.py`, must end `161/161 checks passed`), `book/make-site.py` (exports the deployable site), `book/make-social.py` + `book/social/*.png` (share cards), `book/landing/index.html` (the book's landing page), `book/PRESS-KIT.md`, `book/MARKETING.md`, `book/ACADEMIA.md`, `book/PITCH.md`, `tools/serve.mjs` (preview server; `ROOT=book node tools/serve.mjs 8080` serves book material only, on port 8080).
>
> **The job.** The book already has a complete standalone website, built and waiting, and needs to go live at its own address:
> **`https://ykidus053-create.github.io/the-hidden-and-the-manifest/`**
> The bundle is `book/site-dist/` — 19 files, ~6 MB: `index.html`, `read/index.html` (the full reading edition), `the-hidden-and-the-manifest.pdf` (1.5 MB, 314 pp), `the-hidden-and-the-manifest.epub`, `cover.jpg`, `triage-card.pdf`, `editions/index.html`, five PNGs in `social/`, plus generated `404.html`, `robots.txt`, `sitemap.xml`, `.nojekyll`, `LICENSE-BOOK.txt`, `README.md`. Its canonical URL, `og:url`, sitemap and robots already point at the address above. It is **gitignored on purpose** (CI checks `git diff --exit-code` after a build, so committing build output breaks it) — it is deployed by copying, not by committing to the book repo.
>
> **The target repo.** `ykidus053-create/the-hidden-and-the-manifest` (public). It currently exists under the malformed name `-the-hidden-and-the-manifest-` — stray hyphens front and back — which would produce the URL `https://ykidus053-create.github.io/-the-hidden-and-the-manifest-/`. **First check whether it has been renamed.** It must be exactly `the-hidden-and-the-manifest` for the URL above to be correct; renaming is repo → Settings → Repository name, and only the repo owner can do it.
>
> **Steps, in order.**
> 1. `cd` into the book repo, confirm branch `arena/09f8871f-getclausery-github-io`, `git pull`.
> 2. Fresh sandbox means no Python packages: `pip install --break-system-packages reportlab pyphen pymupdf pillow`. Then `sh book/publish.sh` and confirm it ends `161/161 checks passed` in a clean shell. If the PDF is missing or stale, this rebuilds it.
> 3. Rebuild the site bundle: `python3 book/make-site.py` (it defaults to the base URL above; `--base-url` overrides). It prints `13 entries at the root` and the base URL — check both.
> 4. Verify the build before pushing: `grep -o 'rel="canonical" href="[^"]*"' book/site-dist/index.html` must show the target URL.
> 5. Deploy: `cd book/site-dist && git init -b main && git add -A && git -c user.email=ykidus053-create@users.noreply.github.com -c user.name="Kidus Yared" commit -m "The Hidden and the Manifest — the book's own site" && git remote add origin https://github.com/ykidus053-create/the-hidden-and-the-manifest.git && git push -u origin main`.
> 6. Turn on Pages: `gh api -X POST repos/ykidus053-create/the-hidden-and-the-manifest/pages -f 'source[branch]=main' -f 'source[path]=/'` (if it 409s, Pages is already on; `gh api repos/…/pages` shows the state). Then poll `gh api repos/…/pages/builds/latest` until `status` is `built`.
> 7. Verify live, not assumed: `curl -o /dev/null -w '%{http_code}'` each of `/`, `/read/`, `/the-hidden-and-the-manifest.pdf`, `/the-hidden-and-the-manifest.epub`, `/cover.jpg`, `/social/og-card.png`, `/sitemap.xml`. All must be 200. Open the live page in the browser preview and confirm the download button really downloads the PDF and that the reading edition renders with its typeface.
> 8. Report the live URL, the checks, and anything that still needs a human.
>
> **If this chat's GitHub connection still cannot write to the new repo**, do not fake it and do not force anything. The exact symptom last time: reads work, but `git push` returns `Permission to ykidus053-create/… denied` and `gh repo rename` returns `403 Resource not accessible by integration`, because the connection is scoped to the Clausery repo only. Tell the user, in one short paragraph, to add the book's repo to the Arena GitHub connection's repository access (or switch it to "All repositories") and to rename the repo if it still has the stray hyphens — then retry steps 5–7. The zero-permission fallback: the user drags `book/site-dist/` into the repo with *Add file → Upload files*, then Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
>
> **Standing constraints from the author, do not violate.** One: the book must live at its own URL, never under `getclausery.github.io`, not as a subdirectory and not in that site's sitemap. Two: never commit `book/site-dist/` to the book repository. Three: no invented facts in any press material — no fake reviews, credentials, blurbs or bestseller language; blanks stay blank for the author to fill. Four: the preview on port 8080 shows only book material, never the Clausery site. Five: prefer real artifacts over promises — if the download is unreliable in the preview iframe, also give a committed file path or an email draft. Six: this book is a theological research project, not authoritative teaching, and marketing must carry that same line.
>
> **Optional next moves once it is live.** A custom domain instead of the GitHub path (`CNAME` file plus rebuild with `--base-url https://domain/`, then two DNS records at the registrar); renaming the repo to `ykidus053-create.github.io` for the bare-root address `https://ykidus053-create.github.io/`; and using `book/PRESS-KIT.md` for the actual launch, whose asset inventory and "what not to say in a pitch" section are already written.

---

## After the new chat is running

That chat owns deployment and nothing else. This one keeps the manuscript, so if the new chat finds something wrong inside the book — a page break, a citation, the imprint line — it should say so here rather than patch the text in isolation, because `book/build.py` and `book/verify.py` are the single source of truth and every edition is generated from them.
