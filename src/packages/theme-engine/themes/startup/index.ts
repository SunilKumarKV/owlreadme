import type { Theme } from '../../types';

export const startupTheme: Theme = {
  id: 'startup',
  name: 'SaaS Startup',
  description: 'Designed for high impact portfolios with custom badge styling, grid details, and structured tables.',
  author: 'OwlREADME Team',
  version: '1.0.0',
  supportedFeatures: ['header', 'about', 'socials', 'techStack', 'stats', 'projects'],
  
  formatHeading: (level, text) => '#'.repeat(level) + ' 🚀 ' + text,
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
  formatQuote: (text) => `> 🚀 **${text}**`,
  
  projectCardLayout: 'grid',
  statisticsLayout: 'default',
  socialBadgeLayout: 'for-the-badge',
  emojiUsage: true,
};

export default startupTheme;
