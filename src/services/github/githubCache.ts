import { GITHUB_CONFIG } from '../../lib/github/constants';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class GitHubCacheManager {
  private cache = new Map<string, CacheEntry<unknown>>();

  public generateKey(url: string, params?: Record<string, unknown>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}:${paramString}`;
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public set<T>(key: string, data: T, ttlMs: number = GITHUB_CONFIG.defaultCacheTtlMs): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  public invalidate(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

export const githubCache = new GitHubCacheManager();
export default githubCache;
