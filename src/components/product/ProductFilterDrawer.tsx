'use client';

import React, { useState } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';

interface FilterState {
  category?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'featured' | 'newest' | 'price-low' | 'price-high';
}

interface ProductFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

export const ProductFilterDrawer: React.FC<ProductFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const categories = [
    { label: 'All Categories', value: '' },
    { label: 'Outerwear & Coats', value: 'outerwear' },
    { label: 'Knitwear & Sweaters', value: 'knitwear' },
    { label: 'Sartorial Tailoring', value: 'tailoring' },
    { label: 'Leather Goods', value: 'leather-goods' },
    { label: 'Footwear', value: 'footwear' },
    { label: 'Accessories', value: 'accessories' },
  ];

  const colors = [
    { name: 'Oatmeal / Cream', value: 'cream' },
    { name: 'Stone Grey', value: 'grey' },
    { name: 'Taupe', value: 'taupe' },
    { name: 'Espresso Brown', value: 'brown' },
    { name: 'Midnight Navy', value: 'navy' },
    { name: 'Charcoal Black', value: 'black' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '38', '40', '42', '48', '50', '52'];

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filter & Sort"
      subtitle="REFINE CATALOG SELECTION"
      width="md"
      footer={
        <div className="flex items-center space-x-3 font-sans">
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              setLocalFilters({});
              onResetFilters();
              onClose();
            }}
          >
            RESET ALL
          </Button>
          <Button variant="primary" fullWidth onClick={handleApply}>
            APPLY FILTERS
          </Button>
        </div>
      }
    >
      <div className="space-y-8 font-sans">
        {/* Sort Order */}
        <div className="space-y-3">
          <label className="text-[11px] font-medium tracking-[0.18em] uppercase text-maison-taupe block">
            Sort Order
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Featured', value: 'featured' },
              { label: 'Newest Arrivals', value: 'newest' },
              { label: 'Price: Low to High', value: 'price-low' },
              { label: 'Price: High to Low', value: 'price-high' },
            ].map((s) => (
              <button
                key={s.value}
                onClick={() => setLocalFilters((prev) => ({ ...prev, sort: s.value as any }))}
                className={`py-2.5 px-3 text-xs uppercase tracking-wider border transition-all ${
                  localFilters.sort === s.value
                    ? 'border-maison-obsidian bg-maison-obsidian text-maison-ivory'
                    : 'border-maison-stone/60 bg-maison-surface/60 text-maison-charcoal hover:border-maison-stone-dark'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-3">
          <label className="text-[11px] font-medium tracking-[0.18em] uppercase text-maison-taupe block">
            Category
          </label>
          <div className="space-y-1.5">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setLocalFilters((prev) => ({ ...prev, category: c.value }))}
                className={`w-full text-left py-2 px-3 text-xs uppercase tracking-wider border transition-all flex items-center justify-between ${
                  localFilters.category === c.value
                    ? 'border-maison-obsidian bg-maison-warm-white font-medium text-maison-obsidian'
                    : 'border-transparent hover:bg-maison-surface text-maison-charcoal'
                }`}
              >
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <label className="text-[11px] font-medium tracking-[0.18em] uppercase text-maison-taupe block">
            Size
          </label>
          <div className="grid grid-cols-4 gap-2">
            {sizes.map((sz) => (
              <button
                key={sz}
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    size: prev.size === sz ? undefined : sz,
                  }))
                }
                className={`py-2 text-xs uppercase tracking-widest border transition-all ${
                  localFilters.size === sz
                    ? 'border-maison-obsidian bg-maison-obsidian text-maison-ivory'
                    : 'border-maison-stone/60 bg-transparent text-maison-charcoal hover:border-maison-obsidian'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <label className="text-[11px] font-medium tracking-[0.18em] uppercase text-maison-taupe block">
            Color Palette
          </label>
          <div className="grid grid-cols-2 gap-2">
            {colors.map((clr) => (
              <button
                key={clr.value}
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    color: prev.color === clr.value ? undefined : clr.value,
                  }))
                }
                className={`py-2 px-3 text-xs text-left uppercase tracking-wider border transition-all ${
                  localFilters.color === clr.value
                    ? 'border-maison-obsidian bg-maison-warm-white text-maison-obsidian font-medium'
                    : 'border-maison-stone/60 bg-transparent text-maison-charcoal hover:border-maison-stone-dark'
                }`}
              >
                {clr.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
