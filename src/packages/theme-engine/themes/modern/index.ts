import type { Theme } from '../../types';

export const modernTheme: Theme = {
  id: 'modern',
  name: 'Sleek Modern',
  description: 'Sleek visual hierarchy with flat-square badge styling, custom card layouts, and subtle emojis.',
  author: 'OwlREADME Team',
  version: '1.0.0',
  supportedFeatures: ['header', 'about', 'socials', 'techStack', 'stats', 'achievements', 'projects'],
  
  formatHeading: (level, text) => '#'.repeat(level) + ' ✨ ' + text,
  formatSpacing: (newlines) => '\n'.repeat(newlines),
  formatSeparator: () => '***',
  badgeStyle: 'flat-square',
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
  socialBadgeLayout: 'flat-square',
  emojiUsage: true,
};

export default modernTheme;
