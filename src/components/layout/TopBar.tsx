'use client';

import { cn } from '@/lib/utils';
import { Locale, getTranslation, getDir } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useCart } from '@/components/CartContext';
import { ShoppingBag } from 'lucide-react';

export function AnnouncementBar({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn('bg-ink text-cream py-2.5 overflow-hidden', className)} role="status" aria-live="polite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-medium tracking-[0.12em] uppercase">{message}</p>
      </div>
    </div>
  );
}

function CartButton({ locale }: { locale: Locale }) {
  const t = getTranslation(locale);
  const { getTotalItems, toggleCart } = useCart();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={toggleCart}
      className="inline-flex items-center gap-2 bg-ink text-cream px-5 py-2.5 text-xs tracking-[0.16em] uppercase font-medium hover:bg-primary-600 transition-colors"
      aria-label={`${t.topbar.cart} (${totalItems} articles)`}
    >
      <ShoppingBag className="w-4 h-4" aria-hidden="true" />
      <span className="hidden sm:inline">{t.topbar.cart}</span>
      <span>({totalItems})</span>
    </button>
  );
}

export function Header({ locale, onLocaleChange, className }: { locale: Locale; onLocaleChange: (locale: Locale) => void; className?: string }) {
  const t = getTranslation(locale);
  const isRTL = locale === 'ar';

  const navLinks = [
    { href: '/#produits', label: t.nav.products, active: false },
    { href: '/checkout', label: t.luxe.orderNow, active: false },
    { href: '/#maison', label: t.nav.about, active: false },
  ];

  return (
    <header
      className={cn('sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-[#E2D6C3] transition-all duration-300', className)}
      role="banner"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-4">
          <nav className="hidden md:flex items-center gap-7 flex-1" role="navigation" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className="relative text-[13px] tracking-[0.14em] uppercase text-[#3d342c] py-1
                           after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-primary-600
                           after:scale-x-0 after:origin-right after:transition-transform after:duration-300
                           hover:after:scale-x-100 hover:after:origin-left"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a href="/" className="text-center leading-none" aria-label="BN STORE - Accueil">
            <span className="font-serif text-[26px] tracking-[0.08em] text-ink">BN <em className="not-italic text-[13px] tracking-[0.42em] align-[3px]">STORE</em></span>
            <span className="block font-sans text-[9px] tracking-[0.3em] uppercase text-[#6E6259] mt-1">Maison de Beauté — Paris</span>
          </a>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <LanguageSwitcher currentLocale={locale} onChange={onLocaleChange} />
            <CartButton locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}

export function TopBar({ locale, onLocaleChange }: { locale: Locale; onLocaleChange: (locale: Locale) => void }) {
  const t = getTranslation(locale);
  return (
    <div className="bg-cream">
      <AnnouncementBar message={t.topbar.announcement} />
      <Header locale={locale} onLocaleChange={onLocaleChange} />
    </div>
  );
}
