import type { Theme } from '../../types';

export const minimalTheme: Theme = {
  id: 'minimal',
  name: 'Minimalist Clean',
  description: 'Ultra-clean markdown layout focusing strictly on raw content without emojis, banners, or heavy formatting.',
  author: 'OwlREADME Team',
  version: '1.0.0',
  supportedFeatures: ['header', 'about', 'socials', 'techStack', 'projects'],
  
  formatHeading: (level, text) => '#'.repeat(level) + ' ' + text,
  formatSpacing: (newlines) => '\n'.repeat(newlines),
  formatSeparator: () => '\n',
  badgeStyle: 'flat',
  formatCodeBlock: (lang, code) => `\`\`\`${lang}\n${code}\n\`\`\``,
  formatTable: (headers, rows) => {
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
    const bodyRows = rows.map((row) => `| ${row.join(' | ')} |`);
    return [headerRow, separatorRow, ...bodyRows].join('\n');
  },
  formatQuote: (text) => `*${text}*`,
  
  projectCardLayout: 'minimal',
  statisticsLayout: 'compact',
  socialBadgeLayout: 'flat',
  emojiUsage: false,
};

export default minimalTheme;
