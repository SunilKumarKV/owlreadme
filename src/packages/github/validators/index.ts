export function validateGithubUsername(username: string): void {
  if (!username || typeof username !== 'string') {
    throw new Error('Please enter a GitHub username.');
  }

  const trimmed = username.trim();

  if (trimmed.length === 0) {
    throw new Error('Please enter a GitHub username.');
  }

  if (trimmed.length > 39) {
    throw new Error(
      `GitHub usernames can be at most 39 characters. "${trimmed}" is ${trimmed.length} characters.`
    );
  }

  if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) {
    throw new Error(
      `Invalid GitHub username "${trimmed}". Usernames can only contain letters, numbers, and hyphens.`
    );
  }

  if (trimmed.startsWith('-') || trimmed.endsWith('-')) {
    throw new Error(
      `Invalid GitHub username "${trimmed}". Usernames cannot start or end with a hyphen.`
    );
  }

  if (/--/.test(trimmed)) {
    throw new Error(
      `Invalid GitHub username "${trimmed}". Usernames cannot contain consecutive hyphens.`
    );
  }
}

export function validateGithubRepoName(repo: string): void {
  if (!repo || typeof repo !== 'string') {
    throw new Error('Invalid GitHub repository name. Please provide a valid repository name.');
  }

  const cleaned = repo.trim().replace(/\.git$/, '');

  if (cleaned.length === 0) {
    throw new Error('Invalid GitHub repository name. Please provide a valid repository name.');
  }

  if (!/^[A-Za-z0-9_.-]+$/.test(cleaned)) {
    throw new Error(
      `Invalid repository name "${repo}". Repository names can only contain letters, numbers, hyphens, underscores, and periods.`
    );
  }
}
