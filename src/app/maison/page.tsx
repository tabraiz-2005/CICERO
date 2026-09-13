import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'The Maison Ethos | LUCEVALIE',
  description: 'An exploration into the philosophy of quiet luxury, natural materiality, and European craftsmanship.',
};

export default function MaisonStoryPage() {
  return (
    <div className="bg-maison-ivory text-maison-obsidian font-sans">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] bg-maison-obsidian text-maison-ivory overflow-hidden flex items-center justify-center text-center">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="LUCEVALIE Maison Ethos"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="relative z-10 max-w-3xl px-6 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-maison-parchment font-medium">
            THE MAISON ETHOS
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-tight">
            Quiet Luxury & Enduring Form
          </h1>
          <p className="font-serif italic text-base sm:text-xl text-maison-stone font-light">
            Craftsmanship conceived not for trend, but for quiet permanence.
          </p>
        </div>
      </section>

      {/* Body Story */}
      <section className="py-24 max-w-4xl mx-auto px-6 sm:px-12 space-y-12 leading-relaxed text-maison-charcoal text-sm sm:text-base font-light">
        <div className="space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl text-maison-obsidian font-normal">
            The Philosophy of Restraint
          </h2>
          <p>
            LUCEVALIE was born from a singular conviction: that true sophistication requires no boastful logos or fleeting internet hype. It resides in the invisible—in the tension of high-altitude cashmere yarn, the soft canvas chest piece of an Italian blazer, and the unlined double-faced seam sewn by hand in Solomeo.
          </p>
        </div>

        <div className="relative aspect-[16/9] bg-maison-stone/30 overflow-hidden my-8">
          <Image
            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600&auto=format&fit=crop"
            alt="Solomeo Atelier Tailoring"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl text-maison-obsidian font-normal">
            Human Touch Over Mass Scale
          </h2>
          <p>
            Every coat, sweater, and calfskin portfolio in the LUCEVALIE catalog is created in small batch quantities across our four specialized partner ateliers in Northern Italy. We refuse industrial speed in favor of artisanal dignity.
          </p>
        </div>

        <div className="pt-8 border-t border-maison-stone/40 text-center space-y-4">
          <h3 className="font-serif text-2xl text-maison-obsidian">Explore Our Ateliers & Material Provenance</h3>
          <Link
            href="/maison/craftsmanship"
            className="inline-block px-8 py-3.5 bg-maison-obsidian text-maison-ivory text-xs font-medium uppercase tracking-[0.2em]"
          >
            DISCOVER CRAFTSMANSHIP &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
