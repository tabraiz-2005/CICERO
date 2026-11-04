-- ---------------------------------------------------------------------------
-- Optional portrait hero photo for phones (falls back to the main hero image).
-- ---------------------------------------------------------------------------
alter table public.store_settings add column if not exists hero_image_mobile_url text;

notify pgrst, 'reload schema';
