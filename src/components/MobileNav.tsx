'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingBag, Phone } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { getTranslation } from '@/lib/i18n';
import { useStoredLocale } from '@/lib/useLocale';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  const { getTotalItems, openCart } = useCart();
  const [locale] = useStoredLocale();
  const t = getTranslation(locale);
  const count = getTotalItems();

  const item = 'flex flex-col items-center justify-center gap-1 text-[11px] min-h-[64px]';

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[#E2D6C3] bg-cream/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} aria-label="Navigation mobile">
      <div className="grid grid-cols-4">
        <Link href="/" className={cn(item, pathname === '/' ? 'text-ink font-semibold' : 'text-[#6E6259]')}>
          <Home className="w-5 h-5" />{t.mobile.home}
        </Link>
        <a href="/#produits" className={cn(item, 'text-[#6E6259]')}>
          <LayoutGrid className="w-5 h-5" />{t.mobile.shop}
        </a>
        <button onClick={openCart} className={cn(item, 'relative text-[#6E6259]')}>
          <ShoppingBag className="w-5 h-5" />{t.mobile.cart}
          {count > 0 && (
            <span className="absolute top-1.5 right-1/2 translate-x-6 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-600 text-cream text-[10px] grid place-items-center font-bold">
              {count}
            </span>
          )}
        </button>
        <Link href="/checkout" className={cn(item, pathname === '/checkout' ? 'text-ink font-semibold' : 'text-[#6E6259]')}>
          <Phone className="w-5 h-5" />{t.mobile.order}
        </Link>
      </div>
    </nav>
  );
}
