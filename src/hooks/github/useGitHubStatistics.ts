import { useState, useEffect, useCallback } from 'react';
import { githubStatisticsService } from '../../services/github/statistics/githubStatisticsService';
import { isValidGitHubUsername } from '../../lib/github/validators';
import { StatisticsState } from '../../types/github/statistics';

export function useGitHubStatistics(username?: string) {
  const [state, setState] = useState<StatisticsState>({
    statistics: null,
    isLoading: false,
    error: null,
    rateLimit: null,
    fromCache: false,
  });

  const fetchStatistics = useCallback(async () => {
    if (!username || !username.trim()) {
      setState({
        statistics: null,
        isLoading: false,
        error: null,
        rateLimit: null,
        fromCache: false,
      });
      return;
    }

    const trimmed = username.trim();
    if (!isValidGitHubUsername(trimmed)) {
      setState({
        statistics: null,
        isLoading: false,
        error: {
          code: 'INVALID_USERNAME',
          message: `Invalid GitHub username format: "${username}"`,
          userMessage: 'Please enter a valid GitHub username.',
        },
        rateLimit: null,
        fromCache: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await githubStatisticsService.getStatistics(trimmed);

      if (res.success && res.data) {
        setState({
          statistics: res.data,
          isLoading: false,
          error: null,
          rateLimit: res.rateLimit || null,
          fromCache: Boolean(res.fromCache),
        });
      } else {
        setState({
          statistics: null,
          isLoading: false,
          error: res.error || {
            code: 'UNKNOWN_ERROR',
            message: 'Failed to calculate statistics.',
            userMessage: 'Unable to calculate GitHub statistics. Please try again.',
          },
          rateLimit: res.rateLimit || null,
          fromCache: false,
        });
      }
    } catch (err: unknown) {
      setState({
        statistics: null,
        isLoading: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: (err as Error)?.message || 'An unexpected error occurred.',
          userMessage: 'An unexpected error occurred while calculating statistics.',
        },
        rateLimit: null,
        fromCache: false,
      });
    }
  }, [username]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    ...state,
    refetch: fetchStatistics,
  };
}

export default useGitHubStatistics;
