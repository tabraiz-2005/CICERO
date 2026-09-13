import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCollections } from '@/lib/commerce/supabaseApi';

export default async function CollectionsIndexPage() {
  const collections = await getCollections();

  return (
    <div className="py-20 bg-maison-ivory text-maison-obsidian font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-taupe">
            CURATED CAPSULES
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-maison-obsidian">
            The Atelier Collections
          </h1>
          <p className="font-serif italic text-base text-maison-charcoal leading-relaxed font-light">
            Explorations into rare natural fibers, architectural drape, and Italian artisanal tradition.
          </p>
        </div>

        <div className="space-y-16">
          {collections.map((col, idx) => (
            <div
              key={col.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:col-span-7 relative aspect-[16/10] bg-maison-stone/30 overflow-hidden group">
                <Image
                  src={col.heroImage}
                  alt={col.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="lg:col-span-5 space-y-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-maison-taupe">
                  {col.season} &bull; {col.featuredProductsCount} PIECES
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-maison-obsidian">
                  {col.name}
                </h2>
                <p className="font-serif italic text-sm sm:text-base text-maison-charcoal">
                  &ldquo;{col.storyQuote}&rdquo;
                </p>
                <p className="text-xs text-maison-taupe leading-relaxed font-light">
                  {col.description}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/collections/${col.slug}`}
                    className="inline-block px-8 py-3.5 bg-maison-obsidian text-maison-ivory text-xs font-medium uppercase tracking-[0.2em] hover:bg-maison-espresso transition-all"
                  >
                    EXPLORE CAPSULE &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
