import { validateHeadingHierarchy, sanitizeMarkdown } from '@/services/readme/markdown';

export interface ReadmeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedMarkdown: string;
}

export function validateGeneratedReadme(markdown: string): ReadmeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!markdown || !markdown.trim()) {
    errors.push('README content is empty.');
    return {
      isValid: false,
      errors,
      warnings,
      sanitizedMarkdown: '',
    };
  }

  const sanitized = sanitizeMarkdown(markdown);

  // Check heading hierarchy
  const hierarchyCheck = validateHeadingHierarchy(sanitized);
  warnings.push(...hierarchyCheck.warnings);

  // Check for unclosed HTML tags
  const openTags = (sanitized.match(/<[a-z1-6]+(?:\s+[^>]+)?>/gi) || []).length;
  const closeTags = (sanitized.match(/<\/[a-z1-6]+>/gi) || []).length;
  if (openTags !== closeTags) {
    warnings.push(`Unmatched HTML tags detected (${openTags} open, ${closeTags} closed).`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedMarkdown: sanitized,
  };
}
