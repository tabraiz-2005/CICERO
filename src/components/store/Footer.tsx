import Link from 'next/link';
import type { NavCategory } from './Header';
import type { StoreSettings } from '@/lib/commerce/types';

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
        { href: '/shipping', label: 'Shipping' },
        { href: '/returns', label: 'Returns & exchanges' },
        { href: '/size-guide', label: 'Size guide' },
        { href: '/faq', label: 'FAQ' },
        { href: '/contact', label: 'Contact' },
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
  const socials = [
    settings.instagram_url && { href: settings.instagram_url, label: 'Instagram' },
    settings.tiktok_url && { href: settings.tiktok_url, label: 'TikTok' },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="mt-24 border-t border-line">
      <div className="site-x grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:py-20">
        <div>
          <p className="eyebrow">Garment system // {settings.tagline}</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            Questions about sizing, an order or a return? Write to{' '}
            <a href={`mailto:${settings.contact_email}`} className="link-u text-fg">
              {settings.contact_email}
            </a>
            {settings.contact_phone && <> or call {settings.contact_phone}</>}.
          </p>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-6">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="label text-muted hover:text-fg">
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="label text-fg">{col.title}</h3>
            <ul className="mt-6 space-y-3.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-display text-[13px] uppercase tracking-[0.14em] text-muted hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="site-x overflow-hidden">
        <p
          aria-hidden
          className="select-none whitespace-nowrap text-center font-display font-bold uppercase leading-none tracking-[0.2em] text-fg/[0.06]"
          style={{ fontSize: 'clamp(4rem, 17vw, 20rem)' }}
        >
          {settings.store_name}
        </p>
      </div>
      <div className="site-x flex flex-col gap-3 border-t border-line py-6 font-display text-[11px] uppercase tracking-label text-subtle sm:flex-row sm:justify-between">
        <span>
          © {new Date().getFullYear()} {settings.store_name}. All rights reserved.
        </span>
        <span>Prices in USD · Secure checkout by Stripe</span>
      </div>
    </footer>
  );
}
