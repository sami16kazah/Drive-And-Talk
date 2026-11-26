import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { getContent } from '@/lib/content';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Messages = JSON defaults merged with texts edited in the admin dashboard (MongoDB).
  // Arrays (lists) are read with t.raw(), so the type is cast for next-intl.
  const messages = (await getContent(locale as 'nl' | 'en')) as any;

  return {
    locale,
    messages,
  };
});
