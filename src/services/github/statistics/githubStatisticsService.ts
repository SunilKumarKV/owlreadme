import { githubService } from '../githubService';
import { githubCache } from '../githubCache';
import { validateUsernameParam } from '../githubValidation';
import { GitHubApiResponse, GitHubStatistics } from '@/types/github';
import { calculateTotalStars } from './stars';
import { calculatePrimaryLanguage } from './languages';
import { fetchTotalCommits } from './commits';
import { fetchContributions } from './contributions';
import { calculateOwlRank } from './rank';

export class GitHubStatisticsService {
  public async getStatistics(username: string): Promise<GitHubApiResponse<GitHubStatistics>> {
    validateUsernameParam(username);

    const cacheKey = githubCache.generateKey(`stats:${username}`);
    const cachedStats = githubCache.get<GitHubStatistics>(cacheKey);

    if (cachedStats) {
      return {
        success: true,
        data: cachedStats,
        fromCache: true,
      };
    }

    try {
      const [profileRes, reposRes] = await Promise.all([
        githubService.getUserProfile(username),
        githubService.getUserRepositories(username, { per_page: 100 }),
      ]);

      if (!profileRes.success || !profileRes.data) {
        return {
          success: false,
          error: profileRes.error,
        };
      }

      const profile = profileRes.data;
      const rawRepos = reposRes.data || [];

      // Map raw repos for calculation
      const repos = rawRepos.map((raw) => ({
        id: raw.id,
        name: raw.name,
        fullName: raw.full_name,
        description: raw.description,
        isPrivate: raw.private,
        isFork: raw.fork,
        isArchived: raw.archived || false,
        isDisabled: raw.disabled || false,
        isTemplate: raw.is_template || false,
        htmlUrl: raw.html_url,
        homepage: raw.homepage,
        stars: raw.stargazers_count,
        forks: raw.forks_count,
        watchers: raw.watchers_count,
        openIssues: raw.open_issues_count,
        language: raw.language,
        topics: raw.topics || [],
        license: null,
        defaultBranch: raw.default_branch,
        size: raw.size,
        owner: {
          login: raw.owner?.login || username,
          id: raw.owner?.id || 0,
          avatarUrl: raw.owner?.avatar_url || '',
          htmlUrl: raw.owner?.html_url || '',
          type: raw.owner?.type || 'User',
        },
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
        pushedAt: raw.pushed_at,
      }));

      const totalStars = calculateTotalStars(repos);
      const { primaryLanguage, languageDistribution } = calculatePrimaryLanguage(repos);
      const [totalCommits, contributionData] = await Promise.all([
        fetchTotalCommits(username),
        fetchContributions(username),
      ]);

      const { rank, score } = calculateOwlRank({
        stars: totalStars,
        contributions: contributionData.contributions,
        commits: totalCommits,
        repos: profile.public_repos,
        followers: profile.followers,
      });

      const statsModel: GitHubStatistics = {
        username: profile.login,
        totalStars,
        primaryLanguage,
        totalCommits,
        contributions: contributionData.contributions,
        pullRequests: contributionData.pullRequests,
        issues: contributionData.issues,
        repositoryCount: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        rank,
        score,
        languageDistribution,
        generatedAt: new Date().toISOString(),
      };

      githubCache.set(cacheKey, statsModel, 300000); // 5 min TTL

      return {
        success: true,
        data: statsModel,
        fromCache: false,
        rateLimit: profileRes.rateLimit,
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: (err as Error)?.message || 'Failed to calculate GitHub statistics.',
          userMessage: 'Unable to calculate GitHub activity statistics.',
        },
      };
    }
  }
}

export const githubStatisticsService = new GitHubStatisticsService();
export default githubStatisticsService;
