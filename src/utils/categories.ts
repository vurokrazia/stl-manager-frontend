import type { Category } from '@/types/models';

/**
 * Build Select options from categories, ensuring we have labels for all values
 */
export function buildCategoryOptions(
  recordCategories: Category[] | any[],
  systemCategories: Category[] = []
): Array<{ label: string; value: string }> {
  // Extract record categories
  const recordOptions = Array.isArray(recordCategories)
    ? recordCategories
        .map((c) => {
          // Handle both object and string formats
          if (typeof c === 'string') {
            return null; // Skip strings, they'll be handled by system categories
          }
          if (c && typeof c === 'object' && c.id && c.name) {
            return { label: c.name, value: c.id };
          }
          return null;
        })
        .filter(Boolean)
    : [];

  // Add system categories
  const systemOptions = systemCategories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  // Merge and deduplicate by value
  const allOptions = [...recordOptions];
  systemOptions.forEach((sysCat) => {
    if (!allOptions.find((opt) => opt?.value === sysCat.value)) {
      allOptions.push(sysCat);
    }
  });

  return allOptions as Array<{ label: string; value: string }>;
}

/**
 * Extract category IDs from categories array
 */
export function extractCategoryIds(categories: Category[] | any[]): string[] {
  if (!Array.isArray(categories)) return [];

  return categories
    .map((c) => {
      if (typeof c === 'string') return c;
      if (c && typeof c === 'object' && c.id) return c.id;
      return null;
    })
    .filter(Boolean) as string[];
}
