'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  allowMultiple = false,
  className,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('divide-y divide-maison-stone/50 border-t border-b border-maison-stone/50', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="py-4">
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between text-left py-2 group focus:outline-none"
              aria-expanded={isOpen}
            >
              <div>
                <span className="font-serif text-lg font-normal text-maison-obsidian group-hover:text-maison-taupe transition-colors duration-200">
                  {item.title}
                </span>
                {item.subtitle && (
                  <p className="text-[11px] text-maison-taupe tracking-wider uppercase mt-0.5">
                    {item.subtitle}
                  </p>
                )}
              </div>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-maison-charcoal stroke-[1.5] transition-transform duration-300',
                  isOpen && 'transform rotate-180'
                )}
              />
            </button>

            {isOpen && (
              <div className="pt-3 pb-2 text-xs sm:text-sm text-maison-charcoal font-sans leading-relaxed transition-all duration-300 animate-fade-in space-y-2">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
