interface FetchError extends Error {
  status?: number;
  statusText?: string;
}

export interface AbortableFetchResponse<T> {
  data: T | null,
  controller: AbortController,
  aborted: boolean
}

export const fetchWithAbort = async <T>(
  url: string,
  options: RequestInit = {},
  signal?: AbortSignal,
  timeout?: number
): Promise<AbortableFetchResponse<T>> => {
  const controller = new AbortController();
  const fetchSignal = signal || controller.signal;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      signal: fetchSignal,
    });

    if (!response.ok) {
      const error: FetchError = new Error(`HTTP error: ${response.status}`);
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    const data: T = await response.json();
    return { data, controller, aborted: false };
  } catch (error) {
    if ((error as DOMException).name === 'AbortError') {
      console.info('Fetch aborted: ', url);
      return { data: null, aborted: true, controller }
    }
    throw error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
};
