import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFolder, useUpdateFolderCategories } from '@/hooks/useBrowse';
import { useCategories } from '@/hooks/useCategories';
import { useUpdateCategories } from '@/hooks/useFiles';

interface BreadcrumbNode {
  id: string;
  name: string;
}

export function useFolderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Breadcrumb management
  const [breadcrumbStack, setBreadcrumbStack] = useState<BreadcrumbNode[]>(() => {
    const stored = sessionStorage.getItem('folderBreadcrumb');
    return stored ? JSON.parse(stored) : [];
  });

  // Category propagation flags
  const [applyToSTL, setApplyToSTL] = useState(true);
  const [applyToZIP, setApplyToZIP] = useState(true);
  const [applyToRAR, setApplyToRAR] = useState(true);
  const [applyToSubfolders, setApplyToSubfolders] = useState(false);

  // Retry countdown
  const [retryCountdown, setRetryCountdown] = useState(0);

  // Pagination and filters
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, typeFilter, categoryFilter]);

  // Retry countdown timer
  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setTimeout(() => {
        setRetryCountdown(retryCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [retryCountdown]);

  // Data fetching
  const { data: folderData, isLoading } = useFolder(id!, {
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
    type: typeFilter,
    category: categoryFilter,
  });

  const { data: categoriesData } = useCategories();
  const updateFolderCategories = useUpdateFolderCategories();
  const updateFileCategories = useUpdateCategories();

  // Update breadcrumb when folder changes
  useEffect(() => {
    if (!folderData) return;

    const currentFolder = folderData.folder;
    const currentNode: BreadcrumbNode = {
      id: currentFolder.id,
      name: currentFolder.name,
    };

    setBreadcrumbStack((prevStack) => {
      const existingIndex = prevStack.findIndex((node) => node.id === currentFolder.id);

      let newStack: BreadcrumbNode[];
      if (existingIndex !== -1) {
        newStack = prevStack.slice(0, existingIndex + 1);
      } else {
        newStack = [...prevStack, currentNode];
      }

      sessionStorage.setItem('folderBreadcrumb', JSON.stringify(newStack));
      return newStack;
    });
  }, [folderData]);

  // Handlers
  const handleFolderCategoryChange = (categoryIds: string[]) => {
    if (id) {
      updateFolderCategories.mutate({
        folderId: id,
        categoryIds,
        applyToSTL,
        applyToZIP,
        applyToRAR,
        applyToSubfolders
      });
    }
  };

  const handleSyncCategories = () => {
    if (id && folderData) {
      const currentCategoryIds = folderData.categories.map((c) => c.id);
      updateFolderCategories.mutate({
        folderId: id,
        categoryIds: currentCategoryIds,
        applyToSTL,
        applyToZIP,
        applyToRAR,
        applyToSubfolders
      });
    }
  };

  const handleSubfolderCategoryChange = (subfolderId: string, categoryIds: string[]) => {
    updateFolderCategories.mutate({ folderId: subfolderId, categoryIds });
  };

  const handleFileCategoryChange = (fileId: string, categoryIds: string[]) => {
    updateFileCategories.mutate({ fileId, categoryIds });
  };

  const handleSubfolderClick = (subfolderId: string) => {
    navigate(`/folders/${subfolderId}`);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      sessionStorage.removeItem('folderBreadcrumb');
      navigate('/browse');
    } else {
      const targetFolder = breadcrumbStack[index];
      navigate(`/folders/${targetFolder.id}`);
    }
  };

  const handleRetry = () => {
    setRetryCountdown(30);
    window.location.reload();
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
    folderData,
    categories: categoriesData?.items || [],
    breadcrumbStack,

    // States
    page,
    pageSize,
    searchText,
    typeFilter,
    categoryFilter,
    applyToSTL,
    applyToZIP,
    applyToRAR,
    applyToSubfolders,
    retryCountdown,
    isLoading,
    isUpdatingFolder: updateFolderCategories.isPending,
    isUpdatingFile: updateFileCategories.isPending,
    isCategoriesLoading: !categoriesData,

    // Setters
    setSearchText,
    setTypeFilter,
    setCategoryFilter,
    setApplyToSTL,
    setApplyToZIP,
    setApplyToRAR,
    setApplyToSubfolders,

    // Handlers
    handleFolderCategoryChange,
    handleSyncCategories,
    handleSubfolderCategoryChange,
    handleFileCategoryChange,
    handleSubfolderClick,
    handleBreadcrumbClick,
    handleRetry,
    handlePaginationChange,
  };
}
