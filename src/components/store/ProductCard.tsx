import Link from 'next/link';
import type { Product } from '@/lib/commerce/types';
import { formatPrice } from '@/lib/utils';
import { Img } from '@/components/ui/Img';
import { GarmentArt } from './GarmentArt';
import { WishlistButton } from './WishlistButton';

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const [main, hover] = [
    product.images[0],
    product.images.find((i) => i.isHover) ?? product.images[1],
  ];
  const soldOut = product.totalStock === 0;
  const badge = soldOut ? 'Sold out' : product.isNewArrival ? 'New arrival' : product.isBestseller ? 'Bestseller' : null;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4.1] overflow-hidden border border-line bg-surface-2">
        {main ? (
          <>
            <Img
              src={main.url}
              alt={main.alt}
              priority={priority}
              className="transition-transform duration-700 group-hover:scale-[1.03]"
            />
            {hover && (
              <Img
                src={hover.url}
                alt={hover.alt}
                className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <GarmentArt category={product.category} label={`Cicero // ${product.categoryName}`} />
        )}

        {badge && (
          <span className="absolute left-3 top-3 bg-[#141213] px-4 py-2 font-display text-[10px] font-bold uppercase tracking-label text-white sm:left-[22px] sm:top-[22px] sm:text-[11px]">
            {badge}
          </span>
        )}
        <WishlistButton product={product} className="absolute right-3 top-3 sm:right-[22px] sm:top-[22px]" />
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-display text-[13px] font-semibold uppercase tracking-[0.14em] sm:text-sm">
            {product.title}
          </h3>
          <p className="mt-1 font-display text-[11px] uppercase tracking-label text-muted">
            {product.categoryName}
            {product.availableColors.length > 1 && ` · ${product.availableColors.length} colours`}
          </p>
        </div>
        <div className="shrink-0 text-right font-display text-sm font-semibold tracking-[0.08em]">
          {formatPrice(product.price)}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="ml-2 text-xs font-normal text-subtle line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
