import type { Metadata } from 'next';
import Link from 'next/link';
import { getSettings } from '@/lib/commerce/catalog';

export const metadata: Metadata = {
  title: 'About Cicero',
  description:
    'Cicero has dressed Gujranwala for winter since 2008. Founded by Amir Khan, now run by Zaid and Jawad, and now delivering across Pakistan with Cash on Delivery.',
};

const STORY = [
  {
    heading: 'Since 2008',
    body: 'Cicero was founded in 2008 by Amir Khan, who studied fashion in Milan, Italy. He opened the first shop in Satellite Town, Gujranwala, with one idea that is still printed on every bag and signboard: we make you more beautiful.',
  },
  {
    heading: 'The next generation',
    body: 'Today Cicero is run by Amir Khan’s nephews, Zaid and Jawad. Zaid brings years of experience in business and manufacturing, which lets us work closely with makers on fabric, fit and price. Together the family is growing Cicero from a well-known Gujranwala shop into a name across Pakistan.',
  },
  {
    heading: 'The store today',
    body: 'Our store is full of coats, jackets, sweaters and knitwear for men and women every winter. Come in, try things on, and get honest advice on size and fit from people who have done this for years.',
  },
  {
    heading: 'Now online',
    body: 'The same pieces and the same care are now on this website. Order online, pay in cash when your parcel arrives anywhere in Pakistan, and message us on WhatsApp whenever you need help.',
  },
];

function Photo({ src, alt, caption, className, position }: { src: string; alt: string; caption?: string; className?: string; position?: string }) {
  return (
    <figure className={`relative overflow-hidden border border-line bg-surface ${className ?? ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${position ?? ''}`} />
      {caption && (
        <figcaption className="absolute bottom-0 left-0 bg-bg/85 px-4 py-2.5 font-display text-[11px] uppercase tracking-label text-fg backdrop-blur">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default async function About() {
  const s = await getSettings();
  return (
    <div className="site-x pt-10 lg:pt-14">
      <p className="eyebrow">Our story // Since 2008</p>
      <h1 className="display mt-4 text-[40px] lg:text-[60px]">About Cicero</h1>
      <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-fg/85">
        A Gujranwala shop that has dressed the city for winter since 2008, now delivering across Pakistan.
      </p>

      <div className="mt-12 grid gap-4 lg:h-[560px] lg:grid-cols-[3fr_2fr]">
        <Photo src="/about/store-jackets.webp" alt="Jackets and coats on the walls of the Cicero store in Gujranwala" className="aspect-[4/3] lg:aspect-auto" caption="The store today" />
        <Photo src="/about/shop-2008-front.webp" alt="The original Cicero shop front with its red signboard" className="aspect-square lg:aspect-auto" position="object-top" caption="Where it started" />
      </div>

      <div className="mt-12 border-t border-line">
        {STORY.map((sec, i) => (
          <section key={sec.heading} className="grid gap-4 border-b border-line py-10 lg:grid-cols-[80px_1fr_2fr] lg:gap-10">
            <span className="font-display text-sm text-subtle">{String(i + 1).padStart(2, '0')}</span>
            <h2 className="label text-fg">{sec.heading}</h2>
            <p className="max-w-2xl text-[15px] leading-relaxed text-fg/85">{sec.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-[320px_320px]">
        <Photo src="/about/store-coats.webp" alt="Women's wool coats in many colours at Cicero" className="col-span-2 aspect-[4/3] lg:aspect-auto" caption="Women's coats" />
        <Photo src="/about/store-aisle.webp" alt="Inside the Cicero store" className="aspect-[9/16] lg:row-span-2 lg:aspect-auto" />
        <Photo src="/about/cicero-bags.webp" alt="Black Cicero shopping bags" className="aspect-[9/16] lg:row-span-2 lg:aspect-auto" position="object-[20%_85%]" />
        <Photo src="/about/store-knitwear.webp" alt="Knit sweaters in winter colours" className="col-span-2 aspect-[4/3] lg:aspect-auto" caption="Knitwear" />
      </div>

      <div className="mt-12 overflow-hidden border border-line bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/about/cicero-sign.webp" alt="The lit Cicero signboard: we make you more beautiful" loading="lazy" className="block h-auto w-full" />
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-line pt-10 sm:flex-row">
        <Link href="/shop" className="btn-primary h-14 px-10">Shop the collection</Link>
        <Link href="/contact" className="btn-outline h-14 px-10">Visit the store</Link>
      </div>
      {s.address && <p className="mt-6 text-sm text-muted">{s.address}{s.opening_hours ? ` · ${s.opening_hours}` : ''}</p>}
    </div>
  );
}
