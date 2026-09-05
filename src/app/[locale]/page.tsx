import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import CategoryCards from '@/components/home/CategoryCards';
import QuickInquiryForm from '@/components/home/QuickInquiryForm';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { connectDB } from '@/lib/db';
import { Course } from '@/models/Course';
import { Link } from '@/i18n/routing';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EnrollmentModalButton from '@/components/courses/EnrollmentModalButton';

async function getFeaturedCourses() {
  try {
    await connectDB();
    const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 }).limit(6);
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.error('Error loading featured courses:', error);
    return [];
  }
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const courses = await getFeaturedCourses();

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Category Specializations Grid */}
      <CategoryCards />

      {/* Dynamic Featured Courses Section */}
      <section className="py-16 bg-brand-mint/50 border-t border-brand-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
                Aanbevolen Programma's
              </span>
              <h2 className="text-3xl font-extrabold text-brand-heading mt-1">
                Populaire Cursussen &amp; Opleidingen
              </h2>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1 font-bold text-sm text-brand-green hover:underline"
            >
              <span>Alle cursussen bekijken</span>
              <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: any) => {
              const title = locale === 'en' ? course.title.en : course.title.nl;
              const desc = locale === 'en' ? course.description.en : course.description.nl;

              return (
                <div
                  key={course._id}
                  className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-cardHover border border-gray-100 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-brand-lightMint">
                      {course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-serif text-4xl text-brand-green font-bold">
                          Drive&amp;Talk
                        </div>
                      )}
                      <span className="absolute top-4 right-4 px-3 py-1 bg-brand-dark/90 backdrop-blur-md text-white text-xs font-extrabold rounded-full">
                        {course.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold text-brand-heading line-clamp-1 group-hover:text-brand-green transition-colors">
                        {title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{desc}</p>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-6 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">Cursusprijs</span>
                      <p className="text-xl font-black text-brand-green">€{course.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="px-3.5 py-2 text-xs font-bold text-brand-heading hover:bg-brand-mint rounded-xl border border-gray-200 transition-colors"
                      >
                        Details
                      </Link>
                      <EnrollmentModalButton courseId={course._id} courseTitle={title} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Inquiry Form Section */}
      <QuickInquiryForm />

      {/* Student Testimonials Preview */}
      <TestimonialsSection />
    </div>
  );
}
