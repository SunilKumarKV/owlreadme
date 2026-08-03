import React from 'react';
import { TechBadgeGroupProps } from '../../types/preview-content';
import TechBadge from './TechBadge';

export const TechBadgeGroup: React.FC<TechBadgeGroupProps> = ({
  badges,
  className = '',
}) => {
  if (!badges || badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 items-center ${className}`}>
      {badges.map((badge) => (
        <TechBadge key={badge.id} badge={badge} />
      ))}
    </div>
  );
};

export default TechBadgeGroup;
