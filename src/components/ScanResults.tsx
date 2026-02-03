import React from 'react';
import { useScanPaths } from '@/hooks/useScans';
import { Table, Typography, Spin, Alert } from 'antd';

const { Text } = Typography;

interface ScanResultsProps {
  scanId: string;
}

const columns = [
  {
    title: 'Scanned Path',
    dataIndex: 'root_path',
    key: 'root_path',
  },
  {
    title: 'Files Found',
    dataIndex: 'files_found',
    key: 'files_found',
  },
  {
    title: 'New Files',
    dataIndex: 'files_inserted',
    key: 'files_inserted',
  },
  {
    title: 'Folders Found',
    dataIndex: 'folders_found',
    key: 'folders_found',
  },
  {
    title: 'New Folders',
    dataIndex: 'folders_inserted',
    key: 'folders_inserted',
  },
];

const ScanResults: React.FC<ScanResultsProps> = ({ scanId }) => {
  const { data: paths, isLoading, isError, error } = useScanPaths(scanId);

  if (isLoading) {
    return <Spin tip="Loading scan results..." />;
  }

  if (isError) {
    return <Alert message="Error loading scan results" description={error.message} type="error" showIcon />;
  }

  if (!paths || paths.length === 0) {
    return <Text>No scan results found for this scan.</Text>;
  }

  return (
    <Table
      columns={columns}
      dataSource={paths}
      rowKey="id"
      pagination={false}
      size="small"
      summary={(pageData) => {
        const totalFilesFound = pageData.reduce((sum, item) => sum + item.files_found, 0);
        const totalFilesInserted = pageData.reduce((sum, item) => sum + item.files_inserted, 0);
        const totalFoldersFound = pageData.reduce((sum, item) => sum + item.folders_found, 0);
        const totalFoldersInserted = pageData.reduce((sum, item) => sum + item.folders_inserted, 0);

        return (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}><Text strong>Totals</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><Text strong>{totalFilesFound}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={2}><Text strong>{totalFilesInserted}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={3}><Text strong>{totalFoldersFound}</Text></Table.Summary.Cell>
            <Table.Summary.Cell index={4}><Text strong>{totalFoldersInserted}</Text></Table.Summary.Cell>
          </Table.Summary.Row>
        );
      }}
    />
  );
};

export default ScanResults;
