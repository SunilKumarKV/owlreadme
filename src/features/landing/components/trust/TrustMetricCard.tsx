import React from 'react';
import { TrustMetricCardProps } from '../../types/trust-metrics';
import TrustMetricIcon from './TrustMetricIcon';
import TrustMetricValue from './TrustMetricValue';
import TrustMetricTitle from './TrustMetricTitle';
import TrustMetricDescription from './TrustMetricDescription';

export const TrustMetricCard: React.FC<TrustMetricCardProps> = ({
  metric,
  className = '',
}) => {
  return (
    <div
      className={`group relative p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/70 dark:bg-[#0d1117]/80 backdrop-blur-xl shadow-xl shadow-gray-900/5 dark:shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-indigo-500/20 hover:border-blue-500/30 dark:hover:border-blue-500/30 flex flex-col justify-between space-y-4 ${className}`}
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
    </div>
  );
};

export default TrustMetricCard;
