import React from 'react';
import { TrustMetricDescriptionProps } from '../../types/trust-metrics';

export const TrustMetricDescription: React.FC<TrustMetricDescriptionProps> = ({
  description,
  className = '',
}) => {
  return (
    <p className={`text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal whitespace-pre-line ${className}`}>
      {description}
    </p>
  );
};

export default TrustMetricDescription;
