begin;
insert into public.categories (
        legacy_id,
        slug,
        name,
        gender,
        description,
        hero_image_url,
        sort_order,
        is_active
    )
values (
        'cat-outerwear',
        'outerwear',
        'Outerwear',
        'all',
        'Sculpted coats, double-faced cashmere overcoats, and hand-finished shearling.',
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1600&auto=format&fit=crop',
        1,
        true
    ),
    (
        'cat-knitwear',
        'knitwear',
        'Knitwear',
        'all',
        'Featherlight Mongolian cashmere, silk-blend turtlenecks, and refined cardigans.',
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1600&auto=format&fit=crop',
        2,
        true
    ),
    (
        'cat-tailoring',
        'tailoring',
        'Tailoring',
        'all',
        'Architectural shoulders, Italian wool-silk tailoring, and fluid trousers.',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
        3,
        true
    ),
    (
        'cat-leather-goods',
        'leather-goods',
        'Leather Goods',
        'all',
        'Supple calfskin travel bags, handcrafted belts, and document portfolios.',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1600&auto=format&fit=crop',
        4,
        true
    ),
    (
        'cat-footwear',
        'footwear',
        'Footwear',
        'all',
        'Hand-stitched suede loafers, refined boots, and leather dress shoes.',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1600&auto=format&fit=crop',
        5,
        true
    ),
    (
        'cat-accessories',
        'accessories',
        'Accessories',
        'all',
        'Raw silk scarves, cashmere wraps, and understated leather accessories.',
        'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1600&auto=format&fit=crop',
        6,
        true
    ) on conflict (slug) do
update
set legacy_id = excluded.legacy_id,
    name = excluded.name,
    gender = excluded.gender,
    description = excluded.description,
    hero_image_url = excluded.hero_image_url,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active,
    updated_at = now();
insert into public.collections (
        legacy_id,
        slug,
        name,
        season,
        description,
        story_quote,
        hero_image_url,
        sort_order,
        is_active
    )
values (
        'col-aw26',
        'autumn-winter-2026',
        'Autumn / Winter 2026',
        'Autumn/Winter 2026',
        'A meditation on form, tactile warmth, and natural earth tonalities. Crafted in Northern Italy.',
        'True luxury requires no gesture of bravado. It rests in quiet proportion and enduring substance.',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1800&auto=format&fit=crop',
        1,
        true
    ),
    (
        'col-cashmere',
        'cashmere-atelier',
        'Cashmere Atelier',
        'Permanent Capsule',
        'Undyed ultrafine cashmere selected from high-altitude Mongolian plateaus.',
        'Lightness of weight, bound to enduring warmth.',
        'https://images.unsplash.com/photo-1608234807905-4466023792f5?q=80&w=1800&auto=format&fit=crop',
        2,
        true
    ),
    (
        'col-tailoring',
        'heritage-tailoring',
        'Heritage Tailoring',
        'Permanent Capsule',
        'Soft canvas structure meeting drape and fluidity through European tailoring.',
        'Confidence born from invisible construction.',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1800&auto=format&fit=crop',
        3,
        true
    ) on conflict (slug) do
update
set legacy_id = excluded.legacy_id,
    name = excluded.name,
    season = excluded.season,
    description = excluded.description,
    story_quote = excluded.story_quote,
    hero_image_url = excluded.hero_image_url,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active,
    updated_at = now();
commit;