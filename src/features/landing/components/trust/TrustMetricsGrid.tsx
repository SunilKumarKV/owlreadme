import React from 'react';
import { TrustMetricsGridProps } from '../../types/trust-metrics';
import TrustMetricCard from './TrustMetricCard';

export const TrustMetricsGrid: React.FC<TrustMetricsGridProps> = ({
  metrics,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 ${className}`}>
      {metrics.map((metric) => (
        <TrustMetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};

export default TrustMetricsGrid;
