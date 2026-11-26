/**
 * Pure helpers shared by server and client code (no server-only imports).
 */

function isPlainObject(v: unknown): v is Record<string, any> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Deep-merge CMS overrides on top of defaults.
 * - objects merge key by key (new default keys always appear)
 * - arrays from the override replace the default array
 * - primitives from the override win when their type matches the default
 */
export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;

  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  if (isPlainObject(base)) {
    if (!isPlainObject(override)) return base;
    const result: Record<string, any> = { ...base };
    for (const key of Object.keys(override)) {
      result[key] = key in base ? deepMerge((base as any)[key], override[key]) : override[key];
    }
    return result as T;
  }

  if (base === undefined) return override as T;
  return (typeof override === typeof base ? override : base) as T;
}

/** Pick the value for a locale from a { nl, en } object, falling back to the other language. */
export function localized(value: { nl?: string; en?: string } | string | undefined, locale: string): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return (locale === 'en' ? value.en || value.nl : value.nl || value.en) || '';
}

export function whatsappLink(number: string): string {
  return `https://wa.me/${(number || '').replace(/[^0-9]/g, '')}`;
}

/** Converts "#00B050" to "0 176 80" (for Tailwind's rgb(var(--x) / alpha) syntax). Returns null when invalid. */
export function hexToRgbChannels(hex: string): string | null {
  if (typeof hex !== 'string') return null;
  let h = hex.trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(h)) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
