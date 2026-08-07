export type ExportStateStatus =
  | 'idle'
  | 'preparing'
  | 'generating'
  | 'downloading'
  | 'success'
  | 'error'
  | 'cancelled';

export type ExportFormat = 'markdown' | 'zip' | 'json' | 'pdf';

export interface ExportOptions {
  filename?: string;
  format: ExportFormat;
  includeAssets?: boolean;
  documentTitle?: string;
  roadmapContent?: string;
  readmeData?: Record<string, unknown>;
  roadmapData?: Record<string, unknown>;
  theme?: string;
  htmlContent?: string;
}

export interface ExportResult {
  success: boolean;
  filename: string;
  format: ExportFormat;
  sizeBytes: number;
  error?: string;
  generatedAt: string;
}

export interface ExportState {
  status: ExportStateStatus;
  progressPct: number;
  error: string | null;
  result: ExportResult | null;
}

export interface ExportAsset {
  url: string;
  type: 'external' | 'generated' | 'github' | 'local';
  filename: string;
  isPackagable: boolean;
}

export interface ExportSecurityAuditResult {
  isSecure: boolean;
  violations: string[];
}
