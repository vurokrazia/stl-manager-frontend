/**
 * Custom hook for files data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filesRepository } from '@/repositories/files.repository';
import type { FileFilters } from '@/types/models';
import { message } from 'antd';

export const QUERY_KEYS = {
  files: 'files',
  file: 'file',
} as const;

/**
 * Hook to fetch list of files
 */
export function useFiles(filters?: FileFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.files, filters],
    queryFn: () => filesRepository.getFiles(filters),
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
}

/**
 * Hook to fetch single file
 */
export function useFile(id: string, enabled = true) {
  return useQuery({
    queryKey: [QUERY_KEYS.file, id],
    queryFn: () => filesRepository.getFileById(id),
    enabled,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to reclassify a file
 */
export function useReclassifyFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => filesRepository.reclassifyFile(fileId),
    onSuccess: (_, fileId) => {
      message.success('Reclassification started!');

      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.file, fileId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.files] });
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to reclassify file';
      message.error(errorMsg);
    },
  });
}

/**
 * Hook to update file categories manually
 */
export function useUpdateCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId, categoryIds }: { fileId: string; categoryIds: string[] }) =>
      filesRepository.updateCategories(fileId, categoryIds),
    onSuccess: (response, { fileId }) => {
      message.success('Categories updated successfully!');

      // Update ALL files list caches (regardless of filters)
      queryClient.setQueriesData({ queryKey: [QUERY_KEYS.files] }, (oldData: any) => {
        if (oldData && oldData.items) {
          return {
            ...oldData,
            items: oldData.items.map((file: any) =>
              file.id === fileId ? { ...file, categories: response.categories } : file
            ),
          };
        }
        return oldData;
      });

      // Update folder detail caches that might contain this file
      const allFolderQueries = queryClient.getQueriesData({ queryKey: ['folder'] });
      allFolderQueries.forEach(([queryKey, data]) => {
        if (data && typeof data === 'object' && 'files' in data) {
          const folderData = data as any;
          if (Array.isArray(folderData.files)) {
            const hasFile = folderData.files.some((f: any) => f.id === fileId);
            if (hasFile) {
              queryClient.setQueryData(queryKey, {
                ...folderData,
                files: folderData.files.map((f: any) =>
                  f.id === fileId ? { ...f, categories: response.categories } : f
                ),
              });
            }
          }
        }
      });

      // Also invalidate to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.file, fileId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.files] });
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to update categories';
      message.error(errorMsg);
    },
  });
}
