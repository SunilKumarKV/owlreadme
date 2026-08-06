import { useState, useEffect, useCallback } from 'react';
import { githubService } from '../../services/github/githubService';
import { isValidGitHubUsername } from '../../lib/github/validators';
import { GitHubRepository, PinnedRepositoriesState, GitHubErrorDetail } from '../../types/github';
import { mapRawRepoToRepository } from './useRepositories';

export function usePinnedRepositories(username?: string) {
  const [state, setState] = useState<PinnedRepositoriesState>({
    pinnedRepositories: [],
    isLoading: false,
    error: null,
    fromGraphQL: false,
    fromCache: false,
  });

  const fetchPinnedRepositories = useCallback(async () => {
    if (!username || !username.trim()) {
      setState({
        pinnedRepositories: [],
        isLoading: false,
        error: null,
        fromGraphQL: false,
        fromCache: false,
      });
      return;
    }

    const trimmed = username.trim();
    if (!isValidGitHubUsername(trimmed)) {
      setState({
        pinnedRepositories: [],
        isLoading: false,
        error: {
          code: 'INVALID_USERNAME',
          message: `Invalid GitHub username format: "${username}"`,
          userMessage: 'Please enter a valid GitHub username.',
        },
        fromGraphQL: false,
        fromCache: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await githubService.getPinnedRepositories(trimmed);

      if (res.success && res.data) {
        const mapped: GitHubRepository[] = res.data.map((raw) => ({
          ...mapRawRepoToRepository(raw),
          isPinned: true,
        }));

        setState({
          pinnedRepositories: mapped,
          isLoading: false,
          error: null,
          fromGraphQL: res.fromGraphQL,
          fromCache: false,
        });
      } else {
        setState({
          pinnedRepositories: [],
          isLoading: false,
          error: (res.error as GitHubErrorDetail) || {
            code: 'UNKNOWN_ERROR',
            message: 'Failed to fetch pinned repositories.',
            userMessage: 'Unable to load pinned repositories.',
          },
          fromGraphQL: false,
          fromCache: false,
        });
      }
    } catch (err: unknown) {
      setState({
        pinnedRepositories: [],
        isLoading: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: (err as Error)?.message || 'An unexpected error occurred.',
          userMessage: 'An unexpected error occurred while loading pinned repositories.',
        },
        fromGraphQL: false,
        fromCache: false,
      });
    }
  }, [username]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPinnedRepositories();
  }, [fetchPinnedRepositories]);

  return {
    ...state,
    refetch: fetchPinnedRepositories,
  };
}

export default usePinnedRepositories;
