import { fetchGitHubUserProfile, fetchGitHubUserRepositories } from '../api/githubApi';
import { CombinedGitHubData, GitHubUserProfile, GitHubRepository, GitHubApiError } from '../types/github';
import { validateGitHubUsername } from '../utils/github';

export class GitHubService {
  async fetchProfile(username: string, signal?: AbortSignal): Promise<GitHubUserProfile> {
    const validation = validateGitHubUsername(username);
    if (!validation.valid) {
      throw {
        type: 'INVALID_USERNAME',
        status: null,
        message: validation.message || 'Invalid username format.',
      } as GitHubApiError;
    }
    return fetchGitHubUserProfile(validation.normalizedUsername, signal);
  }

  async fetchRepositories(username: string, signal?: AbortSignal): Promise<GitHubRepository[]> {
    const validation = validateGitHubUsername(username);
    if (!validation.valid) {
      throw {
        type: 'INVALID_USERNAME',
        status: null,
        message: validation.message || 'Invalid username format.',
      } as GitHubApiError;
    }
    return fetchGitHubUserRepositories(validation.normalizedUsername, signal);
  }

  async fetchUserDataCombined(username: string, signal?: AbortSignal): Promise<CombinedGitHubData> {
    const validation = validateGitHubUsername(username);
    if (!validation.valid) {
      throw {
        type: 'INVALID_USERNAME',
        status: null,
        message: validation.message || 'Invalid username format.',
      } as GitHubApiError;
    }

    const [profile, repos] = await Promise.all([
      fetchGitHubUserProfile(validation.normalizedUsername, signal),
      fetchGitHubUserRepositories(validation.normalizedUsername, signal),
    ]);

    return {
      profile,
      repos,
    };
  }
}

export const githubService = new GitHubService();
export default githubService;
