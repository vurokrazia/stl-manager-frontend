import { useState } from 'react';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory
} from '@/hooks/useCategories';
import type { Category } from '@/types/models';

export function useCategoriesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Data fetching
  const { data: categoriesData, isLoading } = useCategories(page, pageSize);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // Handlers
  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate(id);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (name: string) => {
    if (editingCategory) {
      // Update
      updateCategory.mutate(
        { id: editingCategory.id, data: { name } },
        {
          onSuccess: () => {
            handleModalClose();
          },
        }
      );
    } else {
      // Create
      createCategory.mutate(
        { name },
        {
          onSuccess: () => {
            handleModalClose();
          },
        }
      );
    }
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
    categories: categoriesData?.items || [],
    total: categoriesData?.total || 0,

    // States
    page,
    pageSize,
    isLoading,
    isModalOpen,
    editingCategory,
    isSubmitting: createCategory.isPending || updateCategory.isPending,
    isDeleting: deleteCategory.isPending,

    // Handlers
    handleCreate,
    handleEdit,
    handleDelete,
    handleModalClose,
    handleSubmit,
    handlePaginationChange,
  };
}
