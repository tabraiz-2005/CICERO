import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { PageTransition } from '@/components/store/PageTransition';
import { Tracker } from '@/components/store/Tracker';
import { MetaPixel } from '@/components/store/MetaPixel';
import { Suspense } from 'react';
import { CartDrawer } from '@/components/store/CartDrawer';
import { WhatsAppButton } from '@/components/store/WhatsAppButton';
import { getCategories, getSettings } from '@/lib/commerce/catalog';
import { storeJsonLd } from '@/lib/commerce/local';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  const nav = categories.map((c) => ({ slug: c.slug, name: c.name, gender: c.gender }));

  return (
    <WishlistProvider>
      <CartProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd(settings, env.siteUrl)).replace(/</g, '\\u003c') }} />
        <div className="flex min-h-screen flex-col">
          <Header
            storeName={settings.store_name}
            categories={nav}
            announcement={settings.announcement_enabled ? settings.announcement_text : null}
            heroImage={settings.hero_image_url}
          />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} categories={nav} />
        </div>
        <CartDrawer freeShippingThreshold={settings.free_shipping_threshold} />
        <WhatsAppButton phone={settings.contact_phone} storeName={settings.store_name} />
        <Suspense fallback={null}>
          <PageTransition />
          <Tracker />
          <MetaPixel />
        </Suspense>
      </CartProvider>
    </WishlistProvider>
  );
}
