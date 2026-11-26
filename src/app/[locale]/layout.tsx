import React from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SessionProviderWrapper from '@/components/providers/SessionProviderWrapper';
import { SiteSettingsProvider } from '@/components/providers/SiteSettingsProvider';
import { getGlobalContent } from '@/lib/content';
import { hexToRgbChannels } from '@/lib/contentUtils';
import { globalDefaults } from '@/content/globalDefaults';
import '@/app/globals.css';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const site = await getGlobalContent();
  return {
    title: t('title'),
    description: t('description'),
    ...(site.branding.faviconUrl ? { icons: { icon: site.branding.faviconUrl } } : {}),
  };
}

const THEME_VARS: Record<string, keyof typeof globalDefaults.theme> = {
  '--brand-green': 'primaryColor',
  '--brand-hover': 'primaryHoverColor',
  '--brand-dark': 'darkColor',
  '--brand-heading': 'headingColor',
  '--brand-body': 'bodyColor',
  '--brand-mint': 'mintColor',
  '--brand-light-mint': 'lightMintColor',
};

function buildThemeCss(theme: typeof globalDefaults.theme) {
  const vars = Object.entries(THEME_VARS)
    .map(([cssVar, key]) => {
      const rgb = hexToRgbChannels(theme[key]) || hexToRgbChannels(globalDefaults.theme[key]);
      return `${cssVar}:${rgb};`;
    })
    .join('');
  return `:root{${vars}}`;
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Messages (defaults + CMS overrides) and site-wide CMS content
  const messages = await getMessages();
  const site = await getGlobalContent();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="flex flex-col min-h-screen">
        <style dangerouslySetInnerHTML={{ __html: buildThemeCss(site.theme) }} />
        <SessionProviderWrapper>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <SiteSettingsProvider value={site}>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </SiteSettingsProvider>
          </NextIntlClientProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
