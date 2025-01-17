import { create } from 'zustand';
import { Case, CaseStatus } from '../types/Case';

export type CasesState = {
    casesById: Record<string, Case>;
    pendingIds: Set<string>;
    acceptedIds: Set<string>;
    rejectedIds: Set<string>;

    searchQuery: string;
    selectedCases: Set<string>;
    recentlyUpdated: Set<string>;

    currentPage: number;
    totalRecordCount: number;
    pageSize: 10;

    columns: CaseTableColumns;
    toggleColumnVisible: (key: keyof Case) => void,

    updateCasesOptimistically: (ids: string[], status: CaseStatus) => void;
    resetRecentlyUpdated: () => void;
    setSearchQuery: (query: string) => void;

    toggleCaseSelection: (id: string) => void;
    isCaseSelected: (id: string) => boolean;
    selectAllCases: () => void;
    clearAllSelections: () => void;

    areAllCasesSelected: () => boolean;
    areAnyCasesSelected: () => boolean;
};


export type CaseTableColumns = Array<{ key: keyof Case, label: string, colWidth?: 1 | 2 | 3, visible: boolean }>


const LOCAL_STORAGE_KEY = 'caseTableColumns';

const getColumnsFromLocalStorage = (): CaseTableColumns => {
    const storedColumns = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedColumns ? JSON.parse(storedColumns) : defaultColumns;
};

const saveColumnsToLocalStorage = (columns: CaseTableColumns) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(columns));
};

const defaultColumns: CaseTableColumns = [
    { key: 'priority', label: 'Priority', visible: false },
    { key: 'caseName', label: 'Case Name', visible: true },
    { key: 'assignee', label: 'Assignee', visible: true },
    { key: 'description', label: 'Description', colWidth: 3, visible: true },
    { key: 'dateCreated', label: 'Date Created', visible: true },
    { key: 'status', label: 'Status', visible: false },
    { key: 'type', label: 'Type', visible: false },
    { key: 'lastUpdated', label: 'Last Updated', visible: false },
]

export const useCasesStore = create<CasesState>((set, get) => ({
    casesById: {},
    pendingIds: new Set(),
    acceptedIds: new Set(),
    rejectedIds: new Set(),
    searchQuery: '',
    columns: getColumnsFromLocalStorage() || defaultColumns,
    selectedCases: new Set(),
    recentlyUpdated: new Set(),

    toggleColumnVisible: (key: keyof Case) => {
        set((state) => {
            const updatedColumns = state.columns.map(col => {
                if (col.key === key) {
                    col.visible = !col.visible
                }
                return col
            })

            saveColumnsToLocalStorage(updatedColumns);

            return {
                columns: updatedColumns
            }
        })
    },

    setSearchQuery: (query) => set({ searchQuery: query }),

    currentPage: 0,
    totalRecordCount: 0,
    pageSize: 10,
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

    resetRecentlyUpdated: () => set({ recentlyUpdated: new Set() }),

    toggleCaseSelection: (id: string) => {
        set((state) => {
            const updatedSelection = new Set(state.selectedCases);
            if (updatedSelection.has(id)) {
                updatedSelection.delete(id);
            } else {
                updatedSelection.add(id);
            }
            return { selectedCases: updatedSelection };
        });
    },

    isCaseSelected: (id: string) => {
        return get().selectedCases.has(id);
    },

    selectAllCases: () => {
        set((state) => ({
            selectedCases: new Set(Object.keys(state.casesById)),
        }));
    },

    clearAllSelections: () => {
        set({ selectedCases: new Set() });
    },

    areAllCasesSelected: () => {
        const state = get();
        return state.selectedCases.size === Object.keys(state.casesById).length;
    },

    areAnyCasesSelected: () => {
        const state = get();
        const totalCases = Object.keys(state.casesById).length;

        return state.selectedCases.size > 0 && state.selectedCases.size < totalCases;
    },
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
            state.acceptedIds.delete(id)
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