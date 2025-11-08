/**
 * CategoryModal - Modal for editing file categories
 */

import { useEffect, useState } from 'react';
import { Modal, Select, Spin, Alert } from 'antd';
import { useCategories } from '@/hooks/useCategories';
import { useUpdateCategories } from '@/hooks/useFiles';
import type { STLFile } from '@/types/models';

interface CategoryModalProps {
  file: STLFile | null;
  open: boolean;
  onClose: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  file,
  open,
  onClose,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const updateMutation = useUpdateCategories();

  // Initialize selected categories when file changes
  useEffect(() => {
    if (file && file.categories) {
      setSelectedCategories(file.categories.map(cat => cat.id));
    } else {
      setSelectedCategories([]);
    }
  }, [file]);

  const handleOk = async () => {
    if (!file) return;

    updateMutation.mutate(
      { fileId: file.id, categoryIds: selectedCategories },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const categoryOptions = categoriesData?.items.map(cat => ({
    label: cat.name,
    value: cat.id,
  })) || [];

  return (
    <Modal
      title={`Edit Categories - ${file?.file_name || ''}`}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={updateMutation.isPending}
      okText="Save"
      cancelText="Cancel"
      width={600}
    >
      {categoriesLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin tip="Loading categories..." />
        </div>
      ) : (
        <>
          <Alert
            message="Select up to 3 categories for this file"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Select
            mode="multiple"
            placeholder="Select categories"
            value={selectedCategories}
            onChange={setSelectedCategories}
            options={categoryOptions}
            style={{ width: '100%' }}
            maxTagCount={3}
            maxCount={3}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </>
      )}
    </Modal>
  );
};
