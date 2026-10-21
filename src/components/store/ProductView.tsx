'use client';

import { Banknote, Eye, MessageCircle, RotateCcw, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/commerce/types';
import { cn, formatPrice } from '@/lib/utils';
import { whatsappLink } from '@/lib/phone';
import { Img } from '@/components/ui/Img';
import { GarmentArt } from './GarmentArt';
import { WishlistButton } from './WishlistButton';

export function ProductView({
  product,
  lowStockThreshold,
  freeShipping,
  deliveryNote,
  whatsappPhone,
}: {
  product: Product;
  lowStockThreshold: number;
  freeShipping: boolean;
  deliveryNote?: string;
  whatsappPhone?: string | null;
}) {
  const { addItem, setIsCartOpen } = useCart();
  const router = useRouter();
  const [pageUrl, setPageUrl] = useState('');
  useEffect(() => setPageUrl(window.location.href.split('?')[0]), []);

  const firstAvailable = product.variants.find((v) => v.inStock) ?? product.variants[0];
  const [color, setColor] = useState(firstAvailable?.color ?? '');
  const [size, setSize] = useState<string | null>(firstAvailable?.size ?? null);

  const sizesForColor = useMemo(
    () =>
      product.availableSizes.map((s) => {
        const v = product.variants.find((x) => x.color === color && x.size === s);
        return { size: s, variant: v, available: Boolean(v?.inStock) };
      }),
    [product, color]
  );

  const variant = product.variants.find((v) => v.color === color && v.size === size);
  const price = variant?.price ?? product.price;
  const compareAt = variant?.compareAtPrice ?? product.compareAtPrice;
  const discount = compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;
  const canBuy = Boolean(variant && variant.inStock);

  const buyNow = () => {
    if (!variant || !variant.inStock) return;
    addItem(product, variant, 1);
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const waOrder = whatsappLink(
    whatsappPhone,
    `Hi Cicero, I'd like to order: ${product.title}` +
      (color ? ` · ${color}` : '') +
      (size ? ` · size ${size}` : '') +
      ` · ${formatPrice(price)}` +
      (pageUrl ? `\n${pageUrl}` : '')
  );

  const colorStock = product.variants.filter((v) => v.color === color).reduce((n, v) => n + v.inventoryQuantity, 0);
  const stockLeft = variant ? variant.inventoryQuantity : colorStock;
  const soldOut = product.totalStock === 0;

  const heroImage =
    product.variants.find((v) => v.color === color && v.image)?.image ?? product.images[0]?.url ?? null;

  const chooseColor = (c: string) => {
    setColor(c);
    const keep = product.variants.find((v) => v.color === c && v.size === size && v.inStock);
    if (!keep) setSize(product.variants.find((v) => v.color === c && v.inStock)?.size ?? null);
  };

  const stockLabel = soldOut
    ? 'Sold out'
    : variant && !variant.inStock
      ? 'Out of stock in this size'
      : stockLeft > 0 && stockLeft <= lowStockThreshold
        ? `Low stock — ${stockLeft} remaining`
        : 'In stock — ready to ship';

  const titleSize =
    product.title.length > 26 ? 'text-[36px] sm:text-[48px] lg:text-[60px]' : 'text-[42px] sm:text-[60px] lg:text-[76px]';

  return (
    <section className="relative -mt-[72px] min-h-[calc(100svh-6px)] overflow-hidden lg:-mt-[100px]">
      {/* Campaign image */}
      <div className="absolute inset-0 lg:left-[38%]">
        {heroImage ? (
          <Img src={heroImage} alt={product.images[0]?.alt ?? product.title} sizes="(max-width:1024px) 100vw, 62vw" priority />
        ) : (
          <GarmentArt category={product.category} className="bg-surface" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/10 lg:bg-gradient-to-r lg:from-bg lg:via-bg/85 lg:via-[45%] lg:to-transparent lg:to-[75%]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg/70 to-transparent" />

      <div className="site-x relative flex min-h-[calc(100svh-6px)] flex-col justify-end pb-10 pt-[300px] lg:justify-center lg:pb-12 lg:pt-[132px]">
        <div className="max-w-[790px]">
          <span className="inline-flex items-center gap-3 border border-line-strong bg-surface/80 px-6 py-3.5 font-display text-[11px] uppercase tracking-label text-fg/90 backdrop-blur sm:text-[13px]">
            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
            {product.collectionName ?? 'Atelier campaign'}{' // '}{product.categoryName}
          </span>

          <h1 className={cn('display mt-8 lg:mt-9', titleSize)}>{product.title}</h1>
          <p className="mt-5 font-display text-sm font-semibold uppercase tracking-wide2 text-muted lg:mt-6 lg:text-base">
            {product.categoryName}
            {product.gender !== 'unisex' && ` · ${product.gender}`}
          </p>
          {product.subtitle && <p className="mt-4 text-lg font-light text-fg/90 lg:mt-6 lg:text-[24px]">{product.subtitle}</p>}

          <p
            className={cn(
              'mt-7 font-display text-[13px] font-bold uppercase tracking-label sm:pl-7 lg:mt-9 lg:text-[15px]',
              soldOut && 'text-danger'
            )}
          >
            {stockLabel}
          </p>

          <div className="mt-5 border border-line-strong bg-surface/90 p-5 backdrop-blur sm:p-8">
            <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-xl font-semibold tracking-[0.06em] sm:text-2xl">
              {formatPrice(price)}
              {discount > 0 && (
                <>
                  <span className="text-sm font-normal text-subtle line-through">{formatPrice(compareAt!)}</span>
                  <span className="bg-brand px-2 py-1 text-[11px] font-bold tracking-normal text-brand-ink sm:text-xs">-{discount}%</span>
                </>
              )}
            </p>
            {product.availableColors.length > 1 && (
              <div className="mb-6">
                <p className="font-display text-[13px] uppercase tracking-wide2 text-muted">
                  Colour: <span className="text-fg">{color}</span>
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {product.availableColors.map((c) => {
                    const any = product.variants.some((v) => v.color === c.name && v.inStock);
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => chooseColor(c.name)}
                        aria-label={c.name}
                        aria-pressed={color === c.name}
                        title={c.name}
                        className={cn(
                          'relative h-10 w-10 border p-1 transition-colors',
                          color === c.name ? 'border-fg' : 'border-line hover:border-line-strong',
                          !any && 'opacity-40'
                        )}
                      >
                        <span className="block h-full w-full" style={{ backgroundColor: c.hex }} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="font-display text-[13px] uppercase tracking-wide2 text-muted sm:text-base">
                Select size
                <Link href="/size-guide" className="ml-4 normal-case tracking-normal text-fg/70 underline underline-offset-4 hover:text-fg">
                  Size guide
                </Link>
              </p>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4">
              {sizesForColor.map(({ size: s, available }) => (
                <button
                  key={s}
                  type="button"
                  disabled={!available}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={cn(
                    'h-14 border font-display text-sm uppercase tracking-[0.12em] transition-colors sm:h-[66px] sm:text-base',
                    size === s
                      ? 'border-brand bg-brand font-bold text-brand-ink'
                      : 'border-line bg-bg text-muted hover:border-line-strong hover:text-fg',
                    !available && 'cursor-not-allowed line-through opacity-35 hover:border-line hover:text-muted'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn-primary mt-6 h-14 w-full text-sm sm:mt-7 sm:h-[68px] sm:text-base"
              disabled={!canBuy}
              onClick={buyNow}
            >
              {soldOut ? 'Sold out' : !variant ? 'Select a size' : !variant.inStock ? 'Unavailable' : `Buy now — ${formatPrice(price)}`}
            </button>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                className="btn-outline h-14 flex-1 text-sm"
                disabled={!canBuy}
                onClick={() => variant && addItem(product, variant, 1)}
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.75} /> Add to bag
              </button>
              <a
                href="#details"
                aria-label="View product details"
                className="flex h-14 w-14 shrink-0 items-center justify-center border border-line bg-bg transition-colors hover:border-line-strong"
              >
                <Eye className="h-6 w-6" strokeWidth={1.5} />
              </a>
            </div>
            {waOrder && (
              <a
                href={waOrder}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex h-12 w-full items-center justify-center gap-3 border border-[#25D366]/60 font-display text-xs font-bold uppercase tracking-label text-fg transition-colors hover:bg-[#25D366]/10"
              >
                <MessageCircle className="h-5 w-5 text-[#25D366]" strokeWidth={1.75} /> Order on WhatsApp
              </a>
            )}

            <div className="mt-6 grid gap-3 border-t border-line pt-6 font-display text-[11px] uppercase tracking-label text-muted sm:grid-cols-3 sm:text-[12px]">
              <span className="flex items-center gap-3">
                <Banknote className="h-4 w-4 shrink-0" strokeWidth={1.5} /> Cash on Delivery
              </span>
              <span className="flex items-center gap-3">
                <Truck className="h-4 w-4 shrink-0" strokeWidth={1.5} /> {freeShipping ? 'Free delivery' : deliveryNote ?? 'Delivery across Pakistan'}
              </span>
              <Link href="/returns" className="flex items-center gap-3 hover:text-fg">
                <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={1.5} /> Exchanges & returns
              </Link>
            </div>
          </div>
        </div>
      </div>

      <WishlistButton product={product} className="absolute right-4 top-[104px] sm:right-8 lg:right-[68px] lg:top-[132px]" />
    </section>
  );
}
