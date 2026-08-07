import { useMemo, useCallback } from 'react';
import { useGitHubProfile } from '../github/useGitHubProfile';
import { useRepositories } from '../github/useRepositories';
import { useReadmeStore } from '../../stores/readme-store';
import { ReadmeGenerator } from '../../features/readme/generator/ReadmeGenerator';

export function useReadme(username?: string) {
  const { profile, isLoading: isProfileLoading, error: profileError, refetch: refetchProfile } = useGitHubProfile(username);
  const { repositories, isLoading: isReposLoading, error: reposError, refetch: refetchRepos } = useRepositories(username);
  const storeState = useReadmeStore();

  const { markdown, validation } = useMemo(() => {
    return ReadmeGenerator.generate({
      profile,
      repositories,
      storeState,
    });
  }, [profile, repositories, storeState]);

  const isLoading = isProfileLoading || isReposLoading;
  const error = (profileError?.userMessage || reposError?.userMessage) || null;

  const refetch = useCallback(async () => {
    await Promise.all([refetchProfile(), refetchRepos()]);
  }, [refetchProfile, refetchRepos]);

  return {
    markdown,
    validation,
    profile,
    repositories,
    isLoading,
    error,
    refetch,
  };
}

export default useReadme;
