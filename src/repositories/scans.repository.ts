/**
 * Scans Repository - Data access layer for scans
 */

import { httpService } from '@/services/http.service';
import { ENDPOINTS } from '@/config/api';
import type { Scan, CreateScanResponse } from '@/types/models';

export class ScansRepository {
  /**
   * Create a new scan
   */
  async createScan(): Promise<CreateScanResponse> {
    return httpService.post<CreateScanResponse>(ENDPOINTS.scan);
  }

  /**
   * Get scan by ID
   */
  async getScanById(id: string): Promise<Scan> {
    return httpService.get<Scan>(`${ENDPOINTS.scans}/${id}`);
  }

  /**
   * Get list of scans
   */
  async getScans(page = 1, pageSize = 20): Promise<{ items: Scan[]; total: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    return httpService.get<{ items: Scan[]; total: number }>(
      `${ENDPOINTS.scans}?${params.toString()}`
    );
  }
}

// Export singleton instance
export const scansRepository = new ScansRepository();
