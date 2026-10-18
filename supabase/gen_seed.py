"""Generates supabase/parts/04_seed.sql — the Cicero starter catalogue.

Run:  python3 supabase/gen_seed.py
Every row uses a `cicero-` legacy_id and ON CONFLICT DO NOTHING, so running the
setup file again never overwrites edits made in the admin portal.
"""
from pathlib import Path

def q(s):
    return "null" if s is None else "'" + str(s).replace("'", "''") + "'"

def arr(items):
    return "array[" + ",".join(q(i) for i in items) + "]::text[]"

CATEGORIES = [
    ("cicero-cat-coats", "wool-coats", "Wool Coats", "Overcoats, topcoats and wrap coats in heavy wool and cashmere blends.", 1),
    ("cicero-cat-jackets", "jackets", "Jackets", "Bombers, field jackets, leather and quilted layers.", 2),
    ("cicero-cat-sweaters", "sweaters", "Sweaters", "Crewnecks, roll-necks and cable knits in merino and cashmere.", 3),
    ("cicero-cat-cardigans", "cardigans", "Cardigans", "Button-through knitwear for layering.", 4),
]
COLLECTIONS = [
    ("cicero-col-winter", "winter-edit", "The Winter Edit", "AW26", "Heavy wool outerwear built for the coldest weeks of the year.", "Cut close to the body, built to last a decade.", 1),
    ("cicero-col-knits", "essential-knits", "Essential Knitwear", "Core", "The knitwear that anchors a cold-weather wardrobe.", "Good knitwear is quiet. It just works.", 2),
]

C = {  # colour name -> (hex, family)
    "Charcoal": ("#3A3B3E", "grey"), "Camel": ("#B48A5E", "brown"), "Black": ("#111111", "black"),
    "Navy": ("#1E2A3F", "blue"), "Oatmeal": ("#D8CDB8", "beige"), "Tobacco": ("#7A5236", "brown"),
    "Olive": ("#545A3A", "green"), "Stone": ("#B9B2A5", "neutral"), "Ecru": ("#EDE6D6", "white"),
    "Forest": ("#2F4434", "green"), "Grey Melange": ("#8D8F93", "grey"), "Ivory": ("#F2EEE4", "white"),
    "Burgundy": ("#5B1F28", "red"), "Oat": ("#DCCFB9", "beige"),
}
MEN = ["S", "M", "L", "XL"]
WOMEN = ["XS", "S", "M", "L"]

COAT_CARE = ["Dry clean only", "Brush after wear with a soft garment brush", "Hang on a wide shoulder hanger"]
KNIT_CARE = ["Hand wash cold or dry clean", "Dry flat away from direct heat", "Fold — never hang knitwear"]
JACKET_CARE = ["Specialist clean only", "Store on a padded hanger", "Keep away from prolonged direct sunlight"]

P = [
    # legacy, sku, slug, title, subtitle, cat, col, gender, price, compare, material, care, fit, colours, new, featured, best
    ("cicero-m-01", "CC-M-01", "double-breasted-wool-overcoat", "Double-Breasted Wool Overcoat", "Heavy Italian wool, peak lapel",
     "wool-coats", "winter-edit", "men", 690, None, "80% virgin wool, 20% cashmere. Viscose lining.", COAT_CARE,
     "Tailored fit through the shoulder with room for a knit underneath. Take your usual size.", ["Charcoal", "Camel", "Black"], True, True, True,
     "A six-button double-breasted overcoat cut from a dense 720g wool-cashmere cloth. Peak lapels, a full canvas front and a knee-skimming length make it the anchor of a winter wardrobe."),
    ("cicero-m-02", "CC-M-02", "single-breasted-wool-topcoat", "Single-Breasted Wool Topcoat", "Clean lines, concealed placket",
     "wool-coats", "winter-edit", "men", 620, None, "100% virgin wool melton. Cupro lining.", COAT_CARE,
     "Regular fit. Size down for a closer silhouette.", ["Navy", "Oatmeal"], True, False, False,
     "A minimal topcoat in compact wool melton with a concealed button placket, notch lapel and slanted flap pockets. Sharp enough for tailoring, relaxed enough for denim."),
    ("cicero-m-03", "CC-M-03", "suede-bomber-jacket", "Suede Bomber Jacket", "Goat suede, ribbed trims",
     "jackets", "winter-edit", "men", 540, 620, "100% goat suede. Wool-blend rib trims.", JACKET_CARE,
     "Relaxed fit, hip length.", ["Tobacco", "Black"], True, True, False,
     "A soft goat-suede bomber with wool-blend ribbed collar, cuffs and hem, a two-way zip and an internal phone pocket. It softens and takes on character with every wear."),
    ("cicero-m-04", "CC-M-04", "waxed-cotton-field-jacket", "Waxed Cotton Field Jacket", "Four pockets, corduroy collar",
     "jackets", None, "men", 420, None, "100% waxed cotton. Cotton check lining.", JACKET_CARE,
     "Regular fit with room for layering.", ["Olive", "Navy"], False, False, True,
     "A weatherproof field jacket in British waxed cotton with four bellows pockets, a corduroy collar and a storm flap over a heavy brass zip."),
    ("cicero-m-05", "CC-M-05", "quilted-liner-jacket", "Quilted Liner Jacket", "Lightweight, diamond quilted",
     "jackets", None, "men", 320, None, "Recycled nylon shell, recycled polyester fill.", JACKET_CARE,
     "Slim fit — wear alone or under a coat.", ["Black", "Stone"], False, False, False,
     "A featherweight diamond-quilted liner with snap closures and a collarless neck. Wear it alone in autumn, or under an overcoat when the temperature drops."),
    ("cicero-m-06", "CC-M-06", "merino-crewneck-sweater", "Merino Crewneck Sweater", "Extra-fine 12-gauge merino",
     "sweaters", "essential-knits", "men", 190, None, "100% extra-fine merino wool.", KNIT_CARE,
     "Regular fit. True to size.", ["Charcoal", "Navy", "Ecru"], False, True, True,
     "The everyday crewneck, knitted from extra-fine merino at 12 gauge for a smooth, light handle. Fully fashioned shoulders and ribbed trims keep the shape wash after wash."),
    ("cicero-m-07", "CC-M-07", "chunky-cable-knit-sweater", "Chunky Cable-Knit Sweater", "Hand-framed Aran cables",
     "sweaters", "essential-knits", "men", 260, None, "70% lambswool, 30% alpaca.", KNIT_CARE,
     "Relaxed, slightly boxy fit.", ["Ecru", "Forest"], True, False, False,
     "A heavyweight fisherman sweater with traditional Aran cables, knitted on hand frames from a lofty lambswool and alpaca yarn."),
    ("cicero-m-08", "CC-M-08", "cashmere-roll-neck", "Cashmere Roll-Neck", "Two-ply Mongolian cashmere",
     "sweaters", "essential-knits", "men", 340, None, "100% Mongolian cashmere.", KNIT_CARE,
     "Slim fit. Size up for a relaxed look.", ["Black", "Camel"], False, True, False,
     "A two-ply cashmere roll-neck with a deep folded collar. Light enough to wear under a coat, warm enough to wear on its own."),
    ("cicero-m-09", "CC-M-09", "shawl-collar-cardigan", "Shawl-Collar Cardigan", "Horn buttons, patch pockets",
     "cardigans", "essential-knits", "men", 280, None, "100% lambswool.", KNIT_CARE,
     "Regular fit.", ["Charcoal", "Oatmeal"], False, False, False,
     "A chunky shawl-collar cardigan in rib-stitch lambswool with genuine horn buttons and two patch pockets."),
    ("cicero-w-01", "CC-W-01", "belted-wrap-wool-coat", "Belted Wrap Wool Coat", "Double-faced wool, tie belt",
     "wool-coats", "winter-edit", "women", 650, None, "90% wool, 10% cashmere, double-faced.", COAT_CARE,
     "Relaxed wrap silhouette. Take your usual size.", ["Camel", "Black"], True, True, True,
     "An unlined, hand-finished wrap coat in double-faced wool and cashmere. Dropped shoulders, a shawl lapel and a self-tie belt give an easy, enveloping shape."),
    ("cicero-w-02", "CC-W-02", "oversized-double-breasted-coat", "Oversized Double-Breasted Coat", "Strong shoulder, maxi length",
     "wool-coats", "winter-edit", "women", 720, None, "100% virgin wool herringbone. Viscose lining.", COAT_CARE,
     "Oversized by design. Size down for a closer fit.", ["Grey Melange", "Ivory"], True, False, False,
     "A strong-shouldered, maxi-length double-breasted coat in a textured wool herringbone. Architectural, dramatic and very warm."),
    ("cicero-w-03", "CC-W-03", "cropped-wool-jacket", "Cropped Wool Jacket", "Boxy, collarless",
     "jackets", None, "women", 380, None, "80% wool, 20% polyamide bouclé.", JACKET_CARE,
     "Boxy, cropped at the waist.", ["Black", "Ecru"], True, False, False,
     "A collarless cropped jacket in a soft wool bouclé with concealed hook closures and a silk-blend lining."),
    ("cicero-w-04", "CC-W-04", "leather-biker-jacket", "Leather Biker Jacket", "Lambskin, asymmetric zip",
     "jackets", None, "women", 590, None, "100% lambskin leather. Cupro lining.", JACKET_CARE,
     "Fitted. If between sizes, size up.", ["Black", "Burgundy"], False, True, True,
     "A classic asymmetric biker in supple lambskin with silver-tone hardware, zipped cuffs and a notched collar."),
    ("cicero-w-05", "CC-W-05", "ribbed-cashmere-turtleneck", "Ribbed Cashmere Turtleneck", "Fine rib, slim fit",
     "sweaters", "essential-knits", "women", 320, None, "100% Mongolian cashmere.", KNIT_CARE,
     "Slim fit. True to size.", ["Ivory", "Black", "Camel"], False, True, True,
     "A fine-rib cashmere turtleneck that sits close to the body — the layer that goes under everything."),
    ("cicero-w-06", "CC-W-06", "mohair-blend-v-neck-sweater", "Mohair-Blend V-Neck Sweater", "Brushed, airy knit",
     "sweaters", "essential-knits", "women", 210, None, "60% mohair, 30% wool, 10% polyamide.", KNIT_CARE,
     "Relaxed fit with dropped shoulders.", ["Oat", "Charcoal"], True, False, False,
     "A brushed mohair-blend V-neck with a soft halo, dropped shoulders and deep ribbed cuffs."),
    ("cicero-w-07", "CC-W-07", "longline-merino-cardigan", "Longline Merino Cardigan", "Knee length, tie waist",
     "cardigans", "essential-knits", "women", 240, None, "100% merino wool.", KNIT_CARE,
     "Relaxed, knee length.", ["Black", "Oatmeal"], False, False, False,
     "A knee-length merino cardigan with a detachable tie belt and deep pockets — a coat for the in-between days."),
]

def stock(i, j, k):
    v = (i * 7 + j * 5 + k * 3) % 15
    return 0 if v == 13 else (2 if v in (4, 9) else v + 1)

out = ["-- Generated by supabase/gen_seed.py — Cicero starter catalogue"]
for leg, slug, name, desc, sort in CATEGORIES:
    out.append(
        f"insert into public.categories (legacy_id, slug, name, gender, description, sort_order) values "
        f"({q(leg)}, {q(slug)}, {q(name)}, 'all', {q(desc)}, {sort}) on conflict do nothing;")
for leg, slug, name, season, desc, quote, sort in COLLECTIONS:
    out.append(
        f"insert into public.collections (legacy_id, slug, name, season, description, story_quote, sort_order) values "
        f"({q(leg)}, {q(slug)}, {q(name)}, {q(season)}, {q(desc)}, {q(quote)}, {sort}) on conflict do nothing;")

for i, (leg, sku, slug, title, sub, cat, col, gender, price, compare, mat, care, fit, colours, new, feat, best, desc) in enumerate(P):
    out.append(f"""
insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ({q(leg)}, {q(sku)}, {q(slug)}, {q(title)}, {q(sub)}, {q(desc)}, {price}, {compare if compare else 'null'}, 'USD',
  (select id from public.categories where slug = {q(cat)}),
  {f"(select id from public.collections where slug = {q(col)})" if col else 'null'},
  {q(gender)}, {q(mat)}, {arr(care)}, {q(fit)}, 'Express shipping in 2–4 business days. Free returns within 30 days.',
  {q(title + ' | Cicero')}, {q(desc[:155])}, {str(new).lower()}, {str(feat).lower()}, {str(best).lower()}, 'active', now() - interval '{i} hours')
on conflict do nothing;""".rstrip())
    sizes = MEN if gender == "men" else WOMEN
    rows = []
    for j, colour in enumerate(colours):
        hx, fam = C[colour]
        code = "".join(w[0] for w in colour.split()).upper() if " " in colour else colour[:3].upper()
        for k, size in enumerate(sizes):
            rows.append(
                f"({q(leg + '-' + code + '-' + size)}, {q(sku + '-' + code + '-' + size)}, {q(colour + ' / ' + size)}, "
                f"{q(colour)}, {q(hx)}, {q(fam)}, {q(size)}, {price}::numeric, {compare if compare else 'null'}::numeric, {stock(i, j, k)})")
    out.append(
        "insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)\n"
        f"select p.id, v.* from public.products p, (values\n  " + ",\n  ".join(rows) +
        f"\n) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)\n"
        f"where p.legacy_id = {q(leg)}\non conflict do nothing;")

Path(__file__).with_name("parts").mkdir(exist_ok=True)
Path(__file__).with_name("parts").joinpath("04_seed.sql").write_text("\n".join(out) + "\n")
print("wrote", len(P), "products")
