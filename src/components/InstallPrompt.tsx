'use client';

import { useEffect, useState } from 'react';
import { X, Share, PlusSquare } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';
import { useStoredLocale } from '@/lib/useLocale';

export function InstallPrompt() {
  const [locale] = useStoredLocale();
  const t = getTranslation(locale);
  const [deferred, setDeferred] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('bn_install_dismissed');
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (dismissed || isStandalone) return;

    const ua = window.navigator.userAgent;
    setIsIOS(/iphone|ipad|ipod/i.test(ua));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      // Expose to footer install button (all devices).
      (window as unknown as { __bnInstallPrompt?: Event }).__bnInstallPrompt = e;
      window.dispatchEvent(new Event('bn:install-ready'));
      setDeferred(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    const tm = setTimeout(() => { if (/iphone|ipad|ipod/i.test(ua)) setShow(true); }, 4000);
    return () => { window.removeEventListener('beforeinstallprompt', onPrompt); clearTimeout(tm); };
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  if (!show) return null;

  const install = async () => {
    if (deferred) {
      deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
      setShow(false);
    }
  };

  return (
    <div className="lg:hidden fixed bottom-[76px] inset-x-3 z-50 rounded-2xl bg-ink text-cream p-4 shadow-2xl flex gap-3 items-start"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }} role="dialog" aria-label={t.mobile.installTitle}>
      <div className="flex-1 text-sm">
        <p className="font-semibold">{t.mobile.installTitle}</p>
        {isIOS && !deferred ? (
          <p className="text-cream/70 text-[13px] mt-1">
            {t.mobile.installIos} <Share className="w-4 h-4 inline" /> <PlusSquare className="w-4 h-4 inline" />
          </p>
        ) : (
          <p className="text-cream/70 text-[13px] mt-1">{t.mobile.installAndroid}</p>
        )}
        {!isIOS && deferred && (
          <button onClick={install} className="mt-2 px-4 py-2 rounded-lg bg-cream text-ink text-[13px] font-semibold">
            {t.mobile.installBtn}
          </button>
        )}
      </div>
      <button aria-label="Fermer" onClick={() => { localStorage.setItem('bn_install_dismissed', '1'); setShow(false); }}
        className="p-1.5 rounded-lg bg-white/10"><X className="w-4 h-4" /></button>
    </div>
  );
}
