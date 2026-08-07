import { validateExportFilename } from './exportValidation';
import { ExportFormat } from '@/types/export';

export function getSanitizedFilename(filename?: string, format: ExportFormat = 'markdown'): string {
  const defaultName = format === 'zip' ? 'README.zip' : 'README.md';
  return validateExportFilename(filename || defaultName, format);
}
