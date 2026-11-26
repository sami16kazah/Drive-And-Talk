import React from 'react';
import { getTranslations } from 'next-intl/server';
import { connectDB } from '@/lib/db';
import { Course } from '@/models/Course';
import { Link } from '@/i18n/routing';
import CourseCard from '@/components/courses/CourseCard';
import { getGlobalContent } from '@/lib/content';
import { categoryLabel } from '@/lib/categories';
import { localized } from '@/lib/contentUtils';

async function getCourses(category?: string) {
  try {
    await connectDB();
    const filter: any = { isActive: true };
    if (category && category !== 'all' && category !== 'All') {
      filter.category = category;
    }
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.error('Error fetching courses page data:', error);
    return [];
  }
}

export default async function CoursesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string };
}) {
  const selectedCategory = searchParams.category || 'all';
  const [courses, site, t] = await Promise.all([
    getCourses(selectedCategory),
    getGlobalContent(),
    getTranslations({ locale, namespace: 'Courses' }),
  ]);

  const categories = [
    { label: t('allCategories'), value: 'all' },
    ...site.categories.map((c) => ({ label: localized(c.label, locale) || c.value, value: c.value })),
  ];

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-4 py-1.5 bg-brand-lightMint text-brand-green font-extrabold text-xs rounded-full uppercase tracking-wider">
            {t('eyebrow')}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-brand-heading">{t('title')}</h1>
          <p className="text-base text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Category Filters Pill Bar */}
        <div className="flex items-center justify-center flex-wrap gap-2 py-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <Link
                key={cat.value}
                href={cat.value === 'all' ? '/courses' : `/courses?category=${encodeURIComponent(cat.value)}`}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 ${
                  isSelected
                    ? 'bg-brand-green text-white shadow-md scale-105'
                    : 'bg-white text-brand-heading border border-gray-200 hover:border-brand-green hover:text-brand-green'
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Course Cards Grid */}
        {courses.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-gray-200 max-w-md mx-auto space-y-2">
            <h4 className="text-lg font-bold text-brand-heading">{t('noCoursesTitle')}</h4>
            <p className="text-xs text-gray-500">{t('noCourses')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: any) => (
              <CourseCard
                key={course._id}
                course={course}
                locale={locale}
                imageHeight="h-52"
                categoryLabel={categoryLabel(site.categories, course.category, locale)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
