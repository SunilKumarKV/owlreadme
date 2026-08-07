import React from 'react';
import { Typography } from '@/design-system';

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};

export interface RepositoryLanguageProps {
  language: string | null;
  className?: string;
}

export const RepositoryLanguage: React.FC<RepositoryLanguageProps> = ({
  language,
  className = '',
}) => {
  if (!language) return null;

  const color = LANGUAGE_COLORS[language] || '#8b949e';

  return (
    <span className={`flex items-center gap-1.5 ${className}`}>
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <Typography variant="caption" className="font-medium text-gray-600 dark:text-gray-300">
        {language}
      </Typography>
    </span>
  );
};

export default RepositoryLanguage;
