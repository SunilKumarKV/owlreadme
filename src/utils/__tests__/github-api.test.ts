import { describe, it, expect } from 'vitest';
import { validateGithubUsername } from '../github-api';

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
