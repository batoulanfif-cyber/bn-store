'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { ChevronRight } from 'lucide-react';
import { Locale, getTranslation } from '@/lib/i18n';
import type { Product as DBProduct } from '@/lib/db-types';

export function ProductGrid({ locale }: { locale: Locale }) {
  const t = getTranslation(locale);
  const isRTL = locale === 'ar';
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch('/api/products?active=true&limit=20', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (alive) setProducts(d.data?.data || []); })
      .catch(() => { if (alive) setProducts([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return (
    <section id="produits" className="bg-cream py-16 sm:py-24 scroll-mt-20" aria-labelledby="products-title" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow-luxe mb-4">{t.luxe.boutiqueEyebrow}</p>
            <h2 id="products-title" className="font-serif font-medium text-heading-lg text-ink">
              {t.products.title} <em className="italic font-normal text-primary-600">{t.products.subtitle}</em>
            </h2>
          </div>
          <a href="/checkout" className="btn-luxe-link self-start sm:self-auto" dir={isRTL ? 'rtl' : 'ltr'}>
            {t.products.viewAll}
            <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
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
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-[#6E6259] border border-[#E2D6C3] bg-cream">
            <p>{t.products.title} — …</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
                  href: `/produit/${product.slug}`,
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
  );
}
