/**
 * Dashboard Page - Statistics and overview
 */

import React from 'react';
import { Row, Col, Empty, Spin } from 'antd';
import {
  FileOutlined,
  FileZipOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import StatCard from '@/components/common/StatCard';
import { useFiles } from '@/hooks/useFiles';
import { formatBytes } from '@/utils/format';

const Dashboard: React.FC = () => {
  const { data: filesData, isLoading, isError } = useFiles();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Empty
        description="Failed to load dashboard data"
        style={{ marginTop: 100 }}
      />
    );
  }

  const files = filesData?.items || [];
  const total = filesData?.total || 0;

  // Calculate statistics
  const stlCount = files.filter((f) => f.type === 'stl').length;
  const zipCount = files.filter((f) => f.type === 'zip').length;
  const rarCount = files.filter((f) => f.type === 'rar').length;
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Files"
            value={total}
            icon={<FileOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="STL Files"
            value={stlCount}
            icon={<InboxOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="ZIP Files"
            value={zipCount}
            icon={<FileZipOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Size"
            value={formatBytes(totalSize)}
            icon={<FileOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Col>
      </Row>

      <div style={{ marginTop: 32 }}>
        <h2>Recent Activity</h2>
        <Empty
          description="No recent activity"
          style={{ marginTop: 50 }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
