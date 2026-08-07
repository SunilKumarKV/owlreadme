/**
 /**
 * Normalizes line endings to standard Unix LF (\n).
 */
export function normalizeLineEndings(markdown: string): string {
  return markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Removes multiple consecutive blank lines, limiting to max 2 blank lines.
 */
export function normalizeSpacing(markdown: string): string {
  const normalized = normalizeLineEndings(markdown);
  return normalized.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Validates heading hierarchy in markdown string (e.g. no jumping from h1 to h4).
 */
export function validateHeadingHierarchy(markdown: string): { valid: boolean; warnings: string[] } {
  const lines = normalizeLineEndings(markdown).split('\n');
  const warnings: string[] = [];
  let previousLevel = 0;

  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+/);
    if (match) {
      const level = match[1].length;
      if (previousLevel > 0 && level > previousLevel + 1) {
        warnings.push(`Line ${index + 1}: Heading level jumped from h${previousLevel} to h${level}`);
      }
      previousLevel = level;
    }
  });

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

/**
 * Strips empty markdown blocks and trailing whitespace.
 */
export function sanitizeMarkdown(markdown: string): string {
  if (!markdown || !markdown.trim()) return '';
  const lines = normalizeLineEndings(markdown).split('\n');
  const sanitizedLines = lines.map((line) => line.trimEnd());
  return normalizeSpacing(sanitizedLines.join('\n'));
}
