/**
 * Folders Page - List all folders (View)
 */

import React from 'react';
import { Table, Tag, Select, Space, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FolderOutlined, SearchOutlined } from '@ant-design/icons';
import type { Folder } from '@/types/models';
import { buildCategoryOptions, extractCategoryIds } from '@/utils/categories';
import { useFoldersPage } from './useFoldersPage';

const FoldersPage: React.FC = () => {
  const {
    folders,
    total,
    categories,
    page,
    pageSize,
    searchText,
    isLoading,
    isUpdating,
    isCategoriesLoading,
    setSearchText,
    handleCategoryChange,
    handleFolderClick,
    handlePaginationChange,
  } = useFoldersPage();

  const columns: ColumnsType<Folder> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Folder) => (
        <Space>
          <FolderOutlined style={{ fontSize: 18, color: '#faad14' }} />
          <span style={{ cursor: 'pointer' }} onClick={() => handleFolderClick(record)}>
            {name}
          </span>
          {record.file_count !== undefined && (
            <Tag color="blue">{record.file_count} files</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
      ellipsis: true,
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
      render: (folderCategories: any[], record: Folder) => {
        const currentCategoryIds = extractCategoryIds(folderCategories);
        const options = buildCategoryOptions(folderCategories, categories);

        return (
          <Select
            mode="multiple"
            placeholder="Select categories"
            value={currentCategoryIds}
            onChange={(values) => handleCategoryChange(record.id, values)}
            options={options}
            style={{ width: '100%' }}
            maxTagCount={2}
            maxCount={3}
            size="small"
            loading={isCategoriesLoading || isUpdating}
            disabled={!categories.length || isUpdating}
          />
        );
      },
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>All Folders</h1>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Input
          placeholder="Search folders by name..."
          prefix={<SearchOutlined />}
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />

        <Table
          columns={columns}
          dataSource={folders}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['20', '50', '100'],
            showTotal: (total) => `Total ${total} folders`,
            onChange: handlePaginationChange,
          }}
        />
      </Space>
    </div>
  );
};

export default FoldersPage;
