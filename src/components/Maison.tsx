import { Locale, getTranslation } from '@/lib/i18n';

export function Maison({ locale }: { locale: Locale }) {
  const t = getTranslation(locale);
  return (
    <section id="maison" className="bg-[#EFE6D8] border-y border-[#E2D6C3] scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <p className="eyebrow-luxe mb-6" style={{ justifyContent: 'center' }}>
          {t.luxe.maisonEyebrow}
        </p>
        <blockquote className="font-serif italic text-[clamp(26px,4vw,44px)] leading-snug text-ink">
          {t.luxe.maisonQuote}
        </blockquote>
        <p className="mt-5 text-xs tracking-[0.22em] uppercase text-[#6E6259]">
          — {t.luxe.maisonSign}
        </p>
        <div className="mt-10 flex justify-center gap-12 sm:gap-16 flex-wrap">
          {[
            ['96%', t.luxe.fact1],
            ['0', t.luxe.fact2],
            ['16', t.luxe.fact3],
          ].map(([big, small]) => (
            <div key={small}>
              <p className="font-serif text-5xl leading-none text-ink">{big}</p>
              <p className="mt-2 text-xs tracking-[0.14em] uppercase text-[#6E6259]">{small}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
