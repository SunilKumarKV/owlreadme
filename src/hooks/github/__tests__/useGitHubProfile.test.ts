import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGitHubProfile } from '../useGitHubProfile';
import { githubService } from '../../../services/github/githubService';

describe('useGitHubProfile Hook Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns initial empty state when username is missing', () => {
    const { result } = renderHook(() => useGitHubProfile(''));
    expect(result.current.profile).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets INVALID_USERNAME error state for invalid username strings', async () => {
    const { result } = renderHook(() => useGitHubProfile('invalid--user'));
    expect(result.current.error?.code).toBe('INVALID_USERNAME');
    expect(result.current.profile).toBeNull();
  });

  it('fetches and maps profile data successfully', async () => {
    const mockRawData = {
      login: 'octocat',
      id: 583231,
      avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
      html_url: 'https://github.com/octocat',
      name: 'The Octocat',
      company: '@github',
      blog: 'https://github.blog',
      location: 'San Francisco',
      email: null,
      bio: 'Monalisa Octocat',
      twitter_username: null,
      public_repos: 8,
      public_gists: 0,
      followers: 10000,
      following: 9,
      created_at: '2011-01-25T18:44:36Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    vi.spyOn(githubService, 'getUserProfile').mockResolvedValue({
      success: true,
      data: mockRawData,
      fromCache: false,
    });

    const { result } = renderHook(() => useGitHubProfile('octocat'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile?.login).toBe('octocat');
    expect(result.current.profile?.name).toBe('The Octocat');
    expect(result.current.profile?.avatarUrl).toBe('https://avatars.githubusercontent.com/u/583231?v=4');
    expect(result.current.error).toBeNull();
  });

  it('handles profile 404 error state cleanly', async () => {
    vi.spyOn(githubService, 'getUserProfile').mockResolvedValue({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Not found',
        userMessage: 'The requested GitHub user could not be found.',
        status: 404,
      },
    });

    const { result } = renderHook(() => useGitHubProfile('nonexistent-user-xyz'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.error?.code).toBe('NOT_FOUND');
  });
});
