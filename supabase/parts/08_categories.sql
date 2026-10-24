-- ---------------------------------------------------------------------------
-- Menu categories for Men and Women. Safe to re-run: adds missing ones and
-- sets the menu order; names and descriptions you edited in the admin stay.
-- Shorts are Men only; everything else shows for both.
-- ---------------------------------------------------------------------------
insert into public.categories (slug, name, gender, description, sort_order) values
  ('sweatshirts', 'Sweatshirts', 'all', 'Crewneck sweatshirts and hoodies in soft brushed fleece.', 1),
  ('sweaters',    'Sweaters',    'all', 'Knit sweaters, polos and roll-necks for the cold months.', 2),
  ('cardigans',   'Cardigans',   'all', 'Zip-up and button-through knitwear for layering.', 3),
  ('tracksuits',  'Tracksuits',  'all', 'Fleece and knit tracksuit sets, made for comfort through the winter.', 4),
  ('trousers',    'Trousers',    'all', 'Tailored, chino and relaxed trousers.', 5),
  ('denim-jeans', 'Denim Jeans', 'all', 'Straight, slim and relaxed denim.', 6),
  ('shorts',      'Shorts',      'men', 'Casual and knit shorts.', 7),
  ('jackets',     'Jackets',     'all', 'Puffers, bombers, leather and quilted jackets.', 8),
  ('wool-coats',  'Wool Coats',  'all', 'Long coats, overcoats and wrap coats.', 9),
  ('accessories', 'Accessories', 'all', 'Scarves, caps, gloves and finishing touches.', 10)
on conflict (slug) do update
  set sort_order = excluded.sort_order,
      gender     = excluded.gender,
      is_active  = true;
