'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_CATEGORIES } from '@/lib/commerce/mockCatalog';

export const CategoryBanners: React.FC = () => {
  return (
    <section className="py-24 bg-maison-ivory text-maison-obsidian font-sans border-b border-maison-stone/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-taupe">
            DISCOVER THE MAISON
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-maison-obsidian tracking-wide">
            Category Stories & Ateliers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/women/${cat.slug}`}
              className="group relative aspect-[3/4] bg-maison-stone/30 overflow-hidden block"
            >
              <Image
                src={cat.heroImage}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maison-obsidian/75 via-maison-obsidian/20 to-transparent transition-opacity duration-300" />
              <div className="absolute bottom-6 left-6 right-6 text-maison-ivory space-y-1.5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-maison-parchment font-medium">
                  {cat.itemCount} PIECES
                </span>
                <h3 className="font-serif text-2xl font-normal tracking-wide">
                  {cat.name}
                </h3>
                <p className="text-xs text-maison-stone font-light line-clamp-2 opacity-90">
                  {cat.description}
                </p>
                <div className="pt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-maison-ivory group-hover:text-maison-parchment transition-colors border-b border-transparent group-hover:border-maison-parchment inline-block pb-0.5">
                  EXPLORE CATEGORY &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
