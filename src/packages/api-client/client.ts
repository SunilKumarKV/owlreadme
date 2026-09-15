/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import { ApiResult, RequestConfig } from './types';
import { logger } from './logger';
import { responseCache } from './cache';
import { requestManager } from './request-manager';

class ApiClient {
  private defaultTimeout = 10000;
  private defaultCacheTtl = 300000; // 5 minutes

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isRetryable(errorOrStatus: number | Error): boolean {
    if (errorOrStatus instanceof Error) {
      return (
        errorOrStatus.name === 'TypeError' ||
        errorOrStatus.message.includes('Failed to fetch') ||
        errorOrStatus.message.includes('network')
      );
    }
    // Retry on 429, 502, 503, 504 status codes
    return errorOrStatus === 429 || (errorOrStatus >= 502 && errorOrStatus <= 504);
  }

  /**
   * Executes a network request using the unified API client infrastructure lifecycle.
   */
  async request<T>(url: string, config: RequestConfig = {}): Promise<ApiResult<T>> {
    const method = config.method || 'GET';
    const cacheEnabled = config.useCache !== false && method === 'GET';
    const cacheTtl = config.cacheTtl || this.defaultCacheTtl;
    const retryCount = config.retry || 0;
    const retryDelay = config.retryDelay || 1000;

    const {
      timeout,
      useCache,
      cacheTtl: _unusedCacheTtl,
      retry,
      retryDelay: _unusedRetryDelay,
      validator,
      ...fetchOptions
    } = config;
    void useCache;
    void _unusedCacheTtl;
    void retry;
    void _unusedRetryDelay;

    const cacheKey = responseCache.generateKey(method, url, fetchOptions.headers, fetchOptions.body);

    if (cacheEnabled) {
      const cached = responseCache.get<T>(cacheKey);
      if (cached !== null) {
        return { success: true, data: cached };
      }
    }

    try {
      const executeRequest = async (signal: AbortSignal): Promise<T> => {
        let attempt = 0;
        while (true) {
          const timeoutController = new AbortController();
          const requestSignal = signal;

          const timeoutId = setTimeout(() => {
            timeoutController.abort();
          }, timeout || this.defaultTimeout);

          const combinedController = new AbortController();
          const abortHandler = () => combinedController.abort();
          requestSignal.addEventListener('abort', abortHandler);
          timeoutController.signal.addEventListener('abort', abortHandler);

          try {
            logger.debug(`Fetching: ${method} ${url} (Attempt ${attempt + 1}/${retryCount + 1})`);
            const response = await fetch(url, {
              ...fetchOptions,
              signal: combinedController.signal,
            });
            clearTimeout(timeoutId);
            requestSignal.removeEventListener('abort', abortHandler);
            timeoutController.signal.removeEventListener('abort', abortHandler);

            if (!response.ok) {
              const status = response.status;
              let errorData: any = undefined;
              try {
                const contentType = response.headers?.get?.('Content-Type') || '';
                if (contentType.includes('application/json')) {
                  errorData = typeof response.json === 'function' ? await response.json() : await response.text();
                } else if (typeof response.text === 'function') {
                  errorData = await response.text();
                } else {
                  errorData = await response.json();
                }
              } catch {
                // Ignore parse failures
              }

              if (attempt < retryCount && this.isRetryable(status)) {
                attempt++;
                const delay = retryDelay * Math.pow(2, attempt - 1);
                logger.warn(`API call returned status ${status}. Retrying in ${delay}ms...`);
                await this.sleep(delay);
                continue;
              }
              throw { status, message: `HTTP Error ${status}`, data: errorData };
            }

            const contentType = response.headers?.get?.('Content-Type') || '';
            let parsedData: any;
            if (contentType.includes('application/json')) {
              parsedData = typeof response.json === 'function' ? await response.json() : await response.text();
            } else if (typeof response.text === 'function') {
              parsedData = await response.text();
            } else {
              parsedData = await response.json();
            }

            if (validator && !validator(parsedData)) {
              throw { isValidationError: true, message: 'Response data validation failed.' };
            }

            return parsedData as T;
          } catch (err: any) {
            clearTimeout(timeoutId);
            requestSignal.removeEventListener('abort', abortHandler);
            timeoutController.signal.removeEventListener('abort', abortHandler);

            if (timeoutController.signal.aborted) {
              const timeoutError = new Error('TIMEOUT_ERROR');
              if (attempt < retryCount && this.isRetryable(timeoutError)) {
                attempt++;
                const delay = retryDelay * Math.pow(2, attempt - 1);
                logger.warn(`API call timed out. Retrying in ${delay}ms...`);
                await this.sleep(delay);
                continue;
              }
              throw { isTimeout: true, message: 'Request timed out' };
            }

            if (attempt < retryCount && this.isRetryable(err)) {
              attempt++;
              const delay = retryDelay * Math.pow(2, attempt - 1);
              logger.warn(`API call failed with network error. Retrying in ${delay}ms...`);
              await this.sleep(delay);
              continue;
            }

            throw err;
          }
        }
      };

      const data = await requestManager.getOrCreatePromise(cacheKey, executeRequest);

      if (cacheEnabled) {
        responseCache.set(cacheKey, data, cacheTtl);
      }

      return { success: true, data };
    } catch (error: any) {
      let code = 'UNKNOWN_ERROR';
      let message = error.message || 'An unknown error occurred.';
      let status: number | undefined = undefined;

      if (error.isTimeout) {
        code = 'TIMEOUT_ERROR';
        message = 'Request timed out after limit was reached.';
      } else if (error.isValidationError) {
        code = 'VALIDATION_ERROR';
        message = error.message;
      } else if (error.status) {
        status = error.status;
        code = `HTTP_ERROR_${status}`;
        message = error.data?.error || `API request failed with status code ${status}.`;
      } else if (error.name === 'TypeError' || error.message?.includes('Failed to fetch')) {
        code = 'NETWORK_ERROR';
        message = 'Network error: Failed to connect to host. Please verify your network connection.';
      }

      logger.error(`API Request Failure (${code}): ${message}`, error);

      return {
        success: false,
        error: {
          code,
          message,
          status,
          data: error.data,
          originalError: error,
        },
      };
    }
  }

  async get<T>(url: string, config?: Omit<RequestConfig, 'method'>): Promise<ApiResult<T>> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  async post<T>(url: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResult<T>> {
    const headers = {
      'Content-Type': 'application/json',
      ...(config?.headers as Record<string, string> | undefined),
    };
    const serializedBody = typeof body === 'string' ? body : body !== undefined ? JSON.stringify(body) : undefined;
    return this.request<T>(url, { ...config, method: 'POST', headers, body: serializedBody });
  }

  async put<T>(url: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResult<T>> {
    const headers = {
      'Content-Type': 'application/json',
      ...(config?.headers as Record<string, string> | undefined),
    };
    const serializedBody = typeof body === 'string' ? body : body !== undefined ? JSON.stringify(body) : undefined;
    return this.request<T>(url, { ...config, method: 'PUT', headers, body: serializedBody });
  }

  async delete<T>(url: string, config?: Omit<RequestConfig, 'method'>): Promise<ApiResult<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
