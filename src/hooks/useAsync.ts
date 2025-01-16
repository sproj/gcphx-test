import { useState, useCallback } from 'react';

interface AsyncState<T> {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    aborted: boolean;
}

interface UseAsyncResult<T> extends AsyncState<T> {
    run: (asyncFunction: (signal?: AbortSignal) => Promise<T>, signal?: AbortSignal) => Promise<void>;
    setError: (value: React.SetStateAction<Error | null>) => void;
}

export const useAsync = <T>(): UseAsyncResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [aborted, setAborted] = useState(false);

    const run = useCallback(
        async (asyncFunction: (signal?: AbortSignal) => Promise<T>, signal?: AbortSignal) => {
            setIsLoading(true);
            setError(null);
            setAborted(false);

            try {
                const result = await asyncFunction(signal);
                if (!signal?.aborted) {
                    setData(result);
                }
            } catch (err) {
                if ((err as DOMException).name === 'AbortError') {
                    setAborted(true);
                    setData(null);
                } else {
                    setError(err as Error);
                }
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return { data, error, isLoading, aborted, run, setError };
};
