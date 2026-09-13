'use client';

import React from 'react';
import Link from 'next/link';
import { X, Globe, Heart, ShoppingBag, Search, ChevronRight } from 'lucide-react';
import { useLocalization } from '@/context/LocalizationContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
}) => {
  const { currency, setIsCountryModalOpen } = useLocalization();
  const { count: wishlistCount } = useWishlist();
  const { itemCount: cartCount, setIsCartOpen } = useCart();

  if (!isOpen) return null;

  const navLinks = [
    { label: 'NEW ARRIVALS', href: '/new-arrivals' },
    { label: 'WOMEN', href: '/women' },
    { label: 'MEN', href: '/men' },
    { label: 'COLLECTIONS', href: '/collections' },
    { label: 'GIFTS', href: '/collections/cashmere-atelier' },
    { label: 'THE MAISON', href: '/maison' },
    { label: 'JOURNAL', href: '/journal' },
    { label: 'PRIVATE CLIENT', href: '/private-client' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-maison-ivory text-maison-obsidian flex flex-col justify-between overflow-y-auto animate-fade-in font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-maison-stone/40">
        <Link href="/" onClick={onClose} className="font-serif text-xl tracking-[0.25em] font-normal uppercase">
          LUCEVALIE
        </Link>
        <button onClick={onClose} className="p-2 text-maison-obsidian" aria-label="Close navigation">
          <X className="w-6 h-6 stroke-[1.2]" />
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 px-8 py-10 space-y-6">
        <div className="space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between font-serif text-2xl sm:text-3xl text-maison-obsidian hover:text-maison-taupe transition-colors tracking-wide py-1 border-b border-maison-stone/30"
            >
              <span>{link.label}</span>
              <ChevronRight className="w-5 h-5 text-maison-taupe-light" />
            </Link>
          ))}
        </div>

        {/* Quick Utilities */}
        <div className="pt-8 border-t border-maison-stone/40 space-y-4">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between text-xs tracking-[0.16em] uppercase text-maison-charcoal py-3 px-4 bg-maison-warm-white border border-maison-stone/50"
          >
            <span className="flex items-center space-x-3">
              <Search className="w-4 h-4 text-maison-taupe" />
              <span>Search Catalog</span>
            </span>
            <span className="text-maison-taupe text-[10px]">⌘K</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between text-xs tracking-[0.16em] uppercase text-maison-charcoal py-3 px-4 border border-maison-stone/50"
            >
              <span className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-maison-taupe" />
                <span>Wishlist</span>
              </span>
              {wishlistCount > 0 && (
                <span className="bg-maison-obsidian text-maison-ivory text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => {
                onClose();
                setIsCartOpen(true);
              }}
              className="flex items-center justify-between text-xs tracking-[0.16em] uppercase text-maison-charcoal py-3 px-4 border border-maison-stone/50"
            >
              <span className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-maison-taupe" />
                <span>Bag</span>
              </span>
              {cartCount > 0 && (
                <span className="bg-maison-obsidian text-maison-ivory text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer / Currency Controls */}
      <div className="p-8 border-t border-maison-stone/40 bg-maison-surface space-y-4">
        <button
          onClick={() => {
            onClose();
            setIsCountryModalOpen(true);
          }}
          className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] text-maison-obsidian"
        >
          <span className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-maison-taupe" />
            <span>Region & Currency</span>
          </span>
          <span className="font-semibold text-maison-taupe">{currency}</span>
        </button>

        <div className="pt-4 border-t border-maison-stone/30 flex justify-between text-[11px] text-maison-taupe uppercase tracking-widest">
          <span>&copy; {new Date().getFullYear()} LUCEVALIE MAISON</span>
          <Link href="/customer-care" onClick={onClose} className="underline">
            Customer Care
          </Link>
        </div>
      </div>
    </div>
  );
};
