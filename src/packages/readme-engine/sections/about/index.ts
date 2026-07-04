import { heading } from '../../utils/markdown-helpers';

export const renderAbout = (about?: string, skills?: string): string => {
  return [
    about ? about : '',
    skills ? `${heading(3, 'Skills')}\n${skills}` : '',
  ].filter(Boolean).join('\n\n');
};
