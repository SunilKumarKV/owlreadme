import { useState, useCallback } from 'react';
import { githubClient } from '../../services/github/githubClient';
import { githubRateLimit } from '../../services/github/githubRateLimit';
import { githubCache } from '../../services/github/githubCache';
import { validateEnvironmentToken } from '../../services/github/githubValidation';
import { GitHubRateLimitInfo, GitHubRequestConfig, GitHubApiResponse } from '../../types/github';

export function useGitHubClient() {
  const [rateLimit, setRateLimit] = useState<GitHubRateLimitInfo>(() => githubRateLimit.getRateLimitInfo());
  const [envStatus] = useState(() => validateEnvironmentToken());

  const executeRequest = useCallback(async <T>(url: string, config?: GitHubRequestConfig): Promise<GitHubApiResponse<T>> => {
    const res = await githubClient.request<T>(url, config);
    if (res.rateLimit) {
      setRateLimit(res.rateLimit);
    }
    return res;
  }, []);

  const clearCache = useCallback((key?: string) => {
    githubCache.invalidate(key);
  }, []);

  return {
    executeRequest,
    rateLimit,
    envStatus,
    clearCache,
  };
}

export default useGitHubClient;
