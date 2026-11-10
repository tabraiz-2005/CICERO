/** Meta Pixel helpers. Do nothing until NEXT_PUBLIC_META_PIXEL_ID is set. */
type Fbq = (...args: unknown[]) => void;

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || '';

export function track(event: string, data?: Record<string, unknown>, eventID?: string) {
  if (!PIXEL_ID || typeof window === 'undefined') return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (!fbq) return;
  try {
    if (eventID) fbq('track', event, data ?? {}, { eventID });
    else fbq('track', event, data ?? {});
  } catch {
    /* never break the shop */
  }
}
