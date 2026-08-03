"use client";

import React from 'react';
import { FeatureChipsProps } from '../../types/hero';
import FeatureChip from './FeatureChip';

export const FeatureChips: React.FC<FeatureChipsProps> = ({ chips, className = '' }) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 pt-2 ${className}`}>
      {chips.map((chip) => (
        <FeatureChip key={chip.id} chip={chip} />
      ))}
    </div>
  );
};

export default FeatureChips;
