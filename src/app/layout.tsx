import type { Metadata, Viewport } from 'next';
import { Jost, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Jost({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

const playfair = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'BN STORE — Maison de Beauté à Paris | Le Rouge Absolu',
  description: 'BN STORE, maison de maquillage de luxe. Rouges rechargeables, paiement cash à la livraison partout en Algérie.',
  keywords: ['cosmétiques', 'maquillage', 'rouge à lèvres', 'luxe', 'beauté', 'Algérie', 'YSL', 'Dior', 'NARS', 'Huda Beauty'],
  authors: [{ name: 'BN STORE' }],
  creator: 'BN STORE',
  publisher: 'BN STORE',
  robots: 'index, follow',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BN STORE',
  },
  formatDetection: { telephone: true },
  openGraph: {
    type: 'website',
    locale: 'fr_DZ',
    url: 'https://bn-store.dz',
    title: 'BN STORE | Beauty & Nature',
    description: 'Les plus grandes marques de beauté au même endroit',
    siteName: 'BN STORE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BN STORE | Beauty & Nature',
    description: 'Les plus grandes marques de beauté au même endroit',
  },
};

export const viewport: Viewport = {
  themeColor: '#1B1512',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}