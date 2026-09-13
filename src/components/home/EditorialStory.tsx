'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const EditorialStory: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-maison-ivory text-maison-obsidian font-sans border-b border-maison-stone/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Editorial Photograph */}
        <div className="lg:col-span-7 relative aspect-[4/5] bg-maison-stone/30 overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1600&auto=format&fit=crop"
            alt="LUCEVALIE Editorial Craftsmanship"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute bottom-6 left-6 bg-maison-ivory/90 backdrop-blur-xs px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-maison-charcoal border border-maison-stone/40">
            Biella Atelier &bull; Hand-Draped Double-Face Cashmere
          </div>
        </div>

        {/* Narrative Content */}
        <div className="lg:col-span-5 space-y-8 pr-0 lg:pr-6">
          <div className="space-y-3">
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-taupe">
              SEASONAL EDITORIAL STORY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.12] text-maison-obsidian">
              The Substance of Silence
            </h2>
          </div>

          <p className="font-serif italic text-base sm:text-lg text-maison-charcoal leading-relaxed font-light">
            &ldquo;In a world of constant noise, true luxury requires no gesture of bravado. It rests in quiet proportion, natural raw materials, and unyielding human touch.&rdquo;
          </p>

          <p className="text-xs sm:text-sm text-maison-taupe leading-relaxed font-sans">
            Harvested from high-altitude Mongolian plateaus and hand-finished in Italian ateliers, each piece is conceived as a modern heirloom designed to endure across generations.
          </p>

          <div className="pt-4">
            <Link
              href="/collections/autumn-winter-2026"
              className="inline-block text-xs font-medium uppercase tracking-[0.22em] text-maison-obsidian border-b border-maison-obsidian pb-1 hover:text-maison-taupe hover:border-maison-taupe transition-all"
            >
              DISCOVER THE COLLECTION &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
