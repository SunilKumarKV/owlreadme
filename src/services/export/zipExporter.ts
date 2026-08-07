import { downloadZipPackage } from '@/utils/export-utils';
import { getSanitizedFilename } from './filename';
import { auditExportSecurity, validateExportDocument } from './exportValidation';
import { ExportResult } from '@/types/export';

export async function exportZipPackage(
  readmeContent: string,
  roadmapContent: string = '',
  filename?: string
): Promise<ExportResult> {
  const validation = validateExportDocument(readmeContent);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid Markdown document for ZIP export.');
  }

  const securityAudit = auditExportSecurity(readmeContent);
  if (!securityAudit.isSecure) {
    throw new Error(`Security Audit Violation: ${securityAudit.violations.join(' ')}`);
  }

  const safeFilename = getSanitizedFilename(filename, 'zip');
  const normalizedReadme = readmeContent.replace(/\r\n/g, '\n');
  const normalizedRoadmap = roadmapContent ? roadmapContent.replace(/\r\n/g, '\n') : '';

  await downloadZipPackage(normalizedReadme, normalizedRoadmap, safeFilename);

  return {
    success: true,
    filename: safeFilename,
    format: 'zip',
    sizeBytes: new Blob([normalizedReadme, normalizedRoadmap]).size,
    generatedAt: new Date().toISOString(),
  };
}
