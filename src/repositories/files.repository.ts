/**
 * Files Repository - Data access layer for files
 */

import { httpService } from '@/services/http.service';
import { ENDPOINTS } from '@/config/api';
import type {
  STLFile,
  FilesListResponse,
  FileFilters,
} from '@/types/models';

export class FilesRepository {
  /**
   * Get list of files with filters
   */
  async getFiles(filters?: FileFilters): Promise<FilesListResponse> {
    const params = new URLSearchParams();

    if (filters?.q) params.append('q', filters.q);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());
    if (filters?.sort) params.append('sort', filters.sort);

    const queryString = params.toString();
    const url = queryString ? `${ENDPOINTS.files}?${queryString}` : ENDPOINTS.files;

    return httpService.get<FilesListResponse>(url);
  }

  /**
   * Get single file by ID
   */
  async getFileById(id: string): Promise<STLFile> {
    return httpService.get<STLFile>(`${ENDPOINTS.files}/${id}`);
  }

  /**
   * Reclassify file with AI
   */
  async reclassifyFile(id: string): Promise<{ job_id: string }> {
    return httpService.post<{ job_id: string }>(ENDPOINTS.reclassify(id));
  }

  /**
   * Update file categories manually
   */
  async updateCategories(
    id: string,
    categoryIds: string[]
  ): Promise<{ file_id: string; categories: any[] }> {
    return httpService.patch<{ file_id: string; categories: any[] }>(
      `${ENDPOINTS.files}/${id}/categories`,
      { category_ids: categoryIds }
    );
  }
}

// Export singleton instance
export const filesRepository = new FilesRepository();
