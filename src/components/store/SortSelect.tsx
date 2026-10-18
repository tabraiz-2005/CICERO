'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get('sort') ?? 'featured';

  return (
    <label className="flex items-center gap-4">
      <SlidersHorizontal className="h-5 w-5 text-muted" strokeWidth={1.5} />
      <span className="hidden font-display text-[13px] uppercase tracking-wide2 text-muted sm:inline">Sort:</span>
      <span className="relative">
        <select
          value={current}
          onChange={(e) => {
            const next = new URLSearchParams(params.toString());
            if (e.target.value === 'featured') next.delete('sort');
            else next.set('sort', e.target.value);
            const qs = next.toString();
            router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
          }}
          className="h-11 w-[220px] appearance-none border border-line-strong bg-surface-2 pl-5 pr-12 font-display text-xs font-medium uppercase tracking-label text-fg focus:outline-none sm:h-12 sm:w-[300px] sm:pl-7"
          aria-label="Sort products"
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2" strokeWidth={1.5} />
      </span>
    </label>
  );
}
