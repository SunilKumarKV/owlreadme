import { githubClient } from './githubClient';
import { githubEndpoints } from './githubEndpoints';
import { validateUsernameParam, validateRepositoryParam } from './githubValidation';
import { GitHubApiResponse, GitHubRawUserResponse, GitHubRawRepoResponse } from '../../types/github';

export interface GraphQLPinnedReposResponse {
  data?: {
    user?: {
      pinnedItems?: {
        nodes?: Array<{
          id: string;
          name: string;
          nameWithOwner: string;
          description: string | null;
          isPrivate: boolean;
          isFork: boolean;
          isArchived: boolean;
          isDisabled: boolean;
          isTemplate: boolean;
          url: string;
          homepageUrl: string | null;
          stargazerCount: number;
          forkCount: number;
          watchers?: { totalCount: number };
          openIssues?: { totalCount: number };
          primaryLanguage?: { name: string } | null;
          repositoryTopics?: { nodes?: Array<{ topic: { name: string } }> };
          licenseInfo?: { key: string; name: string; spdxId: string | null; url: string | null } | null;
          defaultBranchRef?: { name: string } | null;
          diskUsage?: number;
          owner: { login: string; id?: number; avatarUrl: string; url: string };
          createdAt: string;
          updatedAt: string;
          pushedAt: string;
        }>;
      };
    };
  };
  errors?: Array<{ message: string }>;
}

export class GitHubService {
  public async getUserProfile(username: string): Promise<GitHubApiResponse<GitHubRawUserResponse>> {
    validateUsernameParam(username);
    const endpoint = githubEndpoints.userProfile(username);
    return githubClient.get<GitHubRawUserResponse>(endpoint);
  }

  public async getUserRepositories(
    username: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<GitHubApiResponse<GitHubRawRepoResponse[]>> {
    validateUsernameParam(username);
    const endpoint = githubEndpoints.userRepos(username, params);
    return githubClient.get<GitHubRawRepoResponse[]>(endpoint);
  }

  public async getRepository(owner: string, repo: string): Promise<GitHubApiResponse<GitHubRawRepoResponse>> {
    validateRepositoryParam(owner, repo);
    const endpoint = githubEndpoints.repository(owner, repo);
    return githubClient.get<GitHubRawRepoResponse>(endpoint);
  }

  public async getPinnedRepositories(
    username: string
  ): Promise<{ success: boolean; data?: GitHubRawRepoResponse[]; fromGraphQL: boolean; error?: unknown }> {
    validateUsernameParam(username);

    // Try GraphQL for pinned repositories
    const query = `
      query GetPinnedRepos($username: String!) {
        user(login: $username) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                id
                name
                nameWithOwner
                description
                isPrivate
                isFork
                isArchived
                isDisabled
                isTemplate
                url
                homepageUrl
                stargazerCount
                forkCount
                watchers { totalCount }
                openIssues: issues(states: OPEN) { totalCount }
                primaryLanguage { name }
                repositoryTopics(first: 10) { nodes { topic { name } } }
                licenseInfo { key name spdxId url }
                defaultBranchRef { name }
                diskUsage
                owner { login avatarUrl url }
                createdAt
                updatedAt
                pushedAt
              }
            }
          }
        }
      }
    `;

    try {
      const gqlRes = await githubClient.post<GraphQLPinnedReposResponse>(githubEndpoints.graphql(), {
        query,
        variables: { username },
      });

      if (gqlRes.success && gqlRes.data?.data?.user?.pinnedItems?.nodes && gqlRes.data.data.user.pinnedItems.nodes.length > 0) {
        const mapped: GitHubRawRepoResponse[] = gqlRes.data.data.user.pinnedItems.nodes.map((node) => ({
          id: typeof node.id === 'number' ? node.id : Math.abs(node.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)),
          node_id: String(node.id),
          name: node.name,
          full_name: node.nameWithOwner,
          private: node.isPrivate,
          owner: {
            login: node.owner.login,
            id: node.owner.id || 0,
            node_id: '',
            avatar_url: node.owner.avatarUrl,
            gravatar_id: '',
            url: node.owner.url,
            html_url: node.owner.url,
            followers_url: '',
            following_url: '',
            gists_url: '',
            starred_url: '',
            subscriptions_url: '',
            organizations_url: '',
            repos_url: '',
            events_url: '',
            received_events_url: '',
            type: 'User',
            site_admin: false,
          },
          html_url: node.url,
          description: node.description,
          fork: node.isFork,
          url: node.url,
          forks_url: '',
          keys_url: '',
          collaborators_url: '',
          teams_url: '',
          hooks_url: '',
          issue_events_url: '',
          events_url: '',
          assignees_url: '',
          branches_url: '',
          tags_url: '',
          blobs_url: '',
          git_tags_url: '',
          git_refs_url: '',
          trees_url: '',
          statuses_url: '',
          languages_url: '',
          stargazers_url: '',
          contributors_url: '',
          subscribers_url: '',
          subscription_url: '',
          commits_url: '',
          git_commits_url: '',
          comments_url: '',
          issue_comment_url: '',
          contents_url: '',
          compare_url: '',
          merges_url: '',
          archive_url: '',
          downloads_url: '',
          issues_url: '',
          pulls_url: '',
          milestones_url: '',
          notifications_url: '',
          labels_url: '',
          releases_url: '',
          deployments_url: '',
          created_at: node.createdAt,
          updated_at: node.updatedAt,
          pushed_at: node.pushedAt,
          git_url: '',
          ssh_url: '',
          clone_url: node.url,
          svn_url: '',
          homepage: node.homepageUrl,
          size: node.diskUsage || 0,
          stargazers_count: node.stargazerCount,
          watchers_count: node.watchers?.totalCount || 0,
          language: node.primaryLanguage?.name || null,
          has_issues: true,
          has_projects: true,
          has_downloads: true,
          has_wiki: true,
          has_pages: false,
          has_discussions: false,
          forks_count: node.forkCount,
          mirror_url: null,
          archived: node.isArchived,
          disabled: node.isDisabled,
          open_issues_count: node.openIssues?.totalCount || 0,
          license: node.licenseInfo ? { key: node.licenseInfo.key, name: node.licenseInfo.name, spdx_id: node.licenseInfo.spdxId, url: node.licenseInfo.url, node_id: '' } : null,
          allow_forking: true,
          is_template: node.isTemplate,
          web_commit_signoff_required: false,
          topics: node.repositoryTopics?.nodes?.map((t) => t.topic.name) || [],
          visibility: node.isPrivate ? 'private' : 'public',
          forks: node.forkCount,
          open_issues: node.openIssues?.totalCount || 0,
          watchers: node.watchers?.totalCount || 0,
          default_branch: node.defaultBranchRef?.name || 'main',
        }));

        return { success: true, data: mapped, fromGraphQL: true };
      }
    } catch {
      // Fall through to REST
    }

    // REST Fallback (most starred)
    const restRes = await this.getUserRepositories(username, { sort: 'updated', per_page: 100 });
    if (restRes.success && restRes.data) {
      const sorted = [...restRes.data]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);
      return { success: true, data: sorted, fromGraphQL: false };
    }

    return { success: false, error: restRes.error, fromGraphQL: false };
  }

  public async getRepositoryReadme(owner: string, repo: string): Promise<GitHubApiResponse<string>> {
    validateRepositoryParam(owner, repo);
    const endpoint = githubEndpoints.rawContent(owner, repo);
    return githubClient.get<string>(endpoint);
  }
}

export const githubService = new GitHubService();
export default githubService;
