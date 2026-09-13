'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight } from 'lucide-react';
import { SearchResult } from '@/lib/commerce/types';
import { formatPrice } from '@/lib/utils';
import { useLocalization } from '@/context/LocalizationContext';

interface PredictiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PredictiveSearchModal: React.FC<PredictiveSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { currency } = useLocalization();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setResults(null);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();

    setIsSearching(true);

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(normalizedQuery)}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error('Search request failed.');
        }

        const searchResults =
          (await response.json()) as SearchResult;

        setResults(searchResults);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return;
        }

        console.error('Search interface error:', error);

        setResults({
          products: [],
          categories: [],
          articles: [],
          totalResults: 0,
        });
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-maison-obsidian/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Container */}
      <div className="relative max-w-4xl mx-auto mt-12 sm:mt-20 px-4 z-10">
        <div className="bg-maison-ivory border border-maison-stone/60 shadow-2xl overflow-hidden transition-all duration-300 animate-slide-up">
          {/* Input Header */}
          <div className="flex items-center px-6 py-5 border-b border-maison-stone/40">
            <Search className="w-5 h-5 text-maison-taupe stroke-[1.5] mr-4" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Cashmere, Outerwear, Tailoring, Leather Goods..."
              className="w-full bg-transparent text-sm sm:text-base font-serif placeholder:font-sans text-maison-obsidian placeholder:text-maison-taupe focus:outline-none tracking-wide"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-maison-taupe hover:text-maison-obsidian mr-2">
                Clear
              </button>
            )}
            <button onClick={onClose} className="p-2 text-maison-charcoal hover:text-maison-obsidian">
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Results Box */}
          <div className="max-h-[65vh] overflow-y-auto p-6 sm:p-8 space-y-8">
            {isSearching && (
              <div className="text-center py-12 text-xs uppercase tracking-[0.2em] text-maison-taupe">
                Searching Maison Catalog...
              </div>
            )}

            {!isSearching && !query && (
              <div className="space-y-4">
                <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-maison-taupe">
                  Suggested Searches
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Cashmere Overcoat', 'Silk Turtleneck', 'Virgin Wool Blazer', 'Calfskin Weekender', 'Suede Loafers'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-xs tracking-wider text-maison-charcoal bg-maison-warm-white border border-maison-stone/50 px-4 py-2 hover:border-maison-obsidian transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isSearching && results && results.totalResults === 0 && (
              <div className="text-center py-12 space-y-3">
                <p className="font-serif text-xl text-maison-obsidian">No items found matching &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-maison-taupe">Try searching for cashmere, blazer, coats, or leather goods.</p>
              </div>
            )}

            {!isSearching && results && results.products.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-maison-stone/30 pb-2">
                  <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-maison-taupe">
                    Products ({results.products.length})
                  </span>
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="text-[11px] uppercase tracking-[0.18em] text-maison-obsidian hover:underline flex items-center space-x-1"
                  >
                    <span>View All Results</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.products.map((product) => {
                    const primaryImg = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url || '';
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="group flex items-center space-x-4 p-2 hover:bg-maison-warm-white/70 transition-colors border border-transparent hover:border-maison-stone/40"
                      >
                        <div className="relative w-16 h-20 bg-maison-stone/30 flex-shrink-0 overflow-hidden">
                          <Image
                            src={primaryImg}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-[0.16em] text-maison-taupe block">
                            {product.category}
                          </span>
                          <h4 className="font-serif text-sm font-normal text-maison-obsidian group-hover:text-maison-taupe transition-colors leading-snug">
                            {product.title}
                          </h4>
                          <div className="text-xs font-sans text-maison-charcoal">
                            {formatPrice(product.price, currency)}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {!isSearching && results && results.articles.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-maison-stone/30">
                <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-maison-taupe">
                  Maison Stories & Journal ({results.articles.length})
                </span>
                <div className="space-y-3">
                  {results.articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/journal/${article.slug}`}
                      onClick={onClose}
                      className="block p-3 hover:bg-maison-warm-white border border-maison-stone/40 transition-colors"
                    >
                      <span className="text-[10px] uppercase tracking-widest text-maison-taupe">
                        {article.category} &bull; {article.publishedDate}
                      </span>
                      <h4 className="font-serif text-base text-maison-obsidian mt-0.5">{article.title}</h4>
                      <p className="text-xs text-maison-charcoal line-clamp-1 mt-1 font-light">{article.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
