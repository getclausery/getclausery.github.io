# Fonts

**Crimson Text** by Sebastian Kosch — a Minion-like old-style text face designed for
long-form reading. Used under the **SIL Open Font License 1.1**; the licence text is
`OFL.txt` in this directory and must travel with the font files.

| File | Used by |
|---|---|
| `CrimsonText-Regular.ttf`, `-Italic`, `-Bold`, `-BoldItalic` | the PDF: embedded and subset by reportlab |
| same four names as `.woff2` | the web edition (inlined as base64 data URIs) and the EPUB (`OEBPS/fonts/`, declared in the manifest) |

The `.woff2` files are subsets of the four TTFs cut to Latin, Latin-1, Latin Extended-A (the manuscript uses ł and ō), and the
punctuation the book actually uses (dashes, quotes, ellipses, currency, arrows), with
`kern`, `liga`, `onum`, `pnum`, and `smcp` retained. Each is about 25 KB.

Regenerate the subsets after replacing the TTFs:

```
cd book/fonts
for f in CrimsonText-Regular CrimsonText-Italic CrimsonText-Bold CrimsonText-BoldItalic; do
  python3 -m fontTools.subset "$f.ttf" \
    --unicodes="U+0000-017F,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212,U+2215" \
    --layout-features="kern,liga,onum,pnum,smcp,c2sc" \
    --flavor=woff2 --output-file="$f.woff2"
done
```

`pip install fonttools brotli` is needed for that, and only for that.

If the font files are missing, every build falls back to the base-14 Times and says so
in `book/README.md`'s typography note — no build breaks.
