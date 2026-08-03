"use client";

import React from 'react';
import { TechBadgeGroupProps } from '../../types/preview-content';
import TechBadge from './TechBadge';

export const TechBadgeGroup: React.FC<TechBadgeGroupProps> = ({ badges, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badge) => (
        <TechBadge key={badge.id} badge={badge} />
      ))}
    </div>
  );
};

export default TechBadgeGroup;
