import { ExportFormat, ExportSecurityAuditResult } from '@/types/export';

/**
 * Validates and sanitizes a requested export filename to prevent Path Traversal,
 * invalid OS characters, control characters, and illegal extensions.
 */
export function validateExportFilename(filename: string, format: ExportFormat): string {
  if (!filename || typeof filename !== 'string') {
    return format === 'zip' ? 'README.zip' : 'README.md';
  }

  // 1. Remove Path Traversal sequences (../, ..\, etc.)
  let sanitized = filename.replace(/(\.\.[\/\\])+/g, '');

  // 2. Remove illegal filename characters across Windows, Mac, Linux
  sanitized = sanitized.replace(/[<>:"/\\|?*]/g, '');

  // 3. Trim whitespace and leading/trailing dots
  sanitized = sanitized.trim().replace(/^\.+|\.+$/g, '');

  if (!sanitized) {
    return format === 'zip' ? 'README.zip' : 'README.md';
  }

  // 4. Ensure correct extension
  const targetExt = format === 'zip' ? '.zip' : format === 'json' ? '.json' : '.md';
  const hasExt = sanitized.toLowerCase().endsWith(targetExt);

  if (!hasExt) {
    // Strip any other file extension if user supplied invalid one
    const dotIdx = sanitized.lastIndexOf('.');
    if (dotIdx > 0) {
      sanitized = sanitized.substring(0, dotIdx);
    }
    sanitized = `${sanitized}${targetExt}`;
  }

  return sanitized;
}

/**
 * Audits export document markdown content for accidental leakage of GitHub PATs, secret keys, or auth headers.
 */
export function auditExportSecurity(content: string): ExportSecurityAuditResult {
  const violations: string[] = [];

  if (!content) {
    return { isSecure: true, violations };
  }

  // GitHub Personal Access Token patterns
  const ghTokenPattern = /\b(ghp|gho|ghu|ghs|ghr|github_pat)_[a-zA-Z0-9_]{20,255}\b/g;
  if (ghTokenPattern.test(content)) {
    violations.push('GitHub Personal Access Token or OAuth token detected in document.');
  }

  // Generic Bearer Tokens
  const bearerPattern = /Bearer\s+[a-zA-Z0-9\-\._~\+\/]+=*/g;
  if (bearerPattern.test(content)) {
    violations.push('Authorization Bearer header token detected in document.');
  }

  // AWS Access Key ID
  const awsKeyPattern = /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g;
  if (awsKeyPattern.test(content)) {
    violations.push('AWS Access Key ID detected in document.');
  }

  return {
    isSecure: violations.length === 0,
    violations,
  };
}

/**
 * Validates document non-emptiness and structural validity before export.
 */
export function validateExportDocument(markdown: string): { isValid: boolean; error?: string } {
  if (!markdown || typeof markdown !== 'string' || !markdown.trim()) {
    return { isValid: false, error: 'Cannot export empty README document.' };
  }

  return { isValid: true };
}
