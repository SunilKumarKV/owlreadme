import type { Theme } from '../../types';

export const openSourceTheme: Theme = {
  id: 'open-source',
  name: 'Open Source Community',
  description: 'Clean templates utilizing social badges, flat style cards, and inline links for contributions.',
  author: 'OwlREADME Team',
  version: '1.0.0',
  supportedFeatures: ['header', 'about', 'socials', 'techStack', 'projects'],
  
  formatHeading: (level, text) => '#'.repeat(level) + ' 🤝 ' + text,
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
  formatQuote: (text) => `> 🤝 *${text}*`,
  
  projectCardLayout: 'gprm',
  statisticsLayout: 'default',
  socialBadgeLayout: 'flat',
  emojiUsage: true,
};

export default openSourceTheme;
