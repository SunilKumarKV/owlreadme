import { describe, it, expect } from 'vitest';
import { analyzeRepositories } from '../repo-analyzer';
import type { GitHubRepo } from '../github-api';

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeRepo(overrides: Partial<GitHubRepo> = {}): GitHubRepo {
  return {
    name: 'my-repo',
    description: 'A test repo',
    html_url: 'https://github.com/user/my-repo',
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    fork: false,
    topics: [],
    updated_at: '2024-01-01T00:00:00Z',
    pushed_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('analyzeRepositories', () => {
  describe('basic aggregation', () => {
    it('returns zero totals for an empty repo list', () => {
      const result = analyzeRepositories([]);
      expect(result.totalStars).toBe(0);
      expect(result.totalForks).toBe(0);
      expect(result.languages).toHaveLength(0);
      expect(result.topStarred).toHaveLength(0);
      expect(result.topActive).toHaveLength(0);
    });

    it('sums stars and forks across own (non-fork) repos', () => {
      const repos = [
        makeRepo({ stargazers_count: 10, forks_count: 2 }),
        makeRepo({ stargazers_count: 5, forks_count: 1 }),
        makeRepo({ stargazers_count: 20, forks_count: 3, fork: true }), // excluded
      ];
      const result = analyzeRepositories(repos);
      expect(result.totalStars).toBe(15);
      expect(result.totalForks).toBe(3);
    });

    it('falls back to all repos when the user only has forks', () => {
      const forks = [
        makeRepo({ fork: true, stargazers_count: 8 }),
        makeRepo({ fork: true, stargazers_count: 4 }),
      ];
      const result = analyzeRepositories(forks);
      expect(result.totalStars).toBe(12);
    });
  });

  describe('language breakdown', () => {
    it('counts language occurrences and sorts by frequency', () => {
      const repos = [
        makeRepo({ language: 'TypeScript' }),
        makeRepo({ language: 'TypeScript' }),
        makeRepo({ language: 'Python' }),
      ];
      const result = analyzeRepositories(repos);
      expect(result.languages[0].name).toBe('TypeScript');
      expect(result.languages[0].count).toBe(2);
      expect(result.languages[1].name).toBe('Python');
      expect(result.languages[1].count).toBe(1);
    });

    it('ignores repos with no language', () => {
      const repos = [
        makeRepo({ language: null as unknown as string }),
        makeRepo({ language: undefined as unknown as string }),
        makeRepo({ language: 'Go' }),
      ];
      const result = analyzeRepositories(repos);
      expect(result.languages).toHaveLength(1);
      expect(result.languages[0].name).toBe('Go');
    });
  });

  describe('top starred repositories', () => {
    it('returns up to 5 repos sorted by star count descending', () => {
      const repos = Array.from({ length: 7 }, (_, i) =>
        makeRepo({ name: `repo-${i}`, stargazers_count: i * 10, description: `desc ${i}` })
      );
      const result = analyzeRepositories(repos);
      expect(result.topStarred).toHaveLength(5);
      expect(result.topStarred[0].stars).toBe(60);
      expect(result.topStarred[4].stars).toBe(20);
    });

    it('maps name, stars, description and url correctly', () => {
      const repos = [makeRepo({ name: 'hero-repo', stargazers_count: 42, description: 'awesome', html_url: 'https://github.com/user/hero-repo' })];
      const result = analyzeRepositories(repos);
      expect(result.topStarred[0]).toMatchObject({
        name: 'hero-repo',
        stars: 42,
        description: 'awesome',
        url: 'https://github.com/user/hero-repo',
      });
    });

    it('uses "No description provided." for repos with no description', () => {
      const repos = [makeRepo({ description: null as unknown as string })];
      const result = analyzeRepositories(repos);
      expect(result.topStarred[0].description).toBe('No description provided.');
    });
  });

  describe('top active repositories', () => {
    it('returns up to 5 repos sorted by pushed_at descending', () => {
      const repos = [
        makeRepo({ name: 'old', pushed_at: '2022-01-01T00:00:00Z' }),
        makeRepo({ name: 'newer', pushed_at: '2023-06-01T00:00:00Z' }),
        makeRepo({ name: 'newest', pushed_at: '2024-03-01T00:00:00Z' }),
      ];
      const result = analyzeRepositories(repos);
      expect(result.topActive[0].name).toBe('newest');
      expect(result.topActive[1].name).toBe('newer');
    });

    it('falls back to updated_at when pushed_at is absent', () => {
      const repos = [
        makeRepo({ name: 'a', pushed_at: undefined as unknown as string, updated_at: '2022-01-01T00:00:00Z' }),
        makeRepo({ name: 'b', pushed_at: undefined as unknown as string, updated_at: '2024-01-01T00:00:00Z' }),
      ];
      const result = analyzeRepositories(repos);
      expect(result.topActive[0].name).toBe('b');
    });
  });

  describe('skill and tech stack extraction', () => {
    it('maps known topics from SKILL_MAP to pretty names', () => {
      const repos = [makeRepo({ topics: ['react', 'typescript', 'docker'] })];
      const result = analyzeRepositories(repos);
      expect(result.suggestedSkills).toContain('React');
      expect(result.suggestedSkills).toContain('TypeScript');
      expect(result.suggestedSkills).toContain('Docker');
    });

    it('ignores topics not in SKILL_MAP', () => {
      const repos = [makeRepo({ topics: ['some-obscure-framework-xyz'] })];
      const result = analyzeRepositories(repos);
      expect(result.suggestedSkills).not.toContain('some-obscure-framework-xyz');
    });

    it('deduplicates skills from topics and languages', () => {
      const repos = [
        makeRepo({ language: 'TypeScript', topics: ['typescript'] }),
      ];
      const result = analyzeRepositories(repos);
      const tsCount = result.suggestedSkills.filter((s) => s === 'TypeScript').length;
      expect(tsCount).toBe(1);
    });

    it('caps suggestedSkills at 12 and suggestedTechStack at 10', () => {
      const repos = Array.from({ length: 20 }, (_, i) =>
        makeRepo({ language: `Lang${i}`, topics: [`topic${i}`] })
      );
      const result = analyzeRepositories(repos);
      expect(result.suggestedSkills.length).toBeLessThanOrEqual(12);
      expect(result.suggestedTechStack.length).toBeLessThanOrEqual(10);
    });

    it('includes language in tech stack fallback even if not in SKILL_MAP', () => {
      const repos = [makeRepo({ language: 'Brainfuck', topics: [] })];
      const result = analyzeRepositories(repos);
      // Language should still show up in techStack
      expect(result.suggestedTechStack).toContain('Brainfuck');
    });
  });

  describe('suggested README sections', () => {
    it('returns 3 suggested readme sections', () => {
      const repos = [makeRepo({ language: 'TypeScript', topics: ['react'] })];
      const result = analyzeRepositories(repos);
      expect(result.suggestedReadmeSections).toHaveLength(3);
    });

    it('includes featured contributions section with top starred links', () => {
      const repos = [makeRepo({ name: 'my-project', stargazers_count: 7, description: 'cool' })];
      const result = analyzeRepositories(repos);
      const featured = result.suggestedReadmeSections.find((s) => s.title.includes('Featured'));
      expect(featured?.content).toContain('my-project');
      expect(featured?.content).toContain('⭐ 7');
    });
  });
});
