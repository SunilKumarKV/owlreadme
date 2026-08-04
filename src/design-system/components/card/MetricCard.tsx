import React from 'react';
import { MetricCardProps } from '../../types/card';
import Card from './Card';
import CardTitle from './CardTitle';
import CardDescription from './CardDescription';

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  value,
  title,
  description,
  trend,
  trendDirection = 'up',
  className = '',
  ...rest
}) => {
  const trendColor =
    trendDirection === 'up'
      ? 'text-emerald-400'
      : trendDirection === 'down'
      ? 'text-red-400'
      : 'text-gray-400';

  return (
    <Card variant="metric" className={className} {...rest}>
      <div className="flex items-start justify-between">
        {icon && <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">{icon}</div>}
        {trend && <span className={`text-xs font-semibold ${trendColor}`}>{trend}</span>}
      </div>

      <div className="mt-4 space-y-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</div>
        <CardTitle className="text-xs uppercase tracking-wider text-gray-400">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </div>
    </Card>
  );
};

export default MetricCard;
