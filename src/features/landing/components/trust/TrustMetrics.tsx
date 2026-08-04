import React from 'react';
import { TrustMetricsProps } from '../../types/trust-metrics';
import useTrustMetrics from '../../hooks/useTrustMetrics';
import TrustMetricsGrid from './TrustMetricsGrid';
import { MotionWrapper } from '@/design-system';

export const TrustMetrics: React.FC<TrustMetricsProps> = ({
  config,
  className = '',
}) => {
  const sectionConfig = useTrustMetrics(config);

  return (
    <section
      id={sectionConfig.sectionId || 'trust-metrics'}
      className={`py-16 sm:py-24 relative overflow-hidden ${className}`}
      aria-label="Trust Metrics"
    >
      <MotionWrapper preset="sectionFade" className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 space-y-12">
        {(sectionConfig.title || sectionConfig.subtitle) && (
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            {sectionConfig.title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {sectionConfig.title}
              </h2>
            )}
            {sectionConfig.subtitle && (
              <p className="text-base text-gray-600 dark:text-gray-400 font-normal">
                {sectionConfig.subtitle}
              </p>
            )}
          </div>
        )}

        <TrustMetricsGrid metrics={sectionConfig.metrics} />
      </MotionWrapper>
    </section>
  );
};

export default TrustMetrics;
