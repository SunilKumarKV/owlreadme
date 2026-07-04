import type { Theme } from '../../types';

export const portfolioTheme: Theme = {
  id: 'portfolio',
  name: 'Interactive Portfolio',
  description: 'Designed to display key repositories, social links, and skills cards like a personal showcase website.',
  author: 'OwlREADME Team',
  version: '1.0.0',
  supportedFeatures: ['header', 'about', 'socials', 'techStack', 'projects'],
  
  formatHeading: (level, text) => '#'.repeat(level) + ' ✨ ' + text,
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
  formatQuote: (text) => `> ✨ *${text}*`,
  
  projectCardLayout: 'modern',
  statisticsLayout: 'default',
  socialBadgeLayout: 'plastic',
  emojiUsage: true,
};

export default portfolioTheme;
