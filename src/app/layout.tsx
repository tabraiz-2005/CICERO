import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/jost';
import '@fontsource-variable/inter';
import '@fontsource-variable/cormorant-garamond';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { themeScript } from '@/components/ui/ThemeToggle';
import { env } from '@/lib/env';

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: 'Cicero | Wool Coats, Jackets & Knitwear in Pakistan', template: '%s | Cicero' },
  description:
    'Cicero, Satellite Town Gujranwala: wool coats, puffer and bomber jackets, sweaters and cardigans for men and women. Shop online with Cash on Delivery across Pakistan.',
  openGraph: { siteName: 'Cicero', type: 'website', locale: 'en_US' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#faf9f6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
