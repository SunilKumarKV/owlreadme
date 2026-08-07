import { ExportOptions, ExportResult } from '@/types/export';
import { exportMarkdownDocument } from './markdownExporter';
import { exportZipPackage } from './zipExporter';
import { downloadJsonBackup, exportToPdf } from '@/utils/export-utils';
import { getSanitizedFilename } from './filename';

export class ExportService {
  /**
   * Central entrypoint for executing exports from the normalized README document.
   */
  public async export(markdown: string, options: ExportOptions): Promise<ExportResult> {
    const format = options.format || 'markdown';

    switch (format) {
      case 'markdown':
        return exportMarkdownDocument(markdown, options.filename);

      case 'zip':
        return exportZipPackage(markdown, options.roadmapContent || '', options.filename);

      case 'json': {
        const safeName = getSanitizedFilename(options.filename, 'json');
        downloadJsonBackup(options.readmeData || {}, options.roadmapData || {}, safeName);
        return {
          success: true,
          filename: safeName,
          format: 'json',
          sizeBytes: new Blob([JSON.stringify(options.readmeData || {})]).size,
          generatedAt: new Date().toISOString(),
        };
      }

      case 'pdf': {
        if (!options.htmlContent) {
          throw new Error('HTML preview content is required for PDF export.');
        }
        exportToPdf(options.htmlContent, options.theme || 'dark', options.documentTitle || 'README.md');
        return {
          success: true,
          filename: 'README.pdf',
          format: 'pdf',
          sizeBytes: 0,
          generatedAt: new Date().toISOString(),
        };
      }

      default:
        throw new Error(`Unsupported export format: "${format}"`);
    }
  }
}

export const exportService = new ExportService();
export default exportService;
