import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { browseRepository } from '@/repositories/browse.repository';

const QUERY_KEYS = {
  browse: ['browse'] as const,
  folders: ['folders'] as const,
  folder: (id: string) => ['folder', id] as const,
};

export function useBrowse(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...QUERY_KEYS.browse, page, pageSize],
    queryFn: () => browseRepository.listBrowse(page, pageSize),
  });
}


export function useFolders(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...QUERY_KEYS.folders, page, pageSize],
    queryFn: () => browseRepository.listFolders(page, pageSize),
  });
}

export function useFolder(
  id: string,
  filters?: {
    page?: number;
    page_size?: number;
    search?: string;
    type?: string;
    category?: string;
  }
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.folder(id), filters],
    queryFn: async () => {
      console.log('[useFolder] Fetching folder with ID:', id, 'filters:', filters);
      const result = await browseRepository.getFolder(id, filters);
      console.log('[useFolder] API Response:', result);
      console.log('[useFolder] Files in response:', result?.files?.length || 0);
      console.log('[useFolder] Pagination:', result?.pagination);
      return result;
    },
    enabled: !!id,
  });
}

export function useUpdateFolderCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      folderId,
      categoryIds,
      applyToSTL,
      applyToZIP,
      applyToRAR,
      applyToSubfolders
    }: {
      folderId: string;
      categoryIds: string[];
      applyToSTL?: boolean;
      applyToZIP?: boolean;
      applyToRAR?: boolean;
      applyToSubfolders?: boolean;
    }) =>
      browseRepository.updateFolderCategories(folderId, categoryIds, {
        applyToSTL,
        applyToZIP,
        applyToRAR,
        applyToSubfolders
      }),
    onSuccess: async (response, { folderId }) => {
      message.success('Folder categories updated successfully!');

      // Update folder categories in cache immediately
      queryClient.setQueryData(QUERY_KEYS.folder(folderId), (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            categories: response.categories || [],
          };
        }
        return oldData;
      });

      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.folder(folderId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.folders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.browse });

      // Refetch the current folder to get updated files with new categories
      await queryClient.refetchQueries({
        queryKey: QUERY_KEYS.folder(folderId),
        exact: true
      });
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to update folder categories';
      message.error(errorMsg);
    },
  });
}
