import { validateGithubUsername, validateGithubRepoName } from '../validators';

export function parseGithubRepositoryUrl(url: string): { owner: string; repo: string } {
  if (!url || typeof url !== 'string') {
    throw new Error('Please enter a valid GitHub repository URL.');
  }

  const trimmed = url.trim();
  const match = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/.*)?$/i);
  if (!match) {
    throw new Error('Invalid GitHub repository URL format. Expected https://github.com/owner/repo');
  }

  const owner = match[1].trim();
  const repo = match[2].replace(/\.git$/, '').trim();

  validateGithubUsername(owner);
  validateGithubRepoName(repo);

  return { owner, repo };
}

export async function handleApiError(res: Response, defaultMsg: string): Promise<Error> {
  if (res.status === 404) {
    return new Error('GitHub user or repository not found. Please check the name and try again.');
  }

  const rateLimitRemaining = res.headers.get('x-ratelimit-remaining');
  const rateLimitReset = res.headers.get('x-ratelimit-reset');

  if (res.status === 403 && rateLimitRemaining === '0' && rateLimitReset) {
    try {
      const resetEpoch = Number(rateLimitReset) * 1000;
      const waitMinutes = Math.max(1, Math.ceil((resetEpoch - Date.now()) / 60000));
      return new Error(
        `GitHub API rate limit reached. Please try again in ${waitMinutes} minute${waitMinutes === 1 ? '' : 's'}.`
      );
    } catch (e) {
      return new Error('GitHub API rate limit reached. Please try again in about an hour.');
    }
  }

  try {
    const errorBody = await res.json();
    if (errorBody?.message) {
      return new Error(`GitHub API error: ${errorBody.message}`);
    }
  } catch (e) {
    // Body not parseable — fall through to default
  }

  return new Error(defaultMsg);
}
