import type { Theme } from '../../types';

export const classicTheme: Theme = {
  id: 'classic',
  name: 'Classic Developer',
  description: 'The standard GitHub Profile aesthetic with clean headings, classic badges, and modern project cards.',
  author: 'OwlREADME Team',
  version: '1.0.0',
  supportedFeatures: ['header', 'about', 'socials', 'techStack', 'stats', 'achievements', 'projects'],
  
  formatHeading: (level, text) => '#'.repeat(level) + ' ' + text,
  formatSpacing: (newlines) => '\n'.repeat(newlines),
  formatSeparator: () => '---',
  badgeStyle: 'flat',
  formatCodeBlock: (lang, code) => `\`\`\`${lang}\n${code}\n\`\`\``,
  formatTable: (headers, rows) => {
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
    const bodyRows = rows.map((row) => `| ${row.join(' | ')} |`);
    return [headerRow, separatorRow, ...bodyRows].join('\n');
  },
  formatQuote: (text) => `> ${text.split('\n').join('\n> ')}`,
  
  projectCardLayout: 'modern',
  statisticsLayout: 'default',
  socialBadgeLayout: 'flat',
  emojiUsage: true,
};

export default classicTheme;
