import { describe, it, expect } from 'vitest';
import { calculateTotalStars } from '../stars';
import { calculatePrimaryLanguage } from '../languages';
import { calculateOwlRank } from '../rank';
import { GitHubRepository } from '@/types/github';

describe('GitHub Statistics Calculation Suite', () => {
  const mockRepos: GitHubRepository[] = [
    {
      id: 1,
      name: 'repo-1',
      fullName: 'user/repo-1',
      description: null,
      isPrivate: false,
      isFork: false,
      isArchived: false,
      isDisabled: false,
      isTemplate: false,
      htmlUrl: '',
      homepage: null,
      stars: 40,
      forks: 5,
      watchers: 40,
      openIssues: 0,
      language: 'TypeScript',
      topics: [],
      license: null,
      defaultBranch: 'main',
      size: 100,
      owner: { login: 'user', id: 1, avatarUrl: '', htmlUrl: '', type: 'User' },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      pushedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'repo-2',
      fullName: 'user/repo-2',
      description: null,
      isPrivate: false,
      isFork: false,
      isArchived: false,
      isDisabled: false,
      isTemplate: false,
      htmlUrl: '',
      homepage: null,
      stars: 60,
      forks: 10,
      watchers: 60,
      openIssues: 2,
      language: 'TypeScript',
      topics: [],
      license: null,
      defaultBranch: 'main',
      size: 200,
      owner: { login: 'user', id: 1, avatarUrl: '', htmlUrl: '', type: 'User' },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      pushedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 3,
      name: 'repo-fork',
      fullName: 'user/repo-fork',
      description: null,
      isPrivate: false,
      isFork: true,
      isArchived: false,
      isDisabled: false,
      isTemplate: false,
      htmlUrl: '',
      homepage: null,
      stars: 100, // Should be ignored in total stars calculation as it is a fork
      forks: 0,
      watchers: 100,
      openIssues: 0,
      language: 'Python',
      topics: [],
      license: null,
      defaultBranch: 'main',
      size: 50,
      owner: { login: 'user', id: 1, avatarUrl: '', htmlUrl: '', type: 'User' },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      pushedAt: '2024-01-01T00:00:00Z',
    },
  ];

  it('calculates total stars accurately ignoring fork repositories', () => {
    const stars = calculateTotalStars(mockRepos);
    expect(stars).toBe(100);
  });

  it('determines primary language and percentage distribution deterministically', () => {
    const result = calculatePrimaryLanguage(mockRepos);
    expect(result.primaryLanguage).toBe('TypeScript');
    expect(result.languageDistribution['TypeScript']).toBeGreaterThan(result.languageDistribution['Python'] || 0);
  });

  it('calculates deterministic OwlREADME rank and score correctly', () => {
    const rankResult = calculateOwlRank({
      stars: 100,
      contributions: 500,
      commits: 200,
      repos: 10,
      followers: 50,
    });

    expect(rankResult.rank).toBe('S+');
    expect(rankResult.score).toBeGreaterThanOrEqual(1000);
  });
});
