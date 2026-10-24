import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { env } from '@/lib/env';

/** The store's standard menu. Missing ones are created automatically; edits made in the admin are kept. */
export const DEFAULT_CATEGORIES = [
  { slug: 'hoodies', name: 'Hoodies', gender: 'all', description: 'Pullover and zip hoodies in soft, heavy fleece.' },
  { slug: 'sweatshirts', name: 'Sweatshirts', gender: 'all', description: 'Crewneck sweatshirts in soft brushed fleece.' },
  { slug: 'sweaters', name: 'Sweaters', gender: 'all', description: 'Knit sweaters, polos and roll-necks for the cold months.' },
  { slug: 'cardigans', name: 'Cardigans', gender: 'all', description: 'Zip-up and button-through knitwear for layering.' },
  { slug: 'tracksuits', name: 'Tracksuits', gender: 'all', description: 'Fleece and knit tracksuit sets, made for comfort through the winter.' },
  { slug: 'trousers', name: 'Trousers', gender: 'all', description: 'Joggers, chinos, tailored and relaxed trousers.' },
  { slug: 'denim-jeans', name: 'Denim Jeans', gender: 'all', description: 'Straight, slim and relaxed denim.' },
  { slug: 'shorts', name: 'Shorts', gender: 'men', description: 'Casual and knit shorts.' },
  { slug: 'jackets', name: 'Jackets', gender: 'all', description: 'Puffers, bombers, leather and quilted jackets.' },
  { slug: 'wool-coats', name: 'Wool Coats', gender: 'all', description: 'Long coats, overcoats and wrap coats.' },
  { slug: 'accessories', name: 'Accessories', gender: 'all', description: 'Scarves, caps, gloves and finishing touches.' },
] as const;

const ORDER = new Map<string, number>(DEFAULT_CATEGORIES.map((c, i) => [c.slug, i]));
export const menuOrder = (slug: string) => ORDER.get(slug) ?? 100;

let ensured: Promise<boolean> | null = null;

/** Adds any standard category that is missing (runs once per server). Returns true if anything was added. */
export function ensureDefaultCategories(existing: string[]): Promise<boolean> {
  const missing = DEFAULT_CATEGORIES.filter((c) => !existing.includes(c.slug));
  if (!missing.length || !env.supabaseSecretKey) return Promise.resolve(false);
  if (!ensured) {
    ensured = (async () => {
      try {
        const { error } = await getSupabaseAdmin()
          .from('categories')
          .upsert(
            missing.map((c) => ({ ...c, sort_order: menuOrder(c.slug) + 1, is_active: true })),
            { onConflict: 'slug', ignoreDuplicates: true }
          );
        if (error) {
          console.warn('[catalog] Could not add standard categories:', error.message);
          return false;
        }
        return true;
      } catch (e) {
        console.warn('[catalog] Could not add standard categories:', (e as Error).message);
        return false;
      }
    })();
  }
  return ensured;
}
