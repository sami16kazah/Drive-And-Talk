import React from 'react';
import { useTranslations } from 'next-intl';
import Logo from '@/components/ui/Logo';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function AboutPage() {
  const t = useTranslations('About');
  const tInfo = useTranslations('SchoolInfo');

  return (
    <div className="py-16 bg-white min-h-screen space-y-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Title Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-block p-4 bg-brand-mint rounded-3xl border border-brand-green/20">
            <Logo showSubtitle={true} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-brand-heading">{t('title')}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{t('subtitle')}</p>
        </div>

        {/* Mission Narrative & Image Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-extrabold text-brand-heading">{t('missionTitle')}</h2>
            <p className="text-base text-brand-body leading-relaxed">{t('missionText')}</p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="text-brand-green mt-1" />
                <p className="text-sm text-brand-body">
                  <strong>Nederlandse Taalonderdompeling:</strong> Gericht op snelle spreekvaardigheid, Staatsexamen B1/B2 voorbereiding en maatschappelijke inburgering.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircleIcon className="text-brand-green mt-1" />
                <p className="text-sm text-brand-body">
                  <strong>CBR Rijbewijs Theorie:</strong> Meertalige autotheorie lessen met actuele oefenvragen en gevaarherkenning.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircleIcon className="text-brand-green mt-1" />
                <p className="text-sm text-brand-body">
                  <strong>Engelse Taalvaardigheid:</strong> Professionele trainingen in zakelijk Engels voor expats en professionals.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircleIcon className="text-brand-green mt-1" />
                <p className="text-sm text-brand-body">
                  <strong>Chemie &amp; Vakcursussen:</strong> Praktische scheikunde lessen voor hbo/wo studenten en laboratoriummedewerkers.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                alt="Drive&Talk Classroom"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Contact & School Info Cards */}
        <div className="space-y-6 pt-6 border-t border-gray-100">
          <h3 className="text-2xl font-bold text-brand-heading text-center">
            {t('contactCardsTitle')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Card */}
            <div className="p-6 bg-brand-mint rounded-3xl border border-brand-green/20 shadow-sm space-y-3">
              <div className="p-3 bg-white rounded-2xl w-fit text-brand-green shadow-sm">
                <EmailIcon fontSize="large" />
              </div>
              <h4 className="font-bold text-lg text-brand-heading">{t('emailLabel')}</h4>
              <p className="text-sm text-gray-600">Officiële vragen &amp; administratie</p>
              <a
                href="mailto:info@drivetalk.nl"
                className="block text-brand-green font-bold text-base hover:underline"
              >
                info@drivetalk.nl
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-200 shadow-sm space-y-3">
              <div className="p-3 bg-white rounded-2xl w-fit text-[#25D366] shadow-sm">
                <WhatsAppIcon fontSize="large" />
              </div>
              <h4 className="font-bold text-lg text-brand-heading">{t('phoneLabel')}</h4>
              <p className="text-sm text-gray-600">Direct advies &amp; snelle antwoorden</p>
              <a
                href="https://wa.me/31628468247"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#25D366] font-bold text-base hover:underline"
              >
                <span>+31 6 28468247</span>
              </a>
            </div>

            {/* Working Hours Card */}
            <div className="p-6 bg-brand-mint rounded-3xl border border-brand-green/20 shadow-sm space-y-3">
              <div className="p-3 bg-white rounded-2xl w-fit text-brand-green shadow-sm">
                <AccessTimeIcon fontSize="large" />
              </div>
              <h4 className="font-bold text-lg text-brand-heading">{t('hoursLabel')}</h4>
              <p className="text-sm text-gray-600">Lessen en klantenservice beschikbaar</p>
              <p className="text-brand-heading font-extrabold text-sm">{tInfo('hours')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
