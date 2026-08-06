export type GitHubErrorCode =
  | 'INVALID_USERNAME'
  | 'INVALID_REPOSITORY'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'ABORTED'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';

export interface GitHubErrorDetail {
  code: GitHubErrorCode;
  message: string;
  userMessage: string;
  status?: number;
  documentationUrl?: string;
  resetDate?: Date;
  rawError?: unknown;
}
