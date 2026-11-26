'use client';

import React, { createContext, useContext } from 'react';
import { globalDefaults, GlobalContent } from '@/content/globalDefaults';

const SiteSettingsContext = createContext<GlobalContent>(globalDefaults);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: GlobalContent;
  children: React.ReactNode;
}) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

/** Site-wide CMS content (contact info, images, categories, ...) for client components. */
export function useSiteSettings(): GlobalContent {
  return useContext(SiteSettingsContext);
}
