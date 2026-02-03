/**
 * Files Page - List and search files (View)
 */

import React from 'react';
import { Table, Input, Select, Tag, Space, Button, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { formatBytes, formatFileType, getFileTypeColor, truncateFileName } from '@/utils/format';
import type { STLFile } from '@/types/models';
import { buildCategoryOptions, extractCategoryIds } from '@/utils/categories';
import { useFilesPage } from './useFilesPage';

const { Search } = Input;
const { Option } = Select;

const FilesPage: React.FC = () => {
  const {
    files,
    total,
    categories,
    filters,
    isLoading,
    isReclassifying,
    isUpdating,
    isCategoriesLoading,
    handleSearch,
    handleTypeFilter,
    handleCategoryFilter,
    handleTableChange,
    handlePaginationChange,
    handleReclassify,
    handleCategoryChange,
    refetch,
  } = useFilesPage();

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
      render: (fileCategories: any[], record: STLFile) => {
        const currentCategoryIds = extractCategoryIds(fileCategories);
        const options = buildCategoryOptions(fileCategories, categories);

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
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: STLFile) => (
        <Button
          size="small"
          icon={<ReloadOutlined />}
          onClick={() => handleReclassify(record.id)}
          loading={isReclassifying}
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
            value={filters.type}
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
            value={filters.category}
            style={{ width: 200 }}
            onChange={handleCategoryFilter}
            loading={isCategoriesLoading}
          >
            {categories.map((cat) => (
              <Option key={cat.name} value={cat.name}>
                {cat.name}
              </Option>
            ))}
          </Select>

          <Button onClick={() => refetch()}>Refresh</Button>
        </Space>

        <Table
          columns={columns}
          dataSource={files}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: filters.page,
            pageSize: filters.page_size,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ['20', '50', '100', '250', '500', '1000', '5000'],
            showTotal: (total) => `Total ${total} files`,
            onChange: handlePaginationChange,
            onShowSizeChange: handlePaginationChange,
          }}
          onChange={handleTableChange}
        />
      </Space>
    </div>
  );
};

export default FilesPage;
