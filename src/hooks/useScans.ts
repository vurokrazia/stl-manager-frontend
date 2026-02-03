/**
 * Custom hook for scans data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scansRepository } from '@/repositories/scans.repository';
import { message } from 'antd';

export const QUERY_KEYS = {
  scans: 'scans',
  scan: 'scan',
  scanPaths: 'scanPaths',
} as const;

/**
 * Hook to fetch scan by ID
 */
export function useScan(id: string, enabled = true) {
  return useQuery({
    queryKey: [QUERY_KEYS.scan, id],
    queryFn: () => scansRepository.getScanById(id),
    enabled: enabled && !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Refetch every 2 seconds if scan is running or pending
      if (data?.status === 'running' || data?.status === 'pending') {
        return 2000;
      }
      // Stop polling when completed or failed
      return false;
    },
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}

/**
 * Alias for useScan - for better semantics
 */
export function useScanStatus(id: string, enabled = true) {
  return useScan(id, enabled);
}

/**
 * Hook to fetch scan paths by scan ID
 */
export function useScanPaths(id: string, enabled = true) {
  return useQuery({
    queryKey: [QUERY_KEYS.scanPaths, id],
    queryFn: () => scansRepository.getScanPaths(id),
    enabled: enabled && !!id,
    staleTime: Infinity, // These results are final
  });
}

/**
 * Hook to fetch list of scans
 */
export function useScans(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [QUERY_KEYS.scans, page, pageSize],
    queryFn: () => scansRepository.getScans(page, pageSize),
    staleTime: 30000,
  });
}

/**
 * Hook to create a new scan
 */
export function useCreateScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => scansRepository.createScan(),
    onSuccess: () => {
      message.success('Scan started successfully!');

      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.scans] });
      queryClient.invalidateQueries({ queryKey: ['files'] }); // From useFiles
    },
    onError: (error: any) => {
      message.error(error?.message || 'Failed to start scan');
    },
  });
}
