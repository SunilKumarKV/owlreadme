import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReadme } from '../useReadme';
import { githubService } from '../../../services/github/githubService';

describe('useReadme Hook Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('provides generated markdown and reactive status for valid user', async () => {
    vi.spyOn(githubService, 'getUserProfile').mockResolvedValue({
      success: true,
      data: {
        login: 'octocat',
        id: 583231,
        avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
        html_url: 'https://github.com/octocat',
        name: 'The Octocat',
        company: '@github',
        blog: null,
        location: null,
        email: null,
        bio: null,
        twitter_username: null,
        public_repos: 2,
        public_gists: 0,
        followers: 10,
        following: 5,
        created_at: '2011-01-25T18:44:36Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      fromCache: false,
    });

    vi.spyOn(githubService, 'getUserRepositories').mockResolvedValue({
      success: true,
      data: [],
      fromCache: false,
    });

    const { result } = renderHook(() => useReadme('octocat'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.markdown).toBeDefined();
    expect(typeof result.current.markdown).toBe('string');
  });
});
