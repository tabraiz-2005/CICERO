-- ---------------------------------------------------------------------------
-- Pakistan: prices in Rupees (PKR) + Cash on Delivery
-- Amounts on orders, settings and fixed discounts are stored in paisa (Rs × 100).
-- Safe to run more than once.
-- ---------------------------------------------------------------------------

-- Allow PKR everywhere.
alter table public.products drop constraint if exists products_currency_check;
alter table public.products add constraint products_currency_check
  check (currency in ('PKR', 'USD', 'EUR', 'GBP', 'JPY', 'AED'));
alter table public.products alter column currency set default 'PKR';

alter table public.orders drop constraint if exists orders_currency_check;
alter table public.orders add constraint orders_currency_check
  check (currency in ('PKR', 'USD', 'EUR', 'GBP', 'JPY', 'AED'));
alter table public.orders alter column currency set default 'PKR';

-- One-time conversions are recorded here so re-running this file never repeats them.
create table if not exists public.app_migrations (name text primary key, ran_at timestamptz not null default now());
alter table public.app_migrations enable row level security;
revoke all on table public.app_migrations from anon, authenticated;

do $$
begin
  if exists (select 1 from public.app_migrations where name = 'usd_to_pkr') then
    return;
  end if;

  -- Starter catalogue: set realistic Pakistani retail prices (edit any time in Admin → Products).
  with p(legacy_id, price, compare_at) as (values
      ('cicero-m-01', 34500, null::numeric),
      ('cicero-m-02', 29500, null::numeric),
      ('cicero-m-03', 24500, 28500::numeric),
      ('cicero-m-04', 18500, null::numeric),
      ('cicero-m-05', 12500, null::numeric),
      ('cicero-m-06', 7500, null::numeric),
      ('cicero-m-07', 9500, null::numeric),
      ('cicero-m-08', 14500, null::numeric),
      ('cicero-m-09', 10500, null::numeric),
      ('cicero-w-01', 32500, null::numeric),
      ('cicero-w-02', 36500, null::numeric),
      ('cicero-w-03', 16500, null::numeric),
      ('cicero-w-04', 26500, null::numeric),
      ('cicero-w-05', 13500, null::numeric),
      ('cicero-w-06', 8500, null::numeric),
      ('cicero-w-07', 11500, null::numeric)
  ), upd as (
    update public.products pr
       set price = p.price, compare_at_price = p.compare_at, currency = 'PKR'
      from p
     where pr.legacy_id = p.legacy_id and pr.currency = 'USD'
    returning pr.id, p.price, p.compare_at
  )
  update public.product_variants v
     set price = upd.price, compare_at_price = upd.compare_at
    from upd
   where v.product_id = upd.id;

  -- Any other product still in dollars: convert at ≈ Rs 280 per $1, rounded to Rs 500.
  update public.product_variants v
     set price = round(v.price * 280 / 500) * 500,
         compare_at_price = case when v.compare_at_price is null then null
                                 else round(v.compare_at_price * 280 / 500) * 500 end
    from public.products p
   where p.id = v.product_id and p.currency = 'USD';
  update public.products
     set price = round(price * 280 / 500) * 500,
         compare_at_price = case when compare_at_price is null then null
                                 else round(compare_at_price * 280 / 500) * 500 end,
         currency = 'PKR'
   where currency = 'USD';

  -- Fixed-amount discounts and minimum spends: US cents → paisa.
  update public.discount_codes set value = value * 280 where discount_type = 'fixed';
  update public.discount_codes set min_subtotal = min_subtotal * 280;

  -- Shipping (paisa): Rs 250 standard, Rs 500 express, free over Rs 15,000.
  update public.store_settings
     set standard_shipping_amount = 25000,
         express_shipping_amount  = 50000,
         free_shipping_threshold  = 1500000,
         announcement_text = 'Free delivery across Pakistan on orders over Rs 15,000 · Cash on Delivery available'
   where id = 1;

  insert into public.app_migrations (name) values ('usd_to_pkr');
end $$;

alter table public.store_settings alter column standard_shipping_amount set default 25000;
alter table public.store_settings alter column express_shipping_amount set default 50000;

-- New homepage defaults (only if still on the old text).
update public.store_settings
   set hero_title = case when hero_title = 'CICERO' then 'The Winter Edit' else hero_title end,
       tagline = case when tagline = 'Outerwear & Knitwear' then 'Coats · Jackets · Knitwear' else tagline end
 where id = 1;

-- How the customer pays.
alter table public.orders add column if not exists payment_method text not null default 'card';
alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders add constraint orders_payment_method_check
  check (payment_method in ('cod', 'easypaisa', 'jazzcash', 'card'));

-- Email is optional for COD customers (phone is what couriers need).
alter table public.orders alter column customer_email drop not null;

-- Has the shop confirmed a COD order with the customer (phone / WhatsApp)?
alter table public.orders add column if not exists confirmed_by_phone boolean not null default false;

-- Place a Cash on Delivery order: take the stock now and confirm the order.
create or replace function public.place_cod_order(p_order_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform public.reserve_order_inventory(p_order_id);
  update public.inventory_reservations
     set status = 'converted', converted_at = now()
   where order_id = p_order_id and status = 'active';
  update public.orders
     set status = 'confirmed', expires_at = null, updated_at = now()
   where id = p_order_id;
end;
$$;
revoke all on function public.place_cod_order(uuid) from public, anon, authenticated;
grant execute on function public.place_cod_order(uuid) to service_role;

-- Cancel a Cash on Delivery order before it's paid: put the stock back.
create or replace function public.cancel_cod_order(p_order_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare r record;
begin
  perform 1 from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if exists (select 1 from public.orders where id = p_order_id and payment_status = 'paid') then
    raise exception 'Order is already paid';
  end if;
  for r in select id, variant_id, quantity from public.inventory_reservations
            where order_id = p_order_id and status in ('active', 'converted') for update loop
    update public.product_variants set inventory_quantity = inventory_quantity + r.quantity, updated_at = now()
     where id = r.variant_id;
    update public.inventory_reservations set status = 'released', released_at = now() where id = r.id;
  end loop;
  update public.orders
     set status = 'cancelled', fulfillment_status = 'cancelled', cancelled_at = now(), updated_at = now()
   where id = p_order_id;
end;
$$;
revoke all on function public.cancel_cod_order(uuid) from public, anon, authenticated;
grant execute on function public.cancel_cod_order(uuid) to service_role;

-- Discount usage for COD orders is counted when the order is placed.
create or replace function public.count_discount_use(p_code text) returns void
language sql security definer set search_path = '' as $$
  update public.discount_codes set times_used = times_used + 1 where code = p_code;
$$;
revoke all on function public.count_discount_use(text) from public, anon, authenticated;
grant execute on function public.count_discount_use(text) to service_role;

-- Ask Supabase's API to pick up the new columns straight away.
notify pgrst, 'reload schema';
