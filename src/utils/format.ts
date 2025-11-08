/**
 * Formatting utilities
 */

/**
 * Format bytes to human readable size
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format file type to display name
 */
export function formatFileType(type: string): string {
  const typeMap: Record<string, string> = {
    stl: 'STL',
    zip: 'ZIP',
    rar: 'RAR',
  };

  return typeMap[type.toLowerCase()] || type.toUpperCase();
}

/**
 * Get color for file type badge
 */
export function getFileTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    stl: 'blue',
    zip: 'green',
    rar: 'orange',
  };

  return colorMap[type.toLowerCase()] || 'default';
}

/**
 * Get color for scan status
 */
export function getScanStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'default',
    running: 'processing',
    completed: 'success',
    failed: 'error',
  };

  return colorMap[status] || 'default';
}

/**
 * Truncate file name if too long
 */
export function truncateFileName(fileName: string, maxLength = 50): string {
  if (fileName.length <= maxLength) return fileName;

  const ext = fileName.split('.').pop() || '';
  const name = fileName.substring(0, fileName.lastIndexOf('.'));
  const truncatedName = name.substring(0, maxLength - ext.length - 4);

  return `${truncatedName}...${ext}`;
}
