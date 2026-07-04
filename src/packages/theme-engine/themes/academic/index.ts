import type { Theme } from '../../types';

export const academicTheme: Theme = {
  id: 'academic',
  name: 'Academic Portfolio',
  description: 'Strict, plain, and highly organized layout style suitable for researchers and academics.',
  author: 'OwlREADME Team',
  version: '1.0.0',
  supportedFeatures: ['header', 'about', 'socials', 'projects'],
  
  formatHeading: (level, text) => '#'.repeat(level) + ' ' + text,
  formatSpacing: (newlines) => '\n'.repeat(newlines),
  formatSeparator: () => '---',
  badgeStyle: 'flat-square',
  formatCodeBlock: (lang, code) => `\`\`\`${lang}\n${code}\n\`\`\``,
  formatTable: (headers, rows) => {
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
    const bodyRows = rows.map((row) => `| ${row.join(' | ')} |`);
    return [headerRow, separatorRow, ...bodyRows].join('\n');
  },
  formatQuote: (text) => `> *${text}*`,
  
  projectCardLayout: 'minimal',
  statisticsLayout: 'compact',
  socialBadgeLayout: 'flat-square',
  emojiUsage: false,
};

export default academicTheme;
