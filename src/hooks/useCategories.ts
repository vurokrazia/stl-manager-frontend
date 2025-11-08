/**
 * Custom hook for categories data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { categoriesRepository } from '@/repositories/categories.repository';

export const QUERY_KEYS = {
  categories: 'categories',
} as const;

/**
 * Hook to fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.categories],
    queryFn: () => categoriesRepository.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes (categories don't change often)
    retry: 3,
  });
}
