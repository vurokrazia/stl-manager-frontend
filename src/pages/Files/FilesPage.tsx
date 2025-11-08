/**
 * Files Page - List and search files
 */

import React, { useState } from 'react';
import { Table, Input, Select, Tag, Space, Button, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useFiles, useReclassifyFile, useUpdateCategories } from '@/hooks/useFiles';
import { useCategories } from '@/hooks/useCategories';
import { formatBytes, formatFileType, getFileTypeColor, truncateFileName } from '@/utils/format';
import type { STLFile, FileFilters } from '@/types/models';

const { Search } = Input;
const { Option } = Select;

const FilesPage: React.FC = () => {
  const [filters, setFilters] = useState<FileFilters>({
    page: 1,
    page_size: 20,
  });

  const { data: filesData, isLoading, refetch } = useFiles(filters);
  const { data: categoriesData } = useCategories();
  const reclassify = useReclassifyFile();
  const updateCategories = useUpdateCategories();

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, q: value, page: 1 }));
  };

  const handleTypeFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      type: value as any,
      page: 1,
    }));
  };

  const handleCategoryFilter = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value, page: 1 }));
  };

  const handleTableChange = (pagination: any) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current,
      page_size: pagination.pageSize,
    }));
  };

  const handleReclassify = (fileId: string) => {
    reclassify.mutate(fileId);
  };

  const handleCategoryChange = (fileId: string, categoryIds: string[]) => {
    updateCategories.mutate({ fileId, categoryIds });
  };

  const columns: ColumnsType<STLFile> = [
    {
      title: 'File Name',
      dataIndex: 'file_name',
      key: 'file_name',
      render: (name: string) => (
        <Tooltip title={name}>
          <span>{truncateFileName(name, 40)}</span>
        </Tooltip>
      ),
      sorter: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={getFileTypeColor(type)}>{formatFileType(type)}</Tag>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (size: number) => formatBytes(size),
      sorter: true,
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      width: 300,
      render: (categories: any[], record: STLFile) => {
        // Ensure we have an array of category IDs
        const currentCategoryIds = Array.isArray(categories)
          ? categories.map(c => c.id).filter(Boolean)
          : [];

        console.log('File:', record.file_name, 'Categories:', categories, 'IDs:', currentCategoryIds);

        return (
          <Select
            mode="multiple"
            placeholder="Select categories"
            value={currentCategoryIds}
            onChange={(values) => handleCategoryChange(record.id, values)}
            options={categoriesData?.items.map(cat => ({
              label: cat.name,
              value: cat.id,
            })) || []}
            style={{ width: '100%' }}
            maxTagCount={2}
            maxCount={3}
            size="small"
            loading={updateCategories.isPending}
            disabled={!categoriesData?.items.length}
          />
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: STLFile) => (
        <Button
          size="small"
          icon={<ReloadOutlined />}
          onClick={() => handleReclassify(record.id)}
          loading={reclassify.isPending}
        >
          Reclassify
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Files</h1>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space size="middle" wrap>
          <Search
            placeholder="Search files..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />

          <Select
            placeholder="Filter by type"
            allowClear
            style={{ width: 150 }}
            onChange={handleTypeFilter}
          >
            <Option value="stl">STL</Option>
            <Option value="zip">ZIP</Option>
            <Option value="rar">RAR</Option>
          </Select>

          <Select
            placeholder="Filter by category"
            allowClear
            style={{ width: 200 }}
            onChange={handleCategoryFilter}
            loading={!categoriesData}
          >
            {categoriesData?.items.map((cat) => (
              <Option key={cat.name} value={cat.name}>
                {cat.name}
              </Option>
            ))}
          </Select>

          <Button onClick={() => refetch()}>Refresh</Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filesData?.items || []}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: filters.page,
            pageSize: filters.page_size,
            total: filesData?.total || 0,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} files`,
          }}
          onChange={handleTableChange}
        />
      </Space>
    </div>
  );
};

export default FilesPage;
