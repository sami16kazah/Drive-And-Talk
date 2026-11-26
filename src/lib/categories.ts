import type { CategoryItem } from '@/content/globalDefaults';
import { localized } from './contentUtils';

/** Display label for a course category value, as configured in the CMS. */
export function categoryLabel(categories: CategoryItem[], value: string, locale: string): string {
  const cat = categories.find((c) => c.value === value);
  return cat ? localized(cat.label, locale) || value : value;
}
