#!/bin/sh
# Build every edition of The Hidden and the Manifest and check the result.
#   sh book/publish.sh
set -eu
cd "$(dirname "$0")/.."

python3 - <<'EOF' || { echo "Missing build dependencies. Run:"; echo "  pip install --break-system-packages reportlab pyphen pymupdf pillow"; exit 1; }
import reportlab, pyphen, pymupdf, PIL  # noqa: F401
EOF

python3 book/build.py
cp book/dist/the-hidden-and-the-manifest.html book/dist/index.html
cp book/dist/the-hidden-and-the-manifest.print.html book/dist/print.html
python3 book/make-pdf.py
python3 book/make-wrap.py

# `dist/` is a build directory (and is ignored by git); `editions/` is the set to
# hand to a reader, a printer, or a distributor.
mkdir -p book/editions
for f in the-hidden-and-the-manifest.pdf the-hidden-and-the-manifest-interior.pdf \
         the-hidden-and-the-manifest.epub cover-wrap.pdf index.html print.html \
         sample.html triage-card.pdf build-report.json; do
  cp "book/dist/$f" book/editions/
done

python3 book/verify.py
