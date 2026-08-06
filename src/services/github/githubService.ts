import { githubClient } from './githubClient';
import { githubEndpoints } from './githubEndpoints';
import { validateUsernameParam, validateRepositoryParam } from './githubValidation';
import { GitHubApiResponse, GitHubRawUserResponse, GitHubRawRepoResponse } from '../../types/github';

export class GitHubService {
  public async getUserProfile(username: string): Promise<GitHubApiResponse<GitHubRawUserResponse>> {
    validateUsernameParam(username);
    const endpoint = githubEndpoints.userProfile(username);
    return githubClient.get<GitHubRawUserResponse>(endpoint);
  }

  public async getUserRepositories(username: string, params?: Record<string, string | number | boolean | undefined>): Promise<GitHubApiResponse<GitHubRawRepoResponse[]>> {
    validateUsernameParam(username);
    const endpoint = githubEndpoints.userRepos(username, params);
    return githubClient.get<GitHubRawRepoResponse[]>(endpoint);
  }

  public async getRepositoryReadme(owner: string, repo: string): Promise<GitHubApiResponse<string>> {
    validateRepositoryParam(owner, repo);
    const endpoint = githubEndpoints.rawContent(owner, repo);
    return githubClient.get<string>(endpoint);
  }
}

export const githubService = new GitHubService();
export default githubService;
