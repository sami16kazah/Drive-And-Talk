'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedIcon from '@mui/icons-material/Verified';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';

const STAT_STYLES = [
  { icon: <SchoolIcon />, className: 'bg-brand-lightMint text-brand-green' },
  { icon: <EmojiEventsIcon />, className: 'bg-amber-50 text-amber-600' },
  { icon: <HeadsetMicIcon />, className: 'bg-blue-50 text-blue-600' },
];

export const HeroSection: React.FC = () => {
  const t = useTranslations('Hero');
  const { branding } = useSiteSettings();
  const stats = (t.raw('stats') as { value: string; label: string }[]) || [];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-mint via-white to-white py-16 lg:py-24 border-b border-brand-green/10">
      {/* Background Decorative Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-80 h-80 bg-brand-green/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-lightMint border border-brand-green/30 text-brand-green font-bold text-xs sm:text-sm shadow-sm">
              <VerifiedIcon fontSize="small" />
              <span>{t('badge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-heading leading-[1.15] tracking-tight">
              {t('titlePrefix')}
              <span className="text-brand-green relative inline-block">
                {t('titleHighlight')}
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3 text-brand-green/30"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-brand-body leading-relaxed max-w-2xl font-normal">
              {t('subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-green hover:bg-brand-hover text-white font-extrabold text-base rounded-full shadow-cardHover transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>{t('ctaExplore')}</span>
                <ArrowForwardIcon fontSize="small" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-brand-dark hover:bg-brand-heading text-white font-extrabold text-base rounded-full shadow transition-all duration-200"
              >
                <span>{t('ctaContact')}</span>
              </Link>
            </div>

            {/* Metrics Bar */}
            {stats.length > 0 && (
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200/80">
                {stats.map((stat, idx) => {
                  const style = STAT_STYLES[idx % STAT_STYLES.length];
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${style.className}`}>{style.icon}</div>
                      <div>
                        <p className="text-sm font-extrabold text-brand-heading">{stat.value}</p>
                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Right Visual Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src={branding.heroImageUrl}
                alt={t('imageAlt')}
                className="w-full h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="px-3 py-1 bg-brand-green text-xs font-black uppercase rounded-full tracking-wider">
                    {t('imageBadge')}
                  </span>
                  <h3 className="text-xl font-bold">{t('imageCaption')}</h3>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
