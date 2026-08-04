import React from 'react';
import { TrustMetricTitleProps } from '../../types/trust-metrics';

export const TrustMetricTitle: React.FC<TrustMetricTitleProps> = ({
  title,
  className = '',
}) => {
  return (
    <h3 className={`text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${className}`}>
      {title}
    </h3>
  );
};

export default TrustMetricTitle;
