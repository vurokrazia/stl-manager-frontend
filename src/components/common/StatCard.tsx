/**
 * StatCard Component - Reusable statistics card
 */

import React from 'react';
import { Card, Statistic } from 'antd';
import type { StatisticProps } from 'antd';

interface StatCardProps extends StatisticProps {
  icon?: React.ReactNode;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  loading = false,
  ...statisticProps
}) => {
  return (
    <Card loading={loading} bordered={false}>
      <Statistic
        {...statisticProps}
        prefix={icon}
        valueStyle={{ color: statisticProps.valueStyle?.color || '#1890ff' }}
      />
    </Card>
  );
};

export default StatCard;
