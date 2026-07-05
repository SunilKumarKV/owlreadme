/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  validateGithubUsername,
  parseGithubRepositoryUrl,
  fetchGithubReadmeFromRawUrl,
} from '../github-api';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('validateGithubUsername', () => {
  it('should not throw for valid github usernames', () => {
    expect(() => validateGithubUsername('octocat')).not.toThrow();
    expect(() => validateGithubUsername('a-b-c')).not.toThrow();
    expect(() => validateGithubUsername('123-abc')).not.toThrow();
    expect(() => validateGithubUsername('a')).not.toThrow();
    expect(() => validateGithubUsername('a'.repeat(39))).not.toThrow();
  });

  it('should throw for empty or non-string inputs', () => {
    expect(() => validateGithubUsername('')).toThrow('Please enter a GitHub username.');
    expect(() => validateGithubUsername('   ')).toThrow('Please enter a GitHub username.');
    expect(() => (validateGithubUsername as any)()).toThrow('Please enter a GitHub username.');
  });

  it('should throw for usernames longer than 39 characters', () => {
    expect(() => validateGithubUsername('a'.repeat(40))).toThrow('GitHub usernames can be at most 39 characters');
  });

  it('should throw for invalid characters', () => {
    expect(() => validateGithubUsername('octo_cat')).toThrow('Usernames can only contain letters, numbers, and hyphens.');
    expect(() => validateGithubUsername('octo.cat')).toThrow('Usernames can only contain letters, numbers, and hyphens.');
    expect(() => validateGithubUsername('octo cat')).toThrow('Usernames can only contain letters, numbers, and hyphens.');
  });

  it('should throw for leading or trailing hyphens', () => {
    expect(() => validateGithubUsername('-octocat')).toThrow('Usernames cannot start or end with a hyphen.');
    expect(() => validateGithubUsername('octocat-')).toThrow('Usernames cannot start or end with a hyphen.');
  });

  it('should throw for consecutive hyphens', () => {
    expect(() => validateGithubUsername('octo--cat')).toThrow('Usernames cannot contain consecutive hyphens.');
  });
});

describe('parseGithubRepositoryUrl', () => {
  it('should parse valid GitHub repo URLs', () => {
    expect(parseGithubRepositoryUrl('https://github.com/octocat/hello-world')).toEqual({
      owner: 'octocat',
      repo: 'hello-world',
    });
    expect(parseGithubRepositoryUrl('github.com/octocat/hello-world')).toEqual({
      owner: 'octocat',
      repo: 'hello-world',
    });
    expect(parseGithubRepositoryUrl('https://www.github.com/octocat/hello-world.git')).toEqual({
      owner: 'octocat',
      repo: 'hello-world',
    });
  });

  it('should throw for invalid repo URLs', () => {
    expect(() => parseGithubRepositoryUrl('https://example.com/octocat/hello-world')).toThrow(
      'Invalid GitHub repository URL format. Expected https://github.com/owner/repo'
    );
    expect(() => parseGithubRepositoryUrl('')).toThrow('Please enter a valid GitHub repository URL.');
  });
});

describe('fetchGithubReadmeFromRawUrl', () => {
  it('should fetch raw markdown content from a URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: async () => '# README' });
    global.fetch = mockFetch as any;
    const result = await fetchGithubReadmeFromRawUrl('https://raw.githubusercontent.com/octocat/hello-world/main/README.md');
    expect(result).toBe('# README');
    expect(mockFetch).toHaveBeenCalledWith('https://raw.githubusercontent.com/octocat/hello-world/main/README.md');
  });

  it('should throw when the raw URL is invalid', async () => {
    await expect(fetchGithubReadmeFromRawUrl('not-a-url')).rejects.toThrow(
      'Please enter a valid raw URL starting with https:// or http://.'
    );
  });
});
