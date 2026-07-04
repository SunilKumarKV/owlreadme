import type { Theme } from '../../types';

export const terminalTheme: Theme = {
  id: 'terminal',
  name: 'Console Terminal',
  description: 'Monospace, retro-style terminal emulator formatting with high contrast layout markers.',
  author: 'OwlREADME Team',
  version: '1.0.0',
  supportedFeatures: ['header', 'about', 'socials', 'techStack', 'projects'],
  
  formatHeading: (level, text) => '#'.repeat(level) + ' $ ' + text,
  formatSpacing: (newlines) => '\n'.repeat(newlines),
  formatSeparator: () => '==================================================',
  badgeStyle: 'flat',
  formatCodeBlock: (lang, code) => `\`\`\`${lang}\n${code}\n\`\`\``,
  formatTable: (headers, rows) => {
    const divider = '+-' + headers.map((h) => '-'.repeat(h.length)).join('-+-') + '-+';
    const headerRow = '| ' + headers.join(' | ') + ' |';
    const bodyRows = rows.map((row) => '| ' + row.join(' | ') + ' |');
    return [divider, headerRow, divider, ...bodyRows, divider].join('\n');
  },
  formatQuote: (text) => `\`\`\`text\n[QUOTE]\n${text}\n\`\`\``,
  
  projectCardLayout: 'compact',
  statisticsLayout: 'compact',
  socialBadgeLayout: 'flat',
  emojiUsage: false,
};

export default terminalTheme;
