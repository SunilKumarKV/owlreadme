import { useState, useEffect, useCallback } from 'react';
import { githubService } from '../../services/github/githubService';
import { isValidGitHubRepository, isValidGitHubUsername } from '../../lib/github/validators';
import { RepositoryState } from '../../types/github/repository';
import { mapRawRepoToRepository } from './useRepositories';

export function useRepository(owner?: string, repo?: string) {
  const [state, setState] = useState<RepositoryState>({
    repository: null,
    isLoading: false,
    error: null,
    rateLimit: null,
    fromCache: false,
  });

  const fetchRepository = useCallback(async () => {
    if (!owner || !owner.trim() || !repo || !repo.trim()) {
      setState({
        repository: null,
        isLoading: false,
        error: null,
        rateLimit: null,
        fromCache: false,
      });
      return;
    }

    const trimmedOwner = owner.trim();
    const trimmedRepo = repo.trim();

    if (!isValidGitHubUsername(trimmedOwner) || !isValidGitHubRepository(trimmedRepo)) {
      setState({
        repository: null,
        isLoading: false,
        error: {
          code: 'INVALID_REPOSITORY',
          message: `Invalid repository path: "${owner}/${repo}"`,
          userMessage: 'Please specify a valid repository owner and name.',
        },
        rateLimit: null,
        fromCache: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await githubService.getRepository(trimmedOwner, trimmedRepo);

      if (res.success && res.data) {
        setState({
          repository: mapRawRepoToRepository(res.data),
          isLoading: false,
          error: null,
          rateLimit: res.rateLimit || null,
          fromCache: Boolean(res.fromCache),
        });
      } else {
        setState({
          repository: null,
          isLoading: false,
          error: res.error || {
            code: 'UNKNOWN_ERROR',
            message: 'Failed to fetch repository.',
            userMessage: 'Unable to load GitHub repository details.',
          },
          rateLimit: res.rateLimit || null,
          fromCache: false,
        });
      }
    } catch (err: unknown) {
      setState({
        repository: null,
        isLoading: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: (err as Error)?.message || 'An unexpected error occurred.',
          userMessage: 'An unexpected error occurred while loading the repository.',
        },
        rateLimit: null,
        fromCache: false,
      });
    }
  }, [owner, repo]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRepository();
  }, [fetchRepository]);

  return {
    ...state,
    refetch: fetchRepository,
  };
}

export default useRepository;
