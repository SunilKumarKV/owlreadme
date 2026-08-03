import { ReadmeContentConfig } from '../types/preview-content';

export const DEFAULT_README_CONTENT_CONFIG: ReadmeContentConfig = {
  username: 'sunilkumarkv',
  developerTitle: 'Full-Stack Engineer',
  commentText: 'Full-Stack Engineer',
  techStackTitle: 'Tech Stack',
  techStack: [
    { id: 'react', label: 'React', icon: 'react', colorVariant: 'blue' },
    { id: 'nextjs', label: 'Next.js', icon: 'nextjs', colorVariant: 'gray' },
    { id: 'typescript', label: 'TypeScript', icon: 'typescript', colorVariant: 'indigo' },
    { id: 'nodejs', label: 'Node.js', icon: 'nodejs', colorVariant: 'emerald' },
  ],
  activityStats: {
    title: 'GitHub Activity Stats',
    rank: 'A+',
    stats: [
      { id: 'stars', label: 'Total Stars', value: '1,240', icon: 'star' },
      { id: 'language', label: 'Primary Language', value: 'TypeScript', icon: 'code' },
      { id: 'commits', label: 'Total Commits', value: '3,850', icon: 'git-commit' },
    ],
  },
  repositoriesTitle: 'Featured Repositories',
  repositories: [
    {
      id: 'owlreadme',
      name: 'owlreadme',
      description: 'Automated GitHub profile README builder & design system engine.',
      stars: 482,
      language: 'TypeScript',
      visibility: 'Public',
      forks: 48,
    },
    {
      id: 'next-starter-kit',
      name: 'next-starter-kit',
      description: 'Production-ready Next.js monorepo starter kit with TailwindCSS & Vitest.',
      stars: 312,
      language: 'TypeScript',
      visibility: 'Public',
      forks: 29,
    },
  ],
};
