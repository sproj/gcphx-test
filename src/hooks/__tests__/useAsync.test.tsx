import { render, act, waitFor } from '@testing-library/react';
import { useAsync } from '../useAsync';

const TestComponent = ({ asyncFunction }: { asyncFunction: (signal?: AbortSignal) => Promise<any> }) => {
    const { data, error, isLoading, aborted, execute } = useAsync(asyncFunction);

    return (
        <div>
            <button onClick={() => {
                const controller = new AbortController();
                execute(controller.signal);
                // Abort after a short delay
                setTimeout(() => controller.abort(), 100);
            }}> Run </button>
            {isLoading && <p>Loading...</p>}
            {aborted && <p>Aborted </p>}
            {error && <p>Error: {error.message} </p>}
            {data && <p>Data: {data} </p>}
        </div>
    );
};

describe('useAsync', () => {
    it('should handle successful execution', async () => {
        const asyncFunction = jest.fn().mockResolvedValueOnce('mock data');
        const { getByText, queryByText } = render(<TestComponent asyncFunction={asyncFunction} />);

        act(() => {
            getByText('Run').click();
        });

        expect(queryByText('Loading...')).toBeInTheDocument();

        await act(async () => {
            // Simulate resolving the promise
            await asyncFunction();
        });

        expect(queryByText('Loading...')).not.toBeInTheDocument();
        expect(queryByText('Data: mock data')).toBeInTheDocument();
    });

    it('should handle errors', async () => {
        // Initialize with a no-op function to get past TypeScript
        let promiseResolve: () => void = () => { };
        const asyncFunction = jest.fn().mockImplementation(() =>
            new Promise((_, reject) => {
                promiseResolve = () => reject(new Error('mock error'));
            })
        );

        const { getByText, findByText, queryByText } = render(<TestComponent asyncFunction={asyncFunction} />);

        // First act: click the button
        await act(async () => {
            getByText('Run').click();
        });

        // Wait for the loading state to appear
        const loadingElement = await findByText('Loading...');
        expect(loadingElement).toBeInTheDocument();

        // trigger the error state
        await act(async () => {
            promiseResolve()
        })
        // Wait for error state
        const errorElement = await findByText('Error: mock error');
        expect(errorElement).toBeInTheDocument();
        expect(queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should handle aborts', async () => {
        const mockFn = jest.fn((signal?: AbortSignal) =>
            new Promise((resolve, reject) => {
                if (signal) {
                    signal.addEventListener('abort', () => {
                        reject(new DOMException('Aborted', 'AbortError'));
                    });
                }
                // This timeout should never resolve because we'll abort before it completes
                setTimeout(() => resolve('mock data'), 5000);
            })
        );

        const { getByText, queryByText } = render(<TestComponent asyncFunction={mockFn} />);

        // Click and trigger the abort
        await act(async () => {
            getByText('Run').click();
        });

        // Wait for the abort to be processed and states to update
        await waitFor(() => {
            const loadingElement = queryByText('Loading...');
            const abortedElement = queryByText('Aborted');

            expect(loadingElement).not.toBeInTheDocument();
            expect(abortedElement).toBeInTheDocument();
        }, {
            timeout: 1000,
            interval: 100 // Check more frequently
        });
    });
});
