import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import EnrollmentModalButton from '@/components/courses/EnrollmentModalButton';

interface CourseCardProps {
  course: any;
  locale: string;
  categoryLabel: string;
  imageHeight?: string;
}

export function CourseCard({ course, locale, categoryLabel, imageHeight = 'h-48' }: CourseCardProps) {
  const t = useTranslations('Courses');
  const title = locale === 'en' ? course.title.en : course.title.nl;
  const desc = locale === 'en' ? course.description.en : course.description.nl;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-cardHover border border-gray-100 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className={`relative ${imageHeight} w-full overflow-hidden bg-brand-lightMint`}>
          {course.imageUrl ? (
            <img
              src={course.imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif text-4xl text-brand-green font-bold">
              {t('imagePlaceholder')}
            </div>
          )}
          <span className="absolute top-4 right-4 px-3 py-1 bg-brand-dark/90 backdrop-blur-md text-white text-xs font-extrabold rounded-full">
            {categoryLabel}
          </span>
        </div>

        <div className="p-6 space-y-3">
          <h3 className="text-xl font-bold text-brand-heading line-clamp-1 group-hover:text-brand-green transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{desc}</p>
        </div>
      </div>

      <div className="p-6 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
        <div>
          <span className="text-xs text-gray-400 font-medium">{t('price')}</span>
          <p className="text-xl font-black text-brand-green">€{course.price}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/courses/${course.slug}`}
            className="px-3.5 py-2 text-xs font-bold text-brand-heading hover:bg-brand-mint rounded-xl border border-gray-200 transition-colors"
          >
            {t('details')}
          </Link>
          <EnrollmentModalButton courseId={course._id} courseTitle={title} buttonText={t('enrollNow')} />
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
