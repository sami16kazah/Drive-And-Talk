import React from 'react';
import { connectDB } from '@/lib/db';
import { Course } from '@/models/Course';
import { Link } from '@/i18n/routing';
import EnrollmentModalButton from '@/components/courses/EnrollmentModalButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
  const courses = await getCourses(selectedCategory);

  const categories = [
    { label: 'Alle Cursussen', value: 'all' },
    { label: 'Nederlands', value: 'Dutch' },
    { label: 'Rijbewijs Theorie', value: 'Driving' },
    { label: 'Engels', value: 'English' },
    { label: 'Chemie', value: 'Chemistry' },
    { label: 'Overig', value: 'Other' },
  ];

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-4 py-1.5 bg-brand-lightMint text-brand-green font-extrabold text-xs rounded-full uppercase tracking-wider">
            Cursusaanbod
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-brand-heading">
            Ontdek Ons Volledige Opleidingsaanbod
          </h1>
          <p className="text-base text-gray-600">
            Kwalitatief taal- en praktijkonderwijs in Nederland. Filter op categorie om de perfecte cursus voor uw doelen te vinden.
          </p>
        </div>

        {/* Category Filters Pill Bar */}
        <div className="flex items-center justify-center flex-wrap gap-2 py-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <Link
                key={cat.value}
                href={cat.value === 'all' ? '/courses' : `/courses?category=${cat.value}`}
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
            <h4 className="text-lg font-bold text-brand-heading">Geen cursussen gevonden</h4>
            <p className="text-xs text-gray-500">Er zijn momenteel geen actieve cursussen in deze categorie.</p>
          </div>
        ) : (
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
                    <div className="relative h-52 w-full overflow-hidden bg-brand-lightMint">
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
                      <h3 className="text-xl font-bold text-brand-heading group-hover:text-brand-green transition-colors">
                        {title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{desc}</p>
                    </div>
                  </div>

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
        )}
      </div>
    </div>
  );
}
