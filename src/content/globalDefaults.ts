/**
 * Default values for site-wide (language independent) content.
 * Everything here can be overridden from the admin dashboard
 * ("Website Inhoud" tab). Overrides are stored in MongoDB (SiteContent model)
 * and deep-merged on top of these defaults at runtime.
 *
 * This file must stay free of server-only imports: it is also used client side.
 */
export const globalDefaults = {
  contact: {
    email: 'info@drivetalk.nl',
    phoneDisplay: '+31 6 28468247',
    whatsappNumber: '31628468247',
  },
  branding: {
    logoUrl: '/logo.png',
    logoAlt: 'Drive & Talk',
    faviconUrl: '',
    heroImageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    aboutImageUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
  },
  theme: {
    primaryColor: '#00B050',
    primaryHoverColor: '#009243',
    darkColor: '#1A2E20',
    headingColor: '#0F1F14',
    bodyColor: '#1E293B',
    mintColor: '#F8FAF7',
    lightMintColor: '#EAF5EE',
  },
  homepage: {
    showHero: true,
    showCategories: true,
    showFeaturedCourses: true,
    showQuickInquiry: true,
    showTestimonials: true,
    featuredCoursesCount: 6,
    testimonialsCount: 3,
  },
  links: {
    privacyUrl: '/contact',
    termsUrl: '/contact',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
  },
  categories: [
    {
      value: 'Dutch',
      icon: 'translate',
      color: 'emerald',
      showOnHome: true,
      label: { nl: 'Nederlands', en: 'Dutch' },
      homeTitle: { nl: 'Nederlandse Taal', en: 'Dutch Language' },
      homeDescription: {
        nl: 'Intensief onderdompelingsonderwijs van A1 tot B2 Staatsexamen.',
        en: 'Intensive immersion education from A1 to the B2 State Exam.',
      },
    },
    {
      value: 'Driving',
      icon: 'car',
      color: 'blue',
      showOnHome: true,
      label: { nl: 'Rijbewijs Theorie', en: 'Driving Theory' },
      homeTitle: { nl: 'CBR Rijbewijs Theorie', en: 'CBR Driving Theory' },
      homeDescription: {
        nl: 'Autotheorie examenvoorbereiding in het Nederlands & Engels.',
        en: 'Car theory exam preparation in Dutch & English.',
      },
    },
    {
      value: 'English',
      icon: 'language',
      color: 'purple',
      showOnHome: true,
      label: { nl: 'Engels', en: 'English' },
      homeTitle: { nl: 'Engelse Taalvaardigheid', en: 'English Proficiency' },
      homeDescription: {
        nl: 'Zakelijk & academisch Engels voor carrière en studie.',
        en: 'Business & academic English for career and study.',
      },
    },
    {
      value: 'Chemistry',
      icon: 'science',
      color: 'amber',
      showOnHome: true,
      label: { nl: 'Chemie', en: 'Chemistry' },
      homeTitle: { nl: 'Chemie & Vakcursussen', en: 'Chemistry & Vocational Courses' },
      homeDescription: {
        nl: 'Toegepaste scheikunde lessen voor hbo/wo en lab-professionals.',
        en: 'Applied chemistry lessons for university students and lab professionals.',
      },
    },
    {
      value: 'Other',
      icon: 'school',
      color: 'gray',
      showOnHome: false,
      label: { nl: 'Overig', en: 'Other' },
      homeTitle: { nl: 'Overige Cursussen', en: 'Other Courses' },
      homeDescription: { nl: 'Overige cursussen en trainingen.', en: 'Other courses and training.' },
    },
  ],
  email: {
    headerTitle: 'DRIVE & TALK',
    headerSubtitle: 'English · Dutch · Driving',
    greeting: 'Beste',
    followUpTitle: 'Heeft u direct aanvullende vragen?',
    followUpText: 'Stuur ons een bericht via WhatsApp:',
    emailLabel: 'Email',
    phoneLabel: 'WhatsApp / Telefoon',
    hoursLabel: 'Openingstijden:',
    hoursText: 'Maandag t/m Zondag : 09:00 - 22:00',
    copyright: 'Drive&Talk Academy. Alle rechten voorbehouden.',
    notificationTitle: 'Drive&Talk Academy',
    notificationSubtitle: 'New Lead Notification',
    notificationSubjectEnrollment: '[Drive&Talk] New Course Enrollment Request:',
    notificationSubjectContact: '[Drive&Talk] New Contact Inquiry from',
    notificationFooter: 'Automated notification from Drive&Talk Academy Web System',
  },
};

export type GlobalContent = typeof globalDefaults;
export type CategoryItem = GlobalContent['categories'][number];

/** Choices shown as dropdowns in the dashboard editor for specific field names. */
export const FIELD_OPTIONS: Record<string, string[]> = {
  icon: ['translate', 'car', 'language', 'science', 'school', 'book', 'work', 'calculate', 'computer', 'brush', 'music', 'sports'],
  color: ['emerald', 'blue', 'purple', 'amber', 'rose', 'sky', 'gray'],
};
