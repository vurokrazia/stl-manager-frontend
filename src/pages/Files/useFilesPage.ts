import { useState } from 'react';
import { useFiles, useReclassifyFile, useUpdateCategories } from '@/hooks/useFiles';
import { useCategories } from '@/hooks/useCategories';
import type { FileFilters } from '@/types/models';

export function useFilesPage() {
  const [filters, setFilters] = useState<FileFilters>({
    page: 1,
    page_size: 20,
  });

  // Data fetching
  const { data: filesData, isLoading, refetch } = useFiles(filters);
  const { data: categoriesData } = useCategories();
  const reclassify = useReclassifyFile();
  const updateCategories = useUpdateCategories();

  // Handlers
  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      q: value || undefined,
      page: 1
    }));
  };

  const handleTypeFilter = (value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      type: value as any,
      page: 1,
    }));
  };

  const handleCategoryFilter = (value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      category: value,
      page: 1
    }));
  };

  const handleTableChange = (pagination: any) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current,
      page_size: pagination.pageSize,
    }));
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPageSize !== prev.page_size ? 1 : newPage,
      page_size: newPageSize,
    }));
  };

  const handleReclassify = (fileId: string) => {
    reclassify.mutate(fileId);
  };

  const handleCategoryChange = (fileId: string, categoryIds: string[]) => {
    updateCategories.mutate({ fileId, categoryIds });
  };

  return {
    // Data
    files: filesData?.items || [],
    total: filesData?.total || 0,
    categories: categoriesData?.items || [],

    // States
    filters,
    isLoading,
    isReclassifying: reclassify.isPending,
    isUpdating: updateCategories.isPending,
    isCategoriesLoading: !categoriesData,

    // Handlers
    handleSearch,
    handleTypeFilter,
    handleCategoryFilter,
    handleTableChange,
    handlePaginationChange,
    handleReclassify,
    handleCategoryChange,
    refetch,
  };
}
