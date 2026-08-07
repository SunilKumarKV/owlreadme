import React from 'react';
import { useReadme } from '@/hooks/readme/useReadme';
import ReadmePreview from './ReadmePreview';
import ReadmeSkeleton from './ReadmeSkeleton';
import ReadmeError from './ReadmeError';

export interface ReadmeContainerProps {
  username?: string;
  className?: string;
}

export const ReadmeContainer: React.FC<ReadmeContainerProps> = ({
  username,
  className = '',
}) => {
  const { markdown, isLoading, error, refetch } = useReadme(username);

  if (isLoading) {
    return <ReadmeSkeleton className={className} />;
  }

  if (error) {
    return <ReadmeError message={error} onRetry={refetch} className={className} />;
  }

  return <ReadmePreview markdown={markdown} className={className} />;
};

export default ReadmeContainer;
