'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Logo from '@/components/ui/Logo';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import { whatsappLink } from '@/lib/contentUtils';

function SmartLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  if (/^(https?:|mailto:|tel:)/i.test(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href || '/'} className={className}>
      {children}
    </Link>
  );
}

export const Footer: React.FC = () => {
  const tNav = useTranslations('Navigation');
  const tInfo = useTranslations('SchoolInfo');
  const t = useTranslations('Footer');
  const { contact, links } = useSiteSettings();
  const programs = (t.raw('programs') as string[]) || [];

  const socials = [
    { href: links.facebookUrl, icon: <FacebookIcon fontSize="small" />, label: 'Facebook' },
    { href: links.instagramUrl, icon: <InstagramIcon fontSize="small" />, label: 'Instagram' },
    { href: links.linkedinUrl, icon: <LinkedInIcon fontSize="small" />, label: 'LinkedIn' },
    { href: links.youtubeUrl, icon: <YouTubeIcon fontSize="small" />, label: 'YouTube' },
  ].filter((s) => !!s.href);

  return (
    <footer className="bg-brand-dark text-white border-t-4 border-brand-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md inline-block border border-brand-green/30">
              <Logo variant="dark" showSubtitle={true} />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{t('description')}</p>
            {socials.length > 0 && (
              <div className="flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="p-2 rounded-xl bg-white/10 text-gray-200 hover:text-brand-green hover:bg-white/20 transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-brand-green font-bold text-base uppercase tracking-wider mb-4">
              {t('navTitle')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/', label: tNav('home') },
                { href: '/courses', label: tNav('courses') },
                { href: '/success-stories', label: tNav('successStories') },
                { href: '/about', label: tNav('about') },
                { href: '/contact', label: tNav('contact') },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-300 hover:text-brand-green transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Programs & Subjects */}
          <div>
            <h4 className="text-brand-green font-bold text-base uppercase tracking-wider mb-4">
              {t('programsTitle')}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              {programs.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>

          {/* Col 4: School Contact & Opening Hours */}
          <div className="space-y-3">
            <h4 className="text-brand-green font-bold text-base uppercase tracking-wider mb-4">
              {t('contactTitle')}
            </h4>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <EmailIcon className="text-brand-green" fontSize="small" />
              <a href={`mailto:${contact.email}`} className="hover:text-brand-green transition-colors">
                {contact.email}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <WhatsAppIcon className="text-[#25D366]" fontSize="small" />
              <a
                href={whatsappLink(contact.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-green transition-colors"
              >
                {contact.phoneDisplay}
              </a>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-300">
              <AccessTimeIcon className="text-brand-green mt-0.5" fontSize="small" />
              <span>{tInfo('hours')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <LocationOnIcon className="text-brand-green" fontSize="small" />
              <span>{tInfo('address')}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>
            &copy; {new Date().getFullYear()} {t('copyright')}
          </p>
          <div className="flex items-center gap-4">
            <SmartLink href={links.privacyUrl} className="hover:text-brand-green">
              {t('privacy')}
            </SmartLink>
            <span>&middot;</span>
            <SmartLink href={links.termsUrl} className="hover:text-brand-green">
              {t('terms')}
            </SmartLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
