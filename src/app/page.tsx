'use client';

import { useState, useEffect } from 'react';
import { Locale, defaultLocale, getDir, getStoredLocale, setStoredLocale } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { FooterBar } from '@/components/layout/Footer';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { Maison } from '@/components/Maison';

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => { setLocale(getStoredLocale()); }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getDir(locale);
  }, [locale]);

  const change = (l: Locale) => { setLocale(l); setStoredLocale(l); };

  return (
    <div className="font-sans antialiased bg-cream text-ink min-h-screen flex flex-col" dir={getDir(locale)}>
      <TopBar locale={locale} onLocaleChange={change} />

      <main className="flex-1" role="main">
        <Hero locale={locale} />
        <ProductGrid locale={locale} />
        <Maison locale={locale} />
      </main>

      <FooterBar locale={locale} />
    </div>
  );
}
