import { unstable_cache } from 'next/cache';
import { connectDB } from './db';
import { SiteContent } from '@/models/SiteContent';
import { globalDefaults, GlobalContent } from '@/content/globalDefaults';
import { deepMerge } from './contentUtils';
import en from '@/messages/en.json';
import nl from '@/messages/nl.json';

export const CONTENT_TAG = 'site-content';

export const CONTENT_SCOPES = ['nl', 'en', 'global'] as const;
export type ContentScope = (typeof CONTENT_SCOPES)[number];

export const contentDefaults: Record<ContentScope, any> = {
  nl,
  en,
  global: globalDefaults,
};

export function isContentScope(value: unknown): value is ContentScope {
  return typeof value === 'string' && (CONTENT_SCOPES as readonly string[]).includes(value);
}

const loadOverrides = unstable_cache(
  async (scope: ContentScope) => {
    await connectDB();
    const doc = await SiteContent.findOne({ key: scope }).lean();
    return (doc?.data as Record<string, any>) ?? null;
  },
  ['site-content-overrides'],
  { tags: [CONTENT_TAG], revalidate: 300 }
);

/** Raw overrides saved in the dashboard (null when nothing saved or the DB is unreachable). */
export async function getContentOverrides(scope: ContentScope) {
  try {
    return await loadOverrides(scope);
  } catch (error) {
    console.error(`Failed to load CMS content "${scope}", using defaults:`, error);
    return null;
  }
}

/** Defaults merged with dashboard overrides. */
export async function getContent(scope: 'global'): Promise<GlobalContent>;
export async function getContent(scope: 'nl' | 'en'): Promise<typeof en>;
export async function getContent(scope: ContentScope): Promise<any>;
export async function getContent(scope: ContentScope) {
  const overrides = await getContentOverrides(scope);
  return deepMerge(contentDefaults[scope], overrides);
}

export function getGlobalContent(): Promise<GlobalContent> {
  return getContent('global');
}
