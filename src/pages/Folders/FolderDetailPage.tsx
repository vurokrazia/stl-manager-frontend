/**
 * Folder Detail Page - Show folder with its files (View)
 */

import React from 'react';
import { Card, Table, Tag, Space, Select, Spin, Breadcrumb, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FolderOutlined, FileOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { formatBytes, getFileTypeColor } from '@/utils/format';
import type { STLFile, Folder } from '@/types/models';
import { buildCategoryOptions, extractCategoryIds } from '@/utils/categories';
import { useFolderDetailPage } from './useFolderDetailPage';
import { FolderHeader } from './components/FolderHeader';
import { FolderNotFound } from './components/FolderNotFound';

type MixedItem =
  | ({ itemType: 'folder' } & Folder)
  | ({ itemType: 'file' } & STLFile);

const FolderDetailPage: React.FC = () => {
  const {
    folderData,
    categories,
    breadcrumbStack,
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
    isUpdatingFolder,
    isUpdatingFile,
    isCategoriesLoading,
    setSearchText,
    setTypeFilter,
    setCategoryFilter,
    setApplyToSTL,
    setApplyToZIP,
    setApplyToRAR,
    setApplyToSubfolders,
    handleFolderCategoryChange,
    handleSyncCategories,
    handleSubfolderCategoryChange,
    handleFileCategoryChange,
    handleSubfolderClick,
    handleBreadcrumbClick,
    handleRetry,
    handlePaginationChange,
  } = useFolderDetailPage();

  // Build breadcrumb
  const breadcrumbItems = [
    {
      title: (
        <span style={{ cursor: 'pointer' }}>
          <HomeOutlined />
        </span>
      ),
      onClick: () => handleBreadcrumbClick(-1),
    },
    ...breadcrumbStack.map((node, index) => {
      const isClickable = index < breadcrumbStack.length - 1;
      return {
        title: (
          <span
            style={{
              cursor: isClickable ? 'pointer' : 'default',
              color: isClickable ? '#1890ff' : 'inherit',
            }}
          >
            {node.name}
          </span>
        ),
        onClick: isClickable ? () => handleBreadcrumbClick(index) : undefined,
      };
    }),
  ];

  // Combined items: subfolders + files
  const mixedItems: MixedItem[] = [
    ...(folderData?.subfolders || []).map(subfolder => ({ itemType: 'folder' as const, ...subfolder })),
    ...(folderData?.files || []).map(file => ({ itemType: 'file' as const, ...file })),
  ];

  const columns: ColumnsType<MixedItem> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        if (record.itemType === 'folder') {
          return (
            <Space>
              <FolderOutlined style={{ fontSize: 18, color: '#faad14' }} />
              <span style={{ cursor: 'pointer' }} onClick={() => handleSubfolderClick(record.id)}>
                {record.name}
              </span>
              {record.file_count !== undefined && (
                <Tag color="blue">{record.file_count} files</Tag>
              )}
            </Space>
          );
        } else {
          return (
            <Space>
              <FileOutlined style={{ fontSize: 18, color: '#1890ff' }} />
              <span>{record.file_name}</span>
            </Space>
          );
        }
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (_, record) => {
        if (record.itemType === 'folder') {
          return <Tag color="gold">Folder</Tag>;
        } else {
          return <Tag color={getFileTypeColor(record.type)}>{record.type.toUpperCase()}</Tag>;
        }
      },
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (_, record) => {
        if (record.itemType === 'file') {
          return formatBytes(record.size);
        }
        return '-';
      },
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      width: 300,
      render: (itemCategories: any[], record: MixedItem) => {
        const currentCategoryIds = extractCategoryIds(itemCategories);
        const options = buildCategoryOptions(itemCategories, categories);

        return (
          <Select
            mode="multiple"
            placeholder="Select categories"
            value={currentCategoryIds}
            onChange={(values) => {
              if (record.itemType === 'folder') {
                handleSubfolderCategoryChange(record.id, values);
              } else {
                handleFileCategoryChange(record.id, values);
              }
            }}
            options={options}
            style={{ width: '100%' }}
            maxTagCount={2}
            maxCount={3}
            size="small"
            loading={isCategoriesLoading || isUpdatingFolder || isUpdatingFile}
            disabled={!categories.length || isUpdatingFolder || isUpdatingFile}
          />
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!folderData) {
    return (
      <FolderNotFound
        retryCountdown={retryCountdown}
        onRetry={handleRetry}
        onGoHome={() => handleBreadcrumbClick(-1)}
      />
    );
  }

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Breadcrumb items={breadcrumbItems} style={{ fontSize: 16, padding: '8px 0' }} />

        <FolderHeader
          folder={folderData.folder}
          folderCategories={folderData.categories}
          systemCategories={categories}
          applyToSTL={applyToSTL}
          applyToZIP={applyToZIP}
          applyToRAR={applyToRAR}
          applyToSubfolders={applyToSubfolders}
          isUpdating={isUpdatingFolder}
          isCategoriesLoading={isCategoriesLoading}
          onCategoryChange={handleFolderCategoryChange}
          onSync={handleSyncCategories}
          onApplyToSTLChange={setApplyToSTL}
          onApplyToZIPChange={setApplyToZIP}
          onApplyToRARChange={setApplyToRAR}
          onApplyToSubfoldersChange={setApplyToSubfolders}
        />

        <Card title="Contents">
          <Space size="middle" wrap style={{ marginBottom: 16 }}>
            <Input
              placeholder="Search files and folders..."
              prefix={<SearchOutlined />}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />

            <Select
              placeholder="Filter by type"
              allowClear
              style={{ width: 150 }}
              value={typeFilter}
              onChange={setTypeFilter}
            >
              <Select.Option value="stl">STL</Select.Option>
              <Select.Option value="zip">ZIP</Select.Option>
              <Select.Option value="rar">RAR</Select.Option>
            </Select>

            <Select
              placeholder="Filter by category"
              allowClear
              style={{ width: 200 }}
              value={categoryFilter}
              onChange={setCategoryFilter}
              loading={isCategoriesLoading}
            >
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.name}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Space>

          <Table
            columns={columns}
            dataSource={mixedItems}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: pageSize,
              total: folderData?.pagination?.total || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['20', '50', '100', '250', '500', '1000', '5000'],
              showTotal: (total) => `Total ${total} items`,
              onChange: handlePaginationChange,
              onShowSizeChange: handlePaginationChange,
            }}
            loading={isLoading}
          />
        </Card>
      </Space>
    </div>
  );
};

export default FolderDetailPage;
