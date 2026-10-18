import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import './globals.css';
import { themeScript } from '@/components/ui/ThemeToggle';
import { env } from '@/lib/env';

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: 'Cicero — we make you more beautiful', template: '%s | Cicero' },
  description: 'Cicero, Gujranwala — wool coats, jackets and knitwear for men and women. Cash on Delivery across Pakistan.',
  openGraph: { siteName: 'Cicero', type: 'website', locale: 'en_US' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#141213',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
