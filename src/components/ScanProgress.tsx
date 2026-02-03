/**
 * Scan Progress Component - Shows scan progress in real-time
 */

import React, { useEffect, useState } from 'react';
import { Modal, Progress, Typography, Space, Spin, Divider } from 'antd';
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useScanStatus } from '@/hooks/useScans';
import ScanResults from './ScanResults';

const { Text } = Typography;

interface ScanProgressProps {
  scanId: string | null;
  onClose: () => void;
}

const ScanProgress: React.FC<ScanProgressProps> = ({ scanId, onClose }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const { data: scanStatus, isLoading } = useScanStatus(scanId || '', !!scanId);

  const isOpen = !!scanId;
  const status = scanStatus?.status || 'pending';

  // Handle nullable Int32 types from backend (Go sql.NullInt32)
  const extractInt = (val: any): number => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    if (typeof val === 'object' && 'Int32' in val) return val.Int32;
    return 0;
  };
  const progress = extractInt(scanStatus?.progress);
  const found = extractInt(scanStatus?.found);
  const processed = extractInt(scanStatus?.processed);
  const remaining = found - processed;

  // Timer effect - start when scan is running
  useEffect(() => {
    if (status === 'running' || status === 'pending') {
      if (!startTime) {
        setStartTime(Date.now());
      }

      const interval = setInterval(() => {
        if (startTime) {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);

      return () => clearInterval(interval);
    } else if (status === 'completed' || status === 'failed') {
      // Stop timer but keep the last value
      if (startTime) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }
  }, [status, startTime]);

  // Reset timer when scanId changes
  useEffect(() => {
    setElapsedTime(0);
    setStartTime(null);
  }, [scanId]);

  // Format elapsed time
  const formatElapsedTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />;
      case 'failed':
        return <CloseCircleOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />;
      default:
        return <SyncOutlined spin style={{ fontSize: 48, color: '#1890ff' }} />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Scan Completed!';
      case 'failed':
        return 'Scan Failed';
      case 'running':
        return 'Scanning Files...';
      default:
        return 'Starting Scan...';
    }
  };

  const handleClose = () => {
    if (status === 'completed' || status === 'failed') {
      onClose();
    }
  };

  if (!scanId) return null;

  return (
    <Modal
      open={isOpen}
      title="File Scan Progress"
      onCancel={handleClose}
      footer={null}
      closable={status === 'completed' || status === 'failed'}
      maskClosable={false}
      centered
    >
      <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <>
            {getStatusIcon()}

            <div style={{ width: '100%' }}>
              <Text strong style={{ fontSize: 18 }}>
                {getStatusText()}
              </Text>
            </div>

            {(status === 'running' || status === 'pending') && (
              <>
                <Space size="small" style={{ marginBottom: 8 }}>
                  <ClockCircleOutlined style={{ color: '#1890ff' }} />
                  <Text type="secondary">
                    Elapsed time: <Text strong>{formatElapsedTime(elapsedTime)}</Text>
                  </Text>
                </Space>

                <Progress
                  percent={progress}
                  status="active"
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />

                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Text>Files Found:</Text>
                    <Text strong>{found}</Text>
                  </Space>
                  <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Text>Files Processed:</Text>
                    <Text strong style={{ color: '#52c41a' }}>{processed}</Text>
                  </Space>
                  {remaining > 0 && (
                    <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                      <Text>Remaining:</Text>
                      <Text strong style={{ color: '#1890ff' }}>{remaining}</Text>
                    </Space>
                  )}
                  {progress > 0 && (
                    <Text type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
                      {progress}% complete
                    </Text>
                  )}
                </Space>
              </>
            )}

            {status === 'completed' && (
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Space direction="vertical" size="small">
                  <Text type="success">Successfully scanned {found} files!</Text>
                  {elapsedTime > 0 && (
                    <Space size="small">
                      <ClockCircleOutlined style={{ color: '#52c41a' }} />
                      <Text type="secondary">
                        Total time: <Text strong>{formatElapsedTime(elapsedTime)}</Text>
                      </Text>
                    </Space>
                  )}
                </Space>
                <Divider>Scan Details</Divider>
                <ScanResults scanId={scanId} />
              </Space>
            )}

            {status === 'failed' && (
              <>
                {(scanStatus?.error as any)?.String && (
                  <Text type="danger">{(scanStatus?.error as any).String}</Text>
                )}
                <Space direction="vertical" size="small">
                  <Text>Files Found: {found}</Text>
                  <Text>Files Processed: {processed}</Text>
                  {elapsedTime > 0 && (
                    <Space size="small">
                      <ClockCircleOutlined style={{ color: '#ff4d4f' }} />
                      <Text type="secondary">
                        Time elapsed: <Text strong>{formatElapsedTime(elapsedTime)}</Text>
                      </Text>
                    </Space>
                  )}
                </Space>
              </>
            )}
          </>
        )}
      </Space>
    </Modal>
  );
};

export default ScanProgress;
