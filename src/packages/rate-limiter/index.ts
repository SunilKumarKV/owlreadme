/**
 * Lightweight in-memory sliding-window rate limiter.
 *
 * No external dependencies required. Designed for use in Next.js API routes
 * to protect endpoints from abusive request volumes. Keyed by arbitrary string
 * (typically the client IP address).
 *
 * Security properties:
 * - Each key maintains a timestamped request log within a rolling window.
 * - Stale entries outside the window are pruned on every check to prevent memory leaks.
 * - Supports configurable limit (max requests) and windowMs (window duration in ms).
 */

interface RateLimitEntry {
  timestamps: number[];
}

class RateLimiter {
  private readonly store = new Map<string, RateLimitEntry>();

  /**
   * Checks whether a given key is within its rate limit.
   *
   * @param key       - Unique identifier for the requester (e.g. IP address).
   * @param limit     - Maximum number of requests allowed in the window.
   * @param windowMs  - Duration of the sliding window in milliseconds.
   * @returns `allowed: true` if under the limit, `allowed: false` with `retryAfterMs` if exceeded.
   */
  check(
    key: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; retryAfterMs: number } {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Retrieve or initialise entry
    let entry = this.store.get(key);
    if (!entry) {
      entry = { timestamps: [] };
      this.store.set(key, entry);
    }

    // Prune timestamps outside the sliding window
    entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

    if (entry.timestamps.length >= limit) {
      // Oldest request in window determines when quota next resets
      const oldestTs = entry.timestamps[0];
      const retryAfterMs = oldestTs + windowMs - now;
      return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 0) };
    }

    // Record this request
    entry.timestamps.push(now);

    // Periodically purge completely stale entries (> 10 × window age)
    // to bound memory growth in long-running server processes.
    if (Math.random() < 0.01) {
      const staleThreshold = now - windowMs * 10;
      for (const [k, v] of this.store.entries()) {
        if (v.timestamps.every((ts) => ts < staleThreshold)) {
          this.store.delete(k);
        }
      }
    }

    return { allowed: true, retryAfterMs: 0 };
  }
}

/** Singleton rate limiter instance shared across all API route invocations. */
export const rateLimiter = new RateLimiter();

/**
 * Extracts the best-effort client IP from a Next.js request object.
 * Prefers `x-forwarded-for` (set by Vercel / proxies) then `x-real-ip`,
 * falling back to a constant key so the limiter still functions without a proxy.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for may be a comma-separated list; first entry is the origin
    return forwarded.split(',')[0].trim();
  }
  return headers.get('x-real-ip') ?? 'unknown';
}
