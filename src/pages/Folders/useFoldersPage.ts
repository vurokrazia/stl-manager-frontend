import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFolders, useUpdateFolderCategories } from '@/hooks/useBrowse';
import { useCategories } from '@/hooks/useCategories';
import type { Folder } from '@/types/models';

export function useFoldersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Data fetching
  const { data: foldersData, isLoading } = useFolders(page, pageSize, debouncedSearch || undefined);
  const { data: categoriesData } = useCategories();
  const updateFolderCategories = useUpdateFolderCategories();

  // Handlers
  const handleCategoryChange = (folderId: string, categoryIds: string[]) => {
    // Solo actualiza categorías del folder, NO propaga a archivos
    updateFolderCategories.mutate({
      folderId,
      categoryIds,
      applyToSTL: false,
      applyToZIP: false,
      applyToRAR: false,
      applyToSubfolders: false
    });
  };

  const handleFolderClick = (folder: Folder) => {
    navigate(`/folders/${folder.id}`);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setPage(1);
    }
  };

  return {
    // Data
    folders: foldersData?.items || [],
    total: foldersData?.total || 0,
    categories: categoriesData?.items || [],

    // States
    page,
    pageSize,
    searchText,
    isLoading,
    isUpdating: updateFolderCategories.isPending,
    isCategoriesLoading: !categoriesData,

    // Handlers
    setSearchText,
    handleCategoryChange,
    handleFolderClick,
    handlePaginationChange,
  };
}
