import React from 'react';
import { Card, Select, Space, Checkbox, Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import type { Folder, Category } from '@/types/models';

interface FolderHeaderProps {
  folder: Folder;
  folderCategories: Category[];
  systemCategories: Category[];
  applyToSTL: boolean;
  applyToZIP: boolean;
  applyToRAR: boolean;
  applyToSubfolders: boolean;
  isUpdating: boolean;
  isCategoriesLoading: boolean;
  onCategoryChange: (categoryIds: string[]) => void;
  onSync: () => void;
  onApplyToSTLChange: (checked: boolean) => void;
  onApplyToZIPChange: (checked: boolean) => void;
  onApplyToRARChange: (checked: boolean) => void;
  onApplyToSubfoldersChange: (checked: boolean) => void;
}

export const FolderHeader: React.FC<FolderHeaderProps> = ({
  folder,
  folderCategories,
  systemCategories,
  applyToSTL,
  applyToZIP,
  applyToRAR,
  applyToSubfolders,
  isUpdating,
  isCategoriesLoading,
  onCategoryChange,
  onSync,
  onApplyToSTLChange,
  onApplyToZIPChange,
  onApplyToRARChange,
  onApplyToSubfoldersChange,
}) => {
  return (
    <Card title={`Folder: ${folder.name}`}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <strong>Path:</strong> {folder.path}
        </div>

        <div>
          <strong>Folder Categories:</strong>
          <br />
          <Select
            mode="multiple"
            placeholder="Select categories for this folder"
            value={folderCategories.map((c) => c.id)}
            onChange={onCategoryChange}
            options={systemCategories.map((cat) => ({
              label: cat.name,
              value: cat.id,
            }))}
            style={{ width: '100%', marginTop: 8 }}
            maxCount={3}
            loading={isCategoriesLoading || isUpdating}
            disabled={!systemCategories.length || isUpdating}
          />
          <div style={{ marginTop: 12 }}>
            <strong style={{ fontSize: 12 }}>Apply categories to:</strong>
            <Space direction="horizontal" style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
              <Checkbox checked={applyToSTL} onChange={(e) => onApplyToSTLChange(e.target.checked)}>
                STL files
              </Checkbox>
              <Checkbox checked={applyToZIP} onChange={(e) => onApplyToZIPChange(e.target.checked)}>
                ZIP files
              </Checkbox>
              <Checkbox checked={applyToRAR} onChange={(e) => onApplyToRARChange(e.target.checked)}>
                RAR files
              </Checkbox>
              <Checkbox checked={applyToSubfolders} onChange={(e) => onApplyToSubfoldersChange(e.target.checked)}>
                Subfolders
              </Checkbox>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={onSync}
                loading={isUpdating}
                disabled={!folderCategories.length}
                size="small"
              >
                Sync
              </Button>
            </Space>
          </div>
        </div>
      </Space>
    </Card>
  );
};
