import { describe, it, expect } from 'vitest';
import { validateExportFilename, auditExportSecurity, validateExportDocument } from '../exportValidation';

describe('Export Validation & Security Suite', () => {
  describe('Filename Sanitization', () => {
    it('sanitizes path traversal attempts', () => {
      const result = validateExportFilename('../../etc/passwd', 'markdown');
      expect(result).toBe('etcpasswd.md');
      expect(result).not.toContain('..');
      expect(result).not.toContain('/');
    });

    it('enforces correct extension for zip export', () => {
      const result = validateExportFilename('my-readme.txt', 'zip');
      expect(result).toBe('my-readme.zip');
    });

    it('returns default filename for empty or invalid inputs', () => {
      expect(validateExportFilename('', 'markdown')).toBe('README.md');
      expect(validateExportFilename('   ', 'zip')).toBe('README.zip');
    });
  });

  describe('Security Auditor', () => {
    it('passes clean markdown content', () => {
      const markdown = '# Hello World\nThis is my developer profile.';
      const audit = auditExportSecurity(markdown);
      expect(audit.isSecure).toBe(true);
      expect(audit.violations).toHaveLength(0);
    });

    it('flags GitHub Personal Access Tokens', () => {
      const markdown = 'Here is my secret token: ghp_1234567890abcdefghijklmnopqrstuvwxyz';
      const audit = auditExportSecurity(markdown);
      expect(audit.isSecure).toBe(false);
      expect(audit.violations[0]).toContain('GitHub Personal Access Token');
    });

    it('flags Authorization Bearer tokens', () => {
      const markdown = 'Header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const audit = auditExportSecurity(markdown);
      expect(audit.isSecure).toBe(false);
      expect(audit.violations[0]).toContain('Authorization Bearer header token');
    });
  });

  describe('Document Validation', () => {
    it('rejects empty markdown string', () => {
      const result = validateExportDocument('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('empty README document');
    });

    it('validates non-empty markdown string', () => {
      const result = validateExportDocument('# User Bio');
      expect(result.isValid).toBe(true);
    });
  });
});
