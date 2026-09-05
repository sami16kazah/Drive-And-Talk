import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SessionProviderWrapper from '@/components/providers/SessionProviderWrapper';
import '@/app/globals.css';

export const metadata = {
  title: 'Drive&Talk Academy - Dutch, English, Driving Theory & Chemistry',
  description:
    'Integrated language and vocational learning academy in the Netherlands. High pass rates in Dutch B1/B2, English, CBR Driving Theory, and Chemistry.',
};

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

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="flex flex-col min-h-screen">
        <SessionProviderWrapper>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
