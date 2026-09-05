'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export const LanguageSwitcher: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = (newLocale: 'nl' | 'en') => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="inline-flex items-center p-1 bg-brand-dark/10 dark:bg-white/10 backdrop-blur-md rounded-full border border-brand-green/20">
      <button
        onClick={() => handleToggle('nl')}
        className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1 ${
          locale === 'nl'
            ? 'bg-brand-green text-white shadow-sm scale-105'
            : 'text-brand-heading hover:text-brand-green'
        }`}
        title="Nederlands"
      >
        <span>🇳🇱</span>
        <span>NL</span>
      </button>
      <button
        onClick={() => handleToggle('en')}
        className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1 ${
          locale === 'en'
            ? 'bg-brand-green text-white shadow-sm scale-105'
            : 'text-brand-heading hover:text-brand-green'
        }`}
        title="English"
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
