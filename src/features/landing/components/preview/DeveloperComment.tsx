import React from 'react';
import { DeveloperCommentProps } from '../../types/preview-content';

export const DeveloperComment: React.FC<DeveloperCommentProps> = ({
  comment,
  className = '',
}) => {
  if (!comment) return null;

  return (
    <p
      className={`font-mono text-xs text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900/50 px-2.5 py-1 rounded-md border border-gray-200/50 dark:border-gray-800/50 inline-block ${className}`}
    >
      &lt;!-- {comment} --&gt;
    </p>
  );
};

export default DeveloperComment;
