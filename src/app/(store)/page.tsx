import Link from 'next/link';
import { HeroSection } from '@/components/store/HeroImage';
import { ArrowUpRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { groupByLook } from '@/lib/commerce/tone';
import { arrange, getCollections, getProducts, getSettings } from '@/lib/commerce/catalog';
import { ProductCard } from '@/components/store/ProductCard';
import { GarmentArt } from '@/components/store/GarmentArt';
import { Img } from '@/components/ui/Img';
import { formatCents } from '@/lib/utils';

export default async function HomePage() {
  const [settings, collections, all] = await Promise.all([
    getSettings(),
    getCollections(),
    getProducts({ sort: 'recent' }),
  ]);
  // One list: the latest uploads and featured pieces first, all categories mixed.
  const everything = await groupByLook(arrange(all));
  const ALL_LIMIT = 24;

  return (
    <>
      {/* Campaign hero: full-bleed photo, centred serif headline */}
      {settings.hero_image_url ? (
        <HeroSection desktop={settings.hero_image_url} mobile={settings.hero_image_mobile_url} alt={settings.hero_title}>
          <HeroCopy eyebrow={settings.hero_eyebrow} title={settings.hero_title} subtitle={settings.hero_subtitle} />
        </HeroSection>
      ) : (
        <section className="relative h-[78svh] min-h-[560px] overflow-hidden bg-black">
          <GarmentArt category="coat" className="bg-surface" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <HeroCopy eyebrow={settings.hero_eyebrow} title={settings.hero_title} subtitle={settings.hero_subtitle} />
        </section>
      )}

      {/* Everything else */}
      {everything.length > 0 && (
        <section className="site-x pt-14 lg:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted">The collection</p>
              <h2 className="mt-2 font-serif text-[32px] font-normal leading-tight lg:text-[44px]">All pieces</h2>
            </div>
            <Link href="/shop" className="label link-u text-muted">
              Shop all {all.length}
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:gap-x-6 lg:gap-y-12 xl:grid-cols-4">
            {everything.slice(0, ALL_LIMIT).map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
          {everything.length > ALL_LIMIT && (
            <div className="mt-12 flex justify-center">
              <Link href="/shop" className="btn-outline h-14 px-10">View all {all.length} pieces</Link>
            </div>
          )}
        </section>
      )}

      {/* Collections */}
      {collections.length > 0 && (
        <section className="site-x pt-14 lg:pt-20">
          <div className="grid gap-3 md:grid-cols-2 lg:gap-[42px]">
            {collections.slice(0, 2).map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden border border-line sm:aspect-[16/11]">
                {c.heroImage ? (
                  <Img src={c.heroImage} alt={c.name} sizes="(max-width: 768px) 100vw, 50vw" className="transition-transform duration-700 group-hover:scale-[1.03]" />
                ) : (
                  <GarmentArt category={c.slug.includes('knit') ? 'sweater' : 'coat'} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white lg:p-10">
                  <p className="font-display text-xs uppercase tracking-wide2 text-white/70">Collection</p>
                  <h3 className="mt-3 font-display text-[26px] font-normal uppercase tracking-[0.06em] lg:text-[34px]">{c.name}</h3>
                  {c.storyQuote && <p className="mt-4 max-w-md text-sm text-white/80">{c.storyQuote}</p>}
                  <span className="label mt-6 inline-flex items-center gap-2 border-b border-white pb-1">
                    Explore <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Service strip */}
      <section className="site-x pt-14 lg:pt-20">
        <div className="grid border border-line sm:grid-cols-3">
          {[
            {
              icon: Truck,
              title: 'Delivery across Pakistan',
              text: settings.free_shipping_threshold
                ? `Tracked courier delivery. Free on orders over ${formatCents(settings.free_shipping_threshold)}.`
                : 'Tracked courier delivery to your door.',
            },
            { icon: RotateCcw, title: 'Easy exchanges', text: 'Wrong size? Message us on WhatsApp and we will help you exchange it.' },
            { icon: ShieldCheck, title: 'Cash on Delivery', text: 'Pay in cash when your parcel arrives, anywhere in Pakistan.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-5 border-line p-8 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-b-0 sm:[&:not(:last-child)]:border-r lg:p-10">
              <Icon className="h-6 w-6 shrink-0" strokeWidth={1.4} />
              <div>
                <h3 className="label">{title}</h3>
                <p className="mt-3 text-sm text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function HeroCopy({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="site-x absolute inset-0 flex flex-col items-start justify-end pb-12 text-left text-white sm:pb-16 lg:justify-center lg:pb-0">
      {eyebrow && <p className="font-display text-[10.5px] uppercase tracking-[0.36em] text-white/85 sm:text-[12px]">{eyebrow}</p>}
      <h1 className="mt-4 max-w-[12ch] font-serif text-[46px] font-normal leading-[1] tracking-[0.005em] sm:text-[68px] lg:mt-5 lg:text-[92px]">
        {title}
      </h1>
      {subtitle && <p className="mt-4 max-w-[46ch] text-[14px] text-white/90 sm:text-[16px] lg:mt-6 lg:text-[18px]">{subtitle}</p>}
      <div className="mt-8 flex w-full max-w-[560px] flex-col gap-3 sm:w-auto sm:flex-row lg:mt-10">
        <Link
          href="/men"
          className="inline-flex h-12 items-center justify-center bg-white px-12 font-display text-[11.5px] font-medium uppercase tracking-[0.26em] text-[#1d1d1b] transition-colors hover:bg-white/85 sm:h-14 sm:min-w-[240px]"
        >
          Shop men
        </Link>
        <Link
          href="/women"
          className="inline-flex h-12 items-center justify-center border border-white px-12 font-display text-[11.5px] font-medium uppercase tracking-[0.26em] text-white transition-colors hover:bg-white hover:text-[#1d1d1b] sm:h-14 sm:min-w-[200px]"
        >
          Shop women
        </Link>
      </div>
    </div>
  );
}
