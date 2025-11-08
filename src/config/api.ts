/**
 * API Configuration
 */

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/v1',
  apiKey: import.meta.env.VITE_API_KEY || 'dev-secret-key',
  timeout: 30000,
} as const;

export const ENDPOINTS = {
  health: '/health',
  scan: '/scan',
  scans: '/scans',
  files: '/files',
  categories: '/categories',
  browse: '/browse',
  folders: '/folders',
  folder: (id: string) => `/folders/${id}`,
  reclassify: (id: string) => `/files/${id}/reclassify`,
  aiStatus: '/ai/status',
} as const;
