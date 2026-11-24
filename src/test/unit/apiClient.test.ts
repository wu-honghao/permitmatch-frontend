import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, deleteAPI, getAPI, patchAPI, postAPI, putAPI } from '../../api/api';
import { BASEAPIURL, USERTOKEN } from '../../constant';

const fetchMock = vi.fn<typeof fetch>();
const ok = (body: unknown) => ({ ok: true, status: 200, json: vi.fn().mockResolvedValue(body) }) as unknown as Response;
const failure = (status: number, body?: unknown) => ({ ok: false, status, json: vi.fn().mockResolvedValue(body) }) as unknown as Response;

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
  localStorage.clear();
});
afterEach(() => vi.unstubAllGlobals());

describe('API client (real request wrapper, mocked fetch)', () => {
  it('GET uses the configured URL without a JSON body or authorization by default', async () => {
    fetchMock.mockResolvedValue(ok({ data: [1] }));
    await expect(getAPI({ url: '/jobs' })).resolves.toEqual({ data: [1] });
    expect(fetchMock).toHaveBeenCalledWith(`${BASEAPIURL}/jobs`, expect.objectContaining({
      method: 'GET', headers: {}, body: undefined,
    }));
  });

  it('adds bearer token only when authorization is requested', async () => {
    localStorage.setItem(USERTOKEN, 'token123');
    fetchMock.mockResolvedValue(ok({ data: [] }));
    await getAPI({ url: '/jobs', headersOption: { isAuthorization: true } });
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      headers: { Authorization: 'Bearer token123' },
    }));
  });

  it.each([
    ['POST', postAPI], ['PUT', putAPI], ['PATCH', patchAPI], ['DELETE', deleteAPI],
  ] as const)('%s serializes request data as JSON', async (method, call) => {
    fetchMock.mockResolvedValue(ok({ data: null }));
    await call({ url: '/jobs/123', data: { title: 'Developer' } });
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Developer' }),
    }));
  });

  it('throws ApiError with response message and HTTP status', async () => {
    fetchMock.mockResolvedValue(failure(422, { message: 'Invalid job' }));
    await expect(postAPI({ url: '/jobs', data: {} })).rejects.toMatchObject({
      name: 'ApiError', message: 'Invalid job', status: 422,
    });
  });

  it('uses fallback HTTP message when error response has no message', async () => {
    fetchMock.mockResolvedValue(failure(500, null));
    await expect(getAPI({ url: '/jobs' })).rejects.toEqual(new ApiError('Request failed (500)', 500));
  });

  it('passes an AbortSignal into fetch', async () => {
    fetchMock.mockResolvedValue(ok({ data: null }));
    const controller = new AbortController();
    await getAPI({ url: '/jobs', signal: controller.signal, timeout: 2000 });
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });
});
