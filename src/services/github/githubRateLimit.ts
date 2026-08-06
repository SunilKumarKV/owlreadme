import { GitHubRateLimitInfo } from '../../types/github/api';
import { GITHUB_RATE_LIMIT_HEADERS } from '../../lib/github/constants';
import { parseResetTimestamp } from '../../lib/github/helpers';

class GitHubRateLimitManager {
  private currentInfo: GitHubRateLimitInfo = {
    limit: 60,
    remaining: 60,
    reset: Math.floor(Date.now() / 1000) + 3600,
    resetDate: new Date(Date.now() + 3600000),
    isExhausted: false,
  };

  public parseHeaders(headers: Headers | Record<string, string>): GitHubRateLimitInfo {
    const getHeader = (key: string): string | null => {
      if (typeof (headers as Headers).get === 'function') {
        return (headers as Headers).get(key);
      }
      const record = headers as Record<string, string>;
      const lowerKey = key.toLowerCase();
      const matchKey = Object.keys(record).find((k) => k.toLowerCase() === lowerKey);
      return matchKey ? record[matchKey] : null;
    };

    const limitStr = getHeader(GITHUB_RATE_LIMIT_HEADERS.limit);
    const remainingStr = getHeader(GITHUB_RATE_LIMIT_HEADERS.remaining);
    const resetStr = getHeader(GITHUB_RATE_LIMIT_HEADERS.reset);

    if (limitStr) {
      this.currentInfo.limit = parseInt(limitStr, 10) || 60;
    }

    if (remainingStr) {
      const remaining = parseInt(remainingStr, 10);
      this.currentInfo.remaining = isNaN(remaining) ? 60 : remaining;
      this.currentInfo.isExhausted = this.currentInfo.remaining <= 0;
    }

    if (resetStr) {
      this.currentInfo.resetDate = parseResetTimestamp(resetStr);
      this.currentInfo.reset = Math.floor(this.currentInfo.resetDate.getTime() / 1000);
    }

    return { ...this.currentInfo };
  }

  public getRateLimitInfo(): GitHubRateLimitInfo {
    // Auto-restore if reset date has passed
    if (this.currentInfo.isExhausted && Date.now() > this.currentInfo.resetDate.getTime()) {
      this.currentInfo.remaining = this.currentInfo.limit;
      this.currentInfo.isExhausted = false;
    }
    return { ...this.currentInfo };
  }
}

export const githubRateLimit = new GitHubRateLimitManager();
export default githubRateLimit;
