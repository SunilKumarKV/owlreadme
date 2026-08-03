import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateGitHubUsername, normalizeUsername, parseGitHubError } from '../utils/github';
import { GitHubService } from '../services/githubService';

describe('GitHub Feature Module', () => {
  describe('utils/github', () => {
    it('normalizes username by trimming whitespace and removing leading @', () => {
      expect(normalizeUsername('  @octocat  ')).toBe('octocat');
      expect(normalizeUsername('torvalds')).toBe('torvalds');
      expect(normalizeUsername('')).toBe('');
    });

    it('validates correct GitHub usernames', () => {
      expect(validateGitHubUsername('octocat').valid).toBe(true);
      expect(validateGitHubUsername('sunil-kumar').valid).toBe(true);
      expect(validateGitHubUsername('torvalds').valid).toBe(true);
    });

    it('rejects invalid GitHub usernames', () => {
      expect(validateGitHubUsername('').valid).toBe(false);
      expect(validateGitHubUsername('a'.repeat(40)).valid).toBe(false);
      expect(validateGitHubUsername('-start').valid).toBe(false);
      expect(validateGitHubUsername('invalid_underscore').valid).toBe(false);
    });

    it('parses errors correctly', () => {
      const parsed = parseGitHubError(new Error('Network error'));
      expect(parsed.type).toBe('UNKNOWN');
      expect(parsed.message).toBe('Network error');
    });
  });

  describe('services/githubService', () => {
    let service: GitHubService;

    beforeEach(() => {
      service = new GitHubService();
      vi.restoreAllMocks();
    });

    it('rejects invalid username before making API request', async () => {
      await expect(service.fetchProfile('invalid_user!')).rejects.toMatchObject({
        type: 'INVALID_USERNAME',
      });
    });
  });
});
