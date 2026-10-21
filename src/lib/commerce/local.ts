import type { StoreSettings } from './types';
import { normalisePkPhone } from '@/lib/phone';

/** The shop's Google Maps page: the saved profile link, else a search for the address. */
export function mapsLink(s: StoreSettings): string | null {
  if (s.google_maps_url) return s.google_maps_url;
  if (!s.address) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.store_name}, ${s.address}`)}`;
}

/** An embeddable map of the address (no API key needed). */
export function mapsEmbed(s: StoreSettings): string | null {
  if (!s.address) return null;
  return `https://maps.google.com/maps?q=${encodeURIComponent(`${s.store_name}, ${s.address}, Pakistan`)}&z=16&output=embed`;
}

/** schema.org data so Google links the website to the shop on Maps. */
export function storeJsonLd(s: StoreSettings, siteUrl: string) {
  const phones = [s.contact_phone, s.contact_phone_2]
    .map((p) => (p ? normalisePkPhone(p) || p : null))
    .filter(Boolean) as string[];
  const sameAs = [s.instagram_url, s.tiktok_url, s.google_maps_url].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: s.store_name,
    slogan: s.tagline || undefined,
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    image: s.hero_image_url || undefined,
    telephone: phones[0],
    email: s.contact_email || undefined,
    priceRange: 'Rs',
    currenciesAccepted: 'PKR',
    paymentAccepted: 'Cash on Delivery',
    address: s.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: s.address.replace(/,?\s*Gujranwala\s*$/i, ''),
          addressLocality: 'Gujranwala',
          addressRegion: 'Punjab',
          addressCountry: 'PK',
        }
      : undefined,
    hasMap: mapsLink(s) || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    contactPoint: phones.map((telephone) => ({ '@type': 'ContactPoint', telephone, contactType: 'customer service', areaServed: 'PK' })),
  };
}
