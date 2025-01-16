import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useCasesStore } from '../stores/casesStore';
import { Case, CaseStatus } from '../types/Case';
import { fetchCases, updateCases, mapDTOToCase } from '../clients/casesClient';
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

    const fetchAllCases = async () => {
        const response = await fetchCases();
        const normalizedCases: Record<string, Case> = {};
        const pendingIds = new Set<string>();
        const acceptedIds = new Set<string>();
        const rejectedIds = new Set<string>();

        for (const dto of response.data) {
            const mappedCase = mapDTOToCase(dto);
            normalizedCases[mappedCase.caseName] = mappedCase;

            switch (dto.status) {
                case 'In Progress':
                    pendingIds.add(mappedCase.caseName);
                    break;
                case 'Accepted':
                    acceptedIds.add(mappedCase.caseName);
                    break;
                case 'Rejected':
                    rejectedIds.add(mappedCase.caseName);
                    break;
            }
        }

        useCasesStore.setState({
            casesById: normalizedCases,
            pendingIds,
            acceptedIds,
            rejectedIds,
        });
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
        run(fetchAllCases);
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
