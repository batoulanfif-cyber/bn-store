'use client';

import { formatPrice } from '@/lib/utils';
import { Locale, getTranslation } from '@/lib/i18n';
import { useCart } from './CartContext';

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  href: string;
}

export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = getTranslation(locale);
  const isRTL = locale === 'ar';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;
  const { addItem } = useCart();

  return (
    <article className="group bg-cream border border-[#E2D6C3] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card-hover" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F3ECE1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.badge ? (
          <span className="absolute top-3.5 left-3.5 bg-ink text-cream text-[10px] tracking-[0.2em] uppercase px-3 py-1.5">
            {product.badge}
          </span>
        ) : (
          <span className="absolute top-3.5 left-3.5 bg-cream/95 text-ink border border-[#E2D6C3] text-[10px] tracking-[0.2em] uppercase px-3 py-1.5">
            {product.brand}
          </span>
        )}
        {hasDiscount && (
          <span className="absolute bottom-3.5 left-3.5 px-2.5 py-1 bg-primary-600 text-cream text-[10px] font-semibold">
            -{discountPercent}%
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); addItem(parseInt(product.id), 1); }}
          className="absolute inset-x-3 bottom-3 bg-ink/95 text-cream py-3 text-[11px] tracking-[0.18em] uppercase font-medium
                     opacity-100 sm:opacity-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                     transition-all duration-300 hover:bg-primary-600"
          aria-label={`${t.products.addToCart} ${product.name}`}
        >
          {t.products.addToCart} — {formatPrice(product.price)} {t.products.priceSuffix}
        </button>
      </div>

      <div className="p-5">
        <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-medium">{product.brand}</p>
        <h3 className="font-serif font-medium text-[25px] text-ink mt-1.5 line-clamp-1">{product.name}</h3>
        {product.rating ? (
          <p className="mt-1.5 text-[13px] text-[#6E6259]">
            ★ {Number(product.rating).toFixed(1)}{product.reviewCount ? ` (${product.reviewCount})` : ''}
          </p>
        ) : null}
        <p className="mt-2 text-[16px] font-medium text-ink">
          {formatPrice(product.price)} {t.products.priceSuffix}
          {hasDiscount && (
            <span className="ml-2 text-[13px] font-light text-[#6E6259] line-through">
              {formatPrice(product.originalPrice!)} {t.products.priceSuffix}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
