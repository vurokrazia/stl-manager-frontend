/**
 * Domain Models - Core business entities
 */

export interface STLFile {
  id: string;
  path: string;
  file_name: string;
  type: 'stl' | 'zip' | 'rar';
  size: number;
  modified_at: string;
  categories: Category[];
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  created_at?: string;
}

export interface Scan {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  found: number;
  processed: number;
  progress: number;
  error?: string;
  created_at: string;
  updated_at: string;
}

export interface FilesListResponse {
  items: STLFile[];
  total: number;
  page: number;
  page_size: number;
}

export interface CategoriesListResponse {
  items: Category[];
}

export interface CreateScanResponse {
  scan_id: string;
}

export interface FileFilters {
  q?: string;
  type?: 'stl' | 'zip' | 'rar';
  category?: string;
  page?: number;
  page_size?: number;
  sort?: string;
}

export interface Statistics {
  total_files: number;
  by_type: Record<string, number>;
  by_category: Record<string, number>;
  total_size: number;
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  file_count?: number;
  categories: Category[];
  created_at: string;
  updated_at: string;
}

export interface BrowseItem {
  id: string;
  name: string;
  type: 'folder' | 'stl' | 'zip' | 'rar';
  size?: number;
  file_count?: number;
  categories: Category[];
  created_at: string;
}

export interface BrowseListResponse {
  items: BrowseItem[];
  total: number;
}

export interface FoldersListResponse {
  items: Folder[];
  total: number;
}

export interface FolderDetailResponse {
  folder: Folder;
  subfolders: Folder[];
  files: STLFile[];
  categories: Category[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}
