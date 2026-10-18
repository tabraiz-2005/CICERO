import Link from 'next/link';
import { MapPin, MessageCircle } from 'lucide-react';
import type { NavCategory } from './Header';
import type { StoreSettings } from '@/lib/commerce/types';
import { formatPkPhone, whatsappLink } from '@/lib/phone';
import { Logo } from './Logo';

export function Footer({ settings, categories }: { settings: StoreSettings; categories: NavCategory[] }) {
  const cols = [
    {
      title: 'Shop',
      links: [
        { href: '/men', label: 'Men' },
        { href: '/women', label: 'Women' },
        ...categories.map((c) => ({ href: `/shop?category=${c.slug}`, label: c.name })),
        { href: '/shop?sort=newest', label: 'New arrivals' },
      ],
    },
    {
      title: 'Client care',
      links: [
        { href: '/shipping', label: 'Delivery' },
        { href: '/returns', label: 'Returns & exchanges' },
        { href: '/size-guide', label: 'Size guide' },
        { href: '/faq', label: 'FAQ' },
        { href: '/contact', label: 'Contact & store' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { href: '/terms', label: 'Terms of sale' },
        { href: '/privacy', label: 'Privacy policy' },
      ],
    },
  ];
  const phones = [settings.contact_phone, settings.contact_phone_2].filter(Boolean) as string[];
  const instaHandle = settings.instagram_url?.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '');

  return (
    <footer className="mt-24 border-t border-line">
      <div className="site-x grid gap-12 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)] lg:py-20">
        <div>
          <Logo className="w-[170px] text-fg" title={settings.store_name} />
          <p className="mt-4 font-display text-sm text-muted">“{settings.tagline}”</p>

          <ul className="mt-8 space-y-3 text-sm">
            {settings.address && (
              <li>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings.store_name}, ${settings.address}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 text-fg/85 hover:text-fg"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.6} /> {settings.address}
                </a>
              </li>
            )}
            {phones.map((p) => (
              <li key={p}>
                <a href={whatsappLink(p) ?? `tel:${p}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-fg/85 hover:text-fg">
                  <MessageCircle className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.6} /> {formatPkPhone(p) || p}
                </a>
              </li>
            ))}
            {settings.instagram_url && (
              <li>
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-fg/85 hover:text-fg">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                  </svg>
                  @{instaHandle}
                </a>
              </li>
            )}
          </ul>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="label text-fg">{col.title}</h3>
            <ul className="mt-6 space-y-3.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-display text-[13px] uppercase tracking-[0.14em] text-muted hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="site-x flex justify-center overflow-hidden pb-6 text-fg/[0.06]">
        <Logo className="w-full max-w-[1100px]" title="" mono />
      </div>
      <div className="site-x flex flex-col gap-3 border-t border-line py-6 font-display text-[11px] uppercase tracking-label text-subtle sm:flex-row sm:justify-between">
        <span>
          © {new Date().getFullYear()} {settings.store_name}™ · Gujranwala, Pakistan
        </span>
        <span>Prices in PKR · Cash on Delivery across Pakistan</span>
      </div>
    </footer>
  );
}
