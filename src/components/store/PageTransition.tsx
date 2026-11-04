'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

/** Shortest time the veil stays up, so a fast page change still feels deliberate, not like a flicker. */
const MIN_VISIBLE_MS = 450;
/** Never leave the veil up if a page fails to load. */
const FAILSAFE_MS = 8000;

/**
 * Brunello Cucinelli-style page change: when a shopper clicks through to another
 * page, the current page softly blurs behind a light veil with the Cicero logo,
 * then the next page appears. Also shows briefly when the site first opens.
 */
export function PageTransition() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [visible, setVisible] = useState(true); // intro on first load
  const shownAt = useRef(Date.now());

  // Intro: fade the veil away shortly after the first page is ready.
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 650);
    return () => clearTimeout(t);
  }, []);

  // Show the veil when an internal link to a different page is clicked.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = e.target as Element | null;
      // Buttons inside a link (colour dots, wishlist heart) don't navigate.
      if (el?.closest?.('button, [data-no-veil]')) return;
      const a = el?.closest?.('a');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const raw = a.getAttribute('href');
      if (!raw || raw.startsWith('#') || /^(mailto|tel|sms|whatsapp):/i.test(raw)) return;
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return;
      // Filters, sorting and anchors on the same page change instantly, without the veil.
      if (url.pathname === window.location.pathname) return;
      shownAt.current = Date.now();
      setVisible(true);
    };
    // Capture phase: runs before Next's <Link> handles the click.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Hide it once the new page has arrived.
  useEffect(() => {
    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt.current));
    const t = setTimeout(() => setVisible(false), wait);
    return () => clearTimeout(t);
  }, [pathname, search]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), FAILSAFE_MS);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div
      aria-hidden
      className={cn(
        'fixed inset-0 z-[70] flex items-center justify-center bg-bg/60 backdrop-blur-xl transition-[opacity,visibility] ease-out',
        visible ? 'visible opacity-100 duration-200' : 'pointer-events-none invisible opacity-0 duration-500'
      )}
    >
      <Logo title="" className="w-[150px] text-fg motion-safe:animate-breathe sm:w-[180px]" />
    </div>
  );
}
