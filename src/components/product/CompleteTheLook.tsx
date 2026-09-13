'use client';

import React from 'react';
import { Product } from '@/lib/commerce/types';
import { ProductCard } from './ProductCard';

interface CompleteTheLookProps {
  title?: string;
  subtitle?: string;
  products: Product[];
}

export const CompleteTheLook: React.FC<CompleteTheLookProps> = ({
  title = 'Complete the Look',
  subtitle = 'CURATED HARMONIOUS PIECES',
  products,
}) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 border-t border-maison-stone/40 font-sans">
      <div className="space-y-8">
        <div className="space-y-1">
          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-maison-taupe">
            {subtitle}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-maison-obsidian">
            {title}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};
