import React from 'react';
import { RepositoryCardProps } from '../../types/card';
import Card from './Card';
import CardTitle from './CardTitle';
import CardDescription from './CardDescription';

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  name,
  description,
  stars = 0,
  forks = 0,
  language = 'TypeScript',
  languageColor = '#3178c6',
  isPrivate = false,
  className = '',
  ...rest
}) => {
  return (
    <Card variant="repository" className={className} {...rest}>
      <div className="flex items-center justify-between">
        <CardTitle className="text-base font-bold text-blue-400 hover:underline">{name}</CardTitle>
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full border border-gray-700 text-gray-400">
          {isPrivate ? 'Private' : 'Public'}
        </span>
      </div>

      <CardDescription className="mt-2 line-clamp-2">{description}</CardDescription>

      <div className="flex items-center space-x-4 mt-4 text-xs text-gray-400">
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: languageColor }} />
          <span>{language}</span>
        </span>
        <span>★ {stars}</span>
        {forks > 0 && <span>⌥ {forks}</span>}
      </div>
    </Card>
  );
};

export default RepositoryCard;
