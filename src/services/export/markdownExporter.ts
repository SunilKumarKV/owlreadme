import { downloadTextFile } from '@/utils/export-utils';
import { getSanitizedFilename } from './filename';
import { auditExportSecurity, validateExportDocument } from './exportValidation';
import { ExportResult } from '@/types/export';

export function exportMarkdownDocument(markdown: string, filename?: string): ExportResult {
  const validation = validateExportDocument(markdown);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid Markdown document.');
  }

  const securityAudit = auditExportSecurity(markdown);
  if (!securityAudit.isSecure) {
    throw new Error(`Security Audit Violation: ${securityAudit.violations.join(' ')}`);
  }

  const safeFilename = getSanitizedFilename(filename, 'markdown');

  // Normalize line endings to LF (\n)
  const normalizedContent = markdown.replace(/\r\n/g, '\n');

  downloadTextFile(safeFilename, normalizedContent);

  return {
    success: true,
    filename: safeFilename,
    format: 'markdown',
    sizeBytes: new Blob([normalizedContent]).size,
    generatedAt: new Date().toISOString(),
  };
}
