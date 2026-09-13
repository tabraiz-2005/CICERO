'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const SignatureCraftSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-maison-espresso text-maison-ivory font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Narrative Side */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-parchment">
              THE CASHMERE ATELIER
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-maison-ivory leading-[1.12]">
              The Anatomy of Pure Lightness
            </h2>
          </div>

          <p className="font-serif italic text-base sm:text-xl text-maison-stone font-light leading-relaxed">
            &ldquo;Each fiber is combed by hand from high-altitude Mongolian herds, spun into 4-ply yarns, and knitted in Umbria with uncompromised tension.&rdquo;
          </p>

          <div className="space-y-4 text-xs text-maison-stone-dark leading-relaxed">
            <div className="border-l border-maison-gold/60 pl-4 py-1">
              <h4 className="text-maison-ivory font-medium uppercase tracking-wider text-[11px] mb-1">
                Undyed Purity
              </h4>
              <p>Preserving natural earth shades of vicuña, chalk, and charcoal without chemical bleaching.</p>
            </div>

            <div className="border-l border-maison-gold/60 pl-4 py-1">
              <h4 className="text-maison-ivory font-medium uppercase tracking-wider text-[11px] mb-1">
                Hand-Split Double Face
              </h4>
              <p>Two layers of pure cashmere joined by invisible hand-stitching along every internal margin.</p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/collections/cashmere-atelier"
              className="inline-block px-8 py-4 bg-maison-ivory text-maison-obsidian text-xs font-medium uppercase tracking-[0.2em] hover:bg-maison-warm-white transition-all"
            >
              EXPLORE THE CASHMERE CAPSULE
            </Link>
          </div>
        </div>

        {/* Visual Side */}
        <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] bg-maison-charcoal overflow-hidden group border border-maison-charcoal/60">
          <Image
            src="https://images.unsplash.com/photo-1608234807905-4466023792f5?q=80&w=1800&auto=format&fit=crop"
            alt="LUCEVALIE Cashmere Atelier Detail"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      </div>
    </section>
  );
};
