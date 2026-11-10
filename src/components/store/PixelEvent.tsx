'use client';

import { useEffect } from 'react';
import { track } from '@/lib/pixel';

/** Fires one Meta Pixel event when the page opens. `once` stops repeats on refresh (e.g. a Purchase). */
export function PixelEvent({ name, data, once }: { name: string; data?: Record<string, unknown>; once?: string }) {
  useEffect(() => {
    const t = setTimeout(() => {
      if (once) {
        try {
          const key = `px_${name}_${once}`;
          if (sessionStorage.getItem(key)) return;
          sessionStorage.setItem(key, '1');
        } catch {
          /* ignore */
        }
      }
      track(name, data, once);
    }, 600); // give the pixel script a moment to load
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
