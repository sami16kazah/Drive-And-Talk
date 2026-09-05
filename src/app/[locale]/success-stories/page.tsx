import React from 'react';
import { connectDB } from '@/lib/db';
import { SuccessStory } from '@/models/SuccessStory';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import VerifiedIcon from '@mui/icons-material/Verified';

async function getSuccessStories() {
  try {
    await connectDB();
    const stories = await SuccessStory.find().sort({ date: -1 });
    return JSON.parse(JSON.stringify(stories));
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return [];
  }
}

export default async function SuccessStoriesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const stories = await getSuccessStories();

  return (
    <div className="py-16 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-4 py-1.5 bg-brand-lightMint text-brand-green font-extrabold text-xs rounded-full uppercase tracking-wider">
            Ervaringen
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-brand-heading">
            Succesverhalen van Onze Cursisten
          </h1>
          <p className="text-base text-gray-600">
            Lees hoe onze studenten hun taalniveau hebben verhoogd en hun CBR-rijbewijstheorie hebben behaald.
          </p>
        </div>

        {/* Stories Grid */}
        {stories.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-gray-200 max-w-md mx-auto space-y-2">
            <h4 className="text-lg font-bold text-brand-heading">Geen succesverhalen</h4>
            <p className="text-xs text-gray-500">Er zijn momenteel geen verhalen gepubliceerd.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((s: any) => {
              const storyText = locale === 'en' ? s.story.en : s.story.nl;

              return (
                <div
                  key={s._id}
                  className="bg-white rounded-3xl p-6 shadow-card hover:shadow-cardHover border border-gray-100 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-lightMint text-brand-green text-xs font-extrabold rounded-full">
                        <VerifiedIcon fontSize="inherit" />
                        <span>Geslaagd</span>
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {new Date(s.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="relative">
                      <FormatQuoteIcon className="text-brand-green/20 text-5xl absolute -top-4 -left-2" />
                      <p className="text-sm text-brand-body italic leading-relaxed pt-2 relative z-10">
                        "{storyText}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    {s.imageUrl ? (
                      <img
                        src={s.imageUrl}
                        alt={s.studentName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-brand-green"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-green text-white font-bold flex items-center justify-center text-lg">
                        {s.studentName[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-brand-heading">{s.studentName}</h4>
                      <p className="text-xs text-brand-green font-semibold">{s.courseTaken}</p>
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
