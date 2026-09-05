'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Story {
  _id: string;
  studentName: string;
  courseTaken: string;
  story: { en: string; nl: string };
  imageUrl?: string;
}

export const TestimonialsSection: React.FC = () => {
  const t = useTranslations('Home');
  const locale = useLocale();
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    fetch('/api/stories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStories(data.slice(0, 3));
      })
      .catch((err) => console.error(err));
  }, []);

  if (stories.length === 0) return null;

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-brand-heading">{t('testimonialsTitle')}</h2>
            <p className="text-sm text-gray-600 mt-1">{t('testimonialsSubtitle')}</p>
          </div>
          <Link
            href="/success-stories"
            className="flex items-center gap-1 text-brand-green font-bold text-sm hover:underline"
          >
            <span>Bekijk alle verhalen</span>
            <ArrowForwardIcon fontSize="small" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story._id}
              className="p-6 bg-brand-mint rounded-2xl border border-brand-green/20 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <FormatQuoteIcon className="text-brand-green/40 text-4xl" />
                <p className="text-sm text-brand-body italic leading-relaxed">
                  "{locale === 'en' ? story.story.en : story.story.nl}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-brand-green/10">
                {story.imageUrl ? (
                  <img
                    src={story.imageUrl}
                    alt={story.studentName}
                    className="w-11 h-11 rounded-full object-cover border border-brand-green"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-brand-green text-white font-bold flex items-center justify-center">
                    {story.studentName[0]}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-sm text-brand-heading">{story.studentName}</h4>
                  <p className="text-xs text-brand-green font-medium">{story.courseTaken}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
