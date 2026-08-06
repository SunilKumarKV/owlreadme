import { GitHubErrorCode, GitHubErrorDetail } from '../../types/github/errors';
import { getFormattedResetTime } from '../../lib/github/helpers';

export class GitHubError extends Error {
  public readonly code: GitHubErrorCode;
  public readonly userMessage: string;
  public readonly status?: number;
  public readonly resetDate?: Date;
  public readonly rawError?: unknown;

  constructor(detail: GitHubErrorDetail) {
    super(detail.message);
    this.name = 'GitHubError';
    this.code = detail.code;
    this.userMessage = detail.userMessage;
    this.status = detail.status;
    this.resetDate = detail.resetDate;
    this.rawError = detail.rawError;
  }
}

export function createGitHubError(status?: number, message?: string, resetDate?: Date, rawError?: unknown): GitHubError {
  if (status === 404) {
    return new GitHubError({
      code: 'NOT_FOUND',
      message: message || 'GitHub resource not found.',
      userMessage: 'The requested GitHub user or repository could not be found.',
      status: 404,
      rawError,
    });
  }

  if (status === 401) {
    return new GitHubError({
      code: 'UNAUTHORIZED',
      message: message || 'GitHub authentication failed.',
      userMessage: 'GitHub access token is invalid or expired. Please check your credentials.',
      status: 401,
      rawError,
    });
  }

  if (status === 403 || status === 429) {
    const formattedReset = resetDate ? getFormattedResetTime(resetDate) : 'shortly';
    return new GitHubError({
      code: 'RATE_LIMITED',
      message: message || 'GitHub API rate limit exceeded.',
      userMessage: `GitHub API rate limit reached. Please try again in ${formattedReset}.`,
      status: status || 429,
      resetDate,
      rawError,
    });
  }

  if (status && status >= 500) {
    return new GitHubError({
      code: 'SERVER_ERROR',
      message: message || `GitHub API server error (${status}).`,
      userMessage: 'GitHub service is currently experiencing issues. Please try again later.',
      status,
      rawError,
    });
  }

  return new GitHubError({
    code: 'UNKNOWN_ERROR',
    message: message || 'An unexpected error occurred during GitHub API request.',
    userMessage: 'Unable to complete GitHub request. Please check your connection and try again.',
    status,
    rawError,
  });
}
