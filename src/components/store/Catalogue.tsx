import Link from 'next/link';
import { Suspense } from 'react';
import { X } from 'lucide-react';
import { countAllProducts, getCategories, getProducts, type SortKey } from '@/lib/commerce/catalog';
import { cn } from '@/lib/utils';
import { ProductCard } from './ProductCard';
import { SortSelect } from './SortSelect';

type G = 'all' | 'men' | 'women';
const SORTS: SortKey[] = ['featured', 'newest', 'price-low', 'price-high'];

export interface CatalogueParams {
  gender?: string;
  category?: string;
  sort?: string;
  collection?: string;
  q?: string;
}

const basePath = (g: G) => (g === 'men' ? '/men' : g === 'women' ? '/women' : '/shop');

function href(g: G, category: string | undefined, sort: string | undefined, extra: Record<string, string | undefined> = {}) {
  const p = new URLSearchParams();
  if (category) p.set('category', category);
  if (sort && sort !== 'featured') p.set('sort', sort);
  for (const [k, v] of Object.entries(extra)) if (v) p.set(k, v);
  const qs = p.toString();
  return qs ? `${basePath(g)}?${qs}` : basePath(g);
}

export async function Catalogue({
  params,
  fixedGender,
  eyebrow = 'Garment system // Catalogue',
  title,
  description,
}: {
  params: CatalogueParams;
  fixedGender?: G;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const gender: G = fixedGender ?? (params.gender === 'men' || params.gender === 'women' ? params.gender : 'all');
  const sort = SORTS.includes(params.sort as SortKey) ? (params.sort as SortKey) : 'featured';
  const [categories, total] = await Promise.all([getCategories(), countAllProducts()]);
  const category = categories.find((c) => c.slug === params.category);

  const products = await getProducts({
    gender,
    category: category?.slug,
    collection: params.collection,
    search: params.q,
    sort,
  });

  const heading =
    title ??
    (category ? category.name : gender === 'men' ? "Men’s Collection" : gender === 'women' ? "Women’s Collection" : 'All Pieces');
  const filtered = gender !== 'all' || Boolean(category) || sort !== 'featured';
  const extra = { collection: params.collection, q: params.q };

  return (
    <div className="site-x">
      <section className="flex flex-col gap-6 border-b border-line pb-10 pt-10 lg:flex-row lg:items-end lg:justify-between lg:pb-16 lg:pt-14">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display mt-4 text-[38px] sm:text-[52px] lg:text-[68px]">{heading}</h1>
          {description && <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-display text-[13px] uppercase tracking-wide2 text-muted sm:text-[15px] lg:pb-3">
          <span>
            Showing <b className="text-fg">{products.length}</b> of <b className="text-fg">{total}</b> pieces
          </span>
          {filtered && (
            <Link href="/shop" className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-fg sm:text-sm">
              <X className="h-4 w-4" /> <span className="underline underline-offset-4">Clear filters</span>
            </Link>
          )}
        </div>
      </section>

      <section className="mt-10 lg:mt-[92px]">
        <div className="flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5 overflow-x-auto no-scrollbar">
            <span className="shrink-0 font-display text-[13px] font-medium uppercase tracking-wide2 text-muted sm:text-[15px]">
              Department:
            </span>
            {(['all', 'men', 'women'] as G[]).map((g) => (
              <Link
                key={g}
                href={href(g, category?.slug, sort, extra)}
                scroll={false}
                className={cn('chip chip-filled shrink-0 sm:min-w-[106px]', gender === g && 'chip-active')}
              >
                {g === 'all' ? 'All genders' : g}
              </Link>
            ))}
          </div>
          <Suspense>
            <SortSelect />
          </Suspense>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto border-b border-line py-6 no-scrollbar">
          <span className="shrink-0 font-display text-[13px] font-medium uppercase tracking-wide2 text-muted sm:text-[15px]">
            Garment:
          </span>
          <Link
            href={href(gender, undefined, sort, extra)}
            scroll={false}
            className={cn('chip shrink-0 !h-11 min-w-[88px]', !category && 'chip-active')}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={href(gender, c.slug, sort, extra)}
              scroll={false}
              className={cn('chip shrink-0 !h-11', category?.slug === c.slug && 'chip-active')}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-32 text-center">
          <p className="display text-3xl text-muted">No pieces found</p>
          <p className="text-sm text-muted">Try another department or garment.</p>
          <Link href="/shop" className="btn-outline">
            View all pieces
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:mt-[72px] lg:gap-x-[42px] lg:gap-y-16 xl:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
