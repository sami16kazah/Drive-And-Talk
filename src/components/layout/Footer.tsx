'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Logo from '@/components/ui/Logo';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export const Footer: React.FC = () => {
  const tNav = useTranslations('Navigation');
  const tInfo = useTranslations('SchoolInfo');

  return (
    <footer className="bg-brand-dark text-white border-t-4 border-brand-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md inline-block border border-brand-green/30">
              <Logo variant="dark" showSubtitle={true} />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Geïntegreerd taal- en praktijkonderwijs in Nederland. Gespecialiseerd in Nederlands, Engels, CBR Rijbewijs Theorie en Chemie.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-brand-green font-bold text-base uppercase tracking-wider mb-4">
              Navigatie
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-brand-green transition-colors">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-300 hover:text-brand-green transition-colors">
                  {tNav('courses')}
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-gray-300 hover:text-brand-green transition-colors">
                  {tNav('successStories')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-brand-green transition-colors">
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-brand-green transition-colors">
                  {tNav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Programs & Subjects */}
          <div>
            <h4 className="text-brand-green font-bold text-base uppercase tracking-wider mb-4">
              Opleidingen
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>Nederlands Intensief (A1 - B2)</li>
              <li>CBR Rijbewijs Theorie Auto</li>
              <li>Business &amp; Academic English</li>
              <li>Toegepaste Chemie &amp; Lab Training</li>
            </ul>
          </div>

          {/* Col 4: School Contact & Opening Hours */}
          <div className="space-y-3">
            <h4 className="text-brand-green font-bold text-base uppercase tracking-wider mb-4">
              Contact &amp; Tijden
            </h4>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <EmailIcon className="text-brand-green" fontSize="small" />
              <a href="mailto:info@drivetalk.nl" className="hover:text-brand-green transition-colors">
                info@drivetalk.nl
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <WhatsAppIcon className="text-[#25D366]" fontSize="small" />
              <a
                href="https://wa.me/31628468247"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-green transition-colors"
              >
                +31 6 28468247
              </a>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-300">
              <AccessTimeIcon className="text-brand-green mt-0.5" fontSize="small" />
              <span>{tInfo('hours')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <LocationOnIcon className="text-brand-green" fontSize="small" />
              <span>Nederland</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>&copy; {new Date().getFullYear()} Drive&amp;Talk Academy. Alle rechten voorbehouden.</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-brand-green">
              Privacy Policy
            </Link>
            <span>&middot;</span>
            <Link href="/contact" className="hover:text-brand-green">
              Algemene Voorwaarden
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
