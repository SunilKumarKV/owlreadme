import {
  GITHUB_USERNAME_REGEX,
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
  GITHUB_ERROR_MESSAGES,
} from '../constants/github';
import { GitHubValidationResult, GitHubApiError } from '../types/github';

export function normalizeUsername(input: string): string {
  if (!input) return '';
  return input.trim().replace(/^@/, '');
}

export function validateGitHubUsername(input: string): GitHubValidationResult {
  const normalized = normalizeUsername(input);

  if (!normalized) {
    return {
      valid: false,
      message: 'Username cannot be empty.',
      normalizedUsername: '',
    };
  }

  if (normalized.length < MIN_USERNAME_LENGTH || normalized.length > MAX_USERNAME_LENGTH) {
    return {
      valid: false,
      message: `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`,
      normalizedUsername: normalized,
    };
  }

  if (!GITHUB_USERNAME_REGEX.test(normalized)) {
    return {
      valid: false,
      message: GITHUB_ERROR_MESSAGES.INVALID_USERNAME,
      normalizedUsername: normalized,
    };
  }

  return {
    valid: true,
    message: null,
    normalizedUsername: normalized,
  };
}

export function parseGitHubError(error: unknown): GitHubApiError {
  if (typeof error === 'object' && error !== null && 'type' in error && 'message' in error) {
    return error as GitHubApiError;
  }

  if (typeof window !== 'undefined' && !navigator.onLine) {
    return {
      type: 'OFFLINE',
      status: null,
      message: GITHUB_ERROR_MESSAGES.OFFLINE,
      rawError: error,
    };
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return {
        type: 'TIMEOUT',
        status: null,
        message: GITHUB_ERROR_MESSAGES.TIMEOUT,
        rawError: error,
      };
    }
    return {
      type: 'UNKNOWN',
      status: null,
      message: error.message || GITHUB_ERROR_MESSAGES.UNKNOWN,
      rawError: error,
    };
  }

  return {
    type: 'UNKNOWN',
    status: null,
    message: GITHUB_ERROR_MESSAGES.UNKNOWN,
    rawError: error,
  };
}
