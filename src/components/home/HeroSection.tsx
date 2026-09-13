'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-[90vh] min-h-[650px] overflow-hidden bg-maison-obsidian text-maison-ivory font-sans">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2400&auto=format&fit=crop"
          alt="LUCEVALIE Autumn / Winter 2026 Editorial Hero"
          fill
          priority
          className="object-cover object-center animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maison-obsidian/80 via-maison-obsidian/30 to-maison-obsidian/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-12 flex flex-col justify-between py-16 text-center">
        <div className="pt-8 sm:pt-12">
          <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-maison-parchment font-medium drop-shadow-sm">
            THE AUTUMN / WINTER 2026 CAMPAIGN
          </span>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto my-auto">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-maison-ivory leading-[1.08]">
            Form in Quiet Accord
          </h1>
          <p className="font-serif italic text-base sm:text-xl text-maison-stone font-light max-w-xl mx-auto leading-relaxed">
            Where unyielding European craftsmanship meets modern confidence and architectural restraint.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs tracking-[0.22em] uppercase">
            <Link
              href="/women"
              className="w-full sm:w-auto px-8 py-4 bg-maison-ivory text-maison-obsidian hover:bg-maison-warm-white transition-all duration-300 font-medium"
            >
              EXPLORE WOMEN
            </Link>
            <Link
              href="/men"
              className="w-full sm:w-auto px-8 py-4 border border-maison-ivory/80 text-maison-ivory hover:bg-maison-ivory hover:text-maison-obsidian transition-all duration-300 font-medium"
            >
              EXPLORE MEN
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 text-[10px] uppercase tracking-[0.25em] text-maison-stone opacity-80">
          <span>SCROLL TO DISCOVER</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce stroke-[1.5]" />
        </div>
      </div>
    </section>
  );
};
