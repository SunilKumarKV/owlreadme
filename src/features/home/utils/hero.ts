export function isValidGitHubUsername(username: string): boolean {
  if (!username) return false;
  const clean = username.trim();
  const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  return githubUsernameRegex.test(clean);
}

export function formatHeroHeadline(prefix: string, highlight: string, suffix: string): string {
  return `${prefix} ${highlight} ${suffix}`.trim();
}
