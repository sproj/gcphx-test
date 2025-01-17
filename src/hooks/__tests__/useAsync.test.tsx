import { render, act, waitFor } from '@testing-library/react';
import { useAsync } from '../useAsync';

interface TestComponentProps {
    asyncFunction: (signal?: AbortSignal) => Promise<any>;
}

const TestComponent: React.FC<TestComponentProps> = ({ asyncFunction }: { asyncFunction: (signal?: AbortSignal) => Promise<any> }) => {
    const { data, error, isLoading, aborted, run } = useAsync<any>();

    return (
        <div>
            <button
                onClick={() => {
                    const controller = new AbortController();
                    run(asyncFunction, controller.signal);
                    // Abort after a short delay
                    setTimeout(() => controller.abort(), 100);
                }}
            >
                Run
            </button>
            {isLoading && <p>Loading...</p>}
            {aborted && <p>Aborted</p>}
            {error && <p>Error: {error.message}</p>}
            {data && <p>Data: {data}</p>}
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

        await waitFor(() => {
            expect(queryByText('Loading...')).not.toBeInTheDocument();
            expect(queryByText('Data: mock data')).toBeInTheDocument();
        });
    });

    it('should handle errors', async () => {
        let promiseResolve: () => void = () => { };
        const asyncFunction = jest.fn().mockImplementation(() =>
            new Promise((_, reject) => {
                promiseResolve = () => reject(new Error('mock error'));
            })
        );

        const { getByText, queryByText, findByText } = render(<TestComponent asyncFunction={asyncFunction} />);

        act(() => {
            getByText('Run').click();
        });

        expect(await findByText('Loading...')).toBeInTheDocument();

        await act(async () => promiseResolve())

        await waitFor(() => {
            expect(queryByText('Loading...')).not.toBeInTheDocument();
            expect(queryByText('Error: mock error')).toBeInTheDocument();
        });
    });

    it('should handle aborts', async () => {
        const mockFn = jest.fn(
            (signal?: AbortSignal) =>
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

        act(() => {
            getByText('Run').click();
        });

        await waitFor(() => {
            expect(queryByText('Loading...')).not.toBeInTheDocument();
            expect(queryByText('Aborted')).toBeInTheDocument();
        });
    });
});
