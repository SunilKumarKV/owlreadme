import React from 'react';
import { TrustMetricValueProps } from '../../types/trust-metrics';

export const TrustMetricValue: React.FC<TrustMetricValueProps> = ({
  value,
  className = '',
}) => {
  return (
    <div className={`text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white ${className}`}>
      {value}
    </div>
  );
};

export default TrustMetricValue;
