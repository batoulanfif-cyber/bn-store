'use client';

import { getTranslation, Locale } from '@/lib/i18n';
import { ChevronRight } from 'lucide-react';

export function Hero({ locale }: { locale: Locale }) {
  const t = getTranslation(locale);
  const isRTL = locale === 'ar';

  return (
    <section className="relative bg-cream overflow-hidden" aria-labelledby="hero-title" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow-luxe mb-5">{t.luxe.iconEyebrow}</p>
          <h1 id="hero-title" className="font-serif font-medium text-hero text-ink">
            {t.hero.title}{' '}
            <em className="italic font-normal text-primary-600">{t.hero.titleHighlight}</em>
          </h1>
          <p className="mt-6 text-body-lg text-[#4a4038] font-light max-w-lg">{t.hero.description}</p>
          <div className="mt-9 flex flex-wrap items-center gap-7">
            <a href="/#produits" className="btn-luxe-solid">
              {t.hero.cta}
              <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
            </a>
            <a href="/checkout" className="btn-luxe-link">
              {t.luxe.orderNow} <span aria-hidden="true">{isRTL ? '←' : '→'}</span>
            </a>
          </div>
          <div className="mt-12 pt-6 border-t border-[#E2D6C3] flex flex-wrap gap-8">
            {[
              ['4,9/5', t.luxe.proofReviews],
              ['Vegan', t.luxe.proofVegan],
              ['COD', t.luxe.proofCod],
            ].map(([big, small]) => (
              <div key={small}>
                <p className="font-serif text-3xl text-ink leading-none">{big}</p>
                <p className="mt-2 text-xs text-[#6E6259]">{small}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative justify-self-center w-full max-w-[400px]">
          <div className="arch-frame p-[18px] pb-14 shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-lipstick.jpg"
              alt="Rouge à lèvres BN STORE Rouge Opéra"
              className="w-full aspect-[3/4] object-cover object-[center_20%] bg-[#f3ece1]"
              style={{ borderRadius: '999px 999px 6px 6px' }}
            />
            <p className="absolute bottom-4 inset-x-0 text-center font-serif italic text-[17px] text-[#4a4038]">
              {t.luxe.satinCaption}
            </p>
          </div>
          <div className="absolute -left-2 sm:-left-10 bottom-24 bg-cream border border-[#E2D6C3] px-5 py-4 shadow-card">
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#6E6259]">{t.luxe.shadeOfMonth}</p>
            <p className="font-serif text-[22px] mt-1">Rouge Opéra <i className="text-primary-600">N° I</i></p>
          </div>
          <div className="absolute -right-1 sm:-right-6 top-14 bg-cream border border-[#E2D6C3] px-5 py-3 shadow-card text-right">
            <p className="font-serif text-3xl">45€</p>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#6E6259]">{t.luxe.rechargeable}</p>
          </div>
        </div>
      </div>

      <div className="bg-ink text-cream overflow-hidden py-3.5 border-y border-ink" aria-hidden="true">
        <div className="flex gap-7 whitespace-nowrap font-serif text-[19px] animate-marquee w-max">
          {[0, 1].map((k) => (
            <span key={k} className="flex gap-7">
              <span>Rouge Opéra</span><span className="text-primary-400">◆</span>
              <span><em className="text-gold">{t.luxe.marqueeHold}</em></span><span className="text-primary-400">◆</span>
              <span>Vegan</span><span className="text-primary-400">◆</span>
              <span><em className="text-gold">{t.luxe.marqueeCod}</em></span><span className="text-primary-400">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
