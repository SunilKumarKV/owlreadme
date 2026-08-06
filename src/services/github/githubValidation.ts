import { isValidGitHubUsername, isValidGitHubRepository } from '../../lib/github/validators';
import { createGitHubError } from './githubErrors';

export function validateUsernameParam(username: string): void {
  if (!isValidGitHubUsername(username)) {
    throw createGitHubError(
      400,
      `Invalid GitHub username parameter: "${username}"`,
      undefined,
      { isValidationError: true }
    );
  }
}

export function validateRepositoryParam(owner: string, repo: string): void {
  if (!isValidGitHubUsername(owner) || !isValidGitHubRepository(repo)) {
    throw createGitHubError(
      400,
      `Invalid repository parameter pair: owner="${owner}", repo="${repo}"`,
      undefined,
      { isValidationError: true }
    );
  }
}

export function validateEnvironmentToken(): { hasToken: boolean; isPublicMode: boolean } {
  const token = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN : undefined;
  const hasToken = Boolean(token && token.trim());
  return {
    hasToken,
    isPublicMode: !hasToken,
  };
}
