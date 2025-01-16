import { useState, useCallback } from 'react';

interface AsyncState<T> {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    aborted: boolean;
}

interface UseAsyncResult<T> extends AsyncState<T> {
    execute: (signal?: AbortSignal) => Promise<void>;
}

export const useAsync = <T>(
    asyncFunction: (signal?: AbortSignal) => Promise<T>
): UseAsyncResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [aborted, setAborted] = useState(false);

    const execute = useCallback(
        async (signal?: AbortSignal) => {
            setIsLoading(true);
            setError(null);
            setAborted(false);
            console.log('useAsync::execute just called: ', { isLoading, aborted, error, data })
            try {
                const result = await asyncFunction(signal);
                if (!signal?.aborted) {
                    console.log('useAsync::execute about to set data: ', { isLoading, aborted, error, data })
                    setData(result);
                    console.log('useAsync::execute after set data: ', { isLoading, aborted, error, data })
                }
            } catch (err) {
                console.log('Caught error:', err);
                if ((err as DOMException).name === 'AbortError') {
                    console.log('Setting aborted to true');
                    setAborted(true);
                    setData(null)
                } else {
                    console.log('Setting error:', err);
                    setError(err as Error);
                }
            } finally {
                console.log('Setting isLoading to false');
                setIsLoading(false);
            }
        },
        [asyncFunction]
    );
    console.log('useAsync is about to return: ', { isLoading, aborted, error, data })
    return { data, error, isLoading, aborted, execute };
};
