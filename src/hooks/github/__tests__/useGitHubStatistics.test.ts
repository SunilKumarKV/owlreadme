import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGitHubStatistics } from '../useGitHubStatistics';
import { githubStatisticsService } from '../../../services/github/statistics/githubStatisticsService';

describe('useGitHubStatistics Hook Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty statistics state for empty username', () => {
    const { result } = renderHook(() => useGitHubStatistics(''));
    expect(result.current.statistics).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('fetches calculated statistics successfully', async () => {
    vi.spyOn(githubStatisticsService, 'getStatistics').mockResolvedValue({
      success: true,
      data: {
        username: 'octocat',
        totalStars: 150,
        primaryLanguage: 'TypeScript',
        totalCommits: 320,
        contributions: 500,
        pullRequests: 25,
        issues: 10,
        repositoryCount: 12,
        followers: 1000,
        following: 5,
        rank: 'S',
        score: 850,
        languageDistribution: { TypeScript: 80, JavaScript: 20 },
        generatedAt: '2024-01-01T00:00:00Z',
      },
      fromCache: false,
    });

    const { result } = renderHook(() => useGitHubStatistics('octocat'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.statistics?.totalStars).toBe(150);
    expect(result.current.statistics?.primaryLanguage).toBe('TypeScript');
    expect(result.current.statistics?.rank).toBe('S');
  });
});
