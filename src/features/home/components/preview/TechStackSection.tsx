"use client";

import React from 'react';
import { TechStackSectionProps } from '../../types/preview-content';
import TechBadgeGroup from './TechBadgeGroup';

export const TechStackSection: React.FC<TechStackSectionProps> = ({
  title = 'Tech Stack',
  badges,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b pb-1 border-gray-200/60 dark:border-gray-800">
        {title}
      </h2>
      <TechBadgeGroup badges={badges} />
    </div>
  );
};

export default TechStackSection;
