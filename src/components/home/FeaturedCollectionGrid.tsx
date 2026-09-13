'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/commerce/types';
import { ProductCard } from '@/components/product/ProductCard';

interface FeaturedCollectionGridProps {
  title: string;
  subtitle: string;
  gender: 'women' | 'men';
  products: Product[];
  viewAllLink: string;
}

export const FeaturedCollectionGrid: React.FC<FeaturedCollectionGridProps> = ({
  title,
  subtitle,
  products,
  viewAllLink,
}) => {
  return (
    <section className="py-24 bg-maison-surface/60 border-b border-maison-stone/40 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-maison-stone/40 pb-6 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-taupe">
              {subtitle}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-maison-obsidian tracking-wide">
              {title}
            </h2>
          </div>

          <Link
            href={viewAllLink}
            className="text-xs font-medium tracking-[0.2em] uppercase text-maison-obsidian border-b border-maison-obsidian pb-1 hover:text-maison-taupe hover:border-maison-taupe transition-colors self-start md:self-auto"
          >
            VIEW ALL ARRIVALS &rarr;
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
