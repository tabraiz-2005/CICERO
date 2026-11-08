-- ---------------------------------------------------------------------------
-- Visitor analytics: one row per page view on the store (no IP addresses kept).
-- Only the server (service role) can read or write it.
-- ---------------------------------------------------------------------------
create table if not exists public.page_views (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  path text not null,
  visitor_id text not null,
  session_id text not null,
  source text,
  device text,
  country text,
  city text,
  product_slug text
);
create index if not exists page_views_created_idx on public.page_views (created_at desc);
alter table public.page_views enable row level security;

notify pgrst, 'reload schema';
