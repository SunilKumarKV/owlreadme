"use client";

import React from 'react';
import { ReadmeCommentProps } from '../../types/preview-content';

export const ReadmeComment: React.FC<ReadmeCommentProps> = ({ comment, className = '' }) => {
  if (!comment) return null;

  return (
    <div
      className={`font-mono text-xs text-gray-500 dark:text-gray-400 select-none ${className}`}
      aria-label="HTML Comment"
    >
      &lt;!-- {comment} --&gt;
    </div>
  );
};

export default ReadmeComment;
