"use client";

import React from 'react';
import HeroPreviewWindow from './HeroPreviewWindow';

interface HeroPreviewPlaceholderProps {
  className?: string;
}

export const HeroPreviewPlaceholder: React.FC<HeroPreviewPlaceholderProps> = ({ className = '' }) => {
  return (
    <div className={`w-full relative ${className}`} data-reveal="true">
      <HeroPreviewWindow />
    </div>
  );
};

export default HeroPreviewPlaceholder;
