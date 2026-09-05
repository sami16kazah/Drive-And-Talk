import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  let targetLocale = locale;
  if (!targetLocale || !routing.locales.includes(targetLocale as any)) {
    targetLocale = routing.defaultLocale;
  }

  return {
    messages: (await import(`../messages/${targetLocale}.json`)).default
  };
});
