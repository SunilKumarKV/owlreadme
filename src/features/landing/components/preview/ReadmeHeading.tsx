import React from 'react';
import { ReadmeHeadingProps } from '../../types/preview-content';

export const ReadmeHeading: React.FC<ReadmeHeadingProps> = ({
  username,
  className = '',
}) => {
  return (
    <h1
      className={`text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white border-b pb-2 border-gray-200/80 dark:border-gray-800 ${className}`}
    >
      Hi, I&apos;m {username} 👋
    </h1>
  );
};

export default ReadmeHeading;
