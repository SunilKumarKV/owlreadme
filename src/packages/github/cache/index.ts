/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import type { CacheEntry } from '../types';

const cacheStore = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function getCachedValue<T>(key: string): T | undefined {
  const entry = cacheStore.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key);
    return undefined;
  }
  return entry.value;
}

export function setCachedValue<T>(key: string, value: T, ttlMs: number = DEFAULT_TTL_MS): void {
  cacheStore.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

export function clearCache(): void {
  cacheStore.clear();
}
