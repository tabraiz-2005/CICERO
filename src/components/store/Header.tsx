'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowRight, Heart, Home, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Img } from '@/components/ui/Img';
import { cn } from '@/lib/utils';
import { SearchOverlay } from './SearchOverlay';
import { Logo } from './Logo';

export interface NavCategory {
  slug: string;
  name: string;
  gender?: 'all' | 'men' | 'women';
}

type Dept = 'men' | 'women';
const DEPTS: { key: Dept; label: string }[] = [
  { key: 'men', label: 'Men' },
  { key: 'women', label: 'Women' },
];

const forDept = (cats: NavCategory[], d: Dept) => cats.filter((c) => !c.gender || c.gender === 'all' || c.gender === d);

/** Small caps nav link with a hairline underline that draws in on hover (Brunello Cucinelli style). */
const navLink = (active: boolean) =>
  cn(
    'relative whitespace-nowrap py-4 font-display text-[12px] font-medium uppercase tracking-[0.2em] transition-colors',
    'after:absolute after:inset-x-0 after:bottom-3 after:h-px after:origin-left after:bg-fg after:transition-transform after:duration-300',
    active ? 'text-fg after:scale-x-100' : 'text-fg/70 after:scale-x-0 hover:text-fg hover:after:scale-x-100'
  );

function Count({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-fg px-1 text-[9px] font-semibold text-bg">
      {n}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Top utility bar                                                            */
/* -------------------------------------------------------------------------- */

function UtilityBar({ announcement }: { announcement?: string | null }) {
  return (
    <div className={cn('border-b border-line bg-surface', !announcement && 'hidden lg:block')}>
      <div className="site-x flex h-9 items-center justify-between gap-6">
        <p className="min-w-0 flex-1 truncate text-center text-[11px] tracking-[0.06em] text-fg/70 lg:text-left">{announcement}</p>
        <nav className="hidden shrink-0 items-center gap-7 font-display text-[10.5px] uppercase tracking-[0.18em] text-fg/60 lg:flex" aria-label="Services">
          <Link href="/contact" className="transition-colors hover:text-fg">Contact us</Link>
          <Link href="/contact#boutique" className="transition-colors hover:text-fg">Our boutique</Link>
          <a href="#newsletter" className="transition-colors hover:text-fg">Newsletter</a>
          <span className="text-fg/45">Pakistan · PKR</span>
        </nav>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop navigation row with mega panels                                    */
/* -------------------------------------------------------------------------- */

function DesktopNav({ categories, heroImage }: { categories: NavCategory[]; heroImage?: string | null }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState<Dept | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (d: Dept) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(d);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  useEffect(() => setOpen(null), [pathname, params]);

  return (
    <div className="flex h-12 items-center justify-center gap-11" onMouseLeave={hide}>
      <Link href="/" onMouseEnter={() => setOpen(null)} className={navLink(pathname === '/')}>
        Home
      </Link>
      <Link href="/new-arrivals" onMouseEnter={() => setOpen(null)} className={navLink(pathname.startsWith('/new-arrivals'))}>
        New arrivals
      </Link>
      {DEPTS.map((d) => (
        <Link
          key={d.key}
          href={`/${d.key}`}
          onMouseEnter={() => show(d.key)}
          onFocus={() => show(d.key)}
          className={navLink(pathname.startsWith(`/${d.key}`) || open === d.key)}
        >
          {d.label}
        </Link>
      ))}
      <Link
        href="/sale"
        onMouseEnter={() => setOpen(null)}
        className={cn(
          'whitespace-nowrap border px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors',
          pathname.startsWith('/sale')
            ? 'border-brand bg-brand text-brand-ink'
            : 'border-brand/70 text-brand hover:bg-brand hover:text-brand-ink'
        )}
      >
        999 Sale
      </Link>
      <Link href="/about" onMouseEnter={() => setOpen(null)} className={navLink(pathname === '/about')}>
        Our story
      </Link>

      {open && (
        <div
          onMouseEnter={() => show(open)}
          className="absolute inset-x-0 top-full border-t border-line bg-bg shadow-[0_30px_40px_-30px_rgba(0,0,0,0.25)] animate-fade-in"
        >
          <div className="site-x grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,420px)] gap-16 py-12">
            <div>
              <p className="font-display text-[11px] uppercase tracking-[0.22em] text-muted">Categories</p>
              <ul className="mt-6 grid grid-flow-col grid-rows-6 gap-x-12 gap-y-3.5">
                {forDept(categories, open).map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/${open}?category=${c.slug}`}
                      className={cn(
                        'text-[14px] tracking-[0.02em] transition-colors hover:text-fg',
                        pathname === `/${open}` && params.get('category') === c.slug ? 'text-fg underline underline-offset-4' : 'text-fg/75'
                      )}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-display text-[11px] uppercase tracking-[0.22em] text-muted">Discover</p>
              <ul className="mt-6 space-y-3.5 text-[14px] tracking-[0.02em] text-fg/75">
                <li><Link href={`/${open}`} className="hover:text-fg">View all {open === 'men' ? "men's" : "women's"}</Link></li>
                <li><Link href="/new-arrivals" className="hover:text-fg">New arrivals</Link></li>
                <li><Link href={`/sale`} className="hover:text-fg">999 Sale</Link></li>
                <li><Link href="/size-guide" className="hover:text-fg">Size guide</Link></li>
              </ul>
            </div>
            <Link href={`/${open}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                {heroImage && (
                  <Img
                    src={heroImage}
                    alt=""
                    sizes="420px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <p className="mt-4 font-display text-[11px] uppercase tracking-[0.22em] text-muted">The Winter Edit</p>
              <p className="mt-1.5 inline-flex items-center gap-2 text-[14px] text-fg">
                Discover the {open === 'men' ? 'men’s' : 'women’s'} collection
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile drawer                                                              */
/* -------------------------------------------------------------------------- */

function MobileMenu({
  storeName,
  categories,
  wishCount,
  onClose,
}: {
  storeName: string;
  categories: NavCategory[];
  wishCount: number;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [dept, setDept] = useState<Dept>(pathname.startsWith('/women') ? 'women' : 'men');

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg animate-fade-in lg:hidden">
      <div className="site-x flex h-16 shrink-0 items-center justify-between border-b border-line">
        <button className="-ml-2 p-2" aria-label="Close menu" onClick={onClose}>
          <X className="h-6 w-6" strokeWidth={1.25} />
        </button>
        <Logo title={storeName} className="w-[112px]" />
        <span className="w-10" />
      </div>

      <div className="site-x flex shrink-0 gap-8 border-b border-line">
        {DEPTS.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setDept(d.key)}
            className={cn(
              '-mb-px border-b py-4 font-display text-[13px] uppercase tracking-[0.2em]',
              dept === d.key ? 'border-fg text-fg' : 'border-transparent text-muted'
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <nav className="site-x flex-1 overflow-y-auto pb-10 pt-6">
        <Link
          href="/sale"
          onClick={onClose}
          className="mb-7 flex items-center justify-between border border-brand/50 px-4 py-3 font-display text-[13px] uppercase tracking-[0.2em] text-brand"
        >
          999 Sale <span className="text-[12px] normal-case tracking-normal text-muted">Everything Rs 999</span>
        </Link>

        <ul className="divide-y divide-line border-y border-line">
          <li>
            <Link href={`/${dept}`} onClick={onClose} className="flex items-center justify-between py-3.5 text-[15px] tracking-[0.02em] text-fg">
              View all <ArrowRight className="h-4 w-4 text-muted" strokeWidth={1.25} />
            </Link>
          </li>
          <li>
            <Link href="/new-arrivals" onClick={onClose} className="flex items-center justify-between py-3.5 text-[15px] tracking-[0.02em] text-fg">
              New arrivals <ArrowRight className="h-4 w-4 text-muted" strokeWidth={1.25} />
            </Link>
          </li>
          {forDept(categories, dept).map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${dept}?category=${c.slug}`}
                onClick={onClose}
                className="flex items-center justify-between py-3.5 text-[15px] tracking-[0.02em] text-fg/85"
              >
                {c.name} <ArrowRight className="h-4 w-4 text-subtle" strokeWidth={1.25} />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid grid-cols-2 gap-y-1">
          {[
            { href: '/', label: 'Home' },
            { href: '/about', label: 'Our story' },
            { href: '/contact', label: 'Contact us' },
            { href: '/contact#boutique', label: 'Our boutique' },
            { href: '/wishlist', label: `Wishlist${wishCount ? ` (${wishCount})` : ''}` },
            { href: '/size-guide', label: 'Size guide' },
          ].map((l) => (
            <Link key={l.label} href={l.href} onClick={onClose} className="py-2 text-[13px] text-muted">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="mt-8 border-t border-line pt-6">
          <span className="text-[12px] uppercase tracking-[0.18em] text-muted">Pakistan · PKR</span>
        </div>
      </nav>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Header                                                                     */
/* -------------------------------------------------------------------------- */

export function Header({
  storeName,
  categories,
  announcement,
  heroImage,
}: {
  storeName: string;
  categories: NavCategory[];
  announcement?: string | null;
  heroImage?: string | null;
}) {
  const { itemCount, setIsCartOpen, hydrated } = useCart();
  const { count } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

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
      <UtilityBar announcement={announcement} />

      <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur-md">
        <div className="site-x grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-20">
          {/* Left */}
          <div className="flex items-center">
            <button className="-ml-2 p-2 lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <Menu className="h-6 w-6" strokeWidth={1.25} />
            </button>
            <Link href="/" className="p-2 lg:hidden" aria-label="Home">
              <Home className="h-[21px] w-[21px]" strokeWidth={1.25} />
            </Link>
            <button
              className="hidden items-center gap-3 py-2 font-display text-[11px] uppercase tracking-[0.2em] text-fg/70 transition-colors hover:text-fg lg:flex"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.25} /> Search
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="block text-fg" aria-label={`${storeName} home`}>
            <Logo title={storeName} className="w-[112px] sm:w-[124px] lg:w-[148px]" />
          </Link>

          {/* Right */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-2 lg:gap-5">
            <ThemeToggle className="h-8 w-8 border-transparent lg:h-9 lg:w-9 lg:border-line" />
            <button className="p-2 lg:hidden" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="h-[21px] w-[21px]" strokeWidth={1.25} />
            </button>
            <Link href="/wishlist" className="relative hidden p-2 sm:block" aria-label="Wishlist">
              <Heart className="h-[20px] w-[20px]" strokeWidth={1.25} />
              {hydrated && <Count n={count} />}
            </Link>
            <button className="flex items-center gap-2.5 p-2" aria-label="Open bag" onClick={() => setIsCartOpen(true)}>
              <span className="relative">
                <ShoppingBag className="h-[20px] w-[20px]" strokeWidth={1.25} />
                {hydrated && <Count n={itemCount} />}
              </span>
              <span className="hidden font-display text-[11px] uppercase tracking-[0.2em] text-fg/70 lg:inline">Bag</span>
            </button>
          </div>
        </div>

        {/* Desktop: centred navigation row */}
        <div className="hidden border-t border-line lg:block">
          <Suspense fallback={<div className="h-12" />}>
            <DesktopNav categories={categories} heroImage={heroImage} />
          </Suspense>
        </div>

        {/* Mobile: Men, Women and the sale, always one tap away */}
        <nav className="site-x flex h-11 items-center gap-6 border-t border-line lg:hidden" aria-label="Departments">
          {DEPTS.map((d) => (
            <Link
              key={d.key}
              href={`/${d.key}`}
              className={cn(
                'font-display text-[11px] font-medium uppercase tracking-[0.2em]',
                pathname.startsWith(`/${d.key}`) ? 'text-fg underline underline-offset-[6px]' : 'text-fg/70'
              )}
            >
              {d.label}
            </Link>
          ))}
          <Link
            href="/new-arrivals"
            className={cn(
              'hidden font-display text-[11px] font-medium uppercase tracking-[0.2em] min-[400px]:inline',
              pathname.startsWith('/new-arrivals') ? 'text-fg underline underline-offset-[6px]' : 'text-fg/70'
            )}
          >
            New
          </Link>
          <Link
            href="/sale"
            className={cn(
              'ml-auto inline-flex h-7 items-center border px-2.5 font-display text-[10.5px] font-semibold uppercase tracking-[0.18em]',
              pathname.startsWith('/sale') ? 'border-brand bg-brand text-brand-ink' : 'border-brand/70 text-brand'
            )}
          >
            999 Sale
          </Link>
        </nav>
      </header>

      {menuOpen && <MobileMenu storeName={storeName} categories={categories} wishCount={count} onClose={() => setMenuOpen(false)} />}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
