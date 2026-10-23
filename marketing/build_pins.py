#!/usr/bin/env python3
"""
Build 5 Pinterest/IG-feed pins (1000x1500, 2:3) for top search-intent keywords.
Matches the dark/blue visual language of the existing press-kit cards in assets/marketing/.
Run: python3 marketing/build_pins.py
Output: assets/marketing/pin-*.png
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1000, 1500
DEJAVU = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
DEJAVU_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

NAVY = (11, 21, 34)          # #0b1522
NAVY_DARK = (8, 15, 24)
BLUE = (41, 151, 255)        # #2997ff
BLUE_DK = (31, 126, 219)
WHITE = (255, 255, 255)
SOFT = (207, 224, 243)       # #cfe0f3
MUTED = (159, 176, 198)      # #9fb0c6
GREEN = (34, 197, 94)
INK = (24, 36, 54)


def font(path, size):
    return ImageFont.truetype(path, size)


def wrap(draw, text, fnt, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=fnt) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_pin(out_path, *, eyebrow, headline, subhead, bullets, cta_text, tag, accent_color=BLUE):
    img = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(img)

    # Background: dark gradient + subtle rounded accent block in top-right
    for y in range(H):
        t = y / H
        r = int(NAVY[0] * (1 - t) + NAVY_DARK[0] * t)
        g = int(NAVY[1] * (1 - t) + NAVY_DARK[1] * t)
        b = int(NAVY[2] * (1 - t) + NAVY_DARK[2] * t)
        d.line([(0, y), (W, y)], fill=(r, g, b))

    # Accent blob top-right
    d.ellipse((W - 350, -200, W + 150, 300), fill=accent_color)
    # Lighter halo
    d.ellipse((W - 280, -120, W + 60, 220), fill=BLUE_DK)

    # Logo "C" badge
    cx, cy, cr = 110, 140, 58
    d.rounded_rectangle((cx - cr, cy - cr, cx + cr, cy + cr), radius=20, fill=accent_color)
    d.text((cx, cy), "C", font=font(DEJAVU_B, 60), fill=WHITE, anchor="mm")
    d.text((cx + cr + 22, cy - 6), "CLAUSERY", font=font(DEJAVU_B, 22), fill=WHITE, anchor="lm")
    d.text((cx + cr + 22, cy + 20), "Free Word templates", font=font(DEJAVU, 15), fill=SOFT, anchor="lm")

    # Eyebrow tag (outline pill)
    y = 260
    if eyebrow:
        f_eye = font(DEJAVU_B, 20)
        tw = d.textlength(eyebrow, font=f_eye)
        pad_x, pad_y = 22, 12
        pill_right = 80 + tw + pad_x * 2
        pill_bot = y + 40
        # Pill background = tint of accent (solid dark-blue fill)
        pill_fill = tuple(max(0, int(accent_color[i] * 0.18) + 15) for i in range(3))
        d.rounded_rectangle((80, y, pill_right, pill_bot), radius=20, fill=pill_fill, outline=accent_color, width=2)
        d.text((80 + pad_x, y + pad_y - 2), eyebrow, font=f_eye, fill=accent_color, anchor="lm")
        y += 70

    # Headline
    f_head = font(DEJAVU_B, 64)
    max_w = W - 160
    lines = wrap(d, headline, f_head, max_w)
    for ln in lines:
        d.text((80, y), ln, font=f_head, fill=WHITE)
        y += 76
    y += 14

    # Subhead
    if subhead:
        f_sub = font(DEJAVU, 28)
        for ln in wrap(d, subhead, f_sub, max_w):
            d.text((80, y), ln, font=f_sub, fill=MUTED)
            y += 38
        y += 20

    # Document preview card (simple mock of a Word page)
    card_top = y + 10
    card_h = 240
    card_left, card_right = 100, W - 100
    # Shadow
    d.rounded_rectangle((card_left + 8, card_top + 10, card_right + 8, card_top + card_h + 10), radius=14, fill=(0, 0, 0))
    d.rounded_rectangle((card_left, card_top, card_right, card_top + card_h), radius=14, fill=WHITE)
    # Fake Word lines
    d.rectangle((card_left + 40, card_top + 40, card_left + 300, card_top + 58), fill=INK)  # title
    for i in range(8):
        ly = card_top + 85 + i * 20
        w = [card_right - card_left - 80, card_right - card_left - 130, card_right - card_left - 100, card_right - card_left - 160][i % 4]
        d.rectangle((card_left + 40, ly, card_left + 40 + w, ly + 6), fill=(210, 215, 222))
    # Price / total accent line
    d.rectangle((card_left + 40, card_top + card_h - 50, card_right - 40, card_top + card_h - 44), fill=accent_color)
    y = card_top + card_h + 50

    # Bullets (checkmarks)
    f_b = font(DEJAVU, 28)
    for b in bullets:
        # Green check
        d.ellipse((82, y + 4, 108, y + 30), fill=GREEN)
        d.text((95, y + 17), "✓", font=font(DEJAVU_B, 20), fill=WHITE, anchor="mm")
        for ln in wrap(d, b, f_b, max_w - 50):
            d.text((128, y + 2), ln, font=f_b, fill=SOFT)
            y += 36
        y += 10

    # CTA button at the bottom
    btn_h = 80
    btn_top = H - 230
    btn_left, btn_right = 80, W - 80
    d.rounded_rectangle((btn_left, btn_top, btn_right, btn_top + btn_h), radius=20, fill=accent_color)
    d.text(((btn_left + btn_right) // 2, btn_top + btn_h // 2), cta_text,
           font=font(DEJAVU_B, 32), fill=WHITE, anchor="mm")

    # URL
    d.text((W // 2, H - 110), "getclausery.github.io",
           font=font(DEJAVU_B, 26), fill=WHITE, anchor="mm")
    d.text((W // 2, H - 70), tag,
           font=font(DEJAVU, 20), fill=MUTED, anchor="mm")

    img.save(out_path, "PNG", optimize=True)
    print(f"wrote {out_path}")


PINS = [
    {
        "out": "assets/marketing/pin-free-invoice-word.png",
        "eyebrow": "FREE DOWNLOAD · EDITABLE .DOCX",
        "headline": "Free Word invoice template — no signup",
        "subhead": "Fill in your details online, click download, keep editing in Word. No account, no card, no watermark.",
        "bullets": [
            "Editable Word .docx — not a locked PDF",
            "No email, no password, no credit card",
            "Calculates tax & totals for you",
            "Also works as a quote or receipt",
        ],
        "cta_text": "Get the free template  →",
        "tag": "#invoicetemplate #smallbusiness #freelance",
    },
    {
        "out": "assets/marketing/pin-freelance-invoice.png",
        "eyebrow": "BUILT FOR FREELANCERS",
        "headline": "Freelance invoice template for Word",
        "subhead": "The invoice template freelancers actually send — clean, editable, with line items, deposits and late fees.",
        "bullets": [
            "Hourly, per-project & deposit formats",
            "Late-fee wording built in",
            "Works offline once loaded",
            "87 templates for contracts & letters too",
        ],
        "cta_text": "Make my first invoice  →",
        "tag": "#freelancelife #invoicetemplate #wordtemplate",
    },
    {
        "out": "assets/marketing/pin-quote-template.png",
        "eyebrow": "FREE QUOTE TEMPLATE",
        "headline": "Quote template for small business",
        "subhead": "Send a professional price quote in Word in 60 seconds. Convert the same quote into an invoice when the client says yes.",
        "bullets": [
            "Validity period & terms built in",
            "One click converts quote to invoice",
            "No account required to download",
            "Your data stays on your device",
        ],
        "cta_text": "Make a free quote  →",
        "tag": "#smallbusiness #quotetemplate #freedownload",
    },
    {
        "out": "assets/marketing/pin-receipt-word.png",
        "eyebrow": "FREE RECEIPT TEMPLATE",
        "headline": "Receipt template for Word — free",
        "subhead": "Issue a payment receipt as an editable Word file. Clients get a file they can actually open and save.",
        "bullets": [
            "Cash, card & bank-transfer receipts",
            "Editable .docx, not a locked PDF",
            "Add your logo & branding free",
            "No signup, no watermark",
        ],
        "cta_text": "Download free receipt  →",
        "tag": "#receipttemplate #smallbusiness #freedownload",
    },
    {
        "out": "assets/marketing/pin-business-kit.png",
        "eyebrow": "FREE BUSINESS KIT",
        "headline": "Free business document templates for Word",
        "subhead": "87 free Word templates for small business — invoices, quotes, receipts, NDAs, contracts, proposals and more.",
        "bullets": [
            "87 templates, all free, all editable Word",
            "No signup, no card, documents stay on your device",
            "Public source code — you can verify it",
            "UK, US & AU tax variants",
        ],
        "cta_text": "See all 87 free templates  →",
        "tag": "#smallbusiness #templates #freetools",
        "accent": (22, 163, 74),  # green for the full-library pin
    },
    {
        "out": "assets/marketing/pin-free-nda.png",
        "eyebrow": "FREE NDA · NO SIGNUP",
        "headline": "Free NDA template (Word) — mutual, ready to sign",
        "subhead": "A plain-English mutual NDA you can fill in and download in under a minute. Standard exclusions, term, survival and signature blocks.",
        "bullets": [
            "Mutual (two-way) NDA, editable Word",
            "Standard exclusions & survival clauses",
            "One-way, employee & contractor variants too",
            "No email, no account, no watermark",
        ],
        "cta_text": "Get the free NDA  →",
        "tag": "#nda #freetemplate #smallbusiness",
    },
    {
        "out": "assets/marketing/pin-freelance-contract.png",
        "eyebrow": "FREE CONTRACT TEMPLATE",
        "headline": "Freelance contract template for Word",
        "subhead": "A simple freelance contract that covers scope, payment, revisions, kill fees and IP — the clauses freelancers actually need.",
        "bullets": [
            "Scope, deliverables & payment terms",
            "Kill-fee & late-payment clauses",
            "IP & confidentiality wording built in",
            "Fill in online, download Word, done",
        ],
        "cta_text": "Get the freelance contract  →",
        "tag": "#freelance #contracttemplate #freedownload",
        "accent": (245, 158, 11),  # gold
    },
    {
        "out": "assets/marketing/pin-independent-contractor.png",
        "eyebrow": "FREE TEMPLATE · EDITABLE WORD",
        "headline": "Independent contractor agreement (Word)",
        "subhead": "Hire a contractor without a long-lawyered PDF. Clear scope, payment, confidentiality, IP and termination clauses.",
        "bullets": [
            "Scope, payment & termination clauses",
            "Confidentiality & IP assignment built in",
            "Not a non-compete",
            "Downloads as an editable .docx",
        ],
        "cta_text": "Download free agreement  →",
        "tag": "#contractor #hiring #smallbusiness",
    },
    {
        "out": "assets/marketing/pin-rental-agreement.png",
        "eyebrow": "LANDLORD FORM · FREE",
        "headline": "Free rental / lease agreement (Word)",
        "subhead": "A residential lease you can fill in online — rent, deposit, late fee, pets, utilities and the federal lead warning for US homes.",
        "bullets": [
            "Fixed term or month-to-month",
            "Rent, deposit, late fee & pets",
            "Utilities, entry & lead-paint disclosure",
            "Editable Word, no signup",
        ],
        "cta_text": "Get the free lease  →",
        "tag": "#landlord #lease #rentalproperty",
        "accent": (22, 163, 74),
    },
    {
        "out": "assets/marketing/pin-proforma-invoice.png",
        "eyebrow": "FREE PROFORMA INVOICE",
        "headline": "Proforma invoice template for Word",
        "subhead": "Send a proforma before you ship or start work, then convert it to a final invoice when the job is done — same numbers, no retyping.",
        "bullets": [
            "Looks like a real invoice, marked proforma",
            "One click converts to final invoice",
            "Totals & tax calculated",
            "Editable Word, free, no signup",
        ],
        "cta_text": "Make a proforma invoice  →",
        "tag": "#proforma #invoicetemplate #smallbusiness",
    },
    {
        "out": "assets/marketing/pin-credit-note.png",
        "eyebrow": "FREE CREDIT NOTE",
        "headline": "Credit note template (Word) — free",
        "subhead": "Issue a credit against an invoice when something is refunded, returned or discounted. References the original invoice and works out the new balance.",
        "bullets": [
            "References the original invoice",
            "Calculates new balance & tax",
            "Reason & approval lines built in",
            "Editable Word, no signup",
        ],
        "cta_text": "Make a free credit note  →",
        "tag": "#creditnote #invoicing #smallbusiness",
    },
    {
        "out": "assets/marketing/pin-bill-of-sale.png",
        "eyebrow": "FREE BILL OF SALE",
        "headline": "Bill of sale template (Word) — car, boat, equipment",
        "subhead": "Proof of sale for a car, boat, equipment or any item: VIN/serial, odometer, purchase price, as-is wording and signatures.",
        "bullets": [
            "VIN, odometer & serial fields",
            "As-is wording & deposit/balance lines",
            "Buyer & seller signature blocks",
            "Fill in online, download Word, free",
        ],
        "cta_text": "Get the free bill of sale  →",
        "tag": "#billofsale #carseller #privatesale",
    },
    {
        "out": "assets/marketing/pin-offer-letter.png",
        "eyebrow": "HR TEMPLATE · FREE",
        "headline": "Job offer letter template (Word)",
        "subhead": "Send a formal offer letter that covers pay, start date, benefits, probation, at-will wording and contingencies — without paying HR-by-the-document services.",
        "bullets": [
            "Salary, start date & probation",
            "Optional bonus, equity & benefits",
            "At-will and contingency clauses",
            "Editable Word, no signup",
        ],
        "cta_text": "Make a free offer letter  →",
        "tag": "#hrtemplates #offerletter #hiring",
        "accent": (245, 158, 11),
    },
    {
        "out": "assets/marketing/pin-two-weeks-notice.png",
        "eyebrow": "CAREER TEMPLATE · FREE",
        "headline": "Two weeks notice letter template (Word)",
        "subhead": "Leave on good terms with a short, polite resignation letter: your last day, thank-you, handover offer. Fills in in under a minute.",
        "bullets": [
            "Last working day & notice period",
            "Thank-you & handover offer",
            "Polite, professional tone",
            "Download as Word, free, no signup",
        ],
        "cta_text": "Write my notice letter  →",
        "tag": "#resignation #twoweeksnotice #career",
    },
]

for p in PINS:
    draw_pin(
        p["out"],
        eyebrow=p["eyebrow"],
        headline=p["headline"],
        subhead=p["subhead"],
        bullets=p["bullets"],
        cta_text=p["cta_text"],
        tag=p["tag"],
        accent_color=p.get("accent", BLUE),
    )
