import 'server-only';
import { unstable_cache } from 'next/cache';
import type { Product } from './types';

type Tone = 'white' | 'light' | 'dark' | 'unknown';

/** Brightness of a photo's background, read from its edge pixels (top row and upper sides). */
async function measure(url: string): Promise<Tone> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000), cache: 'no-store' });
    if (!res.ok) return 'unknown';
    const sharp = (await import('sharp')).default;
    const n = 24;
    const { data } = await sharp(Buffer.from(await res.arrayBuffer()))
      .resize(n, n, { fit: 'fill' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const px = (x: number, y: number) => {
      const i = (y * n + x) * 3;
      return (data[i] + data[i + 1] + data[i + 2]) / 3;
    };
    const samples: number[] = [];
    for (let x = 0; x < n; x++) samples.push(px(x, 0));
    for (let y = 0; y < n / 2; y++) samples.push(px(0, y), px(n - 1, y));
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    return avg >= 244 ? 'white' : avg >= 170 ? 'light' : 'dark';
  } catch {
    return 'unknown';
  }
}

/** Cached per image, so each photo is only measured once. */
const toneOf = (url: string) => unstable_cache(() => measure(url), ['photo-tone-v1', url], { revalidate: false })();

/**
 * Lay the arranged list out in rows of four whose photos share the same kind of
 * background (pure white studio, soft grey studio, dark), so every row looks
 * like one shoot. Rows keep the arranged priority: a row comes as early as its
 * first piece would have. Leftovers that can't fill a row go at the end.
 */
export async function groupByLook(products: Product[], perRow = 4): Promise<Product[]> {
  const deadline = new Promise<null>((r) => setTimeout(() => r(null), 8000));
  const tones = await Promise.race([
    Promise.all(products.map((p) => (p.images[0]?.url ? toneOf(p.images[0].url) : Promise.resolve<Tone>('unknown')))),
    deadline,
  ]);
  if (!tones) return products; // photos too slow to read this time: keep the normal order

  const index = new Map(products.map((p, i) => [p.id, i]));
  const queues = new Map<Tone, Product[]>();
  products.forEach((p, i) => queues.set(tones[i], [...(queues.get(tones[i]) ?? []), p]));

  const rows: Product[][] = [];
  const rest: Product[] = [];
  for (const [tone, list] of Array.from(queues.entries())) {
    if (tone === 'unknown') {
      rest.push(...list);
      continue;
    }
    for (let i = 0; i + perRow <= list.length; i += perRow) rows.push(list.slice(i, i + perRow));
    rest.push(...list.slice(list.length - (list.length % perRow)));
  }
  const first = (r: Product[]) => Math.min(...r.map((p) => index.get(p.id) ?? 0));
  rows.sort((a, b) => first(a) - first(b));
  rest.sort((a, b) => (index.get(a.id) ?? 0) - (index.get(b.id) ?? 0));
  return [...rows.flat(), ...rest];
}
