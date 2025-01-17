import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import { CasesState, useCasesStore } from '../stores/casesStore';
import { Case, CaseStatus } from '../types/Case';
import { updateCases, mapDTOToCase, mapStatusToSet, getCases, FetchCasesParams } from '../clients/casesClient';
import { useAsync } from '../hooks/useAsync';
import { useLocation } from 'react-router';

export type CurrentView = CaseStatus | 'all'

type CasesContextValue = {
    updateCases: (ids: string[], status: CaseStatus) => Promise<void>;
    searchCases: (query: string) => void;
    loading: boolean;
    error: Error | null;
    nextPage: () => Promise<void>,
    previousPage: () => Promise<void>
} & Omit<CasesState, 'updateCasesOptimistically' | 'resetRecentlyUpdated'>
    & { currentView: CurrentView }

const CasesContext = createContext<CasesContextValue | undefined>(undefined);

export const CasesProvider = ({ children }: { children: ReactNode }) => {
    const {
        casesById,
        pendingIds,
        acceptedIds,
        rejectedIds,
        selectedCases,
        columns,
        updateCasesOptimistically,
        resetRecentlyUpdated,
        setSearchQuery,
        toggleCaseSelection,
        clearAllSelections,
        selectAllCases,
        isCaseSelected,
        areAllCasesSelected,
        areAnyCasesSelected,
        recentlyUpdated,
        searchQuery,
        currentPage,
        totalRecordCount,
        pageSize
    } = useCasesStore();

    const location = useLocation()

    const currentView = useMemo(() => pathNameToView(location.pathname), [location.pathname])

    const { run, isLoading: loading, error } = useAsync();

    const fetchCases = useCallback(async (params: Partial<FetchCasesParams>, signal?: AbortSignal) => {
        try {
            const response = await getCases({ status: currentView, limit: params.limit || 10, ...params }, signal);

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
                currentPage: response.page,
                totalRecordCount: response.total
            });
        } catch (e) {
            console.error('Failed to fetch cases: ', e)
            throw e
        }
    }, [location.pathname]);

    const updateCasesHandler = async (ids: string[], status: CaseStatus) => {
        updateCasesOptimistically(ids, status);

        const body = {
            ids,
            status: status === CaseStatus.Accepted ? 'Accepted' : 'Rejected',
        };

        try {
            const response = await updateCases(body);
            console.info(response.message);
            run(() => fetchCases({})); // Refetch cases after update
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

    const nextPage = useCallback(async () => {
        if (currentPage >= Math.ceil(totalRecordCount / pageSize)) return;
        const controller = new AbortController()
        fetchCases({ page: +currentPage + 1, status: currentView }, controller.signal)
        return controller.abort()
    }, [currentPage, currentView])

    const previousPage = useCallback(async () => {
        if (currentPage <= 1) return;
        const controller = new AbortController()
        fetchCases({ page: +currentPage - 1, status: currentView }, controller.signal)
        return controller.abort()
    }, [currentPage, currentView])

    useEffect(() => {
        const controller = new AbortController();
        run(async () => fetchCases({}, controller.signal));
        return () => controller.abort()
    }, [run, fetchCases]);

    return (
        <CasesContext.Provider
            value={{
                currentView,
                loading,
                casesById,
                error,
                selectedCases,
                pendingIds,
                acceptedIds,
                rejectedIds,
                columns,
                updateCases: updateCasesHandler,
                searchCases,
                toggleCaseSelection,
                isCaseSelected,
                selectAllCases,
                clearAllSelections,
                areAllCasesSelected,
                areAnyCasesSelected,
                recentlyUpdated,
                searchQuery,
                setSearchQuery,
                currentPage,
                totalRecordCount,
                pageSize,
                nextPage,
                previousPage
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

const pathNameToView = (path: string) => {
    switch (path) {
        case '/pending': {
            return CaseStatus.InProgress
        }
        case '/accepted': {
            return CaseStatus.Accepted
        }
        case '/rejected': {
            return CaseStatus.Rejected
        }
        default: {
            return 'all'
        }
    }
}