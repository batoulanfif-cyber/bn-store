'use client';

import { useState, useEffect } from 'react';
import { Locale, locales } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  onChange: (locale: Locale) => void;
}

export function LanguageSwitcher({ currentLocale, onChange }: LanguageSwitcherProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[104px] h-10 bg-[#EFE6D8] animate-pulse" aria-hidden="true" />;
  }

  return (
    <div className="flex border border-[#E2D6C3]" role="group" aria-label="Language / اللغة">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          aria-pressed={currentLocale === l}
          className={`px-3.5 py-2 text-[13px] font-medium transition-colors ${
            currentLocale === l ? 'bg-ink text-cream' : 'text-[#6E6259] hover:bg-[#EFE6D8]'
          }`}
        >
          {l === 'fr' ? 'FR' : 'عربي'}
        </button>
      ))}
    </div>
  );
}
