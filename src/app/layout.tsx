import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import './globals.css';
import { themeScript } from '@/components/ui/ThemeToggle';
import { env } from '@/lib/env';

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: 'Cicero — Outerwear & Knitwear', template: '%s | Cicero' },
  description: 'Cicero makes wool coats, jackets and knitwear for men and women — cut close, built to last.',
  openGraph: { siteName: 'Cicero', type: 'website', locale: 'en_US' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0B0C0F',
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
