/**
 * Categories Page - Manage categories (CRUD)
 */

import React from 'react';
import { Table, Button, Space, Modal, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Category } from '@/types/models';
import { useCategoriesPage } from './useCategoriesPage';
import { CategoryModal } from './CategoryModal';

const CategoriesPage: React.FC = () => {
  const {
    categories,
    total,
    page,
    pageSize,
    isLoading,
    isModalOpen,
    editingCategory,
    isSubmitting,
    isDeleting,
    handleCreate,
    handleEdit,
    handleDelete,
    handleModalClose,
    handleSubmit,
    handlePaginationChange,
  } = useCategoriesPage();

  const handleDeleteConfirm = (category: Category) => {
    Modal.confirm({
      title: 'Delete Category',
      content: `Are you sure you want to delete the category "${category.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => handleDelete(category.id),
    });
  };

  const columns: ColumnsType<Category> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 200,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Category) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={isDeleting}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteConfirm(record)}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <h1>Categories</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Create Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} categories`,
          pageSizeOptions: ['20', '50', '100', '250', '500', '1000', '5000'],
          onChange: handlePaginationChange,
          onShowSizeChange: handlePaginationChange,
        }}
      />

      <CategoryModal
        open={isModalOpen}
        category={editingCategory}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default CategoriesPage;
