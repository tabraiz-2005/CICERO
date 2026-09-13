import React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Artisanal Ateliers & Craftsmanship | LUCEVALIE',
  description: 'Detailed insights into Biella double-faced cashmere sewing, Solomeo soft tailoring, and Tuscan leather craftsmanship.',
};

export default function CraftsmanshipPage() {
  const ateliers = [
    {
      name: 'Biella Cashmere Atelier',
      region: 'Piedmont, Italy',
      focus: 'Double-Faced Outerwear & Unlined Hand-Stitching',
      desc: 'Master craftswomen spend up to 38 hours splitting two ultra-thin layers of Mongolian cashmere, turning the raw edges inward and hand-stitching with invisible tension.',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Solomeo Tailoring House',
      region: 'Umbria, Italy',
      focus: 'Deconstructed Soft Shoulder Jackets & Blazers',
      desc: 'Freeing the masculine and feminine silhouette from stiff internal canvas. Using natural horsehair chest pieces and hand-shaped lapel rolls.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Florence Leather Workshop',
      region: 'Tuscany, Italy',
      focus: 'Full-Grain Tuscan Calfskin & Suede Lining',
      desc: 'Third-generation leather artisans vegetable-tanning hides with organic chestnut extracts, burnishing raw edges by hand.',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  return (
    <div className="py-20 bg-maison-ivory text-maison-obsidian font-sans">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-taupe">
            HERITAGE & PROVENANCE
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal">
            The Specialized Ateliers
          </h1>
          <p className="font-serif italic text-base text-maison-charcoal leading-relaxed font-light">
            Behind every LUCEVALIE creation is a legacy of specialized regional mastery across Italy.
          </p>
        </div>

        <div className="space-y-16">
          {ateliers.map((a, idx) => (
            <div
              key={a.name}
              className={`grid grid-cols-1 md:grid-cols-12 gap-10 items-center ${
                idx % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="md:col-span-6 relative aspect-[4/3] bg-maison-stone/30 overflow-hidden">
                <Image src={a.image} alt={a.name} fill className="object-cover" />
              </div>

              <div className="md:col-span-6 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-maison-gold font-medium">
                  {a.region} &bull; {a.focus}
                </span>
                <h2 className="font-serif text-3xl font-normal text-maison-obsidian">{a.name}</h2>
                <p className="text-xs sm:text-sm text-maison-charcoal leading-relaxed font-light">
                  {a.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
