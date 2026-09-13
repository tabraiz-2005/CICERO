'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface MegaMenuProps {
  activeMenu: string | null;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ activeMenu, onClose }) => {
  if (!activeMenu) return null;

  const getMenuContent = () => {
    switch (activeMenu) {
      case 'WOMEN':
        return {
          title: "Women's Collection",
          subtitle: 'Autumn / Winter 2026',
          categories: [
            { name: 'All Women', href: '/women' },
            { name: 'New Arrivals', href: '/new-arrivals' },
            { name: 'Outerwear & Coats', href: '/women/outerwear' },
            { name: 'Cashmere & Knitwear', href: '/women/knitwear' },
            { name: 'Tailoring & Blazers', href: '/women/tailoring' },
            { name: 'Leather Goods & Bags', href: '/women/leather-goods' },
            { name: 'Footwear', href: '/women/footwear' },
            { name: 'Silk Accessories', href: '/women/accessories' },
          ],
          featuredImage: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop',
          featuredCaption: 'The Double-Faced Cashmere Overcoat',
          featuredLink: '/products/double-faced-cashmere-belted-overcoat',
        };
      case 'MEN':
        return {
          title: "Men's Collection",
          subtitle: 'Contemporary Tailoring & Fine Knitwear',
          categories: [
            { name: 'All Men', href: '/men' },
            { name: 'New Arrivals', href: '/new-arrivals' },
            { name: 'Overcoats & Jackets', href: '/men/outerwear' },
            { name: 'Seamless Knitwear', href: '/men/knitwear' },
            { name: 'Sartorial Blazers', href: '/men/tailoring' },
            { name: 'Calfskin Leather Goods', href: '/men/leather-goods' },
            { name: 'Italian Loafers & Shoes', href: '/men/footwear' },
            { name: 'Cashmere Scarves', href: '/men/accessories' },
          ],
          featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
          featuredCaption: 'Deconstructed Virgin Wool Tailoring',
          featuredLink: '/products/double-breasted-virgin-wool-blazer',
        };
      case 'COLLECTIONS':
        return {
          title: 'Curated Capsules',
          subtitle: 'The Atelier Editions',
          categories: [
            { name: 'Autumn / Winter 2026', href: '/collections/autumn-winter-2026' },
            { name: 'Cashmere Atelier', href: '/collections/cashmere-atelier' },
            { name: 'Heritage Tailoring', href: '/collections/heritage-tailoring' },
            { name: 'Timeless Essentials', href: '/collections' },
          ],
          featuredImage: 'https://images.unsplash.com/photo-1608234807905-4466023792f5?q=80&w=800&auto=format&fit=crop',
          featuredCaption: 'Discover the Cashmere Atelier Story',
          featuredLink: '/collections/cashmere-atelier',
        };
      case 'THE MAISON':
        return {
          title: 'The World of LUCEVALIE',
          subtitle: 'Philosophy, Artisans & Heritage',
          categories: [
            { name: 'Maison Story', href: '/maison' },
            { name: 'Atelier & Craftsmanship', href: '/maison/craftsmanship' },
            { name: 'Journal & Editorial Stories', href: '/journal' },
            { name: 'Private Client Concierge', href: '/private-client' },
          ],
          featuredImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
          featuredCaption: 'Inside our Solomeo & Biella Ateliers',
          featuredLink: '/maison/craftsmanship',
        };
      default:
        return null;
    }
  };

  const content = getMenuContent();
  if (!content) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 bg-maison-ivory/98 backdrop-blur-md border-b border-maison-stone/50 shadow-luxury z-40 transition-all duration-300 animate-fade-in font-sans"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-12 gap-12">
        {/* Hierarchy Column */}
        <div className="col-span-4 space-y-6 border-r border-maison-stone/40 pr-8">
          <div>
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-maison-taupe">
              {content.subtitle}
            </p>
            <h3 className="font-serif text-2xl font-normal text-maison-obsidian mt-1">
              {content.title}
            </h3>
          </div>

          <div className="pt-2 space-y-3">
            {content.categories.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className="group flex items-center justify-between text-xs tracking-[0.14em] uppercase text-maison-charcoal hover:text-maison-obsidian transition-colors py-1"
              >
                <span className="border-b border-transparent group-hover:border-maison-obsidian pb-0.5 transition-all">
                  {item.name}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-maison-taupe" />
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Editorial Card */}
        <div className="col-span-5 relative group overflow-hidden">
          <Link href={content.featuredLink} onClick={onClose} className="block aspect-[16/10] relative overflow-hidden bg-maison-stone/30">
            <Image
              src={content.featuredImage}
              alt={content.featuredCaption}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-maison-obsidian/60 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 text-maison-ivory space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-maison-parchment">Editorial Highlight</span>
              <h4 className="font-serif text-xl font-normal leading-snug">{content.featuredCaption}</h4>
            </div>
          </Link>
        </div>

        {/* Brand Quote / Atelier Highlight */}
        <div className="col-span-3 flex flex-col justify-between p-6 bg-maison-warm-white/80 border border-maison-stone/50">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-maison-taupe">The Maison Philosophy</span>
            <p className="font-serif italic text-sm text-maison-charcoal leading-relaxed">
              &ldquo;Quiet luxury rests in restraint, where unyielding craftsmanship creates timeless desire.&rdquo;
            </p>
          </div>
          <Link
            href="/maison"
            onClick={onClose}
            className="text-[11px] uppercase tracking-[0.18em] text-maison-obsidian border-b border-maison-obsidian/50 hover:border-maison-obsidian inline-block pb-0.5"
          >
            Discover our Ethos &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
