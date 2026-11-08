import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|headless|lighthouse|pingdom|monitor/i;
const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.slice(0, n) : null);

function deviceOf(ua: string) {
  if (/ipad|tablet/i.test(ua)) return 'Tablet';
  if (/mobi|iphone|android/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

function sourceOf(ref: string | null, utm: string | null, host: string | null) {
  if (utm) return utm.toLowerCase().slice(0, 60);
  if (!ref) return 'direct';
  try {
    const h = new URL(ref).hostname.replace(/^www\./, '').replace(/^(m|l|lm)\./, '');
    if (host && h === host.replace(/^www\./, '')) return null; // moving inside the site
    if (/facebook|fb\.com/.test(h)) return 'facebook';
    if (/instagram/.test(h)) return 'instagram';
    if (/tiktok/.test(h)) return 'tiktok';
    if (/google\./.test(h)) return 'google';
    if (/whatsapp|wa\.me/.test(h)) return 'whatsapp';
    return h.slice(0, 60);
  } catch {
    return 'direct';
  }
}

/** Records one store page view. Always answers 204; analytics must never break the shop. */
export async function POST(req: NextRequest) {
  try {
    const ua = req.headers.get('user-agent') ?? '';
    if (BOT.test(ua)) return new NextResponse(null, { status: 204 });
    const b = await req.json().catch(() => ({}));
    const path = clip(b.path, 300);
    const vid = clip(b.vid, 64);
    const sid = clip(b.sid, 64);
    if (!path || !vid || !sid || path.startsWith('/admin') || path.startsWith('/api')) return new NextResponse(null, { status: 204 });

    const city = req.headers.get('x-vercel-ip-city');
    await getSupabaseAdmin()
      .from('page_views')
      .insert({
        path,
        visitor_id: vid,
        session_id: sid,
        source: b.first ? sourceOf(clip(b.ref, 500), clip(b.utm, 60), req.headers.get('host')) : null,
        device: deviceOf(ua),
        country: req.headers.get('x-vercel-ip-country'),
        city: city ? decodeURIComponent(city).slice(0, 80) : null,
        product_slug: path.startsWith('/products/') ? path.split('/')[2]?.slice(0, 120) ?? null : null,
      });
  } catch {
    /* ignore */
  }
  return new NextResponse(null, { status: 204 });
}
