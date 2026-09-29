'use client';

import { useState, useEffect, useMemo } from 'react';
import { Locale, defaultLocale, getDir, getStoredLocale, setStoredLocale } from '@/lib/i18n';
import { getTranslation } from '@/lib/i18n';
import { TopBar } from '@/components/layout/TopBar';
import { FooterBar } from '@/components/layout/Footer';
import { ProductCard } from '@/components/ProductCard';
import type { Product as DBProduct } from '@/lib/db-types';

export default function ShopPage() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => { setLocale(getStoredLocale()); }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getDir(locale);
  }, [locale]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch('/api/products?active=true&limit=100', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (alive) setProducts(d.data?.data || []); })
      .catch(() => { if (alive) setProducts([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const change = (l: Locale) => { setLocale(l); setStoredLocale(l); };
  const t = getTranslation(locale);
  const isRTL = locale === 'ar';

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => { if (p.category) set.add(p.category); });
    return ['all', ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    });
  }, [products, category, search]);

  return (
    <div className="font-sans antialiased bg-cream text-ink min-h-screen flex flex-col" dir={getDir(locale)}>
      <TopBar locale={locale} onLocaleChange={change} />

      <main className="flex-1" role="main">
        <section className="bg-cream py-16 sm:py-20" aria-labelledby="shop-title" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="eyebrow-luxe mb-4">{t.luxe.boutiqueEyebrow}</p>
              <h1 id="shop-title" className="font-serif font-medium text-heading-lg text-ink">
                {t.products.title} <em className="italic font-normal text-primary-600">{t.products.subtitle}</em>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-8">
              <div className="flex flex-wrap gap-2" role="group" aria-label={t.products.title}>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-4 py-2 text-[12px] tracking-[0.14em] uppercase border transition-colors ${
                      category === c
                        ? 'bg-ink text-cream border-ink'
                        : 'bg-cream text-ink border-[#E2D6C3] hover:border-ink'
                    }`}
                  >
                    {c === 'all' ? t.products.all : c}
                  </button>
                ))}
              </div>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.topbar.searchPlaceholder}
                className="px-4 py-2.5 text-sm bg-cream border border-[#E2D6C3] text-ink placeholder:text-[#6E6259]/70 focus:outline-none focus:border-ink sm:w-64"
                aria-label={t.topbar.searchPlaceholder}
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="border border-[#E2D6C3] bg-cream animate-pulse">
                    <div className="aspect-[4/5] bg-[#EFE6D8]" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 w-20 bg-[#EFE6D8]" />
                      <div className="h-6 w-3/4 bg-[#EFE6D8]" />
                      <div className="h-4 w-1/2 bg-[#EFE6D8]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-[#6E6259] border border-[#E2D6C3] bg-cream">
                <p>{t.products.noResults}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id.toString(),
                      brand: product.brand,
                      name: product.name,
                      price: Number(product.price),
                      originalPrice: product.original_price ? Number(product.original_price) : undefined,
                      image: product.image,
                      rating: Number(product.rating),
                      reviewCount: product.review_count,
                      badge: product.badge || undefined,
                      href: `/products#produit-${product.slug}`,
                    }}
                    locale={locale}
                  />
                ))}
              </div>
            )}

            <p className="text-center mt-8 text-[13px] text-[#6E6259]">
              {t.luxe.boutiqueNote}
            </p>
          </div>
        </section>
      </main>

      <FooterBar locale={locale} />
    </div>
  );
}
