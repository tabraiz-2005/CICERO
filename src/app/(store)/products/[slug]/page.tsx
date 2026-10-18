import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts, getSettings } from '@/lib/commerce/catalog';
import { ProductView } from '@/components/store/ProductView';
import { ProductCard } from '@/components/store/ProductCard';
import { Img } from '@/components/ui/Img';
import { primaryImage } from '@/lib/utils';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return { title: 'Not found' };
  const image = primaryImage(product.images);
  return {
    title: product.seoTitle.replace(/\s*\|\s*Cicero$/i, ''),
    description: product.seoDescription.slice(0, 160),
    openGraph: { images: image ? [image] : undefined },
  };
}

function Detail({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-6">
      <h3 className="label text-muted">{title}</h3>
      <div className="mt-4 text-[15px] leading-relaxed text-fg/90">{children}</div>
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();
  const [settings, related] = await Promise.all([getSettings(), getRelatedProducts(product, 4)]);

  const freeShipping = settings.free_shipping_threshold !== null && product.price * 100 >= settings.free_shipping_threshold;
  const gallery = product.images.slice(1);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: settings.store_name },
    image: product.images.map((i) => i.url),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: product.price,
      availability: product.totalStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductView product={product} lowStockThreshold={settings.low_stock_threshold} freeShipping={freeShipping} />

      <section id="details" className="site-x scroll-mt-28 pt-20 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <div>
            <p className="eyebrow">Garment file // {product.sku}</p>
            <h2 className="display mt-4 text-4xl lg:text-6xl">The details</h2>
            <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-fg/90">{product.description}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {product.material && <Detail title="Composition">{product.material}</Detail>}
            {product.fitInfo && <Detail title="Fit">{product.fitInfo}</Detail>}
            {product.careInstructions.length > 0 && (
              <Detail title="Care">
                <ul className="space-y-1.5">
                  {product.careInstructions.map((c) => (
                    <li key={c}>— {c}</li>
                  ))}
                </ul>
              </Detail>
            )}
            <Detail title="Shipping & returns">
              {product.shippingInfo || 'Express shipping in 2–4 business days. Free returns within 30 days.'}
            </Detail>
            {product.craftsmanshipNotes && <Detail title="Construction">{product.craftsmanshipNotes}</Detail>}
          </div>
        </div>

        {gallery.length > 0 && (
          <div className="mt-20 grid gap-3 sm:grid-cols-2 lg:gap-[42px]">
            {gallery.map((img, i) => (
              <div key={img.url + i} className="relative aspect-[3/4] overflow-hidden border border-line">
                <Img src={img.url} alt={img.alt} sizes="(max-width: 640px) 100vw, 50vw" />
              </div>
            ))}
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="site-x pt-24 lg:pt-32">
          <div className="flex items-end justify-between border-b border-line pb-8">
            <div>
              <p className="eyebrow">Garment system // Continue</p>
              <h2 className="display mt-4 text-4xl lg:text-6xl">You may also like</h2>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:gap-x-[42px] xl:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
