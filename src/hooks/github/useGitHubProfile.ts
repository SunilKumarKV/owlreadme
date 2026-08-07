import { useState, useEffect, useCallback } from 'react';
import { githubService } from '../../services/github/githubService';
import { isValidGitHubUsername } from '../../lib/github/validators';
import { GitHubUserProfile, ProfileState } from '../../types/github/profile';
import { GitHubRawUserResponse } from '../../types/github/responses';

export function mapRawUserToUserProfile(raw: GitHubRawUserResponse): GitHubUserProfile {
  return {
    login: raw.login,
    id: raw.id,
    avatarUrl: raw.avatar_url,
    profileUrl: raw.html_url,
    name: raw.name,
    company: raw.company,
    blog: raw.blog,
    location: raw.location,
    email: raw.email,
    bio: raw.bio,
    twitterUsername: raw.twitter_username,
    publicRepos: raw.public_repos,
    publicGists: raw.public_gists,
    followers: raw.followers,
    following: raw.following,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function useGitHubProfile(username?: string) {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    isLoading: false,
    error: null,
    rateLimit: null,
    fromCache: false,
  });

  const fetchProfile = useCallback(async (isCancelled?: () => boolean) => {
    if (!username || !username.trim()) {
      if (!isCancelled?.()) {
        setState({
          profile: null,
          isLoading: false,
          error: null,
          rateLimit: null,
          fromCache: false,
        });
      }
      return;
    }

    const trimmed = username.trim();
    if (!isValidGitHubUsername(trimmed)) {
      if (!isCancelled?.()) {
        setState({
          profile: null,
          isLoading: false,
          error: {
            code: 'INVALID_USERNAME',
            message: `Invalid GitHub username format: "${username}"`,
            userMessage: 'Please enter a valid GitHub username.',
          },
          rateLimit: null,
          fromCache: false,
        });
      }
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await githubService.getUserProfile(trimmed);

      if (isCancelled?.()) return;

      if (res.success && res.data) {
        const mappedProfile = mapRawUserToUserProfile(res.data);
        setState({
          profile: mappedProfile,
          isLoading: false,
          error: null,
          rateLimit: res.rateLimit || null,
          fromCache: Boolean(res.fromCache),
        });
      } else {
        setState({
          profile: null,
          isLoading: false,
          error: res.error || {
            code: 'UNKNOWN_ERROR',
            message: 'Failed to fetch GitHub profile.',
            userMessage: 'Unable to load GitHub profile. Please try again.',
          },
          rateLimit: res.rateLimit || null,
          fromCache: false,
        });
      }
    } catch (err: unknown) {
      if (isCancelled?.()) return;

      setState({
        profile: null,
        isLoading: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: (err as Error)?.message || 'An unexpected error occurred.',
          userMessage: 'An unexpected error occurred while loading the profile.',
        },
        rateLimit: null,
        fromCache: false,
      });
    }
  }, [username]);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [fetchProfile]);

  return {
    ...state,
    refetch: fetchProfile,
  };
}

export default useGitHubProfile;
