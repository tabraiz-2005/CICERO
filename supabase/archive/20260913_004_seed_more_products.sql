begin;
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
select product_data.legacy_id,
    product_data.sku,
    product_data.slug,
    product_data.title,
    product_data.subtitle,
    product_data.description,
    product_data.price,
    'USD',
    categories.id,
    collections.id,
    product_data.gender,
    product_data.material,
    product_data.care_instructions,
    product_data.craftsmanship_notes,
    product_data.fit_info,
    product_data.shipping_info,
    product_data.seo_title,
    product_data.seo_description,
    product_data.is_new_arrival,
    product_data.is_featured,
    'active',
    now()
from (
        values (
                'prod-w-knit-02',
                'LV-W26-KN02-CREAM',
                'silk-cashmere-ribbed-turtleneck',
                'Silk-Cashmere Ribbed Turtleneck',
                'Mongolian Cashmere & Mulberry Silk',
                'A refined ribbed turtleneck combining cashmere softness with the natural luminosity of silk.',
                1450::numeric,
                'knitwear',
                'cashmere-atelier',
                'women',
                '70% Ultrafine Mongolian Cashmere, 30% Mulberry Silk',
                array [
        'Hand wash gently in lukewarm water',
        'Reshape while damp and dry flat'
      ]::text [],
                'Fully fashioned and assembled in Italy using traditional low-gauge knitting.',
                'A refined close fit. Select your normal size.',
                'Complimentary express shipping in LUCEVALIE presentation packaging.',
                'Silk-Cashmere Ribbed Turtleneck | LUCEVALIE',
                'Discover the LUCEVALIE silk and cashmere ribbed turtleneck.',
                true,
                true
            ),
            (
                'prod-m-knit-05',
                'LV-M26-KN05-TAUPE',
                'pure-cashmere-seamless-crewneck',
                'Pure Cashmere Seamless Crewneck',
                'Undyed Four-Ply Mongolian Cashmere',
                'A seamless crewneck preserving the natural softness and tonal depth of undyed Mongolian cashmere.',
                1680::numeric,
                'knitwear',
                'cashmere-atelier',
                'men',
                '100% Undyed Four-Ply Mongolian Cashmere',
                array [
        'Hand wash cold or specialist dry clean',
        'Reshape and dry flat'
      ]::text [],
                'Created using seamless whole-garment knitting in Italy.',
                'Classic regular fit. Select your normal size.',
                'Complimentary express shipping.',
                'Pure Cashmere Seamless Crewneck | LUCEVALIE',
                'Discover the LUCEVALIE seamless four-ply cashmere crewneck.',
                false,
                true
            ),
            (
                'prod-w-pants-06',
                'LV-W26-TR06-IVORY',
                'pleated-virgin-wool-wide-leg-trousers',
                'Pleated Virgin Wool Wide-Leg Trousers',
                'High-Waisted Architectural Silhouette',
                'Fluid wide-leg trousers tailored from lightweight Italian wool crepe with elegant inverted pleats.',
                1250::numeric,
                'tailoring',
                'heritage-tailoring',
                'women',
                '98% Italian Virgin Wool Crepe, 2% Elastane',
                array [
        'Specialist dry clean only'
      ]::text [],
                'Precisely cut and tailored in Biella, Italy.',
                'High-waisted with a fluid wide-leg silhouette.',
                'Complimentary express shipping and returns.',
                'Pleated Virgin Wool Wide-Leg Trousers | LUCEVALIE',
                'Discover LUCEVALIE high-waisted trousers in Italian virgin wool.',
                true,
                false
            ),
            (
                'prod-m-shoes-07',
                'LV-M26-SH07-SUEDE',
                'hand-stitched-suede-penny-loafers',
                'Hand-Stitched Suede Penny Loafers',
                'Velvety Italian Calfskin Suede',
                'Supple unlined suede loafers with hand-stitched aprons and flexible leather soles.',
                980::numeric,
                'footwear',
                'autumn-winter-2026',
                'men',
                '100% Italian Calfskin Suede with Leather Sole',
                array [
        'Protect with suede spray before wearing',
        'Store with shoe trees and dust bags'
      ]::text [],
                'Blake stitched and hand-finished in Montegranaro, Italy.',
                'Fits true to European size.',
                'Complimentary shipping with protective dust bags.',
                'Hand-Stitched Suede Penny Loafers | LUCEVALIE',
                'Discover LUCEVALIE hand-stitched Italian suede loafers.',
                true,
                true
            ),
            (
                'prod-w-acc-08',
                'LV-W26-AC08-SILK',
                'hand-hemmed-raw-silk-cashmere-wrap',
                'Hand-Hemmed Silk & Cashmere Wrap',
                'Whisper-Weight Hand-Loomed Jacquard',
                'A featherlight silk and cashmere wrap finished with delicate hand-rolled edges.',
                680::numeric,
                'accessories',
                'cashmere-atelier',
                'women',
                '55% Mulberry Silk, 45% Mongolian Cashmere',
                array [
        'Specialist dry clean only',
        'Store folded inside the provided box'
      ]::text [],
                'Woven on traditional wooden looms and hand-finished in Como, Italy.',
                'Dimensions: 140cm by 140cm.',
                'Complimentary luxury gift-box packaging.',
                'Hand-Hemmed Silk and Cashmere Wrap | LUCEVALIE',
                'Discover the LUCEVALIE hand-loomed silk and cashmere wrap.',
                false,
                true
            )
    ) as product_data(
        legacy_id,
        sku,
        slug,
        title,
        subtitle,
        description,
        price,
        category_slug,
        collection_slug,
        gender,
        material,
        care_instructions,
        craftsmanship_notes,
        fit_info,
        shipping_info,
        seo_title,
        seo_description,
        is_new_arrival,
        is_featured
    )
    join public.categories on categories.slug = product_data.category_slug
    join public.collections on collections.slug = product_data.collection_slug on conflict (slug) do
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
delete from public.product_images
where product_id in (
        select id
        from public.products
        where slug in (
                'silk-cashmere-ribbed-turtleneck',
                'pure-cashmere-seamless-crewneck',
                'pleated-virgin-wool-wide-leg-trousers',
                'hand-stitched-suede-penny-loafers',
                'hand-hemmed-raw-silk-cashmere-wrap'
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
                'silk-cashmere-ribbed-turtleneck',
                'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE silk cashmere ribbed turtleneck',
                1,
                true,
                false
            ),
            (
                'silk-cashmere-ribbed-turtleneck',
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE silk cashmere turtleneck detail',
                2,
                false,
                true
            ),
            (
                'pure-cashmere-seamless-crewneck',
                'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE pure cashmere crewneck',
                1,
                true,
                false
            ),
            (
                'pure-cashmere-seamless-crewneck',
                'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE cashmere crewneck detail',
                2,
                false,
                true
            ),
            (
                'pleated-virgin-wool-wide-leg-trousers',
                'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE pleated virgin wool trousers',
                1,
                true,
                false
            ),
            (
                'pleated-virgin-wool-wide-leg-trousers',
                'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE wide-leg trousers detail',
                2,
                false,
                true
            ),
            (
                'hand-stitched-suede-penny-loafers',
                'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE hand-stitched suede loafers',
                1,
                true,
                false
            ),
            (
                'hand-hemmed-raw-silk-cashmere-wrap',
                'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1400&auto=format&fit=crop',
                'LUCEVALIE silk and cashmere wrap',
                1,
                true,
                false
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
                'v-02-s',
                'silk-cashmere-ribbed-turtleneck',
                'LV-W26-KN02-CRM-S',
                'Warm Cream / S',
                'Warm Cream',
                '#F7F3EC',
                'white',
                'S',
                1450::numeric,
                8
            ),
            (
                'v-02-m',
                'silk-cashmere-ribbed-turtleneck',
                'LV-W26-KN02-CRM-M',
                'Warm Cream / M',
                'Warm Cream',
                '#F7F3EC',
                'white',
                'M',
                1450::numeric,
                12
            ),
            (
                'v-05-m',
                'pure-cashmere-seamless-crewneck',
                'LV-M26-KN05-M',
                'Natural Taupe / M',
                'Natural Taupe',
                '#A3998C',
                'neutral',
                'M',
                1680::numeric,
                7
            ),
            (
                'v-05-l',
                'pure-cashmere-seamless-crewneck',
                'LV-M26-KN05-L',
                'Natural Taupe / L',
                'Natural Taupe',
                '#A3998C',
                'neutral',
                'L',
                1680::numeric,
                5
            ),
            (
                'v-06-38',
                'pleated-virgin-wool-wide-leg-trousers',
                'LV-W26-TR06-38',
                'Warm Ivory / 38',
                'Warm Ivory',
                '#FAF6EE',
                'white',
                '38',
                1250::numeric,
                4
            ),
            (
                'v-07-42',
                'hand-stitched-suede-penny-loafers',
                'LV-M26-SH07-42',
                'Warm Tobacco / 42',
                'Warm Tobacco',
                '#875338',
                'brown',
                '42',
                980::numeric,
                6
            ),
            (
                'v-08-os',
                'hand-hemmed-raw-silk-cashmere-wrap',
                'LV-W26-AC08-OS',
                'Parchment Rose / One Size',
                'Parchment Rose',
                '#E0D2C7',
                'neutral',
                'One Size',
                680::numeric,
                10
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