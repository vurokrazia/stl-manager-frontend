import { httpService } from '@/services/http.service';
import { ENDPOINTS } from '@/config/api';

export interface AIStatus {
  enabled: boolean;
}

class AIRepository {
  async getStatus(): Promise<AIStatus> {
    return httpService.get<AIStatus>(ENDPOINTS.aiStatus);
  }
}

export const aiRepository = new AIRepository();
