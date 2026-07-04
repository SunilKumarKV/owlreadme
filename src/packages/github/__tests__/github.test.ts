import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateGithubUsername,
  validateGithubRepoName,
  parseGithubRepositoryUrl,
} from '../index';
import { calculateLanguageAnalytics } from '../languages';

describe('GitHub Package Validators', () => {
  it('should validate usernames correctly', () => {
    expect(() => validateGithubUsername('octocat')).not.toThrow();
    expect(() => validateGithubUsername('-octocat')).toThrow();
    expect(() => validateGithubUsername('a'.repeat(40))).toThrow();
  });

  it('should validate repo names correctly', () => {
    expect(() => validateGithubRepoName('my-repo')).not.toThrow();
    expect(() => validateGithubRepoName('invalid space')).toThrow();
  });

  it('should parse repository URLs correctly', () => {
    const parsed = parseGithubRepositoryUrl('https://github.com/octocat/Hello-World');
    expect(parsed).toEqual({ owner: 'octocat', repo: 'Hello-World' });
  });
});

describe('Language Analytics', () => {
  it('should calculate percentages correctly', () => {
    const repos = [
      { name: 'r1', htmlUrl: '', description: '', stargazersCount: 0, forksCount: 0, watchersCount: 0, language: 'TypeScript', license: '', topics: [], archived: false, updatedAt: '', defaultBranch: '' },
      { name: 'r2', htmlUrl: '', description: '', stargazersCount: 0, forksCount: 0, watchersCount: 0, language: 'TypeScript', license: '', topics: [], archived: false, updatedAt: '', defaultBranch: '' },
      { name: 'r3', htmlUrl: '', description: '', stargazersCount: 0, forksCount: 0, watchersCount: 0, language: 'JavaScript', license: '', topics: [], archived: false, updatedAt: '', defaultBranch: '' },
    ];
    const stats = calculateLanguageAnalytics(repos);
    expect(stats[0]).toEqual({ name: 'TypeScript', repoCount: 2, percentage: 66.67 });
    expect(stats[1]).toEqual({ name: 'JavaScript', repoCount: 1, percentage: 33.33 });
  });
});
