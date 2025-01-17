import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useCasesStore } from '../stores/casesStore';
import { Case, CaseStatus } from '../types/Case';
import { fetchCases, updateCases, mapDTOToCase, mapStatusToSet } from '../clients/casesClient';
import { useAsync } from '../hooks/useAsync';

type CasesContextValue = {
    updateCases: (ids: string[], status: CaseStatus) => Promise<void>;
    searchCases: (query: string) => void;
    loading: boolean;
    error: Error | null;
};

const CasesContext = createContext<CasesContextValue | undefined>(undefined);

export const CasesProvider = ({ children }: { children: ReactNode }) => {
    const {
        updateCasesOptimistically,
        resetRecentlyUpdated,
        setSearchQuery,
    } = useCasesStore();

    const { run, isLoading: loading, error } = useAsync();

    const fetchAllCases = async (signal?: AbortSignal) => {
        try {
            const response = await fetchCases(signal);

            const normalizedCases: Record<string, Case> = {};
            const statusSets = {
                pending: new Set<string>(),
                accepted: new Set<string>(),
                rejected: new Set<string>(),
            };

            for (const dto of response.data) {
                const mappedCase = mapDTOToCase(dto);

                normalizedCases[mappedCase.caseName] = mappedCase;

                mapStatusToSet(dto.status, mappedCase.caseName, statusSets);

            }

            useCasesStore.setState({
                casesById: normalizedCases,
                pendingIds: statusSets.pending,
                acceptedIds: statusSets.accepted,
                rejectedIds: statusSets.rejected,
            });
        } catch (e) {
            console.error('Failed to fetch cases: ', e)
            throw e
        }
    };

    const updateCasesHandler = async (ids: string[], status: CaseStatus) => {
        updateCasesOptimistically(ids, status);

        const body = {
            ids,
            status: status === CaseStatus.Accepted ? 'Accepted' : 'Rejected',
        };

        try {
            const response = await updateCases(body);
            console.info(response.message);
            run(fetchAllCases); // Refetch cases after update
        } catch (err) {
            console.error(err);
            throw err; // Rethrow to let `run` handle the error state
        } finally {
            resetRecentlyUpdated();
        }
    };

    const searchCases = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        const controller = new AbortController();
        run(async () => fetchAllCases(controller.signal));
        return () => controller.abort()
    }, [run]);

    return (
        <CasesContext.Provider
            value={{
                updateCases: updateCasesHandler,
                searchCases,
                loading,
                error,
            }}
        >
            {children}
        </CasesContext.Provider>
    );
};

export const useCases = () => {
    const context = useContext(CasesContext);
    if (!context) {
        throw new Error('useCases must be used within a CasesProvider');
    }
    return context;
};
