/* eslint-disable @typescript-eslint/no-explicit-any */
import { READMEData, SectionOrderConfig } from '../types';
import { getSectionMetadata } from '../registry';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
  completionStatus?: number;
}

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

export const validateRequiredFields = (data: READMEData): ValidationResult => {
  const errors: string[] = [];

  if (!data.name?.trim()) errors.push('Developer name is required.');
  if (!data.role?.trim()) errors.push('Professional role/title is required.');
  if (!data.about?.trim()) errors.push('About section should not be empty.');

  return { valid: errors.length === 0, errors };
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

/**
 * Dynamically validates the README configurations by querying the Section Registry for validators.
 */
export const validateREADME = (data: READMEData): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let totalScore = 0;
  let scoreCount = 0;

  // 1. Run global section order check
  const orderCheckResult = validateSectionOrder(data.sections);
  errors.push(...orderCheckResult.errors);

  // 2. Dynamic Registry Validation
  if (data.sections && data.sections.order && data.sections.order.length > 0) {
    data.sections.order.forEach((sectionId) => {
      const sectionConfig = data.sections?.sections[sectionId];
      // Skip validation if the section is disabled
      if (sectionConfig && !sectionConfig.enabled) return;

      const entry = getSectionMetadata(sectionId);
      if (entry && entry.validator) {
        // Resolve target config object based on section ID
        let config: any = undefined;
        switch (sectionId) {
          case 'header':
            config = data.header;
            break;
          case 'about':
            config = { about: data.about, skills: data.skills };
            break;
          case 'socials':
            config = data.socialLinks;
            break;
          case 'techStack':
            config = data.techStack;
            break;
          case 'stats':
            config = data.githubStats;
            break;
          case 'achievements':
            config = data.achievements;
            break;
          case 'projects':
            config = data.featuredProjects;
            break;
          case 'support':
            config = data.support;
            break;
          case 'quotes':
            config = data.quotes;
            break;
          case 'visitor':
            config = data.standaloneVisitor;
            break;
          case 'custom':
            config = data.customMarkdown;
            break;
          case 'animatedComponents':
            config = data.animatedComponents;
            break;
          default:
            config = (data as any)[sectionId];
        }

        const sectionResult = entry.validator(config);
        errors.push(...sectionResult.errors);
        warnings.push(...sectionResult.warnings);
        if (sectionResult.completionStatus !== undefined) {
          totalScore += sectionResult.completionStatus;
          scoreCount++;
        }
      }
    });
  } else {
    // Legacy fallback validation when layout config is missing
    const fallbackResults = [
      validateRequiredFields(data),
      validateUrls(data),
      validateGithubUsername(data),
      validateMarkdownContent(data),
    ];
    fallbackResults.forEach((res) => {
      errors.push(...res.errors);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    completionStatus: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 100,
  };
};
