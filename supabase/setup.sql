-- =============================================================================
--  CICERO — database setup
--  Paste this whole file into Supabase → SQL Editor → New query → Run.
--  Safe to run on a new project or on the existing Lucevalie database, and safe
--  to run again later: it never overwrites products you create in the admin.
-- =============================================================================
begin;

-- ======== 01_catalog.sql ========
-- Automatically maintains updated_at timestamps.
create or replace function public.set_updated_at() returns trigger language plpgsql
set search_path = '' as $$ begin new.updated_at = now();
return new;
end;
$$;
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    legacy_id text unique,
    slug text not null unique,
    name text not null,
    gender text not null default 'all' check (gender in ('women', 'men', 'all')),
    description text,
    hero_image_url text,
    sort_order integer not null default 0,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
create table if not exists public.collections (
    id uuid primary key default gen_random_uuid(),
    legacy_id text unique,
    slug text not null unique,
    name text not null,
    season text,
    description text,
    story_quote text,
    hero_image_url text,
    sort_order integer not null default 0,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    legacy_id text unique,
    sku text not null unique,
    slug text not null unique,
    title text not null,
    subtitle text,
    description text not null,
    price numeric(12, 2) not null check (price >= 0),
    compare_at_price numeric(12, 2) check (
        compare_at_price is null
        or compare_at_price >= price
    ),
    currency text not null default 'USD' check (currency in ('USD', 'EUR', 'GBP', 'JPY', 'AED')),
    category_id uuid references public.categories(id) on delete
    set null,
        collection_id uuid references public.collections(id) on delete
    set null,
        gender text not null check (gender in ('women', 'men', 'unisex')),
        material text,
        care_instructions text [] not null default '{}',
        craftsmanship_notes text,
        fit_info text,
        shipping_info text,
        seo_title text,
        seo_description text,
        is_new_arrival boolean not null default false,
        is_featured boolean not null default false,
        is_bestseller boolean not null default false,
        related_product_slugs text [] not null default '{}',
        complete_the_look_slugs text [] not null default '{}',
        status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
        published_at timestamptz,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
create table if not exists public.product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    url text not null,
    alt_text text not null,
    width integer check (
        width is null
        or width > 0
    ),
    height integer check (
        height is null
        or height > 0
    ),
    position integer not null default 0,
    is_primary boolean not null default false,
    is_hover boolean not null default false,
    created_at timestamptz not null default now()
);
create table if not exists public.product_variants (
    id uuid primary key default gen_random_uuid(),
    legacy_id text unique,
    product_id uuid not null references public.products(id) on delete cascade,
    sku text not null unique,
    name text not null,
    color text not null,
    color_hex text not null,
    color_family text not null check (
        color_family in (
            'neutral',
            'brown',
            'black',
            'white',
            'blue',
            'grey'
        )
    ),
    size text not null,
    price numeric(12, 2) not null check (price >= 0),
    compare_at_price numeric(12, 2) check (
        compare_at_price is null
        or compare_at_price >= price
    ),
    inventory_quantity integer not null default 0 check (inventory_quantity >= 0),
    is_active boolean not null default true,
    image_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (product_id, color, size)
);
create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_collection_id_idx on public.products(collection_id);
create index if not exists products_gender_idx on public.products(gender);
create index if not exists products_status_idx on public.products(status);
create index if not exists product_images_product_id_idx on public.product_images(product_id);
create index if not exists product_variants_product_id_idx on public.product_variants(product_id);
drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before
update on public.categories for each row execute function public.set_updated_at();
drop trigger if exists collections_set_updated_at on public.collections;
create trigger collections_set_updated_at before
update on public.collections for each row execute function public.set_updated_at();
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before
update on public.products for each row execute function public.set_updated_at();
drop trigger if exists product_variants_set_updated_at on public.product_variants;
create trigger product_variants_set_updated_at before
update on public.product_variants for each row execute function public.set_updated_at();
-- Secure every public table with Row Level Security.
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
-- Visitors can read catalog data but cannot modify it.
revoke all on table public.categories,
public.collections,
public.products,
public.product_images,
public.product_variants
from anon,
    authenticated;
grant select on table public.categories,
    public.collections,
    public.products,
    public.product_images,
    public.product_variants to anon,
    authenticated;
drop policy if exists "Public can view active categories" on public.categories;
create policy "Public can view active categories" on public.categories for
select to anon,
    authenticated using (is_active = true);
drop policy if exists "Public can view active collections" on public.collections;
create policy "Public can view active collections" on public.collections for
select to anon,
    authenticated using (is_active = true);
drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products" on public.products for
select to anon,
    authenticated using (status = 'active');
drop policy if exists "Public can view active product images" on public.product_images;
create policy "Public can view active product images" on public.product_images for
select to anon,
    authenticated using (
        exists (
            select 1
            from public.products
            where products.id = product_images.product_id
                and products.status = 'active'
        )
    );
drop policy if exists "Public can view active product variants" on public.product_variants;
create policy "Public can view active product variants" on public.product_variants for
select to anon,
    authenticated using (
        is_active = true
        and exists (
            select 1
            from public.products
            where products.id = product_variants.product_id
                and products.status = 'active'
        )
    );

-- ======== 02_orders.sql ========
create sequence if not exists public.order_number_seq start with 100001 increment by 1;
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    order_number text not null unique default (
        'LV-' || lpad(nextval('public.order_number_seq')::text, 8, '0')
    ),
    customer_id uuid references auth.users(id) on delete
    set null,
        customer_email text not null,
        customer_first_name text not null,
        customer_last_name text not null,
        customer_phone text,
        shipping_address jsonb not null default '{}'::jsonb,
        billing_address jsonb,
        shipping_method text not null default 'express' check (shipping_method in ('express', 'same-day')),
        currency text not null default 'USD' check (currency in ('USD', 'EUR', 'GBP', 'JPY', 'AED')),
        subtotal_amount integer not null check (subtotal_amount >= 0),
        discount_amount integer not null default 0 check (discount_amount >= 0),
        shipping_amount integer not null default 0 check (shipping_amount >= 0),
        tax_amount integer not null default 0 check (tax_amount >= 0),
        total_amount integer not null check (total_amount >= 0),
        promo_code text,
        is_gift_wrapped boolean not null default false,
        gift_message text,
        status text not null default 'pending' check (
            status in (
                'pending',
                'confirmed',
                'cancelled',
                'refunded'
            )
        ),
        payment_status text not null default 'unpaid' check (
            payment_status in (
                'unpaid',
                'processing',
                'paid',
                'failed',
                'refunded',
                'partially_refunded'
            )
        ),
        fulfillment_status text not null default 'unfulfilled' check (
            fulfillment_status in (
                'unfulfilled',
                'processing',
                'shipped',
                'delivered',
                'returned',
                'cancelled'
            )
        ),
        stripe_checkout_session_id text,
        stripe_payment_intent_id text,
        stripe_customer_id text,
        expires_at timestamptz,
        paid_at timestamptz,
        cancelled_at timestamptz,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        check (
            total_amount = greatest(
                0,
                subtotal_amount - discount_amount + shipping_amount + tax_amount
            )
        )
);
create unique index if not exists orders_stripe_session_unique on public.orders (stripe_checkout_session_id)
where stripe_checkout_session_id is not null;
create unique index if not exists orders_payment_intent_unique on public.orders (stripe_payment_intent_id)
where stripe_payment_intent_id is not null;
create index if not exists orders_customer_email_idx on public.orders (lower(customer_email));
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete
    set null,
        variant_id uuid references public.product_variants(id) on delete
    set null,
        sku text not null,
        product_slug text not null,
        title text not null,
        color text not null,
        size text not null,
        image_url text,
        unit_amount integer not null check (unit_amount >= 0),
        quantity integer not null check (
            quantity between 1 and 20
        ),
        line_total_amount integer generated always as (unit_amount * quantity) stored,
        created_at timestamptz not null default now(),
        unique (order_id, sku)
);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_items_variant_id_idx on public.order_items (variant_id);
create table if not exists public.inventory_reservations (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    variant_id uuid not null references public.product_variants(id) on delete restrict,
    quantity integer not null check (quantity > 0),
    status text not null default 'active' check (status in ('active', 'converted', 'released')),
    expires_at timestamptz not null,
    converted_at timestamptz,
    released_at timestamptz,
    created_at timestamptz not null default now(),
    unique (order_id, variant_id)
);
create index if not exists inventory_reservations_active_idx on public.inventory_reservations (expires_at)
where status = 'active';
create table if not exists public.stripe_webhook_events (
    stripe_event_id text primary key,
    event_type text not null,
    object_id text,
    livemode boolean not null default false,
    processing_status text not null default 'processing' check (
        processing_status in ('processing', 'completed', 'failed')
    ),
    error_message text,
    received_at timestamptz not null default now(),
    processed_at timestamptz
);
create or replace function public.reserve_order_inventory(p_order_id uuid) returns void language plpgsql security definer
set search_path = '' as $$
declare order_record record;
item_record record;
begin
select id,
    status,
    expires_at into order_record
from public.orders
where id = p_order_id for
update;
if not found then raise exception 'Order not found';
end if;
if order_record.status <> 'pending' then raise exception 'Order is not pending';
end if;
if exists (
    select 1
    from public.inventory_reservations
    where order_id = p_order_id
        and status = 'active'
) then return;
end if;
if not exists (
    select 1
    from public.order_items
    where order_id = p_order_id
) then raise exception 'Order has no items';
end if;
for item_record in
select variant_id,
    quantity
from public.order_items
where order_id = p_order_id
order by variant_id loop if item_record.variant_id is null then raise exception 'Order item has no active variant';
end if;
update public.product_variants
set inventory_quantity = inventory_quantity - item_record.quantity,
    updated_at = now()
where id = item_record.variant_id
    and is_active = true
    and inventory_quantity >= item_record.quantity;
if not found then raise exception 'Insufficient inventory for variant %',
item_record.variant_id;
end if;
insert into public.inventory_reservations (
        order_id,
        variant_id,
        quantity,
        expires_at
    )
values (
        p_order_id,
        item_record.variant_id,
        item_record.quantity,
        coalesce(
            order_record.expires_at,
            now() + interval '30 minutes'
        )
    );
end loop;
end;
$$;
create or replace function public.release_order_inventory(p_order_id uuid) returns void language plpgsql security definer
set search_path = '' as $$
declare reservation_record record;
begin for reservation_record in
select id,
    variant_id,
    quantity
from public.inventory_reservations
where order_id = p_order_id
    and status = 'active'
order by variant_id for
update loop
update public.product_variants
set inventory_quantity = inventory_quantity + reservation_record.quantity,
    updated_at = now()
where id = reservation_record.variant_id;
update public.inventory_reservations
set status = 'released',
    released_at = now()
where id = reservation_record.id;
end loop;
update public.orders
set status = 'cancelled',
    fulfillment_status = 'cancelled',
    cancelled_at = now(),
    updated_at = now()
where id = p_order_id
    and payment_status <> 'paid';
end;
$$;
create or replace function public.confirm_order_payment(
        p_order_id uuid,
        p_checkout_session_id text,
        p_payment_intent_id text,
        p_stripe_customer_id text default null
    ) returns void language plpgsql security definer
set search_path = '' as $$ begin perform 1
from public.orders
where id = p_order_id for
update;
if not found then raise exception 'Order not found';
end if;
if exists (
    select 1
    from public.orders
    where id = p_order_id
        and payment_status = 'paid'
) then return;
end if;
if not exists (
    select 1
    from public.inventory_reservations
    where order_id = p_order_id
        and status = 'active'
) then raise exception 'No active inventory reservation';
end if;
update public.inventory_reservations
set status = 'converted',
    converted_at = now()
where order_id = p_order_id
    and status = 'active';
update public.orders
set status = 'confirmed',
    payment_status = 'paid',
    stripe_checkout_session_id = p_checkout_session_id,
    stripe_payment_intent_id = p_payment_intent_id,
    stripe_customer_id = p_stripe_customer_id,
    paid_at = now(),
    updated_at = now()
where id = p_order_id;
end;
$$;
drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before
update on public.orders for each row execute function public.set_updated_at();
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_reservations enable row level security;
alter table public.stripe_webhook_events enable row level security;
revoke all on table public.orders
from anon,
    authenticated;
revoke all on table public.order_items
from anon,
    authenticated;
revoke all on table public.inventory_reservations
from anon,
    authenticated;
revoke all on table public.stripe_webhook_events
from anon,
    authenticated;
revoke all on sequence public.order_number_seq
from anon,
    authenticated;
revoke all on function public.reserve_order_inventory(uuid)
from public,
    anon,
    authenticated;
revoke all on function public.release_order_inventory(uuid)
from public,
    anon,
    authenticated;
revoke all on function public.confirm_order_payment(uuid, text, text, text)
from public,
    anon,
    authenticated;
grant execute on function public.reserve_order_inventory(uuid) to service_role;
grant execute on function public.release_order_inventory(uuid) to service_role;
grant execute on function public.confirm_order_payment(uuid, text, text, text) to service_role;

-- ======== 03_cicero.sql ========
-- ---------------------------------------------------------------------------
-- CICERO additions: admin portal, settings, discounts, storage, order fields
-- ---------------------------------------------------------------------------

-- Wider colour palette for outerwear & knitwear.
alter table public.product_variants drop constraint if exists product_variants_color_family_check;
alter table public.product_variants add constraint product_variants_color_family_check
  check (color_family in ('neutral','brown','black','white','blue','grey','green','red','beige'));

-- Inventory may be tracked without a hex colour.
alter table public.product_variants alter column color_hex set default '#1A1A1A';

-- Orders: fulfilment details managed from the admin portal.
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists tracking_url text;
alter table public.orders add column if not exists admin_notes text;
alter table public.orders add column if not exists shipped_at timestamptz;
alter table public.orders add column if not exists delivered_at timestamptz;

alter table public.orders drop constraint if exists orders_shipping_method_check;
alter table public.orders add constraint orders_shipping_method_check
  check (shipping_method in ('standard', 'express', 'same-day'));
alter table public.orders alter column shipping_method set default 'standard';

-- Cicero order numbers: CC-00100001
alter table public.orders alter column order_number
  set default ('CC-' || lpad(nextval('public.order_number_seq')::text, 8, '0'));

-- ---------------------------------------------------------------------------
-- Admin team (in addition to the owner emails in the ADMIN_EMAILS env var)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'staff' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Store settings (single row, edited from Admin → Settings)
-- ---------------------------------------------------------------------------
create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  store_name text not null default 'Cicero',
  tagline text not null default 'Outerwear & Knitwear',
  announcement_enabled boolean not null default true,
  announcement_text text not null default 'Free shipping on orders over $300',
  hero_eyebrow text not null default 'Autumn / Winter Campaign',
  hero_title text not null default 'CICERO',
  hero_subtitle text not null default 'Wool coats, jackets and knitwear cut for the cold months.',
  hero_image_url text,
  hero_cta_label text not null default 'Shop the collection',
  hero_cta_href text not null default '/shop',
  standard_shipping_amount integer not null default 1500 check (standard_shipping_amount >= 0),
  express_shipping_amount integer not null default 3500 check (express_shipping_amount >= 0),
  free_shipping_threshold integer check (free_shipping_threshold is null or free_shipping_threshold >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  contact_email text not null default 'care@cicero.store',
  contact_phone text,
  instagram_url text,
  tiktok_url text,
  updated_at timestamptz not null default now()
);
alter table public.store_settings add column if not exists free_shipping_threshold integer;
insert into public.store_settings (id, free_shipping_threshold) values (1, 30000) on conflict (id) do nothing;

drop trigger if exists store_settings_set_updated_at on public.store_settings;
create trigger store_settings_set_updated_at before update on public.store_settings
  for each row execute function public.set_updated_at();

alter table public.store_settings enable row level security;
revoke all on table public.store_settings from anon, authenticated;
grant select on table public.store_settings to anon, authenticated;
drop policy if exists "Public can read store settings" on public.store_settings;
create policy "Public can read store settings" on public.store_settings
  for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- Discount codes (Admin → Discounts)
-- ---------------------------------------------------------------------------
create table if not exists public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code = upper(code) and code ~ '^[A-Z0-9_-]{2,40}$'),
  description text,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  value integer not null check (value > 0),          -- percent (1-100) or cents
  min_subtotal integer not null default 0 check (min_subtotal >= 0),
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  times_used integer not null default 0 check (times_used >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (discount_type <> 'percent' or value <= 100)
);
drop trigger if exists discount_codes_set_updated_at on public.discount_codes;
create trigger discount_codes_set_updated_at before update on public.discount_codes
  for each row execute function public.set_updated_at();
alter table public.discount_codes enable row level security;
revoke all on table public.discount_codes from anon, authenticated;

insert into public.discount_codes (code, description, discount_type, value, min_subtotal)
values ('WELCOME10', '10% off a first order', 'percent', 10, 0)
on conflict (code) do nothing;

-- Count a discount use when an order is paid.
create or replace function public.confirm_order_payment(
  p_order_id uuid,
  p_checkout_session_id text,
  p_payment_intent_id text,
  p_stripe_customer_id text default null
) returns void language plpgsql security definer set search_path = '' as $$
declare v_promo text;
begin
  perform 1 from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;

  if exists (select 1 from public.orders where id = p_order_id and payment_status = 'paid') then
    return;
  end if;

  if not exists (
    select 1 from public.inventory_reservations where order_id = p_order_id and status = 'active'
  ) then
    raise exception 'No active inventory reservation';
  end if;

  update public.inventory_reservations
     set status = 'converted', converted_at = now()
   where order_id = p_order_id and status = 'active';

  update public.orders
     set status = 'confirmed',
         payment_status = 'paid',
         stripe_checkout_session_id = p_checkout_session_id,
         stripe_payment_intent_id = p_payment_intent_id,
         stripe_customer_id = p_stripe_customer_id,
         paid_at = now(),
         updated_at = now()
   where id = p_order_id
   returning promo_code into v_promo;

  if v_promo is not null then
    update public.discount_codes set times_used = times_used + 1 where code = v_promo;
  end if;
end;
$$;
revoke all on function public.confirm_order_payment(uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.confirm_order_payment(uuid, text, text, text) to service_role;

-- ---------------------------------------------------------------------------
-- Storage bucket for product / category / campaign images (public read)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 10485760,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do update set public = true;

-- ---------------------------------------------------------------------------
-- Remove the old Lucevalie demo catalogue (only rows the old seed created).
-- Products you add in the admin portal are never touched by this file.
-- ---------------------------------------------------------------------------
delete from public.inventory_reservations r
 using public.product_variants v, public.products p
 where r.variant_id = v.id and v.product_id = p.id
   and p.legacy_id is not null and p.legacy_id not like 'cicero-%'
   and r.status <> 'active';

delete from public.products
 where legacy_id is not null and legacy_id not like 'cicero-%'
   and not exists (
     select 1 from public.inventory_reservations r
       join public.product_variants v on v.id = r.variant_id
      where v.product_id = products.id
   );

update public.products set status = 'archived'
 where legacy_id is not null and legacy_id not like 'cicero-%';

delete from public.categories c
 where c.legacy_id is not null and c.legacy_id not like 'cicero-%'
   and not exists (select 1 from public.products p where p.category_id = c.id);
delete from public.collections c
 where c.legacy_id is not null and c.legacy_id not like 'cicero-%'
   and not exists (select 1 from public.products p where p.collection_id = c.id);
update public.categories set is_active = false where legacy_id is not null and legacy_id not like 'cicero-%';
update public.collections set is_active = false where legacy_id is not null and legacy_id not like 'cicero-%';

-- ======== 04_seed.sql ========
-- Generated by supabase/gen_seed.py — Cicero starter catalogue
insert into public.categories (legacy_id, slug, name, gender, description, sort_order) values ('cicero-cat-coats', 'wool-coats', 'Wool Coats', 'all', 'Overcoats, topcoats and wrap coats in heavy wool and cashmere blends.', 1) on conflict do nothing;
insert into public.categories (legacy_id, slug, name, gender, description, sort_order) values ('cicero-cat-jackets', 'jackets', 'Jackets', 'all', 'Bombers, field jackets, leather and quilted layers.', 2) on conflict do nothing;
insert into public.categories (legacy_id, slug, name, gender, description, sort_order) values ('cicero-cat-sweaters', 'sweaters', 'Sweaters', 'all', 'Crewnecks, roll-necks and cable knits in merino and cashmere.', 3) on conflict do nothing;
insert into public.categories (legacy_id, slug, name, gender, description, sort_order) values ('cicero-cat-cardigans', 'cardigans', 'Cardigans', 'all', 'Button-through knitwear for layering.', 4) on conflict do nothing;
insert into public.collections (legacy_id, slug, name, season, description, story_quote, sort_order) values ('cicero-col-winter', 'winter-edit', 'The Winter Edit', 'AW26', 'Heavy wool outerwear built for the coldest weeks of the year.', 'Cut close to the body, built to last a decade.', 1) on conflict do nothing;
insert into public.collections (legacy_id, slug, name, season, description, story_quote, sort_order) values ('cicero-col-knits', 'essential-knits', 'Essential Knitwear', 'Core', 'The knitwear that anchors a cold-weather wardrobe.', 'Good knitwear is quiet. It just works.', 2) on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-m-01', 'CC-M-01', 'double-breasted-wool-overcoat', 'Double-Breasted Wool Overcoat', 'Heavy Italian wool, peak lapel', 'A six-button double-breasted overcoat cut from a dense 720g wool-cashmere cloth. Peak lapels, a full canvas front and a knee-skimming length make it the anchor of a winter wardrobe.', 690, null, 'USD',
  (select id from public.categories where slug = 'wool-coats'),
  (select id from public.collections where slug = 'winter-edit'),
  'men', '80% virgin wool, 20% cashmere. Viscose lining.', array['Dry clean only','Brush after wear with a soft garment brush','Hang on a wide shoulder hanger']::text[], 'Tailored fit through the shoulder with room for a knit underneath. Take your usual size.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Double-Breasted Wool Overcoat | Cicero', 'A six-button double-breasted overcoat cut from a dense 720g wool-cashmere cloth. Peak lapels, a full canvas front and a knee-skimming length make it the an', true, true, true, 'active', now() - interval '0 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-m-01-CHA-S', 'CC-M-01-CHA-S', 'Charcoal / S', 'Charcoal', '#3A3B3E', 'grey', 'S', 690::numeric, null::numeric, 1),
  ('cicero-m-01-CHA-M', 'CC-M-01-CHA-M', 'Charcoal / M', 'Charcoal', '#3A3B3E', 'grey', 'M', 690::numeric, null::numeric, 4),
  ('cicero-m-01-CHA-L', 'CC-M-01-CHA-L', 'Charcoal / L', 'Charcoal', '#3A3B3E', 'grey', 'L', 690::numeric, null::numeric, 7),
  ('cicero-m-01-CHA-XL', 'CC-M-01-CHA-XL', 'Charcoal / XL', 'Charcoal', '#3A3B3E', 'grey', 'XL', 690::numeric, null::numeric, 2),
  ('cicero-m-01-CAM-S', 'CC-M-01-CAM-S', 'Camel / S', 'Camel', '#B48A5E', 'brown', 'S', 690::numeric, null::numeric, 6),
  ('cicero-m-01-CAM-M', 'CC-M-01-CAM-M', 'Camel / M', 'Camel', '#B48A5E', 'brown', 'M', 690::numeric, null::numeric, 9),
  ('cicero-m-01-CAM-L', 'CC-M-01-CAM-L', 'Camel / L', 'Camel', '#B48A5E', 'brown', 'L', 690::numeric, null::numeric, 12),
  ('cicero-m-01-CAM-XL', 'CC-M-01-CAM-XL', 'Camel / XL', 'Camel', '#B48A5E', 'brown', 'XL', 690::numeric, null::numeric, 15),
  ('cicero-m-01-BLA-S', 'CC-M-01-BLA-S', 'Black / S', 'Black', '#111111', 'black', 'S', 690::numeric, null::numeric, 11),
  ('cicero-m-01-BLA-M', 'CC-M-01-BLA-M', 'Black / M', 'Black', '#111111', 'black', 'M', 690::numeric, null::numeric, 0),
  ('cicero-m-01-BLA-L', 'CC-M-01-BLA-L', 'Black / L', 'Black', '#111111', 'black', 'L', 690::numeric, null::numeric, 2),
  ('cicero-m-01-BLA-XL', 'CC-M-01-BLA-XL', 'Black / XL', 'Black', '#111111', 'black', 'XL', 690::numeric, null::numeric, 2)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-m-01'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-m-02', 'CC-M-02', 'single-breasted-wool-topcoat', 'Single-Breasted Wool Topcoat', 'Clean lines, concealed placket', 'A minimal topcoat in compact wool melton with a concealed button placket, notch lapel and slanted flap pockets. Sharp enough for tailoring, relaxed enough for denim.', 620, null, 'USD',
  (select id from public.categories where slug = 'wool-coats'),
  (select id from public.collections where slug = 'winter-edit'),
  'men', '100% virgin wool melton. Cupro lining.', array['Dry clean only','Brush after wear with a soft garment brush','Hang on a wide shoulder hanger']::text[], 'Regular fit. Size down for a closer silhouette.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Single-Breasted Wool Topcoat | Cicero', 'A minimal topcoat in compact wool melton with a concealed button placket, notch lapel and slanted flap pockets. Sharp enough for tailoring, relaxed enough ', true, false, false, 'active', now() - interval '1 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-m-02-NAV-S', 'CC-M-02-NAV-S', 'Navy / S', 'Navy', '#1E2A3F', 'blue', 'S', 620::numeric, null::numeric, 8),
  ('cicero-m-02-NAV-M', 'CC-M-02-NAV-M', 'Navy / M', 'Navy', '#1E2A3F', 'blue', 'M', 620::numeric, null::numeric, 11),
  ('cicero-m-02-NAV-L', 'CC-M-02-NAV-L', 'Navy / L', 'Navy', '#1E2A3F', 'blue', 'L', 620::numeric, null::numeric, 0),
  ('cicero-m-02-NAV-XL', 'CC-M-02-NAV-XL', 'Navy / XL', 'Navy', '#1E2A3F', 'blue', 'XL', 620::numeric, null::numeric, 2),
  ('cicero-m-02-OAT-S', 'CC-M-02-OAT-S', 'Oatmeal / S', 'Oatmeal', '#D8CDB8', 'beige', 'S', 620::numeric, null::numeric, 13),
  ('cicero-m-02-OAT-M', 'CC-M-02-OAT-M', 'Oatmeal / M', 'Oatmeal', '#D8CDB8', 'beige', 'M', 620::numeric, null::numeric, 1),
  ('cicero-m-02-OAT-L', 'CC-M-02-OAT-L', 'Oatmeal / L', 'Oatmeal', '#D8CDB8', 'beige', 'L', 620::numeric, null::numeric, 4),
  ('cicero-m-02-OAT-XL', 'CC-M-02-OAT-XL', 'Oatmeal / XL', 'Oatmeal', '#D8CDB8', 'beige', 'XL', 620::numeric, null::numeric, 7)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-m-02'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-m-03', 'CC-M-03', 'suede-bomber-jacket', 'Suede Bomber Jacket', 'Goat suede, ribbed trims', 'A soft goat-suede bomber with wool-blend ribbed collar, cuffs and hem, a two-way zip and an internal phone pocket. It softens and takes on character with every wear.', 540, 620, 'USD',
  (select id from public.categories where slug = 'jackets'),
  (select id from public.collections where slug = 'winter-edit'),
  'men', '100% goat suede. Wool-blend rib trims.', array['Specialist clean only','Store on a padded hanger','Keep away from prolonged direct sunlight']::text[], 'Relaxed fit, hip length.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Suede Bomber Jacket | Cicero', 'A soft goat-suede bomber with wool-blend ribbed collar, cuffs and hem, a two-way zip and an internal phone pocket. It softens and takes on character with e', true, true, false, 'active', now() - interval '2 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-m-03-TOB-S', 'CC-M-03-TOB-S', 'Tobacco / S', 'Tobacco', '#7A5236', 'brown', 'S', 540::numeric, 620::numeric, 15),
  ('cicero-m-03-TOB-M', 'CC-M-03-TOB-M', 'Tobacco / M', 'Tobacco', '#7A5236', 'brown', 'M', 540::numeric, 620::numeric, 3),
  ('cicero-m-03-TOB-L', 'CC-M-03-TOB-L', 'Tobacco / L', 'Tobacco', '#7A5236', 'brown', 'L', 540::numeric, 620::numeric, 6),
  ('cicero-m-03-TOB-XL', 'CC-M-03-TOB-XL', 'Tobacco / XL', 'Tobacco', '#7A5236', 'brown', 'XL', 540::numeric, 620::numeric, 9),
  ('cicero-m-03-BLA-S', 'CC-M-03-BLA-S', 'Black / S', 'Black', '#111111', 'black', 'S', 540::numeric, 620::numeric, 2),
  ('cicero-m-03-BLA-M', 'CC-M-03-BLA-M', 'Black / M', 'Black', '#111111', 'black', 'M', 540::numeric, 620::numeric, 8),
  ('cicero-m-03-BLA-L', 'CC-M-03-BLA-L', 'Black / L', 'Black', '#111111', 'black', 'L', 540::numeric, 620::numeric, 11),
  ('cicero-m-03-BLA-XL', 'CC-M-03-BLA-XL', 'Black / XL', 'Black', '#111111', 'black', 'XL', 540::numeric, 620::numeric, 0)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-m-03'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-m-04', 'CC-M-04', 'waxed-cotton-field-jacket', 'Waxed Cotton Field Jacket', 'Four pockets, corduroy collar', 'A weatherproof field jacket in British waxed cotton with four bellows pockets, a corduroy collar and a storm flap over a heavy brass zip.', 420, null, 'USD',
  (select id from public.categories where slug = 'jackets'),
  null,
  'men', '100% waxed cotton. Cotton check lining.', array['Specialist clean only','Store on a padded hanger','Keep away from prolonged direct sunlight']::text[], 'Regular fit with room for layering.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Waxed Cotton Field Jacket | Cicero', 'A weatherproof field jacket in British waxed cotton with four bellows pockets, a corduroy collar and a storm flap over a heavy brass zip.', false, false, true, 'active', now() - interval '3 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-m-04-OLI-S', 'CC-M-04-OLI-S', 'Olive / S', 'Olive', '#545A3A', 'green', 'S', 420::numeric, null::numeric, 7),
  ('cicero-m-04-OLI-M', 'CC-M-04-OLI-M', 'Olive / M', 'Olive', '#545A3A', 'green', 'M', 420::numeric, null::numeric, 2),
  ('cicero-m-04-OLI-L', 'CC-M-04-OLI-L', 'Olive / L', 'Olive', '#545A3A', 'green', 'L', 420::numeric, null::numeric, 13),
  ('cicero-m-04-OLI-XL', 'CC-M-04-OLI-XL', 'Olive / XL', 'Olive', '#545A3A', 'green', 'XL', 420::numeric, null::numeric, 1),
  ('cicero-m-04-NAV-S', 'CC-M-04-NAV-S', 'Navy / S', 'Navy', '#1E2A3F', 'blue', 'S', 420::numeric, null::numeric, 12),
  ('cicero-m-04-NAV-M', 'CC-M-04-NAV-M', 'Navy / M', 'Navy', '#1E2A3F', 'blue', 'M', 420::numeric, null::numeric, 15),
  ('cicero-m-04-NAV-L', 'CC-M-04-NAV-L', 'Navy / L', 'Navy', '#1E2A3F', 'blue', 'L', 420::numeric, null::numeric, 3),
  ('cicero-m-04-NAV-XL', 'CC-M-04-NAV-XL', 'Navy / XL', 'Navy', '#1E2A3F', 'blue', 'XL', 420::numeric, null::numeric, 6)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-m-04'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-m-05', 'CC-M-05', 'quilted-liner-jacket', 'Quilted Liner Jacket', 'Lightweight, diamond quilted', 'A featherweight diamond-quilted liner with snap closures and a collarless neck. Wear it alone in autumn, or under an overcoat when the temperature drops.', 320, null, 'USD',
  (select id from public.categories where slug = 'jackets'),
  null,
  'men', 'Recycled nylon shell, recycled polyester fill.', array['Specialist clean only','Store on a padded hanger','Keep away from prolonged direct sunlight']::text[], 'Slim fit — wear alone or under a coat.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Quilted Liner Jacket | Cicero', 'A featherweight diamond-quilted liner with snap closures and a collarless neck. Wear it alone in autumn, or under an overcoat when the temperature drops.', false, false, false, 'active', now() - interval '4 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-m-05-BLA-S', 'CC-M-05-BLA-S', 'Black / S', 'Black', '#111111', 'black', 'S', 320::numeric, null::numeric, 0),
  ('cicero-m-05-BLA-M', 'CC-M-05-BLA-M', 'Black / M', 'Black', '#111111', 'black', 'M', 320::numeric, null::numeric, 2),
  ('cicero-m-05-BLA-L', 'CC-M-05-BLA-L', 'Black / L', 'Black', '#111111', 'black', 'L', 320::numeric, null::numeric, 2),
  ('cicero-m-05-BLA-XL', 'CC-M-05-BLA-XL', 'Black / XL', 'Black', '#111111', 'black', 'XL', 320::numeric, null::numeric, 8),
  ('cicero-m-05-STO-S', 'CC-M-05-STO-S', 'Stone / S', 'Stone', '#B9B2A5', 'neutral', 'S', 320::numeric, null::numeric, 4),
  ('cicero-m-05-STO-M', 'CC-M-05-STO-M', 'Stone / M', 'Stone', '#B9B2A5', 'neutral', 'M', 320::numeric, null::numeric, 7),
  ('cicero-m-05-STO-L', 'CC-M-05-STO-L', 'Stone / L', 'Stone', '#B9B2A5', 'neutral', 'L', 320::numeric, null::numeric, 2),
  ('cicero-m-05-STO-XL', 'CC-M-05-STO-XL', 'Stone / XL', 'Stone', '#B9B2A5', 'neutral', 'XL', 320::numeric, null::numeric, 13)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-m-05'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-m-06', 'CC-M-06', 'merino-crewneck-sweater', 'Merino Crewneck Sweater', 'Extra-fine 12-gauge merino', 'The everyday crewneck, knitted from extra-fine merino at 12 gauge for a smooth, light handle. Fully fashioned shoulders and ribbed trims keep the shape wash after wash.', 190, null, 'USD',
  (select id from public.categories where slug = 'sweaters'),
  (select id from public.collections where slug = 'essential-knits'),
  'men', '100% extra-fine merino wool.', array['Hand wash cold or dry clean','Dry flat away from direct heat','Fold — never hang knitwear']::text[], 'Regular fit. True to size.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Merino Crewneck Sweater | Cicero', 'The everyday crewneck, knitted from extra-fine merino at 12 gauge for a smooth, light handle. Fully fashioned shoulders and ribbed trims keep the shape was', false, true, true, 'active', now() - interval '5 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-m-06-CHA-S', 'CC-M-06-CHA-S', 'Charcoal / S', 'Charcoal', '#3A3B3E', 'grey', 'S', 190::numeric, null::numeric, 6),
  ('cicero-m-06-CHA-M', 'CC-M-06-CHA-M', 'Charcoal / M', 'Charcoal', '#3A3B3E', 'grey', 'M', 190::numeric, null::numeric, 9),
  ('cicero-m-06-CHA-L', 'CC-M-06-CHA-L', 'Charcoal / L', 'Charcoal', '#3A3B3E', 'grey', 'L', 190::numeric, null::numeric, 12),
  ('cicero-m-06-CHA-XL', 'CC-M-06-CHA-XL', 'Charcoal / XL', 'Charcoal', '#3A3B3E', 'grey', 'XL', 190::numeric, null::numeric, 15),
  ('cicero-m-06-NAV-S', 'CC-M-06-NAV-S', 'Navy / S', 'Navy', '#1E2A3F', 'blue', 'S', 190::numeric, null::numeric, 11),
  ('cicero-m-06-NAV-M', 'CC-M-06-NAV-M', 'Navy / M', 'Navy', '#1E2A3F', 'blue', 'M', 190::numeric, null::numeric, 0),
  ('cicero-m-06-NAV-L', 'CC-M-06-NAV-L', 'Navy / L', 'Navy', '#1E2A3F', 'blue', 'L', 190::numeric, null::numeric, 2),
  ('cicero-m-06-NAV-XL', 'CC-M-06-NAV-XL', 'Navy / XL', 'Navy', '#1E2A3F', 'blue', 'XL', 190::numeric, null::numeric, 2),
  ('cicero-m-06-ECR-S', 'CC-M-06-ECR-S', 'Ecru / S', 'Ecru', '#EDE6D6', 'white', 'S', 190::numeric, null::numeric, 1),
  ('cicero-m-06-ECR-M', 'CC-M-06-ECR-M', 'Ecru / M', 'Ecru', '#EDE6D6', 'white', 'M', 190::numeric, null::numeric, 4),
  ('cicero-m-06-ECR-L', 'CC-M-06-ECR-L', 'Ecru / L', 'Ecru', '#EDE6D6', 'white', 'L', 190::numeric, null::numeric, 7),
  ('cicero-m-06-ECR-XL', 'CC-M-06-ECR-XL', 'Ecru / XL', 'Ecru', '#EDE6D6', 'white', 'XL', 190::numeric, null::numeric, 2)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-m-06'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-m-07', 'CC-M-07', 'chunky-cable-knit-sweater', 'Chunky Cable-Knit Sweater', 'Hand-framed Aran cables', 'A heavyweight fisherman sweater with traditional Aran cables, knitted on hand frames from a lofty lambswool and alpaca yarn.', 260, null, 'USD',
  (select id from public.categories where slug = 'sweaters'),
  (select id from public.collections where slug = 'essential-knits'),
  'men', '70% lambswool, 30% alpaca.', array['Hand wash cold or dry clean','Dry flat away from direct heat','Fold — never hang knitwear']::text[], 'Relaxed, slightly boxy fit.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Chunky Cable-Knit Sweater | Cicero', 'A heavyweight fisherman sweater with traditional Aran cables, knitted on hand frames from a lofty lambswool and alpaca yarn.', true, false, false, 'active', now() - interval '6 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-m-07-ECR-S', 'CC-M-07-ECR-S', 'Ecru / S', 'Ecru', '#EDE6D6', 'white', 'S', 260::numeric, null::numeric, 13),
  ('cicero-m-07-ECR-M', 'CC-M-07-ECR-M', 'Ecru / M', 'Ecru', '#EDE6D6', 'white', 'M', 260::numeric, null::numeric, 1),
  ('cicero-m-07-ECR-L', 'CC-M-07-ECR-L', 'Ecru / L', 'Ecru', '#EDE6D6', 'white', 'L', 260::numeric, null::numeric, 4),
  ('cicero-m-07-ECR-XL', 'CC-M-07-ECR-XL', 'Ecru / XL', 'Ecru', '#EDE6D6', 'white', 'XL', 260::numeric, null::numeric, 7),
  ('cicero-m-07-FOR-S', 'CC-M-07-FOR-S', 'Forest / S', 'Forest', '#2F4434', 'green', 'S', 260::numeric, null::numeric, 3),
  ('cicero-m-07-FOR-M', 'CC-M-07-FOR-M', 'Forest / M', 'Forest', '#2F4434', 'green', 'M', 260::numeric, null::numeric, 6),
  ('cicero-m-07-FOR-L', 'CC-M-07-FOR-L', 'Forest / L', 'Forest', '#2F4434', 'green', 'L', 260::numeric, null::numeric, 9),
  ('cicero-m-07-FOR-XL', 'CC-M-07-FOR-XL', 'Forest / XL', 'Forest', '#2F4434', 'green', 'XL', 260::numeric, null::numeric, 12)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-m-07'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-m-08', 'CC-M-08', 'cashmere-roll-neck', 'Cashmere Roll-Neck', 'Two-ply Mongolian cashmere', 'A two-ply cashmere roll-neck with a deep folded collar. Light enough to wear under a coat, warm enough to wear on its own.', 340, null, 'USD',
  (select id from public.categories where slug = 'sweaters'),
  (select id from public.collections where slug = 'essential-knits'),
  'men', '100% Mongolian cashmere.', array['Hand wash cold or dry clean','Dry flat away from direct heat','Fold — never hang knitwear']::text[], 'Slim fit. Size up for a relaxed look.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Cashmere Roll-Neck | Cicero', 'A two-ply cashmere roll-neck with a deep folded collar. Light enough to wear under a coat, warm enough to wear on its own.', false, true, false, 'active', now() - interval '7 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-m-08-BLA-S', 'CC-M-08-BLA-S', 'Black / S', 'Black', '#111111', 'black', 'S', 340::numeric, null::numeric, 2),
  ('cicero-m-08-BLA-M', 'CC-M-08-BLA-M', 'Black / M', 'Black', '#111111', 'black', 'M', 340::numeric, null::numeric, 8),
  ('cicero-m-08-BLA-L', 'CC-M-08-BLA-L', 'Black / L', 'Black', '#111111', 'black', 'L', 340::numeric, null::numeric, 11),
  ('cicero-m-08-BLA-XL', 'CC-M-08-BLA-XL', 'Black / XL', 'Black', '#111111', 'black', 'XL', 340::numeric, null::numeric, 0),
  ('cicero-m-08-CAM-S', 'CC-M-08-CAM-S', 'Camel / S', 'Camel', '#B48A5E', 'brown', 'S', 340::numeric, null::numeric, 2),
  ('cicero-m-08-CAM-M', 'CC-M-08-CAM-M', 'Camel / M', 'Camel', '#B48A5E', 'brown', 'M', 340::numeric, null::numeric, 13),
  ('cicero-m-08-CAM-L', 'CC-M-08-CAM-L', 'Camel / L', 'Camel', '#B48A5E', 'brown', 'L', 340::numeric, null::numeric, 1),
  ('cicero-m-08-CAM-XL', 'CC-M-08-CAM-XL', 'Camel / XL', 'Camel', '#B48A5E', 'brown', 'XL', 340::numeric, null::numeric, 4)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-m-08'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-m-09', 'CC-M-09', 'shawl-collar-cardigan', 'Shawl-Collar Cardigan', 'Horn buttons, patch pockets', 'A chunky shawl-collar cardigan in rib-stitch lambswool with genuine horn buttons and two patch pockets.', 280, null, 'USD',
  (select id from public.categories where slug = 'cardigans'),
  (select id from public.collections where slug = 'essential-knits'),
  'men', '100% lambswool.', array['Hand wash cold or dry clean','Dry flat away from direct heat','Fold — never hang knitwear']::text[], 'Regular fit.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Shawl-Collar Cardigan | Cicero', 'A chunky shawl-collar cardigan in rib-stitch lambswool with genuine horn buttons and two patch pockets.', false, false, false, 'active', now() - interval '8 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-m-09-CHA-S', 'CC-M-09-CHA-S', 'Charcoal / S', 'Charcoal', '#3A3B3E', 'grey', 'S', 280::numeric, null::numeric, 12),
  ('cicero-m-09-CHA-M', 'CC-M-09-CHA-M', 'Charcoal / M', 'Charcoal', '#3A3B3E', 'grey', 'M', 280::numeric, null::numeric, 15),
  ('cicero-m-09-CHA-L', 'CC-M-09-CHA-L', 'Charcoal / L', 'Charcoal', '#3A3B3E', 'grey', 'L', 280::numeric, null::numeric, 3),
  ('cicero-m-09-CHA-XL', 'CC-M-09-CHA-XL', 'Charcoal / XL', 'Charcoal', '#3A3B3E', 'grey', 'XL', 280::numeric, null::numeric, 6),
  ('cicero-m-09-OAT-S', 'CC-M-09-OAT-S', 'Oatmeal / S', 'Oatmeal', '#D8CDB8', 'beige', 'S', 280::numeric, null::numeric, 2),
  ('cicero-m-09-OAT-M', 'CC-M-09-OAT-M', 'Oatmeal / M', 'Oatmeal', '#D8CDB8', 'beige', 'M', 280::numeric, null::numeric, 2),
  ('cicero-m-09-OAT-L', 'CC-M-09-OAT-L', 'Oatmeal / L', 'Oatmeal', '#D8CDB8', 'beige', 'L', 280::numeric, null::numeric, 8),
  ('cicero-m-09-OAT-XL', 'CC-M-09-OAT-XL', 'Oatmeal / XL', 'Oatmeal', '#D8CDB8', 'beige', 'XL', 280::numeric, null::numeric, 11)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-m-09'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-w-01', 'CC-W-01', 'belted-wrap-wool-coat', 'Belted Wrap Wool Coat', 'Double-faced wool, tie belt', 'An unlined, hand-finished wrap coat in double-faced wool and cashmere. Dropped shoulders, a shawl lapel and a self-tie belt give an easy, enveloping shape.', 650, null, 'USD',
  (select id from public.categories where slug = 'wool-coats'),
  (select id from public.collections where slug = 'winter-edit'),
  'women', '90% wool, 10% cashmere, double-faced.', array['Dry clean only','Brush after wear with a soft garment brush','Hang on a wide shoulder hanger']::text[], 'Relaxed wrap silhouette. Take your usual size.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Belted Wrap Wool Coat | Cicero', 'An unlined, hand-finished wrap coat in double-faced wool and cashmere. Dropped shoulders, a shawl lapel and a self-tie belt give an easy, enveloping shape.', true, true, true, 'active', now() - interval '9 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-w-01-CAM-XS', 'CC-W-01-CAM-XS', 'Camel / XS', 'Camel', '#B48A5E', 'brown', 'XS', 650::numeric, null::numeric, 4),
  ('cicero-w-01-CAM-S', 'CC-W-01-CAM-S', 'Camel / S', 'Camel', '#B48A5E', 'brown', 'S', 650::numeric, null::numeric, 7),
  ('cicero-w-01-CAM-M', 'CC-W-01-CAM-M', 'Camel / M', 'Camel', '#B48A5E', 'brown', 'M', 650::numeric, null::numeric, 2),
  ('cicero-w-01-CAM-L', 'CC-W-01-CAM-L', 'Camel / L', 'Camel', '#B48A5E', 'brown', 'L', 650::numeric, null::numeric, 13),
  ('cicero-w-01-BLA-XS', 'CC-W-01-BLA-XS', 'Black / XS', 'Black', '#111111', 'black', 'XS', 650::numeric, null::numeric, 9),
  ('cicero-w-01-BLA-S', 'CC-W-01-BLA-S', 'Black / S', 'Black', '#111111', 'black', 'S', 650::numeric, null::numeric, 12),
  ('cicero-w-01-BLA-M', 'CC-W-01-BLA-M', 'Black / M', 'Black', '#111111', 'black', 'M', 650::numeric, null::numeric, 15),
  ('cicero-w-01-BLA-L', 'CC-W-01-BLA-L', 'Black / L', 'Black', '#111111', 'black', 'L', 650::numeric, null::numeric, 3)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-w-01'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-w-02', 'CC-W-02', 'oversized-double-breasted-coat', 'Oversized Double-Breasted Coat', 'Strong shoulder, maxi length', 'A strong-shouldered, maxi-length double-breasted coat in a textured wool herringbone. Architectural, dramatic and very warm.', 720, null, 'USD',
  (select id from public.categories where slug = 'wool-coats'),
  (select id from public.collections where slug = 'winter-edit'),
  'women', '100% virgin wool herringbone. Viscose lining.', array['Dry clean only','Brush after wear with a soft garment brush','Hang on a wide shoulder hanger']::text[], 'Oversized by design. Size down for a closer fit.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Oversized Double-Breasted Coat | Cicero', 'A strong-shouldered, maxi-length double-breasted coat in a textured wool herringbone. Architectural, dramatic and very warm.', true, false, false, 'active', now() - interval '10 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-w-02-GM-XS', 'CC-W-02-GM-XS', 'Grey Melange / XS', 'Grey Melange', '#8D8F93', 'grey', 'XS', 720::numeric, null::numeric, 11),
  ('cicero-w-02-GM-S', 'CC-W-02-GM-S', 'Grey Melange / S', 'Grey Melange', '#8D8F93', 'grey', 'S', 720::numeric, null::numeric, 0),
  ('cicero-w-02-GM-M', 'CC-W-02-GM-M', 'Grey Melange / M', 'Grey Melange', '#8D8F93', 'grey', 'M', 720::numeric, null::numeric, 2),
  ('cicero-w-02-GM-L', 'CC-W-02-GM-L', 'Grey Melange / L', 'Grey Melange', '#8D8F93', 'grey', 'L', 720::numeric, null::numeric, 2),
  ('cicero-w-02-IVO-XS', 'CC-W-02-IVO-XS', 'Ivory / XS', 'Ivory', '#F2EEE4', 'white', 'XS', 720::numeric, null::numeric, 1),
  ('cicero-w-02-IVO-S', 'CC-W-02-IVO-S', 'Ivory / S', 'Ivory', '#F2EEE4', 'white', 'S', 720::numeric, null::numeric, 4),
  ('cicero-w-02-IVO-M', 'CC-W-02-IVO-M', 'Ivory / M', 'Ivory', '#F2EEE4', 'white', 'M', 720::numeric, null::numeric, 7),
  ('cicero-w-02-IVO-L', 'CC-W-02-IVO-L', 'Ivory / L', 'Ivory', '#F2EEE4', 'white', 'L', 720::numeric, null::numeric, 2)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-w-02'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-w-03', 'CC-W-03', 'cropped-wool-jacket', 'Cropped Wool Jacket', 'Boxy, collarless', 'A collarless cropped jacket in a soft wool bouclé with concealed hook closures and a silk-blend lining.', 380, null, 'USD',
  (select id from public.categories where slug = 'jackets'),
  null,
  'women', '80% wool, 20% polyamide bouclé.', array['Specialist clean only','Store on a padded hanger','Keep away from prolonged direct sunlight']::text[], 'Boxy, cropped at the waist.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Cropped Wool Jacket | Cicero', 'A collarless cropped jacket in a soft wool bouclé with concealed hook closures and a silk-blend lining.', true, false, false, 'active', now() - interval '11 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-w-03-BLA-XS', 'CC-W-03-BLA-XS', 'Black / XS', 'Black', '#111111', 'black', 'XS', 380::numeric, null::numeric, 3),
  ('cicero-w-03-BLA-S', 'CC-W-03-BLA-S', 'Black / S', 'Black', '#111111', 'black', 'S', 380::numeric, null::numeric, 6),
  ('cicero-w-03-BLA-M', 'CC-W-03-BLA-M', 'Black / M', 'Black', '#111111', 'black', 'M', 380::numeric, null::numeric, 9),
  ('cicero-w-03-BLA-L', 'CC-W-03-BLA-L', 'Black / L', 'Black', '#111111', 'black', 'L', 380::numeric, null::numeric, 12),
  ('cicero-w-03-ECR-XS', 'CC-W-03-ECR-XS', 'Ecru / XS', 'Ecru', '#EDE6D6', 'white', 'XS', 380::numeric, null::numeric, 8),
  ('cicero-w-03-ECR-S', 'CC-W-03-ECR-S', 'Ecru / S', 'Ecru', '#EDE6D6', 'white', 'S', 380::numeric, null::numeric, 11),
  ('cicero-w-03-ECR-M', 'CC-W-03-ECR-M', 'Ecru / M', 'Ecru', '#EDE6D6', 'white', 'M', 380::numeric, null::numeric, 0),
  ('cicero-w-03-ECR-L', 'CC-W-03-ECR-L', 'Ecru / L', 'Ecru', '#EDE6D6', 'white', 'L', 380::numeric, null::numeric, 2)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-w-03'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-w-04', 'CC-W-04', 'leather-biker-jacket', 'Leather Biker Jacket', 'Lambskin, asymmetric zip', 'A classic asymmetric biker in supple lambskin with silver-tone hardware, zipped cuffs and a notched collar.', 590, null, 'USD',
  (select id from public.categories where slug = 'jackets'),
  null,
  'women', '100% lambskin leather. Cupro lining.', array['Specialist clean only','Store on a padded hanger','Keep away from prolonged direct sunlight']::text[], 'Fitted. If between sizes, size up.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Leather Biker Jacket | Cicero', 'A classic asymmetric biker in supple lambskin with silver-tone hardware, zipped cuffs and a notched collar.', false, true, true, 'active', now() - interval '12 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-w-04-BLA-XS', 'CC-W-04-BLA-XS', 'Black / XS', 'Black', '#111111', 'black', 'XS', 590::numeric, null::numeric, 2),
  ('cicero-w-04-BLA-S', 'CC-W-04-BLA-S', 'Black / S', 'Black', '#111111', 'black', 'S', 590::numeric, null::numeric, 13),
  ('cicero-w-04-BLA-M', 'CC-W-04-BLA-M', 'Black / M', 'Black', '#111111', 'black', 'M', 590::numeric, null::numeric, 1),
  ('cicero-w-04-BLA-L', 'CC-W-04-BLA-L', 'Black / L', 'Black', '#111111', 'black', 'L', 590::numeric, null::numeric, 4),
  ('cicero-w-04-BUR-XS', 'CC-W-04-BUR-XS', 'Burgundy / XS', 'Burgundy', '#5B1F28', 'red', 'XS', 590::numeric, null::numeric, 15),
  ('cicero-w-04-BUR-S', 'CC-W-04-BUR-S', 'Burgundy / S', 'Burgundy', '#5B1F28', 'red', 'S', 590::numeric, null::numeric, 3),
  ('cicero-w-04-BUR-M', 'CC-W-04-BUR-M', 'Burgundy / M', 'Burgundy', '#5B1F28', 'red', 'M', 590::numeric, null::numeric, 6),
  ('cicero-w-04-BUR-L', 'CC-W-04-BUR-L', 'Burgundy / L', 'Burgundy', '#5B1F28', 'red', 'L', 590::numeric, null::numeric, 9)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-w-04'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-w-05', 'CC-W-05', 'ribbed-cashmere-turtleneck', 'Ribbed Cashmere Turtleneck', 'Fine rib, slim fit', 'A fine-rib cashmere turtleneck that sits close to the body — the layer that goes under everything.', 320, null, 'USD',
  (select id from public.categories where slug = 'sweaters'),
  (select id from public.collections where slug = 'essential-knits'),
  'women', '100% Mongolian cashmere.', array['Hand wash cold or dry clean','Dry flat away from direct heat','Fold — never hang knitwear']::text[], 'Slim fit. True to size.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Ribbed Cashmere Turtleneck | Cicero', 'A fine-rib cashmere turtleneck that sits close to the body — the layer that goes under everything.', false, true, true, 'active', now() - interval '13 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-w-05-IVO-XS', 'CC-W-05-IVO-XS', 'Ivory / XS', 'Ivory', '#F2EEE4', 'white', 'XS', 320::numeric, null::numeric, 2),
  ('cicero-w-05-IVO-S', 'CC-W-05-IVO-S', 'Ivory / S', 'Ivory', '#F2EEE4', 'white', 'S', 320::numeric, null::numeric, 2),
  ('cicero-w-05-IVO-M', 'CC-W-05-IVO-M', 'Ivory / M', 'Ivory', '#F2EEE4', 'white', 'M', 320::numeric, null::numeric, 8),
  ('cicero-w-05-IVO-L', 'CC-W-05-IVO-L', 'Ivory / L', 'Ivory', '#F2EEE4', 'white', 'L', 320::numeric, null::numeric, 11),
  ('cicero-w-05-BLA-XS', 'CC-W-05-BLA-XS', 'Black / XS', 'Black', '#111111', 'black', 'XS', 320::numeric, null::numeric, 7),
  ('cicero-w-05-BLA-S', 'CC-W-05-BLA-S', 'Black / S', 'Black', '#111111', 'black', 'S', 320::numeric, null::numeric, 2),
  ('cicero-w-05-BLA-M', 'CC-W-05-BLA-M', 'Black / M', 'Black', '#111111', 'black', 'M', 320::numeric, null::numeric, 13),
  ('cicero-w-05-BLA-L', 'CC-W-05-BLA-L', 'Black / L', 'Black', '#111111', 'black', 'L', 320::numeric, null::numeric, 1),
  ('cicero-w-05-CAM-XS', 'CC-W-05-CAM-XS', 'Camel / XS', 'Camel', '#B48A5E', 'brown', 'XS', 320::numeric, null::numeric, 12),
  ('cicero-w-05-CAM-S', 'CC-W-05-CAM-S', 'Camel / S', 'Camel', '#B48A5E', 'brown', 'S', 320::numeric, null::numeric, 15),
  ('cicero-w-05-CAM-M', 'CC-W-05-CAM-M', 'Camel / M', 'Camel', '#B48A5E', 'brown', 'M', 320::numeric, null::numeric, 3),
  ('cicero-w-05-CAM-L', 'CC-W-05-CAM-L', 'Camel / L', 'Camel', '#B48A5E', 'brown', 'L', 320::numeric, null::numeric, 6)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-w-05'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-w-06', 'CC-W-06', 'mohair-blend-v-neck-sweater', 'Mohair-Blend V-Neck Sweater', 'Brushed, airy knit', 'A brushed mohair-blend V-neck with a soft halo, dropped shoulders and deep ribbed cuffs.', 210, null, 'USD',
  (select id from public.categories where slug = 'sweaters'),
  (select id from public.collections where slug = 'essential-knits'),
  'women', '60% mohair, 30% wool, 10% polyamide.', array['Hand wash cold or dry clean','Dry flat away from direct heat','Fold — never hang knitwear']::text[], 'Relaxed fit with dropped shoulders.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Mohair-Blend V-Neck Sweater | Cicero', 'A brushed mohair-blend V-neck with a soft halo, dropped shoulders and deep ribbed cuffs.', true, false, false, 'active', now() - interval '14 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-w-06-OAT-XS', 'CC-W-06-OAT-XS', 'Oat / XS', 'Oat', '#DCCFB9', 'beige', 'XS', 210::numeric, null::numeric, 9),
  ('cicero-w-06-OAT-S', 'CC-W-06-OAT-S', 'Oat / S', 'Oat', '#DCCFB9', 'beige', 'S', 210::numeric, null::numeric, 12),
  ('cicero-w-06-OAT-M', 'CC-W-06-OAT-M', 'Oat / M', 'Oat', '#DCCFB9', 'beige', 'M', 210::numeric, null::numeric, 15),
  ('cicero-w-06-OAT-L', 'CC-W-06-OAT-L', 'Oat / L', 'Oat', '#DCCFB9', 'beige', 'L', 210::numeric, null::numeric, 3),
  ('cicero-w-06-CHA-XS', 'CC-W-06-CHA-XS', 'Charcoal / XS', 'Charcoal', '#3A3B3E', 'grey', 'XS', 210::numeric, null::numeric, 0),
  ('cicero-w-06-CHA-S', 'CC-W-06-CHA-S', 'Charcoal / S', 'Charcoal', '#3A3B3E', 'grey', 'S', 210::numeric, null::numeric, 2),
  ('cicero-w-06-CHA-M', 'CC-W-06-CHA-M', 'Charcoal / M', 'Charcoal', '#3A3B3E', 'grey', 'M', 210::numeric, null::numeric, 2),
  ('cicero-w-06-CHA-L', 'CC-W-06-CHA-L', 'Charcoal / L', 'Charcoal', '#3A3B3E', 'grey', 'L', 210::numeric, null::numeric, 8)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-w-06'
on conflict do nothing;

insert into public.products (legacy_id, sku, slug, title, subtitle, description, price, compare_at_price, currency,
  category_id, collection_id, gender, material, care_instructions, fit_info, shipping_info, seo_title, seo_description,
  is_new_arrival, is_featured, is_bestseller, status, published_at)
values ('cicero-w-07', 'CC-W-07', 'longline-merino-cardigan', 'Longline Merino Cardigan', 'Knee length, tie waist', 'A knee-length merino cardigan with a detachable tie belt and deep pockets — a coat for the in-between days.', 240, null, 'USD',
  (select id from public.categories where slug = 'cardigans'),
  (select id from public.collections where slug = 'essential-knits'),
  'women', '100% merino wool.', array['Hand wash cold or dry clean','Dry flat away from direct heat','Fold — never hang knitwear']::text[], 'Relaxed, knee length.', 'Express shipping in 2–4 business days. Free returns within 30 days.',
  'Longline Merino Cardigan | Cicero', 'A knee-length merino cardigan with a detachable tie belt and deep pockets — a coat for the in-between days.', false, false, false, 'active', now() - interval '15 hours')
on conflict do nothing;
insert into public.product_variants (product_id, legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
select p.id, v.* from public.products p, (values
  ('cicero-w-07-BLA-XS', 'CC-W-07-BLA-XS', 'Black / XS', 'Black', '#111111', 'black', 'XS', 240::numeric, null::numeric, 1),
  ('cicero-w-07-BLA-S', 'CC-W-07-BLA-S', 'Black / S', 'Black', '#111111', 'black', 'S', 240::numeric, null::numeric, 4),
  ('cicero-w-07-BLA-M', 'CC-W-07-BLA-M', 'Black / M', 'Black', '#111111', 'black', 'M', 240::numeric, null::numeric, 7),
  ('cicero-w-07-BLA-L', 'CC-W-07-BLA-L', 'Black / L', 'Black', '#111111', 'black', 'L', 240::numeric, null::numeric, 2),
  ('cicero-w-07-OAT-XS', 'CC-W-07-OAT-XS', 'Oatmeal / XS', 'Oatmeal', '#D8CDB8', 'beige', 'XS', 240::numeric, null::numeric, 6),
  ('cicero-w-07-OAT-S', 'CC-W-07-OAT-S', 'Oatmeal / S', 'Oatmeal', '#D8CDB8', 'beige', 'S', 240::numeric, null::numeric, 9),
  ('cicero-w-07-OAT-M', 'CC-W-07-OAT-M', 'Oatmeal / M', 'Oatmeal', '#D8CDB8', 'beige', 'M', 240::numeric, null::numeric, 12),
  ('cicero-w-07-OAT-L', 'CC-W-07-OAT-L', 'Oatmeal / L', 'Oatmeal', '#D8CDB8', 'beige', 'L', 240::numeric, null::numeric, 15)
) as v(legacy_id, sku, name, color, color_hex, color_family, size, price, compare_at_price, inventory_quantity)
where p.legacy_id = 'cicero-w-07'
on conflict do nothing;

commit;
