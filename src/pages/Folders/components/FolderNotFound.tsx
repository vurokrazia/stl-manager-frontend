import React from 'react';
import { Result, Button } from 'antd';
import { FolderOpenOutlined, ReloadOutlined } from '@ant-design/icons';

interface FolderNotFoundProps {
  retryCountdown: number;
  onRetry: () => void;
  onGoHome: () => void;
}

export const FolderNotFound: React.FC<FolderNotFoundProps> = ({
  retryCountdown,
  onRetry,
  onGoHome,
}) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh'
    }}>
      <Result
        icon={<FolderOpenOutlined style={{ color: '#faad14' }} />}
        title="Carpeta no encontrada"
        subTitle="Lo sentimos, la carpeta que buscas no existe o no está disponible en este momento."
        extra={[
          <Button
            type="primary"
            key="retry"
            icon={<ReloadOutlined />}
            onClick={onRetry}
            disabled={retryCountdown > 0}
          >
            {retryCountdown > 0
              ? `Volver a intentar (${retryCountdown}s)`
              : 'Volver a intentar'}
          </Button>,
          <Button key="home" onClick={onGoHome}>
            Volver al inicio
          </Button>,
        ]}
      />
    </div>
  );
};
