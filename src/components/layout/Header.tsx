'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, Heart, ShoppingBag, Menu, Globe } from 'lucide-react';
import { useLocalization } from '@/context/LocalizationContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { AnnouncementBar } from './AnnouncementBar';
import { MegaMenu } from './MegaMenu';
import { MobileNavigation } from './MobileNavigation';
import { PredictiveSearchModal } from '@/components/search/PredictiveSearchModal';

interface HeaderProps {
  transparentHero?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ transparentHero = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { currency, setIsCountryModalOpen } = useLocalization();
  const { count: wishlistCount } = useWishlist();
  const { itemCount: cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'NEW ARRIVALS', href: '/new-arrivals', hasMega: false },
    { label: 'WOMEN', href: '/women', hasMega: true },
    { label: 'MEN', href: '/men', hasMega: true },
    { label: 'COLLECTIONS', href: '/collections', hasMega: true },
    { label: 'GIFTS', href: '/collections/cashmere-atelier', hasMega: false },
    { label: 'THE MAISON', href: '/maison', hasMega: true },
  ];

  const headerBgClass = transparentHero && !isScrolled
    ? 'bg-transparent text-maison-ivory border-b border-maison-ivory/15'
    : 'bg-maison-ivory/95 backdrop-blur-md text-maison-obsidian border-b border-maison-stone/40 shadow-sm';

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-colors duration-500 font-sans">
        <AnnouncementBar />

        <div className={`relative transition-all duration-300 ${headerBgClass}`}>
          <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 xl:px-10 h-20 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Mobile Menu Button */}
            <div className="flex items-center xl:hidden space-x-3 justify-self-start">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="p-2 text-current hover:opacity-75 transition-opacity"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6 stroke-[1.2]" />
              </button>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-current hover:opacity-75 transition-opacity xl:hidden"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-4 2xl:gap-7 text-[10px] 2xl:text-[11px] tracking-[0.14em] 2xl:tracking-[0.2em] font-medium uppercase justify-self-start whitespace-nowrap">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative py-7"
                  onMouseEnter={() => item.hasMega && setActiveMegaMenu(item.label)}
                >
                  <Link
                    href={item.href}
                    className="hover:text-maison-taupe transition-colors border-b border-transparent hover:border-current pb-1"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Center Brand Wordmark */}
            <div className="col-start-2 text-center justify-self-center">
              <Link
                href="/"
                className="block font-serif text-2xl sm:text-3xl tracking-[0.22em] sm:tracking-[0.28em] font-normal uppercase transition-opacity hover:opacity-85 whitespace-nowrap"
              >
                LUCEVALIE
              </Link>
            </div>

            {/* Utilities (Search, Account, Wishlist, Bag, Currency) */}
            <div className="col-start-3 flex items-center space-x-2 sm:space-x-4 2xl:space-x-5 text-current justify-self-end">
              {/* Country / Currency Selector */}
              <button
                onClick={() => setIsCountryModalOpen(true)}
                className="hidden md:flex items-center space-x-1.5 text-[11px] tracking-[0.16em] uppercase hover:text-maison-taupe transition-colors px-2 py-1"
                aria-label="Select currency"
              >
                <Globe className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>{currency}</span>
              </button>

              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden xl:block p-2 hover:text-maison-taupe transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4 stroke-[1.5]" />
              </button>

              {/* Account Link */}
              <Link
                href="/account"
                className="p-2 hover:text-maison-taupe transition-colors"
                aria-label="Account"
              >
                <User className="w-4 h-4 stroke-[1.5]" />
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-2 hover:text-maison-taupe transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 stroke-[1.5]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-maison-obsidian text-maison-ivory text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:text-maison-taupe transition-colors flex items-center space-x-1"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="text-[11px] font-medium tracking-widest">({cartCount})</span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Mega Menu Dropdown */}
          <MegaMenu
            activeMenu={activeMegaMenu}
            onClose={() => setActiveMegaMenu(null)}
          />
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      <MobileNavigation
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Predictive Search Modal */}
      <PredictiveSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
