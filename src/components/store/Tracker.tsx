'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const rid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function store(kind: 'local' | 'session', key: string): { id: string; fresh: boolean } {
  try {
    const s = kind === 'local' ? window.localStorage : window.sessionStorage;
    const v = s.getItem(key);
    if (v) return { id: v, fresh: false };
    const id = rid();
    s.setItem(key, id);
    return { id, fresh: true };
  } catch {
    return { id: rid(), fresh: true };
  }
}

/** Sends one anonymous page view per page the shopper opens. */
export function Tracker() {
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    const vid = store('local', 'cc_vid').id;
    const session = store('session', 'cc_sid');
    const body = JSON.stringify({
      path: pathname,
      vid,
      sid: session.id,
      first: session.fresh,
      ref: session.fresh ? document.referrer || null : null,
      utm: params.get('utm_source'),
    });
    try {
      if (!navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }))) {
        fetch('/api/track', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
      }
    } catch {
      /* ignore */
    }
  }, [pathname, params]);

  return null;
}
