import { READMEData, SectionOrderConfig } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateRequiredFields = (data: READMEData): ValidationResult => {
  const errors: string[] = [];

  if (!data.name?.trim()) errors.push('Developer name is required.');
  if (!data.role?.trim()) errors.push('Professional role/title is required.');
  if (!data.about?.trim()) errors.push('About section should not be empty.');

  return { valid: errors.length === 0, errors };
};

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidGithubUsername = (value: string) => {
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(value);
};

export const validateSectionOrder = (sections?: SectionOrderConfig): ValidationResult => {
  const errors: string[] = [];
  if (!sections) {
    return { valid: true, errors };
  }

  const seen = new Set<string>();
  const duplicates = sections.order.filter((id) => {
    if (seen.has(id)) return true;
    seen.add(id);
    return false;
  });

  if (duplicates.length > 0) {
    errors.push(`Duplicate sections detected: ${[...new Set(duplicates)].join(', ')}`);
  }

  if (sections.order.length === 0) {
    errors.push('README must include at least one ordered section.');
  }

  return { valid: errors.length === 0, errors };
};

export const validateUrls = (data: READMEData): ValidationResult => {
  const errors: string[] = [];

  if (data.avatarUrl && !isValidUrl(data.avatarUrl)) {
    errors.push('Avatar URL is invalid.');
  }

  if (data.featuredProjects?.projects) {
    data.featuredProjects.projects.forEach((project) => {
      if (project.repoUrl && !isValidUrl(project.repoUrl)) {
        errors.push(`Project URL invalid for ${project.repoName || project.title || project.id}.`);
      }
      if (project.demoUrl && !isValidUrl(project.demoUrl)) {
        errors.push(`Project demo URL invalid for ${project.repoName || project.title || project.id}.`);
      }
    });
  }

  if (data.socialLinks?.platforms) {
    Object.entries(data.socialLinks.platforms).forEach(([platformId, platformConfig]) => {
      if (platformConfig.enabled && platformConfig.value) {
        const value = platformConfig.value.trim();
        if (value.startsWith('http')) {
          if (!isValidUrl(value)) {
            errors.push(`Social link URL invalid for ${platformId}.`);
          }
        }
      }
    });
  }

  return { valid: errors.length === 0, errors };
};

export const validateGithubUsername = (data: READMEData): ValidationResult => {
  const errors: string[] = [];
  if (data.githubStats?.enabled && data.githubStats.username && !isValidGithubUsername(data.githubStats.username)) {
    errors.push('GitHub username is invalid.');
  }
  return { valid: errors.length === 0, errors };
};

export const validateMarkdownContent = (data: READMEData): ValidationResult => {
  const errors: string[] = [];
  if (data.customMarkdown?.enabled && data.customMarkdown.content) {
    if (data.customMarkdown.content.trim().length === 0) {
      errors.push('Custom markdown is enabled but empty.');
    }
  }
  return { valid: errors.length === 0, errors };
};

export const validateREADME = (data: READMEData): ValidationResult => {
  const validators: Array<(data: READMEData) => ValidationResult> = [
    validateRequiredFields,
    (data) => validateSectionOrder(data.sections),
    validateUrls,
    validateGithubUsername,
    validateMarkdownContent,
  ];

  const errors = validators.flatMap((validate) => validate(data).errors);
  return { valid: errors.length === 0, errors };
};
