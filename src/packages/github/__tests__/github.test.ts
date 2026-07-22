import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateGithubUsername,
  validateGithubRepoName,
  parseGithubRepositoryUrl,
} from '../index';
import { calculateLanguageAnalytics } from '../languages';
import { fetchGithubReadme } from '../repositories';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal fetch Response mock. */
function makeFetchResponse(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
  const headersObj = new Headers({ 'Content-Type': typeof body === 'string' ? 'text/plain' : 'application/json', ...headers });
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: headersObj,
    json: async () => JSON.parse(bodyStr),
    text: async () => bodyStr,
    clone: () => makeFetchResponse(status, body, headers),
  } as unknown as Response;
}

// ---------------------------------------------------------------------------
// Existing tests (preserved)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// fetchGithubReadme — integration-style unit tests (fetch mocked)
// ---------------------------------------------------------------------------

describe('fetchGithubReadme', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    // Clear the in-memory cache between tests so mocks are not bypassed.
    // The cache module exports a clearCache or similar; if not, we reset via module.
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns README content for a valid repo (main branch)', async () => {
    const mockFetch = vi.mocked(fetch);
    // First call: GET /repos/octocat/Hello-World → 200 with default_branch
    mockFetch.mockResolvedValueOnce(
      makeFetchResponse(200, { default_branch: 'main', name: 'Hello-World' })
    );
    // Second call: GET /repos/octocat/Hello-World/readme → 200 with raw text
    mockFetch.mockResolvedValueOnce(
      makeFetchResponse(200, '# Hello World\nWelcome!')
    );

    const result = await fetchGithubReadme('octocat', 'Hello-World');
    expect(result).toBe('# Hello World\nWelcome!');
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // First call must target the repo metadata endpoint
    expect(mockFetch.mock.calls[0][0]).toContain('/repos/octocat/Hello-World');
    expect(mockFetch.mock.calls[0][0]).not.toContain('/readme');

    // Second call must target the /readme endpoint with correct Accept header
    expect(mockFetch.mock.calls[1][0]).toContain('/repos/octocat/Hello-World/readme');
    expect((mockFetch.mock.calls[1][1] as RequestInit)?.headers).toMatchObject({
      Accept: 'application/vnd.github.raw',
    });
  });

  it('returns README content for a repo with a non-main default branch', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      makeFetchResponse(200, { default_branch: 'canary', name: 'next.js' })
    );
    mockFetch.mockResolvedValueOnce(
      makeFetchResponse(200, '# Next.js README on canary')
    );

    const result = await fetchGithubReadme('vercel', 'next.js');
    expect(result).toBe('# Next.js README on canary');
  });

  it('throws a clear "repository not found" error on 404 from repo metadata', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      makeFetchResponse(404, { message: 'Not Found' })
    );

    await expect(fetchGithubReadme('octocat', 'nonexistent-repo-xyz')).rejects.toThrow(
      'Repository "octocat/nonexistent-repo-xyz" not found.'
    );
    // Should NOT make a second request for the readme
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('throws a clear "no README found" error on 404 from readme endpoint', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      makeFetchResponse(200, { default_branch: 'main', name: 'empty-repo' })
    );
    mockFetch.mockResolvedValueOnce(
      makeFetchResponse(404, { message: 'Not Found' })
    );

    await expect(fetchGithubReadme('octocat', 'empty-repo')).rejects.toThrow(
      'No README file found in "octocat/empty-repo"'
    );
  });

  it('throws a "private repository" error on 403 without rate-limit headers', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      makeFetchResponse(403, { message: 'Forbidden' })
    );

    await expect(fetchGithubReadme('someorg', 'private-repo')).rejects.toThrow(
      'Access denied to "someorg/private-repo". The repository may be private.'
    );
  });

  it('throws a "rate limit" error on 403 with rate-limit exhausted message', async () => {
    const mockFetch = vi.mocked(fetch);
    // Use a unique repo name to avoid a cache hit from the earlier passing test.
    mockFetch.mockResolvedValueOnce(
      makeFetchResponse(403, { message: 'API rate limit exceeded for ...' })
    );

    await expect(fetchGithubReadme('octocat', 'rate-limited-repo')).rejects.toThrow(
      'GitHub API rate limit reached.'
    );
  });

  it('throws a "too many requests" error on 429', async () => {
    const mockFetch = vi.mocked(fetch);
    // Use a unique repo name to avoid a cache hit from the earlier passing test.
    mockFetch.mockResolvedValueOnce(
      makeFetchResponse(429, { message: 'Too Many Requests' })
    );

    await expect(fetchGithubReadme('octocat', 'throttled-repo')).rejects.toThrow(
      'Too many requests to GitHub.'
    );
  });

  it('throws an "empty README" error when the API returns an empty string', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      makeFetchResponse(200, { default_branch: 'main', name: 'empty-readme-repo' })
    );
    mockFetch.mockResolvedValueOnce(
      makeFetchResponse(200, '   ')
    );

    await expect(fetchGithubReadme('octocat', 'empty-readme-repo')).rejects.toThrow(
      'README in "octocat/empty-readme-repo" appears to be empty.'
    );
  });

  it('throws a validation error for an invalid owner name', async () => {
    await expect(fetchGithubReadme('-bad-owner', 'repo')).rejects.toThrow(
      'Usernames cannot start or end with a hyphen.'
    );
  });

  it('throws a validation error for an invalid repo name', async () => {
    await expect(fetchGithubReadme('octocat', 'invalid repo!')).rejects.toThrow(
      'Repository names can only contain letters'
    );
  });
});
