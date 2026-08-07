/**
 * Wraps text in an HTML align tag block.
 */
export function formatAlignedBlock(content: string, align: 'center' | 'left' | 'right' = 'center'): string {
  if (!content || !content.trim()) return '';
  return `<p align="${align}">\n${content.trim()}\n</p>`;
}

/**
 * Formats a badge markdown image.
 */
export function formatBadge(label: string, value: string, color = 'blue', logo?: string): string {
  const encodedLabel = encodeURIComponent(label);
  const encodedValue = encodeURIComponent(value);
  const logoParam = logo ? `&logo=${encodeURIComponent(logo)}` : '';
  return `![${label}](https://img.shields.io/badge/${encodedLabel}-${encodedValue}-${color}?style=for-the-badge${logoParam}&logoColor=white)`;
}

/**
 * Formats an array of items into bullet points.
 */
export function formatBulletList(items: string[]): string {
  const validItems = items.filter((item) => item && item.trim());
  if (validItems.length === 0) return '';
  return validItems.map((item) => `- ${item.trim()}`).join('\n');
}

/**
 * Formats code snippet block.
 */
export function formatCodeBlock(code: string, language = ''): string {
  if (!code || !code.trim()) return '';
  return `\`\`\`${language}\n${code.trim()}\n\`\`\``;
}
