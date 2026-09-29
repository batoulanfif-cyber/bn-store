'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Truck, Shield, Headphones, CreditCard, Facebook, Instagram, Smartphone } from 'lucide-react';
import { Locale, getTranslation, getDir } from '@/lib/i18n';

function InstallAppButton({ label, hint }: { label: string; hint: string }) {
  const [showHint, setShowHint] = useState(false);

  const install = async () => {
    const dp = (window as unknown as { __bnInstallPrompt?: { prompt: () => void; userChoice: Promise<unknown> } }).__bnInstallPrompt;
    if (dp) {
      dp.prompt();
      await dp.userChoice;
    } else {
      setShowHint((v) => !v);
    }
  };

  return (
    <li>
      <button onClick={install} className="hover:text-cream inline-flex items-center gap-1.5">
        <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
        {label}
      </button>
      {showHint && <p className="mt-1.5 text-[12px] text-cream/50">{hint}</p>}
    </li>
  );
}

export function FooterBar({ locale, className }: { locale: Locale; className?: string }) {
  const t = getTranslation(locale);
  const dir = getDir(locale);

  const features = [
    { icon: Truck, title: t.footer.delivery, description: t.footer.deliveryDesc },
    { icon: Shield, title: t.footer.authentic, description: t.footer.authenticDesc },
    { icon: Headphones, title: t.footer.support, description: t.footer.supportDesc },
    { icon: CreditCard, title: t.footer.cod, description: t.footer.codDesc },
  ];

  return (
    <footer className={cn('bg-ink text-cream', className)} role="contentinfo" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pb-10">
          {features.map((f) => (
            <div key={f.title} className="py-6 px-4 flex flex-col items-center text-center border-r border-white/10 last:border-0">
              <f.icon className="w-6 h-6 text-gold mb-3" aria-hidden="true" />
              <h3 className="font-medium text-body-sm">{f.title}</h3>
              <p className="text-caption text-cream/50">{f.description}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-4 gap-8 py-10 border-t border-white/10">
          <div>
            <p className="font-serif text-2xl tracking-[0.08em]">BN <em className="not-italic text-xs tracking-[0.42em]">STORE</em></p>
            <p className="mt-3 text-sm font-light text-cream/60 max-w-xs">{t.footer.brandTagline} — {t.luxe.footTagline}</p>
          </div>
          <div>
            <h4 className="text-[11px] tracking-[0.24em] uppercase text-cream/45 mb-4">{t.luxe.footShop}</h4>
            <ul className="space-y-2.5 text-sm text-cream/70">
              <li><a href="/#produits" className="hover:text-cream">{t.nav.products}</a></li>
              <li><a href="/products" className="hover:text-cream">{t.products.viewAll}</a></li>
              <li><a href="/checkout" className="hover:text-cream">{t.luxe.orderNow}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] tracking-[0.24em] uppercase text-cream/45 mb-4">{t.luxe.footHouse}</h4>
            <ul className="space-y-2.5 text-sm text-cream/70">
              <li><a href="/#maison" className="hover:text-cream">{t.nav.about}</a></li>
              <li><a href="/#produits" className="hover:text-cream">{t.nav.brands}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] tracking-[0.24em] uppercase text-cream/45 mb-4">{t.luxe.footHelp}</h4>
            <ul className="space-y-2.5 text-sm text-cream/70">
              <li>
                <a href="https://www.facebook.com/profile.php?id=61594861916745" target="_blank" rel="noopener noreferrer" className="hover:text-cream inline-flex items-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5" aria-hidden="true" />
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/bn_store_cosmitics" target="_blank" rel="noopener noreferrer" className="hover:text-cream inline-flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5" aria-hidden="true" />
                  Instagram
                </a>
              </li>
              <InstallAppButton label={t.mobile.installApp} hint={t.mobile.installAndroid} />
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-cream/45">
          <p>© 2026 BN STORE — {t.luxe.footRights}</p>
          <p>{t.luxe.footPay}</p>
        </div>
      </div>
    </footer>
  );
}
