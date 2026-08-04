import React from 'react';
import { TrustMetricCardProps } from '../../types/trust-metrics';
import TrustMetricIcon from './TrustMetricIcon';
import TrustMetricValue from './TrustMetricValue';
import TrustMetricTitle from './TrustMetricTitle';
import TrustMetricDescription from './TrustMetricDescription';
import { GlassCard } from '@/design-system/components/card';

export const TrustMetricCard: React.FC<TrustMetricCardProps> = ({
  metric,
  className = '',
}) => {
  return (
    <GlassCard
      hover
      className={`flex flex-col justify-between space-y-4 hover:border-blue-500/30 ${className}`}
    >
      <div className="flex items-center justify-between">
        <TrustMetricIcon icon={metric.icon} colorTheme={metric.colorTheme} />
        {metric.badge && (
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] uppercase tracking-wide border border-blue-500/20">
            {metric.badge}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <TrustMetricValue value={metric.value} />
        <TrustMetricTitle title={metric.title} />
      </div>

      <TrustMetricDescription description={metric.description} />
    </GlassCard>
  );
};

export default TrustMetricCard;
