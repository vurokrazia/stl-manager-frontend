import { httpService } from '@/services/http.service';
import { ENDPOINTS } from '@/config/api';
import type { BrowseListResponse, FoldersListResponse, FolderDetailResponse } from '@/types/models';

class BrowseRepository {
  async listBrowse(page = 1, pageSize = 20): Promise<BrowseListResponse> {
    return httpService.get<BrowseListResponse>(ENDPOINTS.browse, {
      params: { page, page_size: pageSize },
    });
  }

  async listFolders(page = 1, pageSize = 20): Promise<FoldersListResponse> {
    return httpService.get<FoldersListResponse>(ENDPOINTS.folders, {
      params: { page, page_size: pageSize },
    });
  }

  async getFolder(
    id: string,
    params?: {
      page?: number;
      page_size?: number;
      search?: string;
      type?: string;
      category?: string;
    }
  ): Promise<FolderDetailResponse> {
    console.log('[BrowseRepository] Requesting folder ID:', id, 'with params:', params);
    const response = await httpService.get<FolderDetailResponse>(ENDPOINTS.folder(id), {
      params: {
        ...(params?.page && { page: params.page }),
        ...(params?.page_size && { page_size: params.page_size }),
        ...(params?.search && { search: params.search }),
        ...(params?.type && { type: params.type }),
        ...(params?.category && { category: params.category }),
      },
    });
    console.log('[BrowseRepository] Response received:', response);
    return response;
  }

  async updateFolderCategories(
    folderId: string,
    categoryIds: string[],
    options?: {
      applyToSTL?: boolean;
      applyToZIP?: boolean;
      applyToRAR?: boolean;
      applyToSubfolders?: boolean;
    }
  ) {
    return httpService.patch(`${ENDPOINTS.folders}/${folderId}/categories`, {
      category_ids: categoryIds,
      apply_to_stl: options?.applyToSTL ?? false,
      apply_to_zip: options?.applyToZIP ?? false,
      apply_to_rar: options?.applyToRAR ?? false,
      apply_to_subfolders: options?.applyToSubfolders ?? false,
    });
  }
}

export const browseRepository = new BrowseRepository();
