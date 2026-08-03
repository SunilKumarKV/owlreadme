import { DEFAULT_PREVIEW_FILENAME } from '../constants/preview';

export function formatFileName(name?: string): string {
  if (!name || !name.trim()) return DEFAULT_PREVIEW_FILENAME;
  const clean = name.trim();
  return clean.endsWith('.md') ? clean : `${clean}.md`;
}
