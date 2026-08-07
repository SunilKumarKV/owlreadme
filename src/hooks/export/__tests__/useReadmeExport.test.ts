import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReadmeExport } from '../useReadmeExport';
import { exportService } from '@/services/export/exportService';

describe('useReadmeExport Hook Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with idle status', () => {
    const { result } = renderHook(() => useReadmeExport('# Test README'));
    expect(result.current.status).toBe('idle');
  });

  it('handles export document lifecycle successfully', async () => {
    vi.spyOn(exportService, 'export').mockResolvedValue({
      success: true,
      filename: 'README.md',
      format: 'markdown',
      sizeBytes: 100,
      generatedAt: '2024-01-01T00:00:00Z',
    });

    const { result } = renderHook(() => useReadmeExport('# Test README'));

    await act(async () => {
      await result.current.exportDocument({ format: 'markdown' });
    });

    expect(result.current.status).toBe('success');
    expect(result.current.result?.filename).toBe('README.md');
  });

  it('sets error state for empty document', async () => {
    const { result } = renderHook(() => useReadmeExport(''));

    await act(async () => {
      await result.current.exportDocument({ format: 'markdown' });
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toContain('empty README document');
  });
});
