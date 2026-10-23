'use client';

import { Banknote, ChevronDown, MessageCircle, RotateCcw, Share2, Truck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/commerce/types';
import { cn, formatPrice } from '@/lib/utils';
import { whatsappLink } from '@/lib/phone';
import { Img } from '@/components/ui/Img';
import { GarmentArt } from './GarmentArt';
import { WishlistButton } from './WishlistButton';

function Accordion({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="group border-b border-line" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[15px] tracking-[0.02em] text-fg [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-4 w-4 text-muted transition-transform group-open:rotate-180" strokeWidth={1.5} />
      </summary>
      <div className="pb-6 text-[14px] leading-relaxed text-fg/80">{children}</div>
    </details>
  );
}

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
  const [slide, setSlide] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  const sizesForColor = useMemo(
    () =>
      product.availableSizes.map((s) => {
        const v = product.variants.find((x) => x.color === color && x.size === s);
        return { size: s, available: Boolean(v?.inStock) };
      }),
    [product, color]
  );

  const variant = product.variants.find((v) => v.color === color && v.size === size);
  const price = variant?.price ?? product.price;
  const compareAt = variant?.compareAtPrice ?? product.compareAtPrice;
  const discount = compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;
  const canBuy = Boolean(variant && variant.inStock);
  const soldOut = product.totalStock === 0;
  const stockLeft = variant ? variant.inventoryQuantity : 0;

  // Gallery: the chosen colour's photo first, then the rest.
  const images = useMemo(() => {
    const colourImg = product.variants.find((v) => v.color === color && v.image)?.image;
    const list = product.images.filter((i) => !i.isHover || product.images.length > 1);
    if (colourImg && !list.some((i) => i.url === colourImg)) return [{ url: colourImg, alt: product.title }, ...list];
    if (colourImg) return [...list.filter((i) => i.url === colourImg), ...list.filter((i) => i.url !== colourImg)];
    return list;
  }, [product, color]);

  const chooseColor = (c: string) => {
    setColor(c);
    const keep = product.variants.find((v) => v.color === c && v.size === size && v.inStock);
    if (!keep) setSize(product.variants.find((v) => v.color === c && v.inStock)?.size ?? null);
    setSlide(0);
    railRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const addToBag = () => {
    if (!variant || !variant.inStock) return;
    addItem(product, variant, 1); // opens the bag drawer
  };
  const buyNow = () => {
    if (!variant || !variant.inStock) return;
    addItem(product, variant, 1);
    setIsCartOpen(false);
    router.push('/checkout');
  };
  const share = async () => {
    const url = pageUrl || window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.title, url });
      else await navigator.clipboard.writeText(url);
    } catch {
      /* cancelled */
    }
  };

  const waOrder = whatsappLink(
    whatsappPhone,
    `Hi Cicero, I'd like to order: ${product.title}` +
      (color ? ` · ${color}` : '') +
      (size ? ` · size ${size}` : '') +
      ` · ${formatPrice(price)}` +
      (pageUrl ? `\n${pageUrl}` : '')
  );

  const dept = product.gender === 'women' ? 'Women' : product.gender === 'men' ? 'Men' : null;

  return (
    <section className="site-x grid gap-8 pt-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,1fr)] lg:gap-16 lg:pt-8">
      {/* Gallery */}
      <div className="relative -mx-4 sm:mx-0">
        <div
          ref={railRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            setSlide(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar lg:block lg:space-y-3 lg:overflow-visible"
        >
          {images.length ? (
            images.map((img, i) => (
              <div key={img.url + i} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-[#ebe9e6]">
                <Img src={img.url} alt={img.alt || product.title} sizes="(max-width:1024px) 100vw, 58vw" priority={i === 0} className="object-contain" />
              </div>
            ))
          ) : (
            <div className="relative aspect-[4/5] w-full bg-surface">
              <GarmentArt category={product.category} />
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-2 lg:hidden">
            {images.map((_, i) => (
              <span key={i} className={cn('h-1.5 w-1.5 rounded-full', i === slide ? 'bg-fg' : 'bg-line-strong')} />
            ))}
          </div>
        )}
      </div>

      {/* Buy panel */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <nav className="flex flex-wrap items-center gap-2 text-[13px] text-muted" aria-label="Breadcrumb">
          {dept && (
            <>
              <Link href={`/${dept.toLowerCase()}`} className="hover:text-fg">{dept}</Link>
              <span>/</span>
            </>
          )}
          <Link href={`/shop?category=${product.category}`} className="text-fg/80 hover:text-fg">{product.categoryName}</Link>
        </nav>

        <div className="mt-6 flex items-start justify-between gap-4">
          <h1 className="font-display text-[26px] font-normal leading-tight tracking-[0.01em] sm:text-[30px]">{product.title}</h1>
          <div className="flex shrink-0 items-center gap-1">
            <button type="button" onClick={share} aria-label="Share" className="flex h-10 w-10 items-center justify-center text-fg/80 hover:text-fg">
              <Share2 className="h-5 w-5" strokeWidth={1.4} />
            </button>
            <WishlistButton product={product} className="h-10 w-10 bg-transparent text-fg backdrop-blur-0 hover:scale-100" />
          </div>
        </div>

        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[18px]">
          <span>{formatPrice(price)}</span>
          {discount > 0 && (
            <>
              <span className="text-[15px] text-subtle line-through">{formatPrice(compareAt!)}</span>
              <span className="text-[13px] font-medium text-brand">-{discount}%</span>
            </>
          )}
        </p>
        {product.subtitle && <p className="mt-3 text-[14px] text-muted">{product.subtitle}</p>}

        {/* Colour */}
        <div className="mt-8 border-t border-line pt-6">
          <div className="flex items-center justify-between">
            <p className="text-[15px]">
              Colour: <span className="text-fg/80">{color || '—'}</span>
            </p>
            {product.availableColors.length > 0 && (
              <div className="flex flex-wrap justify-end gap-2.5">
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
                        'h-8 w-8 rounded-full border p-[3px] transition-colors',
                        color === c.name ? 'border-fg' : 'border-transparent hover:border-line-strong',
                        !any && 'opacity-40'
                      )}
                    >
                      <span className="block h-full w-full rounded-full ring-1 ring-inset ring-line-strong" style={{ backgroundColor: c.hex }} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Size */}
        <div className="mt-6 border-t border-line pt-6">
          <div className="flex items-center justify-between">
            <p className="text-[15px]">
              Size: <span className="text-fg/80">{size ?? 'Select'}</span>
            </p>
            <Link href="/size-guide" className="text-[13px] text-muted underline underline-offset-4 hover:text-fg">
              Size guide
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {sizesForColor.map(({ size: s, available }) => (
              <button
                key={s}
                type="button"
                disabled={!available}
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={cn(
                  'h-12 border text-[14px] transition-colors',
                  size === s ? 'border-fg bg-fg text-bg' : 'border-line text-fg/85 hover:border-fg',
                  !available && 'cursor-not-allowed text-subtle line-through hover:border-line'
                )}
              >
                {s}
              </button>
            ))}
          </div>
          {canBuy && stockLeft > 0 && stockLeft <= lowStockThreshold && (
            <p className="mt-3 text-[13px] text-warning">Only {stockLeft} left in this size</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            type="button"
            disabled={!canBuy}
            onClick={addToBag}
            className="flex h-14 w-full items-center justify-center bg-fg font-display text-[13px] font-medium uppercase tracking-[0.3em] text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {soldOut ? 'Sold out' : !variant ? 'Select a size' : !variant.inStock ? 'Unavailable' : 'Add to bag'}
          </button>
          <button
            type="button"
            disabled={!canBuy}
            onClick={buyNow}
            className="flex h-14 w-full items-center justify-center border border-fg font-display text-[13px] font-medium uppercase tracking-[0.3em] text-fg transition-colors hover:bg-fg hover:text-bg disabled:cursor-not-allowed disabled:opacity-40"
          >
            Buy now · Cash on Delivery
          </button>
          {waOrder && (
            <a
              href={waOrder}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-full items-center justify-center gap-3 text-[14px] text-fg/85 hover:text-fg"
            >
              <MessageCircle className="h-5 w-5 text-[#25D366]" strokeWidth={1.6} /> Order on WhatsApp
            </a>
          )}
        </div>

        <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-[13px] text-muted">
          <li className="flex items-center gap-3">
            <Banknote className="h-4 w-4 shrink-0" strokeWidth={1.5} /> Cash on Delivery anywhere in Pakistan
          </li>
          <li className="flex items-center gap-3">
            <Truck className="h-4 w-4 shrink-0" strokeWidth={1.5} /> {freeShipping ? 'Free delivery on this piece' : deliveryNote ?? 'Delivery across Pakistan'}
          </li>
          <li className="flex items-center gap-3">
            <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={1.5} /> Easy exchanges
          </li>
        </ul>

        {/* Details */}
        <div className="mt-8 border-t border-line">
          <Accordion title="Details" open>
            {product.description && <p>{product.description}</p>}
            {product.craftsmanshipNotes && <p className="mt-3">{product.craftsmanshipNotes}</p>}
            {product.fitInfo && <p className="mt-3"><span className="text-fg">Fit:</span> {product.fitInfo}</p>}
            {product.sku && <p className="mt-3 text-[12px] text-subtle">SKU: {product.sku}</p>}
          </Accordion>
          {(product.material || product.careInstructions.length > 0) && (
            <Accordion title="Composition & care">
              {product.material && <p>{product.material}</p>}
              {product.careInstructions.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {product.careInstructions.map((c) => (
                    <li key={c}>— {c}</li>
                  ))}
                </ul>
              )}
            </Accordion>
          )}
          <Accordion title="Delivery & returns">
            <p>{product.shippingInfo || 'Delivered across Pakistan by courier. Pay in cash when your parcel arrives.'}</p>
            <p className="mt-3">
              <Link href="/shipping" className="underline underline-offset-4">Delivery</Link>
              {' · '}
              <Link href="/returns" className="underline underline-offset-4">Exchanges & returns</Link>
            </p>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
