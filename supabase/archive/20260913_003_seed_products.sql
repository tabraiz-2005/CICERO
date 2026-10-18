begin;
-- Product 1: Women's Cashmere Coat
insert into public.products (
        legacy_id,
        sku,
        slug,
        title,
        subtitle,
        description,
        price,
        compare_at_price,
        currency,
        category_id,
        collection_id,
        gender,
        material,
        care_instructions,
        craftsmanship_notes,
        fit_info,
        shipping_info,
        seo_title,
        seo_description,
        is_new_arrival,
        is_featured,
        status,
        published_at
    )
values (
        'prod-w-coat-01',
        'LV-W26-CT01-OAT',
        'double-faced-cashmere-belted-overcoat',
        'Double-Faced Cashmere Belted Coat',
        'Pure Mongolian Cashmere in Oat Vicuña',
        'A hand-sewn double-faced overcoat combining exceptional lightness, warmth and an effortlessly refined silhouette.',
        4850,
        5200,
        'USD',
        (
            select id
            from public.categories
            where slug = 'outerwear'
        ),
        (
            select id
            from public.collections
            where slug = 'autumn-winter-2026'
        ),
        'women',
        '100% Ultrafine Mongolian Double-Faced Cashmere',
        array [
    'Specialist dry clean only',
    'Do not wash or tumble dry',
    'Store in a breathable garment cover'
  ],
        'Hand-assembled in Italy with meticulous stitching along the double-face margins.',
        'Designed for a relaxed fit. Select your normal size.',
        'Complimentary global express shipping and returns within 30 days.',
        'Double-Faced Cashmere Belted Coat | LUCEVALIE',
        'Discover the LUCEVALIE double-faced cashmere belted coat.',
        true,
        true,
        'active',
        now()
    ) on conflict (slug) do
update
set title = excluded.title,
    subtitle = excluded.subtitle,
    description = excluded.description,
    price = excluded.price,
    compare_at_price = excluded.compare_at_price,
    category_id = excluded.category_id,
    collection_id = excluded.collection_id,
    gender = excluded.gender,
    material = excluded.material,
    care_instructions = excluded.care_instructions,
    craftsmanship_notes = excluded.craftsmanship_notes,
    fit_info = excluded.fit_info,
    shipping_info = excluded.shipping_info,
    seo_title = excluded.seo_title,
    seo_description = excluded.seo_description,
    is_new_arrival = excluded.is_new_arrival,
    is_featured = excluded.is_featured,
    status = excluded.status,
    published_at = excluded.published_at,
    updated_at = now();
-- Product 2: Men's Blazer
insert into public.products (
        legacy_id,
        sku,
        slug,
        title,
        subtitle,
        description,
        price,
        currency,
        category_id,
        collection_id,
        gender,
        material,
        care_instructions,
        craftsmanship_notes,
        fit_info,
        shipping_info,
        seo_title,
        seo_description,
        is_new_arrival,
        is_featured,
        status,
        published_at
    )
values (
        'prod-m-tailor-03',
        'LV-M26-BL03-NAV',
        'double-breasted-virgin-wool-blazer',
        'Double-Breasted Virgin Wool & Cashmere Blazer',
        'Deconstructed Soft Shoulder Tailoring',
        'A lightweight double-breasted jacket balancing sartorial structure with relaxed elegance.',
        3650,
        'USD',
        (
            select id
            from public.categories
            where slug = 'tailoring'
        ),
        (
            select id
            from public.collections
            where slug = 'heritage-tailoring'
        ),
        'men',
        '90% Italian Virgin Wool, 10% Cashmere',
        array [
    'Dry clean only by a garment specialist',
    'Press using a protective cloth'
  ],
        'Tailored in Italy with genuine horn buttons and hand-finished buttonholes.',
        'Contemporary Italian fit with soft, unpadded shoulders.',
        'Complimentary shipping with garment bag and hanger.',
        'Double-Breasted Virgin Wool Blazer | LUCEVALIE',
        'Discover LUCEVALIE soft-shoulder tailoring in virgin wool and cashmere.',
        true,
        true,
        'active',
        now()
    ) on conflict (slug) do
update
set title = excluded.title,
    subtitle = excluded.subtitle,
    description = excluded.description,
    price = excluded.price,
    category_id = excluded.category_id,
    collection_id = excluded.collection_id,
    gender = excluded.gender,
    material = excluded.material,
    care_instructions = excluded.care_instructions,
    craftsmanship_notes = excluded.craftsmanship_notes,
    fit_info = excluded.fit_info,
    shipping_info = excluded.shipping_info,
    seo_title = excluded.seo_title,
    seo_description = excluded.seo_description,
    is_new_arrival = excluded.is_new_arrival,
    is_featured = excluded.is_featured,
    status = excluded.status,
    published_at = excluded.published_at,
    updated_at = now();
-- Product 3: Leather Weekender
insert into public.products (
        legacy_id,
        sku,
        slug,
        title,
        subtitle,
        description,
        price,
        currency,
        category_id,
        collection_id,
        gender,
        material,
        care_instructions,
        craftsmanship_notes,
        fit_info,
        shipping_info,
        seo_title,
        seo_description,
        is_new_arrival,
        is_featured,
        status,
        published_at
    )
values (
        'prod-u-bag-04',
        'LV-U26-BG04-TAN',
        'artisanal-calfskin-weekender-portfolio',
        'Artisanal Calfskin Weekender Bag',
        'Hand-Burnished Tuscan Leather',
        'A full-grain calfskin weekender with hand-finished edges, refined hardware and a suede-lined interior.',
        3200,
        'USD',
        (
            select id
            from public.categories
            where slug = 'leather-goods'
        ),
        (
            select id
            from public.collections
            where slug = 'autumn-winter-2026'
        ),
        'unisex',
        '100% Full-Grain Tuscan Calfskin with Suede Lining',
        array [
    'Condition with quality leather cream',
    'Store inside the provided protective dust cover'
  ],
        'Handcrafted in Florence using traditional vegetable-tanning techniques.',
        'Dimensions: 52cm wide, 32cm high and 24cm deep.',
        'Complimentary shipping with a protective dust cover.',
        'Artisanal Calfskin Weekender Bag | LUCEVALIE',
        'Discover the LUCEVALIE handcrafted Tuscan leather weekender.',
        true,
        true,
        'active',
        now()
    ) on conflict (slug) do
update
set title = excluded.title,
    subtitle = excluded.subtitle,
    description = excluded.description,
    price = excluded.price,
    category_id = excluded.category_id,
    collection_id = excluded.collection_id,
    gender = excluded.gender,
    material = excluded.material,
    care_instructions = excluded.care_instructions,
    craftsmanship_notes = excluded.craftsmanship_notes,
    fit_info = excluded.fit_info,
    shipping_info = excluded.shipping_info,
    seo_title = excluded.seo_title,
    seo_description = excluded.seo_description,
    is_new_arrival = excluded.is_new_arrival,
    is_featured = excluded.is_featured,
    status = excluded.status,
    published_at = excluded.published_at,
    updated_at = now();
-- Replace images for these demonstration products.
delete from public.product_images
where product_id in (
        select id
        from public.products
        where slug in (
                'double-faced-cashmere-belted-overcoat',
                'double-breasted-virgin-wool-blazer',
                'artisanal-calfskin-weekender-portfolio'
            )
    );
insert into public.product_images (
        product_id,
        url,
        alt_text,
        width,
        height,
        position,
        is_primary,
        is_hover
    )
select products.id,
    image_data.url,
    image_data.alt_text,
    1400,
    1800,
    image_data.position,
    image_data.is_primary,
    image_data.is_hover
from (
        values (
                'double-faced-cashmere-belted-overcoat',
                'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE double-faced cashmere coat',
                1,
                true,
                false
            ),
            (
                'double-faced-cashmere-belted-overcoat',
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE cashmere coat lifestyle view',
                2,
                false,
                true
            ),
            (
                'double-breasted-virgin-wool-blazer',
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE double-breasted wool blazer',
                1,
                true,
                false
            ),
            (
                'double-breasted-virgin-wool-blazer',
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE wool blazer detail',
                2,
                false,
                true
            ),
            (
                'artisanal-calfskin-weekender-portfolio',
                'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE artisanal calfskin weekender',
                1,
                true,
                false
            ),
            (
                'artisanal-calfskin-weekender-portfolio',
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE calfskin weekender detail',
                2,
                false,
                true
            )
    ) as image_data(
        product_slug,
        url,
        alt_text,
        position,
        is_primary,
        is_hover
    )
    join public.products on products.slug = image_data.product_slug;
-- Add sizes, colors, prices and inventory.
insert into public.product_variants (
        legacy_id,
        product_id,
        sku,
        name,
        color,
        color_hex,
        color_family,
        size,
        price,
        inventory_quantity,
        is_active
    )
select variant_data.legacy_id,
    products.id,
    variant_data.sku,
    variant_data.name,
    variant_data.color,
    variant_data.color_hex,
    variant_data.color_family,
    variant_data.size,
    variant_data.price,
    variant_data.inventory_quantity,
    true
from (
        values (
                'v-01-s',
                'double-faced-cashmere-belted-overcoat',
                'LV-W26-CT01-OAT-S',
                'Oatmeal Vicuña / S',
                'Oatmeal Vicuña',
                '#D9C3B0',
                'neutral',
                'S',
                4850::numeric,
                4
            ),
            (
                'v-01-m',
                'double-faced-cashmere-belted-overcoat',
                'LV-W26-CT01-OAT-M',
                'Oatmeal Vicuña / M',
                'Oatmeal Vicuña',
                '#D9C3B0',
                'neutral',
                'M',
                4850::numeric,
                6
            ),
            (
                'v-01-l',
                'double-faced-cashmere-belted-overcoat',
                'LV-W26-CT01-OAT-L',
                'Oatmeal Vicuña / L',
                'Oatmeal Vicuña',
                '#D9C3B0',
                'neutral',
                'L',
                4850::numeric,
                2
            ),
            (
                'v-03-48',
                'double-breasted-virgin-wool-blazer',
                'LV-M26-BL03-NAV-48',
                'Midnight Navy / 48',
                'Midnight Navy',
                '#1C2536',
                'blue',
                '48',
                3650::numeric,
                3
            ),
            (
                'v-03-50',
                'double-breasted-virgin-wool-blazer',
                'LV-M26-BL03-NAV-50',
                'Midnight Navy / 50',
                'Midnight Navy',
                '#1C2536',
                'blue',
                '50',
                3650::numeric,
                5
            ),
            (
                'v-04-os',
                'artisanal-calfskin-weekender-portfolio',
                'LV-U26-BG04-TAN-OS',
                'Saddle Tan / One Size',
                'Saddle Tan',
                '#9E643E',
                'brown',
                'One Size',
                3200::numeric,
                4
            )
    ) as variant_data(
        legacy_id,
        product_slug,
        sku,
        name,
        color,
        color_hex,
        color_family,
        size,
        price,
        inventory_quantity
    )
    join public.products on products.slug = variant_data.product_slug on conflict (sku) do
update
set name = excluded.name,
    color = excluded.color,
    color_hex = excluded.color_hex,
    color_family = excluded.color_family,
    size = excluded.size,
    price = excluded.price,
    inventory_quantity = excluded.inventory_quantity,
    is_active = excluded.is_active,
    updated_at = now();
commit;