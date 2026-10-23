#!/usr/bin/env python3
"""Build the LinkedIn 8-slide carousel '7 things every freelancer invoice needs'."""
from PIL import Image, ImageDraw, ImageFont
import os, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "marketing"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1080, 1080
BG = (11, 27, 49)       # navy
INK = (234, 241, 251)
MUTED = (138, 160, 189)
ACCENT = (37, 99, 235)  # blue
GREEN = (34, 197, 94)
GOLD = (245, 158, 11)

def fr(path, size):
    for candidate in [path, "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                      "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]:
        if os.path.exists(candidate):
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()

FONT_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def rrect(draw, box, r, fill, outline=None, width=0):
    draw.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)

def text_wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=font) <= max_w:
            cur = test
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def render_slide(idx, eyebrow, headline, body_bullets=None, cta=False):
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    # top brand bar
    d.rectangle((0, 0, W, 6), fill=ACCENT)
    # eyebrow
    eb_f = fr(FONT_B, 28)
    eb = eyebrow.upper()
    d.text((80, 70), eb, font=eb_f, fill=GOLD)
    # headline
    hf = fr(FONT_B, 64)
    lines = text_wrap(d, headline, hf, W - 160)
    y = 140
    for ln in lines:
        d.text((80, y), ln, font=hf, fill=INK)
        y += 78
    # bullets
    if body_bullets:
        bf = fr(FONT_R, 36)
        b_y = y + 30
        for b in body_bullets:
            # check mark
            d.ellipse((80, b_y + 8, 104, b_y + 32), fill=GREEN)
            for bl in text_wrap(d, b, bf, W - 200):
                d.text((120, b_y), bl, font=bf, fill=INK)
                b_y += 44
            b_y += 18
    # page number (lower right)
    pf = fr(FONT_R, 24)
    if idx > 0:
        d.text((W - 180, H - 70), f"{idx} / 8", font=pf, fill=MUTED)
    # CTA footer for last slide
    if cta:
        rrect(d, (80, H - 220, W - 80, H - 80), 18, fill=ACCENT)
        cta_h = fr(FONT_B, 48)
        cta_s = fr(FONT_R, 28)
        d.text((120, H - 200), "getclausery.github.io", font=cta_h, fill=INK)
        d.text((120, H - 140), "Free Word invoices in 60 seconds — no signup", font=cta_s, fill=INK)
    else:
        # logo/name footer
        nf = fr(FONT_B, 28)
        d.text((80, H - 60), "CLAUSERY", font=nf, fill=MUTED)
    return im

SLIDES = [
    # slide 0 - cover
    {"eyebrow": "Freelancer toolkit", "headline": "7 things every freelancer invoice needs",
     "body_bullets": ["Miss one and you don't get paid on time.", "A 60-second checklist you can use today."]},
    # 1
    {"eyebrow": "1 · Who and when", "headline": "Your name, their name, number, date, due date",
     "body_bullets": ["Unique invoice number — start at 1001, never reuse.", "Date issued + payment due date (e.g. 14 or 30 days).", "Your legal name/address and their legal name/address."]},
    # 2
    {"eyebrow": "2 · Line items", "headline": "Description, quantity, rate, amount",
     "body_bullets": ["One row per thing you delivered.", "Never write 'services rendered' — clients refuse to pay vague invoices.", "Quantity × rate = amount, done for you by the tool."]},
    # 3
    {"eyebrow": "3 · Tax", "headline": "Get the tax line right",
     "body_bullets": ["VAT (UK), GST (AU/NZ/CA), sales tax (US) — by jurisdiction.", "Label the rate so the client sees why total is more than subtotal.", "Don't guess: if you're not sure, leave tax off and ask your accountant."]},
    # 4
    {"eyebrow": "4 · Total + currency", "headline": "Big, bold total, with currency",
     "body_bullets": ["Put TOTAL DUE in its own row, bigger than everything else.", "State the currency (USD, GBP, AUD, EUR).", "If there's a deposit paid, subtract it and show 'Balance due'."]},
    # 5
    {"eyebrow": "5 · How to pay", "headline": "Bank details, card link, or both",
     "body_bullets": ["BACS/SWIFT: account name, number, sort code / routing, IBAN.", "Or a Stripe/PayPal/Wise payment link.", "Make 'how to pay' one line — two clicks max for the client."]},
    # 6
    {"eyebrow": "6 · Late-payment terms", "headline": "A late fee, stated up front",
     "body_bullets": ["'X% per month on overdue balances' — standard, enforceable.", "Without this line, chasing late pay is much harder.", "In the UK, you can also charge statutory interest (8% over base)."]},
    # 7 - cta
    {"eyebrow": "7 · Make it in Word", "headline": "You don't need a SaaS",
     "body_bullets": ["Editable Word .docx, not a locked PDF.", "Fill it in online, download it, keep editing.", "No account, no card, nothing uploaded.", "87 templates, all free."], "cta": True},
]

if __name__ == "__main__":
    for i, s in enumerate(SLIDES):
        im = render_slide(i, **s)
        out = OUT / f"linkedin-carousel-{i:02d}.png"
        im.save(out, "PNG", optimize=True)
        print(f"wrote {out}")
