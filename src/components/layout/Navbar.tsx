'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useSession, signIn, signOut } from 'next-auth/react';
import Logo from '@/components/ui/Logo';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

export const Navbar: React.FC = () => {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === 'admin';

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/courses', label: t('courses') },
    { href: '/success-stories', label: t('successStories') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-brand-green/15 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Logo showSubtitle={true} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'text-brand-green bg-brand-lightMint font-bold'
                      : 'text-brand-body hover:text-brand-green hover:bg-brand-mint'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200`}
              >
                <AdminPanelSettingsIcon fontSize="small" />
                <span>{t('admin')}</span>
              </Link>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Toggle */}
            <LanguageSwitcher />

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/31628468247"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <WhatsAppIcon fontSize="small" />
              <span>WhatsApp</span>
            </a>

            {/* User Auth */}
            {status === 'authenticated' ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-9 h-9 rounded-full border-2 border-brand-green object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand-green text-white flex items-center justify-center font-bold">
                    {session.user?.name ? session.user.name[0] : 'U'}
                  </div>
                )}
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title={t('signOut')}
                >
                  <LogoutIcon fontSize="small" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google', { callbackUrl: window.location.pathname })}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-dark hover:bg-brand-heading text-white text-sm font-semibold rounded-full transition-colors"
              >
                <LoginIcon fontSize="small" />
                <span>{t('signIn')}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-heading hover:bg-brand-mint focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-green/10 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'text-brand-green bg-brand-lightMint font-bold'
                    : 'text-brand-body hover:bg-brand-mint'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-bold text-amber-700 bg-amber-50"
              >
                <AdminPanelSettingsIcon />
                <span>{t('admin')}</span>
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            <a
              href="https://wa.me/31628468247"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-bold rounded-xl shadow"
            >
              <WhatsAppIcon />
              <span>Chat via WhatsApp (+31 6 28468247)</span>
            </a>

            {status === 'authenticated' ? (
              <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-3">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-10 h-10 rounded-full border-2 border-brand-green"
                    />
                  )}
                  <div>
                    <p className="font-bold text-sm text-brand-heading">{session.user?.name}</p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg"
                >
                  {t('signOut')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signIn('google', { callbackUrl: window.location.pathname });
                }}
                className="flex items-center justify-center gap-2 w-full py-3 bg-brand-dark text-white font-bold rounded-xl"
              >
                <LoginIcon />
                <span>{t('signIn')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
