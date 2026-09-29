'use client';

import { useState, useEffect } from 'react';
import { Locale, defaultLocale, getStoredLocale } from './i18n';

/** Shared FR/AR locale synced across header, drawer, mobile nav and checkout. */
export function useStoredLocale(): [Locale, (l: Locale) => void] {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setLocale(getStoredLocale());
    const onChange = (e: Event) => setLocale((e as CustomEvent<Locale>).detail);
    window.addEventListener('bn-locale', onChange);
    return () => window.removeEventListener('bn-locale', onChange);
  }, []);

  return [locale, setLocale];
}
