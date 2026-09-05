'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import TranslateIcon from '@mui/icons-material/Translate';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LanguageIcon from '@mui/icons-material/Language';
import ScienceIcon from '@mui/icons-material/Science';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const CategoryCards: React.FC = () => {
  const categories = [
    {
      title: 'Nederlandse Taal',
      subtitle: 'Intensief onderdompelingsonderwijs van A1 tot B2 Staatsexamen.',
      icon: <TranslateIcon className="text-brand-green text-4xl" />,
      categoryParam: 'Dutch',
      color: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'CBR Rijbewijs Theorie',
      subtitle: 'Autotheorie examenvoorbereiding in het Nederlands & Engels.',
      icon: <DirectionsCarIcon className="text-blue-600 text-4xl" />,
      categoryParam: 'Driving',
      color: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'Engelse Taalvaardigheid',
      subtitle: 'Zakelijk & academisch Engels voor carrière en studie.',
      icon: <LanguageIcon className="text-purple-600 text-4xl" />,
      categoryParam: 'English',
      color: 'bg-purple-50 border-purple-100',
    },
    {
      title: 'Chemie & Vakcursussen',
      subtitle: 'Toegepaste scheikunde lessen voor hbo/wo en lab-professionals.',
      icon: <ScienceIcon className="text-amber-600 text-4xl" />,
      categoryParam: 'Chemistry',
      color: 'bg-amber-50 border-amber-100',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold text-brand-heading">
            Onze Vakgebieden &amp; Specialisaties
          </h2>
          <p className="text-sm text-gray-600">
            Ontdek waarom duizenden cursisten in Nederland kiezen voor de gecombineerde aanpak van Drive&amp;Talk Academy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/courses?category=${cat.categoryParam}`}
              className={`p-6 rounded-2xl border ${cat.color} hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between group`}
            >
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-heading">{cat.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{cat.subtitle}</p>
              </div>

              <div className="mt-6 flex items-center gap-1 text-brand-green font-bold text-xs group-hover:translate-x-1 transition-transform">
                <span>Bekijk cursussen</span>
                <ArrowForwardIcon fontSize="inherit" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
