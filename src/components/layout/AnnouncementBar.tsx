'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-maison-espresso text-maison-ivory text-[11px] font-sans tracking-[0.18em] uppercase py-2.5 px-4 flex items-center justify-between border-b border-maison-charcoal/40 relative z-40 transition-all duration-300">
      <div className="hidden sm:block w-12"></div>
      
      <div className="flex items-center justify-center space-x-3 text-center mx-auto">
        <span className="font-light text-maison-stone">
          COMPLIMENTARY GLOBAL EXPRESS SHIPPING & ADVISOR SERVICES
        </span>
        <Link
          href="/private-client"
          className="inline-flex items-center text-maison-ivory hover:text-maison-parchment transition-colors border-b border-maison-ivory/50 pb-0.5"
        >
          <span>DISCOVER CONCIERGE</span>
          <ChevronRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="text-maison-taupe-light hover:text-maison-ivory transition-colors p-1"
        aria-label="Close announcement bar"
      >
        <X className="w-3.5 h-3.5 stroke-[1.5]" />
      </button>
    </div>
  );
};
