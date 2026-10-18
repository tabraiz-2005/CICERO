-- ---------------------------------------------------------------------------
-- Cicero brand details: address, second phone, Instagram, tagline.
-- Only fills empty / default values, so it never overwrites your own edits.
-- ---------------------------------------------------------------------------
alter table public.store_settings add column if not exists address text;
alter table public.store_settings add column if not exists contact_phone_2 text;

update public.store_settings
   set address         = coalesce(nullif(address, ''), 'Main Market, Satellite Town, Gujranwala'),
       contact_phone   = coalesce(nullif(contact_phone, ''), '03207110919'),
       contact_phone_2 = coalesce(nullif(contact_phone_2, ''), '03706157560'),
       instagram_url   = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/cicero.com.pk'),
       tagline = case when tagline in ('Coats · Jackets · Knitwear', 'Outerwear & Knitwear') then 'we make you more beautiful' else tagline end
 where id = 1;

notify pgrst, 'reload schema';
