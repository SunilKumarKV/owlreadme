import type { Theme } from '../../types';

export const professionalTheme: Theme = {
  id: 'professional',
  name: 'Executive Business',
  description: 'Formal Executive theme utilizing high-contrast, larger badges, table listings, and clean lines.',
  author: 'OwlREADME Team',
  version: '1.0.0',
  supportedFeatures: ['header', 'about', 'socials', 'techStack', 'stats', 'projects'],
  
  formatHeading: (level, text) => '#'.repeat(level) + ' ' + text,
  formatSpacing: (newlines) => '\n'.repeat(newlines),
  formatSeparator: () => '---',
  badgeStyle: 'for-the-badge',
  formatCodeBlock: (lang, code) => `\`\`\`${lang}\n${code}\n\`\`\``,
  formatTable: (headers, rows) => {
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
    const bodyRows = rows.map((row) => `| ${row.join(' | ')} |`);
    return [headerRow, separatorRow, ...bodyRows].join('\n');
  },
  formatQuote: (text) => `> **PROFESSIONAL OUTLINE**\n> ${text.split('\n').join('\n> ')}`,
  
  projectCardLayout: 'compact',
  statisticsLayout: 'default',
  socialBadgeLayout: 'for-the-badge',
  emojiUsage: false,
};

export default professionalTheme;
