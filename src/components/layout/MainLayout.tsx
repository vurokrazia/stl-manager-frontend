/**
 * Main Layout Component - Application shell with sidebar and header
 */

import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Space, Badge, Tooltip } from 'antd';
import {
  DashboardOutlined,
  FileOutlined,
  ScanOutlined,
  FolderOpenOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCreateScan } from '@/hooks/useScans';
import { useAIStatus } from '@/hooks/useAI';
import ScanProgress from '@/components/ScanProgress';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const createScan = useCreateScan();
  const { data: aiStatus } = useAIStatus();
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/browse',
      icon: <FolderOpenOutlined />,
      label: 'Browse',
    },
    {
      key: '/all-folders',
      icon: <FolderOpenOutlined />,
      label: 'All Folders',
    },
    {
      key: '/files',
      icon: <FileOutlined />,
      label: 'All Files',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleScanClick = () => {
    createScan.mutate(undefined, {
      onSuccess: (data) => {
        if (data?.scan_id) {
          setCurrentScanId(data.scan_id);
        }
      },
    });
  };

  const handleCloseScanProgress = () => {
    setCurrentScanId(null);
  };

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={250}
          style={{
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              padding: '20px',
              borderBottom: '1px solid #f0f0f0',
              textAlign: collapsed ? 'center' : 'left',
            }}
          >
            {collapsed ? (
              <FolderOpenOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            ) : (
              <Space>
                <FolderOpenOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <Title level={4} style={{ margin: 0 }}>
                  STL Manager
                </Title>
              </Space>
            )}
          </div>

          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: 0, paddingTop: 16 }}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              background: '#fff',
              padding: '0 24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              3D Print Files Manager
            </Title>

            <Space size="middle">
              <Tooltip title={aiStatus?.enabled ? 'AI Classification: Enabled' : 'AI Classification: Disabled'}>
                <Badge
                  status={aiStatus?.enabled ? 'success' : 'default'}
                  text={
                    <Space>
                      <RobotOutlined />
                      <span>{aiStatus?.enabled ? 'AI On' : 'AI Off'}</span>
                    </Space>
                  }
                />
              </Tooltip>

              <Button
                type="primary"
                icon={<ScanOutlined />}
                onClick={handleScanClick}
                loading={createScan.isPending}
              >
                Scan Files
              </Button>
            </Space>
          </Header>

          <Content
            style={{
              margin: '24px',
              padding: '24px',
              background: '#fff',
              borderRadius: 8,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>

      <ScanProgress scanId={currentScanId} onClose={handleCloseScanProgress} />
    </>
  );
};

export default MainLayout;
