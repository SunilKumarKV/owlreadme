export interface Theme {
  id: string;
  name: string;
  description: string;
  previewImage?: string;
  author: string;
  version: string;
  supportedFeatures: string[];

  // Markdown element formatters (only controls layout rendering)
  formatHeading: (level: number, text: string) => string;
  formatSpacing: (newlines: number) => string;
  formatSeparator: () => string;
  badgeStyle: 'flat' | 'flat-square' | 'for-the-badge' | 'plastic';
  formatCodeBlock: (language: string, code: string) => string;
  formatTable: (headers: string[], rows: string[][]) => string;
  formatQuote: (text: string) => string;

  // Renderer presentation layout default mappings
  projectCardLayout: 'minimal' | 'modern' | 'compact' | 'grid' | 'gprm';
  statisticsLayout: 'default' | 'compact';
  socialBadgeLayout: 'flat' | 'flat-square' | 'for-the-badge' | 'plastic';
  emojiUsage: boolean;
}
