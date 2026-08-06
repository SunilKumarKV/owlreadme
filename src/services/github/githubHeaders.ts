import { GITHUB_CONFIG } from '../../lib/github/constants';

export function buildGitHubHeaders(
  customToken?: string,
  extraHeaders?: Record<string, string>
): Record<string, string> {
  const token = customToken || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN : undefined);

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': GITHUB_CONFIG.userAgent,
    'X-GitHub-Api-Version': GITHUB_CONFIG.apiVersion,
    ...extraHeaders,
  };

  if (token && token.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  return headers;
}
