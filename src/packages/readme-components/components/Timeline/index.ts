/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import type { READMEComponent } from '../../types';

export const TimelineComponent: READMEComponent = {
  metadata: {
    id: 'Timeline',
    name: 'Career Timeline',
    category: 'Career',
    icon: 'Milestone',
    description: 'Chronological timeline mapping out your work history, education milestones, or achievements.',
    author: 'OwlREADME Team',
    version: '2.0.0',
  },
  renderer: (config) => {
    if (!config || !config.enabled || !config.milestones || config.milestones.length === 0) return '';
    const lines = ['## 📅 Career Timeline', ''];
    config.milestones.forEach((m: any) => {
      if (!m.year || !m.title) return;
      const company = m.company ? ` @ **${m.company}**` : '';
      const desc = m.description ? ` - *${m.description}*` : '';
      lines.push(`- **${m.year}**: ${m.title}${company}${desc}`);
    });
    return lines.join('\n');
  },
  defaultConfig: {
    enabled: true,
    milestones: [],
  },
};

export default TimelineComponent;
