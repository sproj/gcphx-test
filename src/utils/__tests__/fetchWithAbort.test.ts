import { fetchWithAbort } from '../fetchWithAbort';

describe('fetchWithAbort', () => {
  beforeEach(() => {
    // Reset mock before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch data successfully', async () => {
    // Mock a successful response
    const mockResponse = { data: 'mockData' };
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200 })
    );

    const { data } = await fetchWithAbort<typeof mockResponse>('/mock-url');

    expect(fetch).toHaveBeenCalledWith('/mock-url', expect.any(Object));
    expect(data).toEqual(mockResponse);
  });

  it('should throw an error for a non-200 status', async () => {
    // Mock a failed response
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 404, statusText: 'Not Found' })
    );

    await expect(fetchWithAbort('/mock-url')).rejects.toMatchObject({
      message: 'HTTP error: 404',
      status: 404,
      statusText: 'Not Found',
    });
  });

  it('should handle aborted requests', async () => {
    // Mock fetch with an AbortError
    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          const abortError = new DOMException('Aborted', 'AbortError');
          reject(abortError);
        })
    );

    const controller = new AbortController();
    const fetchPromise = fetchWithAbort('/mock-url', {}, controller.signal);

    // Abort the request
    controller.abort();

    await expect(fetchPromise).resolves.toMatchObject({ aborted: true, data: null });
    expect(controller.signal).toMatchObject({ aborted: true })
  });

  it('should include default headers', async () => {
    const mockResponse = { data: 'mockData' };
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200 })
    );

    const { data } = await fetchWithAbort<typeof mockResponse>('/mock-url');

    expect(fetch).toHaveBeenCalledWith('/mock-url', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      signal: expect.any(Object),
    });
    expect(data).toEqual(mockResponse);
  });

  it('should abort the request after the specified timeout', async () => {
    jest.useFakeTimers();

    // Mock fetch to simulate a long-running request
    (global.fetch as jest.Mock).mockImplementation((_, { signal }) => {
      return new Promise((_, reject) => {
        // Simulate the abort triggering a rejection
        signal?.addEventListener('abort', () => {
          const abortError = new DOMException('Aborted', 'AbortError');
          reject(abortError);
        });
      });
    });

    const url = '/timeout-test';
    const timeout = 1000;

    const fetchPromise = fetchWithAbort(url, {}, undefined, timeout);

    // Fast-forward the timers to simulate the timeout
    jest.advanceTimersByTime(timeout);

    const result = await fetchPromise;

    expect(result.aborted).toBe(true);
    expect(result.data).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );

    jest.useRealTimers();
  });

});
