import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../client';

function mockJsonResponse(data: unknown): Response {
  return {
    ok: true,
    status: 200,
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as unknown as Response;
}

describe('apiClient body serialization', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockJsonResponse({ ok: true })));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('serializes object body for post requests', async () => {
    await apiClient.post('/api/test', { action: 'ping', count: 1 }, { useCache: false });

    const mockFetch = vi.mocked(fetch);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, init] = mockFetch.mock.calls[0];
    expect(init?.method).toBe('POST');
    expect(init?.body).toBe(JSON.stringify({ action: 'ping', count: 1 }));
    expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
  });

  it('serializes object body for put requests', async () => {
    await apiClient.put('/api/test', { name: 'owl' }, { useCache: false });

    const mockFetch = vi.mocked(fetch);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, init] = mockFetch.mock.calls[0];
    expect(init?.method).toBe('PUT');
    expect(init?.body).toBe(JSON.stringify({ name: 'owl' }));
    expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
  });

  it('keeps string body unchanged', async () => {
    await apiClient.post('/api/test', '{"raw":true}', { useCache: false });

    const mockFetch = vi.mocked(fetch);
    const [, init] = mockFetch.mock.calls[0];
    expect(init?.body).toBe('{"raw":true}');
  });

  it('preserves caller headers while setting JSON content type', async () => {
    await apiClient.post(
      '/api/test',
      { action: 'merge-headers' },
      { useCache: false, headers: { Authorization: '******' } }
    );

    const mockFetch = vi.mocked(fetch);
    const [, init] = mockFetch.mock.calls[0];
    expect(init?.headers).toMatchObject({
      'Content-Type': 'application/json',
      Authorization: '******',
    });
  });
});
