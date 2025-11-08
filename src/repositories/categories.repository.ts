/**
 * Categories Repository - Data access layer for categories
 */

import { httpService } from '@/services/http.service';
import { ENDPOINTS } from '@/config/api';
import type { CategoriesListResponse } from '@/types/models';

export class CategoriesRepository {
  /**
   * Get all categories
   */
  async getCategories(): Promise<CategoriesListResponse> {
    return httpService.get<CategoriesListResponse>(ENDPOINTS.categories);
  }
}

// Export singleton instance
export const categoriesRepository = new CategoriesRepository();
