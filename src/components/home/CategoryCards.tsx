'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import { CategoryIcon, CATEGORY_COLORS } from '@/components/ui/CategoryIcon';
import { localized } from '@/lib/contentUtils';

export const CategoryCards: React.FC = () => {
  const t = useTranslations('Home');
  const locale = useLocale();
  const { categories } = useSiteSettings();
  const visible = categories.filter((c) => c.showOnHome);

  if (visible.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold text-brand-heading">{t('categoriesTitle')}</h2>
          <p className="text-sm text-gray-600">{t('categoriesSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((cat, idx) => {
            const colors = CATEGORY_COLORS[cat.color] || CATEGORY_COLORS.emerald;
            return (
              <Link
                key={`${cat.value}-${idx}`}
                href={`/courses?category=${encodeURIComponent(cat.value)}`}
                className={`p-6 rounded-2xl border ${colors.card} hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between group`}
              >
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                    <CategoryIcon name={cat.icon} className={`${colors.icon} text-4xl`} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-heading">
                    {localized(cat.homeTitle, locale) || localized(cat.label, locale)}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {localized(cat.homeDescription, locale)}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-brand-green font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>{t('categoriesCta')}</span>
                  <ArrowForwardIcon fontSize="inherit" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
