/**
 * Custom hook for categories data fetching and CRUD operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { categoriesRepository } from '@/repositories/categories.repository';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/types/models';

export const QUERY_KEYS = {
  categories: 'categories',
} as const;

/**
 * Hook to fetch all categories with pagination
 */
export function useCategories(page = 1, pageSize = 100) {
  return useQuery({
    queryKey: [QUERY_KEYS.categories, page, pageSize],
    queryFn: () => categoriesRepository.getCategories(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes (categories don't change often)
    retry: 3,
  });
}

/**
 * Hook to create a new category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoriesRepository.createCategory(data),
    onSuccess: () => {
      message.success('Category created successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.categories] });
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to create category';
      message.error(errorMsg);
    },
  });
}

/**
 * Hook to update a category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      categoriesRepository.updateCategory(id, data),
    onSuccess: () => {
      message.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.categories] });
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to update category';
      message.error(errorMsg);
    },
  });
}

/**
 * Hook to delete a category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesRepository.deleteCategory(id),
    onSuccess: () => {
      message.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.categories] });
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to delete category';
      message.error(errorMsg);
    },
  });
}
