import { generateQuotesMarkdown } from '../../../readme-engine/sections';
import type { READMEComponent } from '../../types';

export const QuoteComponent: READMEComponent = {
  metadata: {
    id: 'Quote',
    name: 'Daily Quote',
    category: 'Content',
    icon: 'MessageSquare',
    description: 'Dynamic programming quotes badge that updates daily.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config) => generateQuotesMarkdown(config),
  defaultConfig: {
    enabled: true,
    theme: 'radical',
    quoteType: 'programming',
  },
};

export default QuoteComponent;
