-- ---------------------------------------------------------------------------
-- Shop hours and Google Maps link (shown in the footer, contact page and to
-- Google as structured data). Also moves the old placeholder address to the
-- FBR-registered one, but only if nobody has changed it yet.
-- ---------------------------------------------------------------------------
alter table public.store_settings add column if not exists opening_hours text;
alter table public.store_settings add column if not exists google_maps_url text;

update public.store_settings
   set address = 'Shop No 142, Block A, Satellite Town, Gujranwala'
 where id = 1
   and (address is null or address = '' or address = 'Main Market, Satellite Town, Gujranwala');

notify pgrst, 'reload schema';
