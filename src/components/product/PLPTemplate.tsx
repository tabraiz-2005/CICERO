'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SlidersHorizontal, Grid2X2, Grid3X3, LayoutGrid, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/commerce/types';
import { ProductCard } from './ProductCard';
import { ProductFilterDrawer } from './ProductFilterDrawer';

interface PLPTemplateProps {
  title: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
  breadcrumbs: { label: string; href: string }[];
  products: Product[];
}

export const PLPTemplate: React.FC<PLPTemplateProps> = ({
  title,
  subtitle = 'LUCEVALIE COLLECTION',
  description,
  heroImage,
  breadcrumbs,
  products: initialProducts,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [columns, setColumns] = useState<2 | 3 | 4>(3);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    let filtered = [...initialProducts];

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.color) {
      filtered = filtered.filter((p) =>
        p.availableColors.some((c) => c.name.toLowerCase().includes(filters.color))
      );
    }
    if (filters.size) {
      filtered = filtered.filter((p) => p.availableSizes.includes(filters.size));
    }
    if (filters.sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setProducts(filtered);
  };

  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className="py-12 sm:py-16 bg-maison-ivory font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[11px] text-maison-taupe tracking-widest uppercase">
          <Link href="/" className="hover:text-maison-obsidian transition-colors">Home</Link>
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-maison-stone-dark" />
              <Link href={b.href} className="hover:text-maison-obsidian transition-colors">
                {b.label}
              </Link>
            </React.Fragment>
          ))}
        </nav>

        {/* Page Title & Intro */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-taupe">
            {subtitle}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-maison-obsidian tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="font-serif italic text-base text-maison-charcoal leading-relaxed font-light">
              {description}
            </p>
          )}
        </div>

        {/* Hero Banner if Provided */}
        {heroImage && (
          <div className="relative aspect-[21/9] w-full bg-maison-stone/30 overflow-hidden">
            <Image src={heroImage} alt={title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-maison-obsidian/20" />
          </div>
        )}

        {/* Utility Bar: Count, Filter & Grid Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-y border-maison-stone/50 py-4 gap-4">
          <div className="text-xs uppercase tracking-[0.18em] text-maison-taupe font-medium">
            SHOWING {products.length} {products.length === 1 ? 'PIECE' : 'PIECES'}
          </div>

          <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center space-x-2 text-xs uppercase tracking-[0.18em] text-maison-obsidian hover:text-maison-taupe transition-colors border border-maison-stone/60 px-4 py-2 bg-maison-surface/70"
            >
              <SlidersHorizontal className="w-4 h-4 stroke-[1.5]" />
              <span>FILTER & SORT</span>
            </button>

            {/* Desktop Grid Columns Switcher */}
            <div className="hidden lg:flex items-center space-x-1 border border-maison-stone/60 p-0.5 bg-maison-surface/70">
              <button
                onClick={() => setColumns(2)}
                className={`p-1.5 transition-colors ${columns === 2 ? 'bg-maison-obsidian text-maison-ivory' : 'text-maison-charcoal'}`}
                title="2 Columns"
              >
                <Grid2X2 className="w-4 h-4 stroke-[1.5]" />
              </button>
              <button
                onClick={() => setColumns(3)}
                className={`p-1.5 transition-colors ${columns === 3 ? 'bg-maison-obsidian text-maison-ivory' : 'text-maison-charcoal'}`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4 stroke-[1.5]" />
              </button>
              <button
                onClick={() => setColumns(4)}
                className={`p-1.5 transition-colors ${columns === 4 ? 'bg-maison-obsidian text-maison-ivory' : 'text-maison-charcoal'}`}
                title="4 Columns"
              >
                <LayoutGrid className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <h3 className="font-serif text-2xl text-maison-obsidian">No items match your active filters</h3>
            <p className="text-xs text-maison-taupe">Try resetting your filters to explore all pieces.</p>
            <button
              onClick={() => handleApplyFilters({})}
              className="text-xs uppercase tracking-[0.2em] text-maison-obsidian underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={`grid ${gridColsClass} gap-x-8 gap-y-12`}>
            {products.map((product, idx) => (
              <React.Fragment key={product.id}>
                <ProductCard product={product} />

                {/* Interspersed Editorial Banner after 4th item */}
                {idx === 3 && (
                  <div className="col-span-full py-8 my-4">
                    <div className="relative aspect-[21/7] bg-maison-espresso text-maison-ivory overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center p-8 sm:p-12 gap-6">
                      <div className="md:col-span-8 space-y-3 z-10">
                        <span className="text-[10px] uppercase tracking-[0.25em] text-maison-parchment font-medium">
                          ATELIER ESSENTIAL
                        </span>
                        <h3 className="font-serif text-2xl sm:text-4xl font-normal">
                          Hand-Draped Cashmere & Virgin Wool
                        </h3>
                        <p className="text-xs text-maison-stone font-light max-w-xl">
                          Every garment is tailored to embrace movement, lightness, and structural elegance.
                        </p>
                      </div>
                      <div className="md:col-span-4 z-10 text-left md:text-right">
                        <Link
                          href="/maison/craftsmanship"
                          className="inline-block px-6 py-3 bg-maison-ivory text-maison-obsidian text-xs font-medium uppercase tracking-[0.2em]"
                        >
                          READ STORY
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <ProductFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={activeFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={() => handleApplyFilters({})}
      />
    </div>
  );
};
