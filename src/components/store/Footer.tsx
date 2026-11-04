import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import type { NavCategory } from './Header';
import type { StoreSettings } from '@/lib/commerce/types';
import { formatPkPhone, whatsappLink } from '@/lib/phone';
import { mapsLink } from '@/lib/commerce/local';
import { Logo } from './Logo';

type Col = { title: string; links: { href: string; label: string; external?: boolean }[] };

function FooterLink({ href, label, external }: Col['links'][number]) {
  const cls = 'text-[13px] tracking-[0.02em] text-fg/70 transition-colors hover:text-fg';
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {label}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

const Social = {
  instagram: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
      <path d="M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9a6.3 6.3 0 1 0 5.3 6.2V8.6a8 8 0 0 0 4.4 1.3V6.6a4.6 4.6 0 0 1-4.4-4.6Z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 32 32" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
      <path d="M16.04 3C9.4 3 4 8.36 4 14.96c0 2.3.66 4.54 1.9 6.47L4 29l7.77-1.87a12.1 12.1 0 0 0 4.27.78h.01C22.68 27.91 28 22.55 28 15.95 28 9.36 22.68 3 16.04 3Zm0 22.6h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-4.61 1.11 1.13-4.43-.24-.38a9.6 9.6 0 0 1-1.5-5.15c0-5.36 4.4-9.72 9.8-9.72 5.39 0 9.66 4.36 9.66 9.72 0 5.37-4.4 10.44-8.82 10.44Zm5.45-7.3c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.25-.59-.5-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  ),
  maps: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  ),
};

export function Footer({ settings }: { settings: StoreSettings; categories?: NavCategory[] }) {
  const phone = settings.contact_phone || settings.contact_phone_2;
  const wa = whatsappLink(phone, `Hi ${settings.store_name}, please add me to your updates list for new arrivals and offers.`);
  const maps = mapsLink(settings);

  const cols: Col[] = [
    {
      title: 'Client service',
      links: [
        { href: '/contact', label: 'Contact us' },
        { href: '/shipping', label: 'Delivery' },
        { href: '/returns', label: 'Returns & exchanges' },
        { href: '/size-guide', label: 'Size guide' },
        { href: '/faq', label: 'FAQ' },
        { href: '/wishlist', label: 'Wishlist' },
      ],
    },
    {
      title: 'Shop',
      links: [
        { href: '/women', label: 'Women' },
        { href: '/men', label: 'Men' },
        { href: '/new-arrivals', label: 'New arrivals' },
        { href: '/sale', label: '999 Sale' },
        { href: '/shop', label: 'All pieces' },
      ],
    },
    {
      title: 'The house',
      links: [
        { href: '/about', label: 'Our story' },
        { href: '/contact#boutique', label: 'Our boutique' },
        ...(maps ? [{ href: maps, label: 'Directions', external: true }] : []),
      ],
    },
    {
      title: 'Legal area',
      links: [
        { href: '/terms', label: 'Terms of sale' },
        { href: '/privacy', label: 'Privacy policy' },
        { href: '/admin', label: 'Staff login' },
      ],
    },
  ];

  const socials = [
    settings.instagram_url && { href: settings.instagram_url, label: 'Instagram', icon: Social.instagram },
    settings.tiktok_url && { href: settings.tiktok_url, label: 'TikTok', icon: Social.tiktok },
    whatsappLink(phone) && { href: whatsappLink(phone) as string, label: 'WhatsApp', icon: Social.whatsapp },
    maps && { href: maps, label: 'Google Maps', icon: Social.maps },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  return (
    <footer className="mt-24 bg-surface">
      {/* Newsletter */}
      <section id="newsletter" className="scroll-mt-40 border-y border-line">
        <div className="site-x flex flex-col items-center py-16 text-center lg:py-20">
          <p className="font-display text-[11px] uppercase tracking-[0.24em] text-muted">Newsletter</p>
          <h2 className="mt-4 font-display text-[22px] font-light uppercase tracking-[0.14em] lg:text-[28px]">
            Discover the world of {settings.store_name}
          </h2>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-fg/70">
            New arrivals, private offers and the winter edit, shared with you first on WhatsApp.
          </p>
          {wa && (
            <a href={wa} target="_blank" rel="noreferrer" className="btn-outline group mt-8 h-12 gap-3 px-10 text-[11px]">
              Subscribe <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </a>
          )}
        </div>
      </section>

      {/* Link columns: open grid on desktop, accordions on mobile */}
      <div className="site-x">
        <div className="hidden grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.3fr)] gap-10 py-16 lg:grid">
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-[11px] font-medium uppercase tracking-[0.22em] text-fg">{col.title}</h3>
              <ul className="mt-6 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink {...l} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div id="boutique-info">
            <h3 className="font-display text-[11px] font-medium uppercase tracking-[0.22em] text-fg">Visit the boutique</h3>
            <div className="mt-6 space-y-2 text-[13px] leading-relaxed text-fg/70">
              {settings.address && <p>{settings.address}</p>}
              {settings.opening_hours && <p>{settings.opening_hours}</p>}
              {phone && (
                <p>
                  <a href={whatsappLink(phone) ?? `tel:${phone}`} target="_blank" rel="noreferrer" className="hover:text-fg">
                    {formatPkPhone(phone) || phone}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="divide-y divide-line py-6 lg:hidden">
          {cols.map((col) => (
            <details key={col.title} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-display text-[11px] font-medium uppercase tracking-[0.22em] [&::-webkit-details-marker]:hidden">
                {col.title}
                <ChevronDown className="h-4 w-4 text-muted transition-transform group-open:rotate-180" strokeWidth={1.25} />
              </summary>
              <ul className="space-y-3 pb-5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink {...l} />
                  </li>
                ))}
              </ul>
            </details>
          ))}
          <div className="py-5 text-[13px] leading-relaxed text-fg/70">
            <p className="mb-2 font-display text-[11px] font-medium uppercase tracking-[0.22em] text-fg">Visit the boutique</p>
            {settings.address && <p>{settings.address}</p>}
            {settings.opening_hours && <p>{settings.opening_hours}</p>}
          </div>
        </div>
      </div>

      {/* Follow us + wordmark */}
      <div className="border-t border-line">
        <div className="site-x flex flex-col items-center gap-6 py-12">
          {socials.length > 0 && (
            <>
              <p className="font-display text-[11px] uppercase tracking-[0.24em] text-muted">Follow us on</p>
              <ul className="flex items-center gap-7 text-fg/70">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="transition-colors hover:text-fg">
                      {s.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          <Logo className="mt-4 w-[132px] text-fg" title={settings.store_name} />
          <p className="font-display text-[10.5px] uppercase tracking-[0.24em] text-subtle">Gujranwala · Since 2008</p>
        </div>
      </div>

      {/* Legal line */}
      <div className="border-t border-line">
        <div className="site-x flex flex-col items-center gap-4 py-6 text-[11px] tracking-[0.06em] text-subtle sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {settings.store_name} · Satellite Town, Gujranwala, Pakistan
          </span>
          <span className="uppercase tracking-[0.18em]">Pakistan · PKR</span>
        </div>
      </div>
    </footer>
  );
}
