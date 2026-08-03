"use client";

import React from 'react';
import { ReadmeContentProps } from '../../types/preview-content';
import { DEFAULT_README_CONTENT_CONFIG } from '../../constants/preview-content';
import ReadmeHeading from './ReadmeHeading';
import ReadmeComment from './ReadmeComment';
import TechStackSection from './TechStackSection';
import ActivityStatsCard from './ActivityStatsCard';
import RepositorySection from './RepositorySection';

export const ReadmeContent: React.FC<ReadmeContentProps> = ({
  config = DEFAULT_README_CONTENT_CONFIG,
  className = '',
}) => {
  return (
    <div className={`space-y-6 text-left font-sans ${className}`}>
      <ReadmeHeading username={config.username} />

      {config.commentText && <ReadmeComment comment={config.commentText} />}

      <TechStackSection title={config.techStackTitle} badges={config.techStack} />

      <ActivityStatsCard config={config.activityStats} />

      <RepositorySection title={config.repositoriesTitle} repositories={config.repositories} />
    </div>
  );
};

export default ReadmeContent;
