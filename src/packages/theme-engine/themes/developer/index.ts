import type { Theme } from '../../types';

export const developerTheme: Theme = {
  id: 'developer',
  name: 'Terminal/Developer',
  description: 'Designed for developers who love dark mode, clean square badges, and monospace coding elements.',
  author: 'OwlREADME Team',
  version: '1.0.0',
  supportedFeatures: ['header', 'about', 'socials', 'techStack', 'stats', 'achievements', 'projects'],
  
  formatHeading: (level, text) => '#'.repeat(level) + ' 💻 ' + text,
  formatSpacing: (newlines) => '\n'.repeat(newlines),
  formatSeparator: () => '<!-- -->\n---',
  badgeStyle: 'flat-square',
  formatCodeBlock: (lang, code) => `\`\`\`${lang}\n${code}\n\`\`\``,
  formatTable: (headers, rows) => {
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
    const bodyRows = rows.map((row) => `| ${row.join(' | ')} |`);
    return [headerRow, separatorRow, ...bodyRows].join('\n');
  },
  formatQuote: (text) => `\`\`\`text\n${text}\n\`\`\``,
  
  projectCardLayout: 'modern',
  statisticsLayout: 'compact',
  socialBadgeLayout: 'flat-square',
  emojiUsage: true,
};

export default developerTheme;
