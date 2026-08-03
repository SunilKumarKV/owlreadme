"use client";

import React from 'react';
import { HeroDescriptionProps } from '../../types/hero';

export const HeroDescription: React.FC<HeroDescriptionProps> = ({
  text,
  className = '',
}) => {
  return (
    <p
      className={`text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal max-w-xl ${className}`}
    >
      {text}
    </p>
  );
};

export default HeroDescription;
