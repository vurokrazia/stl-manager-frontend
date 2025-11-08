import { useQuery } from '@tanstack/react-query';
import { aiRepository } from '@/repositories/ai.repository';

export const useAIStatus = () => {
  return useQuery({
    queryKey: ['ai', 'status'],
    queryFn: () => aiRepository.getStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
