export const GITHUB_CONFIG = {
  apiBaseUrl: 'https://api.github.com',
  rawBaseUrl: 'https://raw.githubusercontent.com',
  apiVersion: '2022-11-28',
  defaultTimeoutMs: 10000,
  defaultRetryCount: 2,
  defaultRetryDelayMs: 1000,
  defaultCacheTtlMs: 300000, // 5 minutes
  userAgent: 'OwlREADME-SaaS-App/1.2.0',
  allowedRawHostnames: [
    'raw.githubusercontent.com',
    'gist.githubusercontent.com',
  ],
} as const;

export const GITHUB_RATE_LIMIT_HEADERS = {
  limit: 'x-ratelimit-limit',
  remaining: 'x-ratelimit-remaining',
  reset: 'x-ratelimit-reset',
  resource: 'x-ratelimit-resource',
} as const;
