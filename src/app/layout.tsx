import type { Metadata } from 'next';
import './globals.css';
import { LocalizationProvider } from '@/context/LocalizationContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CountryCurrencyModal } from '@/components/layout/CountryCurrencyModal';
import { generateOrganizationSchema } from '@/lib/seo/jsonLd';

export const metadata: Metadata = {
  title: 'LUCEVALIE | European Luxury Maison & Cashmere Atelier',
  description:
    'Contemporary European luxury maison built around quiet refinement, Mongolian cashmere atelier craftsmanship, and architectural elegance.',
  keywords: [
    'LUCEVALIE',
    'Luxury Fashion',
    'Cashmere Atelier',
    'European Maison',
    'Quiet Luxury',
    'Italian Tailoring',
    'Fine Outerwear',
  ],
  authors: [{ name: 'LUCEVALIE Maison' }],
  openGraph: {
    title: 'LUCEVALIE | European Luxury Maison',
    description: 'Quiet luxury, European refinement, and exceptional human artistry.',
    url: 'https://lucevalie.com',
    siteName: 'LUCEVALIE',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'LUCEVALIE Autumn Winter Campaign',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUCEVALIE | Contemporary Luxury Maison',
    description: 'Quiet luxury and exceptional craftsmanship.',
    images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="bg-maison-ivory text-maison-obsidian antialiased min-h-screen flex flex-col justify-between">
        <LocalizationProvider>
          <WishlistProvider>
            <CartProvider>
              <Header transparentHero={false} />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <CountryCurrencyModal />
            </CartProvider>
          </WishlistProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
