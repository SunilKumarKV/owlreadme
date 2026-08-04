import React from 'react';
import { StatsCardProps } from '../../types/card';
import Card from './Card';
import CardTitle from './CardTitle';

export const StatsCard: React.FC<StatsCardProps> = ({
  title = 'GitHub Activity Stats',
  className = '',
  children,
  ...rest
}) => {
  return (
    <Card variant="stats" className={className} {...rest}>
      {title && <CardTitle className="text-sm font-semibold mb-4 text-gray-300">{title}</CardTitle>}
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </Card>
  );
};

export default StatsCard;
