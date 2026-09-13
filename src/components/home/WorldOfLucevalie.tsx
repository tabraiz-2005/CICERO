'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const WorldOfLucevalie: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-maison-surface/70 text-maison-obsidian font-sans border-b border-maison-stone/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-taupe">
            HERITAGE & ARTISTRY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-maison-obsidian leading-[1.12]">
            The World of LUCEVALIE
          </h2>
          <p className="font-serif italic text-base sm:text-xl text-maison-charcoal font-light leading-relaxed">
            Founded on European artisan traditions, LUCEVALIE unifies human artistry with architectural clarity.
          </p>
          <p className="text-xs sm:text-sm text-maison-taupe leading-relaxed font-light">
            Our ateliers across Solomeo, Biella, Como, and Florence combine century-old spinning, hand-draping, and vegetable leather tanning with modern environmental consciousness.
          </p>
          <div className="pt-2">
            <Link
              href="/maison"
              className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-maison-obsidian border-b border-maison-obsidian pb-1 hover:text-maison-taupe hover:border-maison-taupe transition-all"
            >
              READ MAISON ETHOS &rarr;
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 relative aspect-[16/10] bg-maison-stone/30 overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600&auto=format&fit=crop"
            alt="LUCEVALIE World of Craftsmanship"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      </div>
    </section>
  );
};
