"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CombinedGitHubData,
  GitHubUserProfile,
  GitHubRepository,
  GitHubApiError,
  GitHubFetchStatus,
  UseGithubProfileOptions,
} from '../types/github';
import { githubService } from '../services/githubService';
import { validateGitHubUsername, parseGitHubError } from '../utils/github';
import useReadmeStore from '@/stores/readme-store';
import useWorkspaceStore from '@/stores/workspace-store';
import { analyzeRepositories } from '@/utils/repo-analyzer';

export function useGithubProfile(options: UseGithubProfileOptions = {}) {
  const searchParams = useSearchParams();
  const urlUsername = searchParams?.get('username') || null;

  const targetUsername = options.username ?? urlUsername ?? '';

  const [profile, setProfile] = useState<GitHubUserProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [status, setStatus] = useState<GitHubFetchStatus>('idle');
  const [error, setError] = useState<GitHubApiError | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProfileData = useCallback(
    async (usernameToFetch: string) => {
      const validation = validateGitHubUsername(usernameToFetch);
      if (!validation.valid) {
        const errObj: GitHubApiError = {
          type: 'INVALID_USERNAME',
          status: null,
          message: validation.message || 'Invalid username.',
        };
        setStatus('error');
        setError(errObj);
        options.onError?.(errObj);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setStatus('loading');
      setError(null);

      try {
        const data: CombinedGitHubData = await githubService.fetchUserDataCombined(
          validation.normalizedUsername,
          controller.signal
        );

        if (controller.signal.aborted) return;

        setProfile(data.profile);
        setRepos(data.repos);
        setStatus('success');
        setError(null);

        // Sync with workspace & readme store
        const readmeStore = useReadmeStore.getState();
        const workspaceStore = useWorkspaceStore.getState();

        let currentActiveId = workspaceStore.activeWorkspaceId;
        if (!currentActiveId) {
          currentActiveId = workspaceStore.createWorkspace(
            `${data.profile.login}'s Workspace`,
            'combined'
          );
        }

        readmeStore.setName(data.profile.name || data.profile.login);
        const inferredRole = data.profile.company
          ? data.profile.company.startsWith('@')
            ? `Developer at ${data.profile.company.substring(1)}`
            : `Developer at ${data.profile.company}`
          : 'Software Developer';
        readmeStore.setRole(inferredRole);

        const bioParts = [];
        if (data.profile.bio) bioParts.push(data.profile.bio);
        if (data.profile.location) bioParts.push(`📍 Based in ${data.profile.location}`);
        readmeStore.setAbout(bioParts.join('\n\n'));

        readmeStore.setAvatarUrl(data.profile.avatar_url);
        readmeStore.setFollowers(data.profile.followers);
        readmeStore.setFollowing(data.profile.following);
        readmeStore.setPublicRepos(data.profile.public_repos);

        const analysis = analyzeRepositories(data.repos);
        readmeStore.setRepoAnalysis(analysis);

        options.onSuccess?.(data);
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        const errObj = parseGitHubError(err);
        setStatus('error');
        setError(errObj);
        options.onError?.(errObj);
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [options]
  );

  useEffect(() => {
    let isCancelled = false;

    if (targetUsername.trim()) {
      Promise.resolve().then(() => {
        if (!isCancelled) {
          fetchProfileData(targetUsername.trim());
        }
      });
    }

    return () => {
      isCancelled = true;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [targetUsername, fetchProfileData]);

  const refetch = useCallback(() => {
    if (targetUsername.trim()) {
      fetchProfileData(targetUsername.trim());
    }
  }, [targetUsername, fetchProfileData]);

  return {
    profile,
    repos,
    status,
    loading: status === 'loading',
    error,
    refetch,
  };
}

export default useGithubProfile;
