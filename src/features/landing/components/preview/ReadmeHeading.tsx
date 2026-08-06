import React from 'react';
import { ReadmeHeadingProps } from '../../types/preview-content';

export const ReadmeHeading: React.FC<ReadmeHeadingProps> = ({
  username,
  name,
  avatarUrl,
  className = '',
}) => {
  const displayName = name || username;

  return (
    <div
      className={`flex items-center gap-3 border-b pb-3 border-gray-200/80 dark:border-gray-800 ${className}`}
    >
      {avatarUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={`${displayName}'s avatar`}
          className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover shrink-0"
        />
      )}
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Hi, I&apos;m {displayName} 👋
      </h1>
    </div>
  );
};

export default ReadmeHeading;
