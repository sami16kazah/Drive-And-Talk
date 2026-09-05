import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Course } from '@/models/Course';
import { SuccessStory } from '@/models/SuccessStory';
import { Setting } from '@/models/Setting';

export async function GET() {
  try {
    await connectDB();

    // 1. Initialize Site Settings
    let settings = await Setting.findOne({ key: 'site_settings' });
    if (!settings) {
      await Setting.create({
        key: 'site_settings',
        adminNotificationEmail: 'info@drivetalk.nl',
        senderEmail: 'samkazah444@gmail.com',
        senderName: 'Drive&Talk Academy',
      });
    }

    // 2. Seed Courses if empty
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      await Course.create([
        {
          title: {
            en: 'Dutch B1/B2 Immersion Program',
            nl: 'Nederlands B1/B2 Intensieve Cursus',
          },
          slug: 'dutch-b1-b2-immersion',
          description: {
            en: 'Comprehensive Dutch language immersion for work, study, and citizenship integration in the Netherlands.',
            nl: 'Uitgebreide Nederlandse taalcursus gericht op werk, studie en inburgering in Nederland.',
          },
          category: 'Dutch',
          price: 395,
          imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=80',
          isActive: true,
        },
        {
          title: {
            en: 'CBR Driving Theory Intensive (Dutch & English)',
            nl: 'CBR Rijbewijs Theorie Intensief (Nederlands & Engels)',
          },
          slug: 'cbr-driving-theory-intensive',
          description: {
            en: 'Master the Dutch CBR auto theory exam with real practice tests, hazard perception, and multi-language guidance.',
            nl: 'Haal je CBR autotheorie examen met actuele oefenvragen, gevaarherkenning en deskundige begeleiding.',
          },
          category: 'Driving',
          price: 195,
          imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=80',
          isActive: true,
        },
        {
          title: {
            en: 'Business & Academic English Proficiency',
            nl: 'Zakelijk & Academisch Engels',
          },
          slug: 'business-academic-english',
          description: {
            en: 'Elevate your fluency, formal writing, presentation skills, and vocabulary for professional careers.',
            nl: 'Verbeter uw spreekvaardigheid, zakelijk schrijven en presentatietechnieken voor de internationale arbeidsmarkt.',
          },
          category: 'English',
          price: 295,
          imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
          isActive: true,
        },
        {
          title: {
            en: 'Applied Chemistry & Laboratory Fundamentals',
            nl: 'Toegepaste Chemie & Laboratorium Grondbeginselen',
          },
          slug: 'applied-chemistry-fundamentals',
          description: {
            en: 'Specialized chemistry tutoring and laboratory principles for university students and chemical industry professionals.',
            nl: 'Gespecialiseerde chemielessen en laboratoriumprincipes voor studenten en professionals in de chemische sector.',
          },
          category: 'Chemistry',
          price: 350,
          imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
          isActive: true,
        },
      ]);
    }

    // 3. Seed Success Stories if empty
    const storyCount = await SuccessStory.countDocuments();
    if (storyCount === 0) {
      await SuccessStory.create([
        {
          studentName: 'Ananya Sharma',
          courseTaken: 'Dutch B1/B2 Immersion Program',
          story: {
            en: 'Drive&Talk helped me pass my B2 Staatsexamen in just 4 months! The instructors are patient, engaging, and focus on practical conversation.',
            nl: 'Dankzij Drive&Talk ben ik in 4 maanden geslaagd voor mijn Staatsexamen B2! De docenten zijn erg geduldig en richten zich op praktische gesprekken.',
          },
          imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
          date: new Date('2026-02-15'),
        },
        {
          studentName: 'Lucas Silva',
          courseTaken: 'CBR Driving Theory Intensive',
          story: {
            en: 'I passed my CBR theory exam on the first attempt with 0 errors in hazard perception! The multi-language explanation made all the difference.',
            nl: 'Ik ben in één keer geslaagd voor mijn CBR theorie-examen met 0 fouten bij gevaarherkenning! De duidelijke meertalige uitleg hielp enorm.',
          },
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
          date: new Date('2026-03-20'),
        },
      ]);
    }

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    console.error('Database seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
