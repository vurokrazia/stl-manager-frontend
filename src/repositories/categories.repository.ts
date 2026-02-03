/**
 * Categories Repository - Data access layer for categories
 */

import { httpService } from '@/services/http.service';
import { ENDPOINTS } from '@/config/api';
import type {
  CategoriesListResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from '@/types/models';

export class CategoriesRepository {
  /**
   * Get all categories with pagination
   */
  async getCategories(page = 1, pageSize = 100): Promise<CategoriesListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    return httpService.get<CategoriesListResponse>(`${ENDPOINTS.categories}?${params}`);
  }

  /**
   * Create a new category
   */
  async createCategory(data: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    return httpService.post<CreateCategoryResponse>(ENDPOINTS.categories, data);
  }

  /**
   * Update a category
   */
  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<UpdateCategoryResponse> {
    return httpService.put<UpdateCategoryResponse>(`${ENDPOINTS.categories}/${id}`, data);
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<void> {
    return httpService.delete(`${ENDPOINTS.categories}/${id}`);
  }
}

// Export singleton instance
export const categoriesRepository = new CategoriesRepository();
