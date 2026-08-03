import { ReadmeContentConfig } from '../types/preview-content';

export const DEFAULT_README_CONTENT_CONFIG: ReadmeContentConfig = {
  username: 'sunilkumarkv',
  developerTitle: 'Full-Stack Engineer',
  commentText: 'Full-Stack Engineer',
  techStackTitle: 'Tech Stack',
  techStack: [
    { id: 'ts-react', label: 'React', colorVariant: 'blue' },
    { id: 'ts-next', label: 'Next.js', colorVariant: 'gray' },
    { id: 'ts-typescript', label: 'TypeScript', colorVariant: 'indigo' },
    { id: 'ts-node', label: 'Node.js', colorVariant: 'emerald' },
  ],
  githubStats: {
    title: 'GitHub Activity Stats',
    rank: 'A+',
    stats: [
      { id: 'stat-stars', label: 'Total Stars', value: '1,240' },
      { id: 'stat-lang', label: 'Primary Language', value: 'TypeScript' },
      { id: 'stat-commits', label: 'Total Commits', value: '2,850' },
    ],
  },
  repositoriesTitle: 'Featured Repositories',
  repositories: [
    {
      id: 'repo-owlreadme',
      name: 'owlreadme',
      description: 'Automated GitHub README Builder with AI optimization and rich components.',
      stars: 840,
      language: 'TypeScript',
      visibility: 'Public',
    },
    {
      id: 'repo-next-starter',
      name: 'next-starter-kit',
      description: 'Production-ready Next.js 16 starter kit with TailwindCSS, Vitest, and ESLint.',
      stars: 400,
      language: 'TypeScript',
      visibility: 'Public',
    },
  ],
};
