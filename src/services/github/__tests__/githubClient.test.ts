import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { githubClient } from '../githubClient';
import { githubCache } from '../githubCache';
import { githubRateLimit } from '../githubRateLimit';
import { isValidGitHubUsername, isValidGitHubRepository, isValidRawGitHubUrl } from '../../../lib/github/validators';

describe('GitHub Integration Foundation Suite', () => {
  beforeEach(() => {
    githubCache.invalidate();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Validators', () => {
    it('validates GitHub usernames correctly', () => {
      expect(isValidGitHubUsername('octocat')).toBe(true);
      expect(isValidGitHubUsername('sunilkumarkv')).toBe(true);
      expect(isValidGitHubUsername('valid-user')).toBe(true);
      expect(isValidGitHubUsername('invalid--username')).toBe(false);
      expect(isValidGitHubUsername('')).toBe(false);
      expect(isValidGitHubUsername('a'.repeat(40))).toBe(false);
    });

    it('validates GitHub repository names correctly', () => {
      expect(isValidGitHubRepository('owlreadme')).toBe(true);
      expect(isValidGitHubRepository('my-repo.js')).toBe(true);
      expect(isValidGitHubRepository('')).toBe(false);
    });

    it('validates raw GitHub content URLs correctly', () => {
      expect(isValidRawGitHubUrl('https://raw.githubusercontent.com/owner/repo/main/README.md')).toBe(true);
      expect(isValidRawGitHubUrl('https://malicious.com/raw')).toBe(false);
      expect(isValidRawGitHubUrl('http://raw.githubusercontent.com/owner/repo/main/README.md')).toBe(false);
    });
  });

  describe('GitHub Cache & Rate Limiter', () => {
    it('caches response data and invalidates on request', () => {
      const key = githubCache.generateKey('https://api.github.com/users/test');
      githubCache.set(key, { login: 'test' }, 5000);
      expect(githubCache.get(key)).toEqual({ login: 'test' });

      githubCache.invalidate(key);
      expect(githubCache.get(key)).toBeNull();
    });

    it('parses rate limit headers correctly', () => {
      const headers = new Headers();
      headers.set('x-ratelimit-limit', '5000');
      headers.set('x-ratelimit-remaining', '4999');
      headers.set('x-ratelimit-reset', '1700000000');

      const info = githubRateLimit.parseHeaders(headers);
      expect(info.limit).toBe(5000);
      expect(info.remaining).toBe(4999);
      expect(info.isExhausted).toBe(false);
    });
  });

  describe('GitHub Client Requests', () => {
    it('handles successful API request and caches response', async () => {
      const mockData = { login: 'octocat', name: 'The Octocat' };
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({
          'Content-Type': 'application/json',
          'x-ratelimit-limit': '60',
          'x-ratelimit-remaining': '59',
        }),
        json: async () => mockData,
      });

      vi.stubGlobal('fetch', mockFetch);

      const res = await githubClient.get('https://api.github.com/users/octocat');
      expect(res.success).toBe(true);
      expect(res.data).toEqual(mockData);
      expect(res.fromCache).toBe(false);

      // Subsequent call should hit cache
      const cachedRes = await githubClient.get('https://api.github.com/users/octocat');
      expect(cachedRes.fromCache).toBe(true);
      expect(cachedRes.data).toEqual(mockData);
    });

    it('handles 404 Not Found response cleanly', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        headers: new Headers(),
        json: async () => ({ message: 'Not Found' }),
      });

      vi.stubGlobal('fetch', mockFetch);

      const res = await githubClient.get('https://api.github.com/users/nonexistent-user-123456');
      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('NOT_FOUND');
    });
  });
});
