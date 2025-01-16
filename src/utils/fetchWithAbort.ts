interface FetchError extends Error {
    status?: number;
    statusText?: string;
  }
  
  export const fetchWithAbort = async <T>(
    url: string,
    options: RequestInit = {},
    signal?: AbortSignal
  ): Promise<{ data: T; controller: AbortController }> => {
    const controller = new AbortController();
    const fetchSignal = signal || controller.signal;
  
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
  
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
      return { data, controller };
    } catch (error) {
      if ((error as DOMException).name === 'AbortError') {
        console.info('Fetch aborted: ', url);
      }
      throw error;
    }
  };
  