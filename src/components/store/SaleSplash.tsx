'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

/** The 11.11 sale runs until midnight Pakistan time; after that everything here hides itself. */
export const SALE_ENDS = Date.parse('2026-11-12T00:00:00+05:00');
const SEEN_KEY = 'cc_1111_seen';

function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(SALE_ENDS - Date.now());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return left;
}

const pad = (n: number) => String(n).padStart(2, '0');
function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { h: pad(Math.floor(s / 3600)), m: pad(Math.floor((s % 3600) / 60)), s: pad(s % 60) };
}

/** Slim black strip at the very top of every page with a live countdown. */
export function SaleBar({ maxOff }: { maxOff: number }) {
  const left = useCountdown();
  if (left === null || left <= 0) return null;
  const { h, m, s } = parts(left);
  return (
    <Link
      href="/shop"
      className="block bg-[#111] text-white transition-colors hover:bg-black"
    >
      <p className="site-x flex h-9 items-center justify-center gap-3 font-display text-[10.5px] uppercase tracking-[0.22em] sm:text-[11px]">
        <span className="font-semibold text-brand">11.11 Sale</span>
        <span className="hidden sm:inline">{maxOff > 0 ? `Up to ${maxOff}% off` : 'Today only'}</span>
        <span className="tabular-nums">Ends in {h}:{m}:{s}</span>
        <span className="underline underline-offset-4">Shop</span>
      </p>
    </Link>
  );
}

/** Full-screen 11.11 welcome, shown once per visit while the sale is on. */
export function SaleSplash({ maxOff }: { maxOff: number }) {
  const left = useCountdown();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (Date.now() >= SALE_ENDS) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setOpen(true), 1100); // after the logo intro
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open || left === null || left <= 0) return null;
  const { h, m, s } = parts(left);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in" onClick={close} role="dialog" aria-modal="true" aria-label="11.11 Sale">
      <div className="relative w-full max-w-[520px] overflow-hidden bg-[#111] px-7 py-12 text-center text-white sm:px-12 sm:py-14" onClick={(e) => e.stopPropagation()}>
        <button onClick={close} aria-label="Close" className="absolute right-3 top-3 p-2 text-white/70 hover:text-white">
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <p className="font-display text-[11px] uppercase tracking-[0.36em] text-white/70">Cicero presents</p>
        <p className="mt-4 font-serif text-[104px] leading-none sm:text-[132px]">
          11<span className="text-brand">.</span>11
        </p>
        <p className="mt-3 font-display text-[13px] uppercase tracking-[0.3em]">The Winter Sale</p>
        {maxOff > 0 && (
          <p className="mt-6 font-serif text-[30px] leading-tight sm:text-[36px]">
            Up to <span className="text-brand">{maxOff}% off</span>
          </p>
        )}
        <p className="mt-3 text-[14px] text-white/75">Coats, knitwear and velvet · Today only · Cash on Delivery</p>

        <div className="mx-auto mt-8 flex max-w-[300px] justify-center gap-3">
          {[
            [h, 'Hours'],
            [m, 'Minutes'],
            [s, 'Seconds'],
          ].map(([v, l]) => (
            <div key={l} className="flex-1 border border-white/20 py-3">
              <p className="font-display text-[26px] tabular-nums">{v}</p>
              <p className="mt-1 text-[9.5px] uppercase tracking-[0.2em] text-white/60">{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/women" onClick={close} className="inline-flex h-12 items-center justify-center bg-white px-8 font-display text-[11.5px] font-medium uppercase tracking-[0.24em] text-[#111] hover:bg-white/85">
            Shop women
          </Link>
          <Link href="/men" onClick={close} className="inline-flex h-12 items-center justify-center border border-white px-8 font-display text-[11.5px] font-medium uppercase tracking-[0.24em] hover:bg-white hover:text-[#111]">
            Shop men
          </Link>
        </div>
        <button onClick={close} className="mt-6 text-[12px] text-white/60 underline underline-offset-4 hover:text-white">
          Continue browsing
        </button>
      </div>
    </div>
  );
}
