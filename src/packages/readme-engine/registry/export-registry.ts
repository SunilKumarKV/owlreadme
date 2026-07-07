/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy codebase types rely on explicit any, refactoring would require major architecture changes */
import { downloadTextFile, downloadZipPackage, downloadJsonBackup, exportToPdf } from '@/utils/export-utils';

export interface ExportContext {
  readmeContent: string;
  roadmapContent: string;
  readmeData: any;
  roadmapData: any;
  theme: string;
  title: string;
  htmlContent?: string;
  filename?: string;
}

export interface Exporter {
  id: string;
  name: string;
  export: (context: ExportContext) => Promise<void> | void;
}

const exporterMap = new Map<string, Exporter>();

/**
 * Registers an exporter format dynamically.
 */
export const registerExporter = (exporter: Exporter): void => {
  exporterMap.set(exporter.id, exporter);
};

/**
 * Unregisters an exporter format dynamically.
 */
export const unregisterExporter = (id: string): void => {
  exporterMap.delete(id);
};

/**
 * Resolves a registered exporter by its format ID.
 */
export const getExporter = (id: string): Exporter | undefined => {
  return exporterMap.get(id);
};

/**
 * Returns a list of all registered exporters.
 */
export const getExporters = (): readonly Exporter[] => {
  return Array.from(exporterMap.values());
};

/**
 * Executes a specific file export action.
 */
export const exportFile = async (id: string, context: ExportContext): Promise<void> => {
  const exporter = getExporter(id);
  if (!exporter) {
    throw new Error(`Exporter "${id}" is not registered in the pipeline.`);
  }
  await exporter.export(context);
};

// Register default built-in exporters
registerExporter({
  id: 'markdown',
  name: 'Markdown',
  export: (ctx) => {
    downloadTextFile(ctx.filename || 'README.md', ctx.readmeContent);
  },
});

registerExporter({
  id: 'zip',
  name: 'ZIP Package',
  export: async (ctx) => {
    await downloadZipPackage(ctx.readmeContent, ctx.roadmapContent, ctx.filename);
  },
});

registerExporter({
  id: 'json',
  name: 'JSON Backup',
  export: (ctx) => {
    downloadJsonBackup(ctx.readmeData, ctx.roadmapData, ctx.filename);
  },
});

registerExporter({
  id: 'pdf',
  name: 'PDF Document',
  export: (ctx) => {
    if (!ctx.htmlContent) {
      throw new Error('HTML content is required for PDF export');
    }
    exportToPdf(ctx.htmlContent, ctx.theme, ctx.title);
  },
});
