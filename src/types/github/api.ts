export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface GitHubClientOptions {
  baseUrl?: string;
  token?: string;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
  useCache?: boolean;
  cacheTtl?: number;
  headers?: Record<string, string>;
}

export interface GitHubRequestConfig extends GitHubClientOptions {
  method?: HttpMethod;
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  signal?: AbortSignal;
}

export interface GitHubRateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  resetDate: Date;
  isExhausted: boolean;
}
