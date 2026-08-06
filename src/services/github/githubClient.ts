import { GitHubRequestConfig } from '../../types/github/api';
import { GitHubApiResponse } from '../../types/github/responses';
import { GITHUB_CONFIG } from '../../lib/github/constants';
import { buildGitHubHeaders } from './githubHeaders';
import { githubRateLimit } from './githubRateLimit';
import { githubCache } from './githubCache';
import { createGitHubError } from './githubErrors';
import { githubLogger } from './githubLogger';

export class GitHubClient {
  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async request<T>(url: string, config: GitHubRequestConfig = {}): Promise<GitHubApiResponse<T>> {
    const method = config.method || 'GET';
    const useCache = config.useCache !== false && method === 'GET';
    const cacheTtl = config.cacheTtl || GITHUB_CONFIG.defaultCacheTtlMs;
    const retryCount = config.retryCount ?? GITHUB_CONFIG.defaultRetryCount;
    const retryDelay = config.retryDelay ?? GITHUB_CONFIG.defaultRetryDelayMs;
    const timeoutMs = config.timeout || GITHUB_CONFIG.defaultTimeoutMs;

    const cacheKey = githubCache.generateKey(url, config.params);

    if (useCache) {
      const cachedData = githubCache.get<T>(cacheKey);
      if (cachedData !== null) {
        githubLogger.info(`Cache hit for ${url}`);
        return {
          success: true,
          data: cachedData,
          fromCache: true,
          rateLimit: githubRateLimit.getRateLimitInfo(),
        };
      }
    }

    const headers = buildGitHubHeaders(config.token, config.headers);
    let attempt = 0;

    while (true) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      if (config.signal) {
        config.signal.addEventListener('abort', () => controller.abort());
      }

      try {
        githubLogger.info(`GitHub Request: ${method} ${url} (Attempt ${attempt + 1}/${retryCount + 1})`);
        
        const response = await fetch(url, {
          method,
          headers,
          body: config.body ? JSON.stringify(config.body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const rateLimit = githubRateLimit.parseHeaders(response.headers);

        if (!response.ok) {
          const status = response.status;
          let errorMessage: string | undefined;

          try {
            const errorJson = await response.json();
            errorMessage = errorJson.message;
          } catch {
            // Ignore parse failure
          }

          if (attempt < retryCount && (status === 429 || status >= 500)) {
            attempt++;
            const backoff = retryDelay * Math.pow(2, attempt - 1);
            githubLogger.warn(`GitHub API status ${status}. Retrying in ${backoff}ms...`);
            await this.sleep(backoff);
            continue;
          }

          const ghError = createGitHubError(status, errorMessage, rateLimit.resetDate, { url });
          githubLogger.error(`GitHub API error (${status}): ${ghError.message}`);
          return {
            success: false,
            error: {
              code: ghError.code,
              message: ghError.message,
              userMessage: ghError.userMessage,
              status: ghError.status,
              resetDate: ghError.resetDate,
            },
            rateLimit,
          };
        }

        const contentType = response.headers.get('Content-Type') || '';
        let data: T;

        if (contentType.includes('application/json')) {
          data = (await response.json()) as T;
        } else {
          data = (await response.text()) as unknown as T;
        }

        if (useCache) {
          githubCache.set(cacheKey, data, cacheTtl);
        }

        return {
          success: true,
          data,
          fromCache: false,
          rateLimit,
        };
      } catch (err: unknown) {
        clearTimeout(timeoutId);

        if (controller.signal.aborted) {
          githubLogger.warn(`GitHub Request aborted or timed out: ${url}`);
          const ghError = createGitHubError(408, 'Request timed out or aborted');
          return {
            success: false,
            error: {
              code: 'TIMEOUT_ERROR',
              message: ghError.message,
              userMessage: ghError.userMessage,
              status: 408,
            },
            rateLimit: githubRateLimit.getRateLimitInfo(),
          };
        }

        if (attempt < retryCount) {
          attempt++;
          const backoff = retryDelay * Math.pow(2, attempt - 1);
          githubLogger.warn(`GitHub Network error. Retrying in ${backoff}ms...`);
          await this.sleep(backoff);
          continue;
        }

        const ghError = createGitHubError(0, (err as Error)?.message || 'Network error', undefined, err);
        return {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: ghError.message,
            userMessage: ghError.userMessage,
          },
          rateLimit: githubRateLimit.getRateLimitInfo(),
        };
      }
    }
  }

  public async get<T>(url: string, config?: Omit<GitHubRequestConfig, 'method'>): Promise<GitHubApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  public async post<T>(url: string, body?: unknown, config?: Omit<GitHubRequestConfig, 'method' | 'body'>): Promise<GitHubApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'POST', body });
  }
}

export const githubClient = new GitHubClient();
export default githubClient;
