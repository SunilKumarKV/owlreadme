export type ReadmeSectionKey =
  | 'header'
  | 'about'
  | 'socials'
  | 'techStack'
  | 'stats'
  | 'projects'
  | 'achievements'
  | 'support'
  | 'quotes'
  | 'visitor'
  | 'custom';

export interface ReadmeSectionMeta {
  key: ReadmeSectionKey;
  label: string;
  defaultOrder: number;
}

export const README_SECTIONS_META: ReadmeSectionMeta[] = [
  { key: 'header', label: 'Header & Title', defaultOrder: 1 },
  { key: 'about', label: 'About & Bio', defaultOrder: 2 },
  { key: 'socials', label: 'Social Networks', defaultOrder: 3 },
  { key: 'techStack', label: 'Tech Stack & Badges', defaultOrder: 4 },
  { key: 'stats', label: 'GitHub Activity Stats', defaultOrder: 5 },
  { key: 'projects', label: 'Featured Repositories', defaultOrder: 6 },
  { key: 'achievements', label: 'Trophies & Badges', defaultOrder: 7 },
  { key: 'support', label: 'Support & Sponsors', defaultOrder: 8 },
];
