"use client";

import React from 'react';
import { HeroHeadingProps } from '../../types/hero';

export const HeroHeading: React.FC<HeroHeadingProps> = ({
  prefix,
  highlight,
  suffix,
  className = '',
}) => {
  return (
    <h1
      className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-gray-900 dark:text-white ${className}`}
    >
      <span>{prefix} </span>
      <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
        {highlight}
      </span>
      <span> {suffix}</span>
    </h1>
  );
};

export default HeroHeading;
