import React from 'react';
import { getTranslations } from 'next-intl/server';
import HeroSection from '@/components/home/HeroSection';
import CategoryCards from '@/components/home/CategoryCards';
import QuickInquiryForm from '@/components/home/QuickInquiryForm';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CourseCard from '@/components/courses/CourseCard';
import { connectDB } from '@/lib/db';
import { Course } from '@/models/Course';
import { Link } from '@/i18n/routing';
import { getGlobalContent } from '@/lib/content';
import { categoryLabel } from '@/lib/categories';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

async function getFeaturedCourses(limit: number) {
  try {
    await connectDB();
    const courses = await Course.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(Math.max(1, limit));
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.error('Error loading featured courses:', error);
    return [];
  }
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const site = await getGlobalContent();
  const { homepage } = site;
  const t = await getTranslations({ locale, namespace: 'Home' });
  const courses = homepage.showFeaturedCourses
    ? await getFeaturedCourses(homepage.featuredCoursesCount)
    : [];

  return (
    <div className="space-y-0">
      {homepage.showHero && <HeroSection />}

      {homepage.showCategories && <CategoryCards />}

      {homepage.showFeaturedCourses && courses.length > 0 && (
        <section className="py-16 bg-brand-mint/50 border-t border-brand-green/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
                  {t('featuredEyebrow')}
                </span>
                <h2 className="text-3xl font-extrabold text-brand-heading mt-1">{t('coursesTitle')}</h2>
                <p className="text-sm text-gray-600 mt-1">{t('coursesSubtitle')}</p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1 font-bold text-sm text-brand-green hover:underline"
              >
                <span>{t('viewAll')}</span>
                <ArrowForwardIcon fontSize="small" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course: any) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  locale={locale}
                  categoryLabel={categoryLabel(site.categories, course.category, locale)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {homepage.showQuickInquiry && <QuickInquiryForm />}

      {homepage.showTestimonials && <TestimonialsSection limit={homepage.testimonialsCount} />}
    </div>
  );
}
