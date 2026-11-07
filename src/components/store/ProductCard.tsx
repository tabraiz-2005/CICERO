'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/lib/commerce/types';
import { cn, formatPrice } from '@/lib/utils';
import { Img } from '@/components/ui/Img';
import { GarmentArt } from './GarmentArt';
import { WishlistButton } from './WishlistButton';

const MAX_SWATCHES = 6;

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const colourImage = (c: string) => product.variants.find((v) => v.color === c && v.image)?.image;
  const activeImage = active ? colourImage(active) : undefined;

  const [main, hover] = activeImage
    ? [{ url: activeImage, alt: `${product.title} in ${active}` }, undefined]
    : [product.images[0], product.images.find((i) => i.isHover) ?? product.images[1]];
  const colours = product.availableColors;
  const href = `/products/${product.slug}${active ? `?color=${encodeURIComponent(active)}` : ''}`;
  const soldOut = product.totalStock === 0;
  const badge = soldOut ? 'Sold out' : product.isNewArrival ? 'New' : null;

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe9e6]">
        {main ? (
          <>
            <Img
              key={main.url}
              src={main.url}
              alt={main.alt}
              priority={priority}
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
            {hover && (
              <Img
                src={hover.url}
                alt={hover.alt}
                className="object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <GarmentArt category={product.category} label={`Cicero // ${product.categoryName}`} />
        )}

        {badge && (
          <span className="absolute left-3 top-3 bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#141213] sm:left-4 sm:top-4 sm:text-[11px]">
            {badge}
          </span>
        )}
        <WishlistButton
          product={product}
          className="absolute right-2 top-2 h-10 w-10 bg-transparent text-[#141213] backdrop-blur-0 hover:scale-110 sm:right-3 sm:top-3"
        />
      </div>

      <div className="mt-4 text-center">
        <h3 className="line-clamp-2 text-[14px] leading-snug tracking-[0.02em] text-fg sm:text-[15px]">{product.title}</h3>
        <p className="mt-1.5 text-[14px] text-fg/80">
          {formatPrice(product.price)}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="ml-2 text-[13px] text-subtle line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </p>
        {colours.length > 1 && (
          <div className="mt-2 flex items-center justify-center gap-0.5" aria-label={`${colours.length} colours`}>
            {colours.slice(0, MAX_SWATCHES).map((c) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={`Show ${c.name}`}
                aria-pressed={active === c.name}
                onMouseEnter={() => colourImage(c.name) && setActive(c.name)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActive(c.name);
                }}
                className="flex h-7 w-7 items-center justify-center"
              >
                <span
                  className={cn(
                    'block h-4 w-4 rounded-full border border-fg/30 transition-transform',
                    active === c.name ? 'scale-110 ring-1 ring-fg ring-offset-2 ring-offset-bg' : ''
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              </button>
            ))}
            {colours.length > MAX_SWATCHES && (
              <span className="ml-1 text-[12px] text-muted">+{colours.length - MAX_SWATCHES}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
