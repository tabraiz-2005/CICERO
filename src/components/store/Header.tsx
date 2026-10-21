'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { SearchOverlay } from './SearchOverlay';
import { Logo } from './Logo';

export interface NavCategory {
  slug: string;
  name: string;
}

function Count({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-fg px-1 font-display text-[10px] font-bold text-bg">
      {n}
    </span>
  );
}

function NavLinks({ categories, onNavigate, vertical }: { categories: NavCategory[]; onNavigate?: () => void; vertical?: boolean }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const links = [
    { href: '/men', label: 'Men', active: pathname === '/men' },
    { href: '/women', label: 'Women', active: pathname === '/women' },
    ...categories.map((c) => ({
      href: `/shop?category=${c.slug}`,
      label: c.name,
      active: pathname === '/shop' && params.get('category') === c.slug,
    })),
  ];
  const contact = { href: '/contact', label: 'Contact', active: pathname === '/contact' };
  return (
    <>
      {links.map((l, i) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onNavigate}
          className={cn(
            'font-display uppercase transition-colors hover:text-fg',
            vertical
              ? 'border-b border-line py-5 text-2xl font-bold tracking-[0.08em]'
              : cn(
                  'whitespace-nowrap text-[13px] font-medium tracking-label',
                  i >= 2 && 'hidden min-[1440px]:inline',
                  i >= 3 && 'min-[1440px]:hidden min-[1800px]:inline',
                  i >= 4 && 'min-[1800px]:hidden min-[2200px]:inline'
                ),
            l.active ? 'text-fg' : vertical ? 'text-fg' : 'text-fg/75'
          )}
        >
          {l.label}
        </Link>
      ))}
      <Link
        href={contact.href}
        onClick={onNavigate}
        className={cn(
          'font-display uppercase transition-colors hover:text-fg',
          vertical
            ? 'border-b border-line py-5 text-2xl font-bold tracking-[0.08em]'
            : 'whitespace-nowrap text-[13px] font-medium tracking-label',
          contact.active ? 'text-fg' : vertical ? 'text-fg' : 'text-fg/75'
        )}
      >
        {contact.label}
      </Link>
    </>
  );
}

export function Header({ storeName, categories }: { storeName: string; categories: NavCategory[] }) {
  const { itemCount, setIsCartOpen, hydrated } = useCart();
  const { count } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const overlayPage = pathname.startsWith('/products/');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = overlayPage && !scrolled;

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 border-b transition-colors duration-300',
          transparent ? 'border-transparent bg-transparent' : 'border-line bg-bg/95 backdrop-blur'
        )}
      >
        <div className="site-x grid h-[72px] grid-cols-[1fr_auto_1fr] items-center lg:h-[100px]">
          <nav className="flex items-center gap-6 xl:gap-11" aria-label="Main">
            <button className="-ml-2 p-2 lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
            <div className="hidden items-center gap-7 lg:flex xl:gap-11">
              <Suspense fallback={null}>
                <NavLinks categories={categories} />
              </Suspense>
            </div>
          </nav>

          <Link
            href="/"
            className="block text-fg"
            aria-label={`${storeName} home`}
          >
            <Logo title={storeName} className="w-[118px] sm:w-[140px] lg:w-[160px] min-[1440px]:w-[188px]" />
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-3 lg:gap-6">
            <ThemeToggle className="hidden sm:flex" />
            <button className="p-2" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="h-[22px] w-[22px]" strokeWidth={1.6} />
            </button>
            <Link href="/wishlist" className="relative hidden p-2 sm:block" aria-label="Wishlist">
              <Heart className="h-[22px] w-[22px]" strokeWidth={1.6} />
              {hydrated && <Count n={count} />}
            </Link>
            <button className="flex items-center gap-3 p-2" aria-label="Open bag" onClick={() => setIsCartOpen(true)}>
              <span className="relative">
                <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.6} />
                {hydrated && <Count n={itemCount} />}
              </span>
              <span className="hidden font-display text-[13px] uppercase tracking-label text-fg/75 md:inline">Bag</span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg animate-fade-in lg:hidden">
          <div className="site-x flex h-[72px] items-center justify-between border-b border-line">
            <Logo title={storeName} className="w-[118px]" />
            <button className="-mr-2 p-2" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="site-x flex flex-1 flex-col overflow-y-auto pt-4">
            <Suspense fallback={null}>
              <NavLinks categories={categories} vertical onNavigate={() => setMenuOpen(false)} />
            </Suspense>
            <Link href="/shop" className="border-b border-line py-5 font-display text-2xl font-bold uppercase tracking-[0.08em] text-muted">
              All pieces
            </Link>
            <Link href="/wishlist" className="border-b border-line py-5 font-display text-sm uppercase tracking-label text-muted">
              Wishlist {count > 0 && `(${count})`}
            </Link>
            <div className="flex items-center justify-between py-6">
              <span className="font-display text-xs uppercase tracking-label text-muted">Appearance</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
