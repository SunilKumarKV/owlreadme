import React from 'react';
import { ReadmeContentProps } from '../../types/preview-content';
import { DEFAULT_README_CONTENT_CONFIG } from '../../constants/preview-content';
import ReadmeHeading from './ReadmeHeading';
import DeveloperComment from './DeveloperComment';
import TechStackSection from './TechStackSection';
import GithubStatsCard from './GithubStatsCard';
import FeaturedRepositories from './FeaturedRepositories';

export const ReadmeContent: React.FC<ReadmeContentProps> = ({
  config = DEFAULT_README_CONTENT_CONFIG,
  className = '',
}) => {
  return (
    <div className={`space-y-6 text-left ${className}`}>
      {/* README Header & Comment */}
      <div className="space-y-2">
        <ReadmeHeading username={config.username} />
        <DeveloperComment comment={config.commentText || config.developerTitle} />
      </div>

      {/* Tech Stack Section */}
      <TechStackSection title={config.techStackTitle} badges={config.techStack} />

      {/* GitHub Activity Stats Card */}
      <GithubStatsCard config={config.githubStats} />

      {/* Featured Repositories Section */}
      <FeaturedRepositories title={config.repositoriesTitle} repositories={config.repositories} />
    </div>
  );
};

export default ReadmeContent;
