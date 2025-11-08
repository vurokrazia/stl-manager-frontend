/**
 * Browse Page - Root folders only
 */

import React from 'react';
import { Table, Tag, Select, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FolderOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useBrowse, useUpdateFolderCategories } from '@/hooks/useBrowse';
import { useCategories } from '@/hooks/useCategories';
import type { Folder } from '@/types/models';

const BrowsePage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  const { data: foldersData, isLoading } = useBrowse(page, pageSize);
  const { data: categoriesData } = useCategories();
  const updateFolderCategories = useUpdateFolderCategories();

  // DEBUG: Log folders data
  console.log('[BrowsePage] isLoading:', isLoading);
  console.log('[BrowsePage] foldersData:', foldersData);
  console.log('[BrowsePage] Total folders:', foldersData?.total || 0);
  console.log('[BrowsePage] Folders array:', foldersData?.items);

  const handleCategoryChange = (folderId: string, categoryIds: string[]) => {
    updateFolderCategories.mutate({ folderId, categoryIds });
  };

  const handleFolderClick = (folder: Folder) => {
    // Limpiar el breadcrumb cuando navegas desde Browse
    sessionStorage.removeItem('folderBreadcrumb');
    navigate(`/folders/${folder.id}`);
  };

  const columns: ColumnsType<Folder> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Folder) => (
        <Space>
          <FolderOutlined style={{ fontSize: 18, color: '#faad14' }} />
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => handleFolderClick(record)}
          >
            {name}
          </span>
          {record.file_count !== undefined && (
            <Tag color="blue">{record.file_count} files</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Type',
      key: 'type',
      width: 100,
      render: () => <Tag color="gold">Folder</Tag>,
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      width: 300,
      render: (categories: any[], record: Folder) => {
        const currentCategoryIds = Array.isArray(categories)
          ? categories.map((c) => c.id).filter(Boolean)
          : [];

        return (
          <Select
            mode="multiple"
            placeholder="Select categories"
            value={currentCategoryIds}
            onChange={(values) => handleCategoryChange(record.id, values)}
            options={
              categoriesData?.items.map((cat) => ({
                label: cat.name,
                value: cat.id,
              })) || []
            }
            style={{ width: '100%' }}
            maxTagCount={2}
            maxCount={3}
            size="small"
            loading={updateFolderCategories.isPending}
            disabled={!categoriesData?.items.length}
          />
        );
      },
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Browse Folders</h1>

      <Table
        columns={columns}
        dataSource={foldersData?.items || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: foldersData?.total || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['20', '50', '100'],
          showTotal: (total) => `Total ${total} folders`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            if (newPageSize !== pageSize) {
              setPageSize(newPageSize);
              setPage(1);
            }
          },
        }}
      />
    </div>
  );
};

export default BrowsePage;
