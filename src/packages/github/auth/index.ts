let githubToken: string | null = null;

/**
 * Stores the GitHub personal access token in-memory.
 */
export function setGithubToken(token: string | null): void {
  githubToken = token ? token.trim() : null;
}

/**
 * Gets the currently stored GitHub token.
 */
export function getGithubToken(): string | null {
  return githubToken;
}

/**
 * Generates authorization headers if a token is present.
 */
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }
  return headers;
}
