import type { Metadata } from 'next';
import Link from 'next/link';
import { getSettings } from '@/lib/commerce/catalog';

export const metadata: Metadata = {
  title: 'About Cicero',
  description:
    'Cicero is a family business that began with Chiragh Din Knitwear and grew, generation by generation, into a Gujranwala retail name for coats, jackets and knitwear. Now delivering across Pakistan.',
};

const STORY = [
  {
    heading: 'Where it began',
    body: [
      'Cicero’s story begins long before the name on our signboard. It started with Chiragh Din Knitwear, a family workshop built on a simple belief: good knitwear should be made carefully, priced honestly and worn for years.',
      'Those early years taught our family what still guides us today — how yarn should feel, how a seam should sit, and why the details nobody notices are the ones that make a garment last.',
    ],
  },
  {
    heading: 'Passed down',
    body: [
      'The craft was handed from father to son, and then to the next generation. Each one learned the trade on the workshop floor, kept the standards it inherited, and added something of its own — new fabrics, new styles and a closer understanding of what our customers wanted.',
    ],
  },
  {
    heading: 'Cicero, the store',
    body: [
      'In 2008 the family brought that experience to retail and opened Cicero in Satellite Town, Gujranwala. Amir Khan, who studied fashion in Milan, shaped the store around one promise that is still printed on every bag: we make you more beautiful.',
      'From knitwear the range grew into wool coats, jackets and winter essentials for men and women — chosen and finished with the same care as the pieces our family first made.',
    ],
  },
  {
    heading: 'Today',
    body: [
      'Today Cicero is led by the next generation, Zaid and Jawad. Zaid brings years of experience in business and manufacturing, working directly with makers on fabric, fit and price, so quality stays high while prices stay fair.',
      'With a loyal following in Gujranwala and a growing family team, we are now bringing Cicero to customers across Pakistan through this online store — the same pieces, the same people and the same promise, delivered to your door with Cash on Delivery.',
    ],
  },
];

const VALUES = [
  { title: 'Made with care', text: 'Roots in knitwear manufacturing mean we know how a garment should be made.' },
  { title: 'Honest prices', text: 'Working directly with makers keeps quality high and prices fair.' },
  { title: 'Personal service', text: 'A family business that still answers every message on WhatsApp.' },
];

export default async function About() {
  const s = await getSettings();
  return (
    <div className="site-x pt-10 lg:pt-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Our story</p>
        <h1 className="display mt-4 text-[40px] lg:text-[60px]">About Cicero</h1>
        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-fg/85 lg:text-[19px]">
          A family business three generations in the making — from a knitwear workshop to a Gujranwala store, and now to homes across Pakistan.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-4xl border-t border-line">
        {STORY.map((sec, i) => (
          <section key={sec.heading} className="grid gap-4 border-b border-line py-10 md:grid-cols-[64px_200px_1fr] md:gap-8 lg:py-12">
            <span className="font-display text-sm text-subtle">{String(i + 1).padStart(2, '0')}</span>
            <h2 className="label text-fg md:pt-1">{sec.heading}</h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-fg/85 lg:text-[16px]">
              {sec.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl gap-px border border-line bg-line sm:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="bg-bg p-8">
            <h3 className="label text-fg">{v.title}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">{v.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 flex max-w-4xl flex-col items-center gap-4 text-center">
        <p className="font-display text-[18px] italic text-fg/80">“{s.tagline || 'we make you more beautiful'}”</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link href="/shop" className="btn-primary h-14 px-10">Shop the collection</Link>
          <Link href="/contact" className="btn-outline h-14 px-10">Visit the store</Link>
        </div>
        {s.address && (
          <p className="mt-4 text-sm text-muted">
            {s.address}
            {s.opening_hours ? ` · ${s.opening_hours}` : ''}
          </p>
        )}
      </div>
    </div>
  );
}
