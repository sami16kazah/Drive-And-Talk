import React from 'react';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Course } from '@/models/Course';
import { Link } from '@/i18n/routing';
import ReviewsSection from '@/components/courses/ReviewsSection';
import EnrollmentModalButton from '@/components/courses/EnrollmentModalButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

async function getCourseBySlug(slug: string) {
  try {
    await connectDB();
    const course = await Course.findOne({ slug });
    if (!course) return null;
    return JSON.parse(JSON.stringify(course));
  } catch (error) {
    console.error('Error fetching course by slug:', error);
    return null;
  }
}

export default async function CourseDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const title = locale === 'en' ? course.title.en : course.title.nl;
  const description = locale === 'en' ? course.description.en : course.description.nl;

  const syllabusPoints =
    locale === 'en'
      ? [
          'Interactive online and classroom practice modules.',
          'Real exam simulations and exam strategy coaching.',
          'Personalized instruction tailored for non-native speakers.',
          'Comprehensive course material and study guidance included.',
        ]
      : [
          'Interactieve lesmodules en klaslokale oefenopdrachten.',
          'Echte examen-simulaties en strategieën voor maximale slagingskans.',
          'Persoonlijke begeleiding afgestemd op anderstaligen.',
          'Inclusief al het benodigde lesmateriaal en oefenvragen.',
        ];

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back Link */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 font-bold text-sm text-gray-500 hover:text-brand-green transition-colors"
        >
          <ArrowBackIcon fontSize="small" />
          <span>Terug naar cursusaanbod</span>
        </Link>

        {/* Hero Card Container */}
        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-card border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-3.5 py-1 bg-brand-lightMint text-brand-green font-extrabold text-xs rounded-full uppercase tracking-wider">
              {course.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-heading">{title}</h1>

            <p className="text-base text-gray-600 leading-relaxed">{description}</p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <AccessTimeIcon className="text-brand-green" />
                <span>Flexibele lestijden (Ma - Zo)</span>
              </div>
              <div className="flex items-center gap-2">
                <MenuBookIcon className="text-brand-green" />
                <span>Inclusief Lesmateriaal</span>
              </div>
              <div className="flex items-center gap-2">
                <WorkspacePremiumIcon className="text-brand-green" />
                <span>Erkend Certificaat</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4 border-t border-gray-100">
              <div>
                <span className="text-xs text-gray-400 font-medium">Totale Prijs</span>
                <p className="text-3xl font-black text-brand-green">€{course.price}</p>
              </div>

              <EnrollmentModalButton
                courseId={course._id}
                courseTitle={title}
                buttonText="Inschrijven voor deze Cursus"
                className="px-6 py-3 bg-brand-green hover:bg-brand-hover text-white font-extrabold text-sm rounded-xl shadow-md transition-all"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-brand-green/20">
              {course.imageUrl ? (
                <img
                  src={course.imageUrl}
                  alt={title}
                  className="w-full h-80 object-cover"
                />
              ) : (
                <div className="w-full h-80 bg-brand-lightMint flex items-center justify-center text-brand-green font-serif text-3xl font-bold">
                  Drive&amp;Talk
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Syllabus Highlights Section */}
        <div className="bg-white rounded-3xl p-8 shadow-card border border-gray-100 space-y-4">
          <h3 className="text-2xl font-bold text-brand-heading">
            Lesprogramma &amp; Inhoud
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {syllabusPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-brand-mint rounded-2xl">
                <CheckCircleIcon className="text-brand-green mt-0.5" />
                <span className="text-sm text-brand-body font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Reviews & Ratings Section */}
        <ReviewsSection courseId={course._id} />
      </div>
    </div>
  );
}
