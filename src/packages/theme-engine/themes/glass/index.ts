import type { Theme } from '../../types';

export const glassTheme: Theme = {
  id: 'glass',
  name: 'Glassmorphic Soft',
  description: 'Soft margins, centered sections, plastic badge style, and detailed card components.',
  author: 'OwlREADME Team',
  version: '1.0.0',
  supportedFeatures: ['header', 'about', 'socials', 'techStack', 'stats', 'projects'],
  
  formatHeading: (level, text) => '#'.repeat(level) + ' 💎 ' + text,
  formatSpacing: (newlines) => '\n'.repeat(newlines),
  formatSeparator: () => '---',
  badgeStyle: 'plastic',
  formatCodeBlock: (lang, code) => `\`\`\`${lang}\n${code}\n\`\`\``,
  formatTable: (headers, rows) => {
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
    const bodyRows = rows.map((row) => `| ${row.join(' | ')} |`);
    return [headerRow, separatorRow, ...bodyRows].join('\n');
  },
  formatQuote: (text) => `> 💎 *${text}*`,
  
  projectCardLayout: 'modern',
  statisticsLayout: 'default',
  socialBadgeLayout: 'plastic',
  emojiUsage: true,
};

export default glassTheme;
