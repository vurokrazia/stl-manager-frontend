/**
 * Folder Detail Page - Show folder with its files
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Table, Tag, Button, Space, Select, Spin, Breadcrumb, Checkbox, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FolderOutlined, FileOutlined, HomeOutlined, SyncOutlined, SearchOutlined } from '@ant-design/icons';
import { useFolder, useUpdateFolderCategories } from '@/hooks/useBrowse';
import { useCategories } from '@/hooks/useCategories';
import { useUpdateCategories } from '@/hooks/useFiles';
import { formatBytes, getFileTypeColor } from '@/utils/format';
import type { STLFile, Folder } from '@/types/models';

interface BreadcrumbNode {
  id: string;
  name: string;
}

const FolderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: categoriesData } = useCategories();
  const updateFolderCategories = useUpdateFolderCategories();
  const updateFileCategories = useUpdateCategories();

  // Breadcrumb stack - mantiene la ruta completa de navegación
  const [breadcrumbStack, setBreadcrumbStack] = useState<BreadcrumbNode[]>(() => {
    const stored = sessionStorage.getItem('folderBreadcrumb');
    return stored ? JSON.parse(stored) : [];
  });

  // Category propagation flags
  const [applyToSTL, setApplyToSTL] = useState(true);
  const [applyToZIP, setApplyToZIP] = useState(true);
  const [applyToRAR, setApplyToRAR] = useState(true);
  const [applyToSubfolders, setApplyToSubfolders] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Filter states - UI state
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);

  // Debounced search for API
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
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

  // Fetch folder with filters and pagination
  const { data: folderData, isLoading } = useFolder(id!, {
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
    type: typeFilter,
    category: categoryFilter,
  });

  // Actualizar el breadcrumb stack cuando cambia el folder
  useEffect(() => {
    if (!folderData) return;

    const currentFolder = folderData.folder;
    const currentNode: BreadcrumbNode = {
      id: currentFolder.id,
      name: currentFolder.name,
    };

    setBreadcrumbStack((prevStack) => {
      // Verificar si el folder actual ya está en el stack
      const existingIndex = prevStack.findIndex((node) => node.id === currentFolder.id);

      let newStack: BreadcrumbNode[];
      if (existingIndex !== -1) {
        // Navegación hacia atrás - cortar el stack hasta este punto
        newStack = prevStack.slice(0, existingIndex + 1);
      } else {
        // Navegación hacia adelante - agregar al stack
        newStack = [...prevStack, currentNode];
      }

      // Guardar en sessionStorage
      sessionStorage.setItem('folderBreadcrumb', JSON.stringify(newStack));
      return newStack;
    });
  }, [folderData]);

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
      // Click en Home
      sessionStorage.removeItem('folderBreadcrumb');
      navigate('/browse');
    } else {
      // Click en un folder del breadcrumb
      const targetFolder = breadcrumbStack[index];
      navigate(`/folders/${targetFolder.id}`);
    }
  };

  // Build breadcrumb from stack
  const buildBreadcrumb = () => {
    const items = [
      {
        title: (
          <span style={{ cursor: 'pointer' }}>
            <HomeOutlined />
          </span>
        ),
        onClick: () => handleBreadcrumbClick(-1),
      },
    ];

    breadcrumbStack.forEach((node, index) => {
      const isClickable = index < breadcrumbStack.length - 1;
      items.push({
        title: (
          <span
            style={{
              cursor: isClickable ? 'pointer' : 'default',
              color: isClickable ? '#1890ff' : 'inherit',
            }}
            className={isClickable ? 'breadcrumb-link' : ''}
          >
            {node.name}
          </span>
        ),
        onClick: isClickable ? () => handleBreadcrumbClick(index) : undefined,
      });
    });

    return items;
  };

  // Combined items: subfolders + files (filtered by API)
  type MixedItem =
    | ({ itemType: 'folder' } & Folder)
    | ({ itemType: 'file' } & STLFile);

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
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => handleSubfolderClick(record.id)}
              >
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
      render: (categories: any[], record: MixedItem) => {
        const currentCategoryIds = Array.isArray(categories)
          ? categories.map((c) => c.id).filter(Boolean)
          : [];

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
            loading={updateFolderCategories.isPending || updateFileCategories.isPending}
            disabled={!categoriesData?.items.length}
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
    return <div>Folder not found</div>;
  }

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Breadcrumb
          items={buildBreadcrumb()}
          style={{ fontSize: 16, padding: '8px 0' }}
        />

        <Card title={`Folder: ${folderData.folder.name}`}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <strong>Path:</strong> {folderData.folder.path}
            </div>
            <div>
              <strong>Direct Files:</strong> {folderData.files.length} | <strong>Subfolders:</strong> {folderData.subfolders.length}
            </div>
            <div>
              <strong>Folder Categories:</strong>
              <br />
              <Select
                mode="multiple"
                placeholder="Select categories for this folder"
                value={folderData.categories.map((c) => c.id)}
                onChange={handleFolderCategoryChange}
                options={
                  categoriesData?.items.map((cat) => ({
                    label: cat.name,
                    value: cat.id,
                  })) || []
                }
                style={{ width: '100%', marginTop: 8 }}
                maxCount={3}
                loading={updateFolderCategories.isPending}
              />
              <div style={{ marginTop: 12 }}>
                <strong style={{ fontSize: 12 }}>Apply categories to:</strong>
                <Space direction="horizontal" style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={applyToSTL}
                    onChange={(e) => setApplyToSTL(e.target.checked)}
                  >
                    STL files
                  </Checkbox>
                  <Checkbox
                    checked={applyToZIP}
                    onChange={(e) => setApplyToZIP(e.target.checked)}
                  >
                    ZIP files
                  </Checkbox>
                  <Checkbox
                    checked={applyToRAR}
                    onChange={(e) => setApplyToRAR(e.target.checked)}
                  >
                    RAR files
                  </Checkbox>
                  <Checkbox
                    checked={applyToSubfolders}
                    onChange={(e) => setApplyToSubfolders(e.target.checked)}
                  >
                    Subfolders
                  </Checkbox>
                  <Button
                    type="primary"
                    icon={<SyncOutlined />}
                    onClick={handleSyncCategories}
                    loading={updateFolderCategories.isPending}
                    disabled={!folderData?.categories.length}
                    size="small"
                  >
                    Sync
                  </Button>
                </Space>
              </div>
            </div>
          </Space>
        </Card>

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
              loading={!categoriesData}
            >
              {categoriesData?.items.map((cat) => (
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
              pageSizeOptions: ['20', '50', '100'],
              showTotal: (total) => `Total ${total} items`,
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                if (newPageSize !== pageSize) {
                  setPageSize(newPageSize);
                  setPage(1);
                }
              },
            }}
            loading={isLoading}
          />
        </Card>
      </Space>
    </div>
  );
};

export default FolderDetailPage;
