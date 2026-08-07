import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportService } from '../exportService';
import * as exportUtils from '@/utils/export-utils';

describe('ExportService Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('exports markdown document successfully using normalized document', async () => {
    const downloadSpy = vi.spyOn(exportUtils, 'downloadTextFile').mockImplementation(() => {});

    const result = await exportService.export('# My README', {
      format: 'markdown',
      filename: 'my-readme.md',
    });

    expect(result.success).toBe(true);
    expect(result.filename).toBe('my-readme.md');
    expect(downloadSpy).toHaveBeenCalledWith('my-readme.md', '# My README');
  });

  it('exports ZIP package successfully', async () => {
    const zipSpy = vi.spyOn(exportUtils, 'downloadZipPackage').mockResolvedValue(undefined);

    const result = await exportService.export('# My README', {
      format: 'zip',
      filename: 'package.zip',
    });

    expect(result.success).toBe(true);
    expect(result.filename).toBe('package.zip');
    expect(zipSpy).toHaveBeenCalled();
  });

  it('throws error when exporting empty markdown document', async () => {
    await expect(
      exportService.export('', { format: 'markdown' })
    ).rejects.toThrow('Cannot export empty README document.');
  });
});
