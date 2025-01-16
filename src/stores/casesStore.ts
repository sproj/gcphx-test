import { create } from 'zustand';
import { Case, CaseStatus } from '../types/Case';

type CasesState = {
    casesById: Record<string, Case>;
    pendingIds: Set<string>;
    acceptedIds: Set<string>;
    rejectedIds: Set<string>;

    searchQuery: string;
    columns: string[];
    selectedCases: Set<string>;
    recentlyUpdated: Set<string>;

    updateCasesOptimistically: (ids: string[], status: CaseStatus) => void;
    resetRecentlyUpdated: () => void;

    setSearchQuery: (query: string) => void;
};

export const useCasesStore = create<CasesState>((set) => ({
    casesById: {},
    pendingIds: new Set(),
    acceptedIds: new Set(),
    rejectedIds: new Set(),
    searchQuery: '',
    columns: ['title', 'status', 'description'],
    selectedCases: new Set(),
    recentlyUpdated: new Set(),

    setSearchQuery: (query) => set({ searchQuery: query }),


    /**
     * On a user updating data:
     *  - Perform the update in state optimistically.
     *  - Keep a track of the update set by id.
     *  - On update succeeding, void the update set (async handler will do this using resetRecentlyUpdated)
     * @param ids 
     * @param status 
     */
    updateCasesOptimistically: (ids: string[], status: CaseStatus) => {
        set((state) => {
            const updatedCasesById: Record<string, Case> = { ...state.casesById };

            // Update cases and their status
            for (const id of ids) {
                const currentCase = updatedCasesById[id];

                if (!currentCase) {
                    console.warn(`Case with ID ${id} not found.`);
                    continue;
                }

                moveCaseBetweenStatuses(id, currentCase.status, status, state)
            }

            return {
                casesById: updatedCasesById,
                recentlyUpdated: new Set(ids),
            };
        });
    },

    resetRecentlyUpdated: () => set({ recentlyUpdated: new Set() })
}));

/**
 * Remove a case id from its current 'status' set and add it to the new one.
 * @param id 
 * @param currentStatus 
 * @param newStatus 
 * @param state 
 */
const moveCaseBetweenStatuses = (
    id: string,
    currentStatus: CaseStatus,
    newStatus: CaseStatus,
    state: CasesState
) => {
    switch (currentStatus) {
        case CaseStatus.InProgress:
            state.pendingIds.delete(id);
            break;
        case CaseStatus.Accepted:
            state.acceptedIds.delete(id);
            break;
        case CaseStatus.Rejected:
            state.rejectedIds.delete(id);
            break;
    }

    if (newStatus === CaseStatus.Accepted) {
        state.acceptedIds.add(id);
    } else if (newStatus === CaseStatus.Rejected) {
        state.rejectedIds.add(id);
    }
}


export const getCasesByStatus = (state: CasesState, status: CaseStatus) => {
    const ids =
        status === CaseStatus.InProgress
            ? state.pendingIds
            : status === CaseStatus.Accepted
                ? state.acceptedIds
                : state.rejectedIds;

    return Array.from(ids).map((id) => state.casesById[id]);
}