import { fetchWithAbort } from '../utils/fetchWithAbort';
import { CaseDTO, GetRequestResponse, UpdateCasesRequest, UpdateCasesResponse, CaseStatus, Case } from '../types/Case';

export const fetchCases = async (signal?: AbortSignal): Promise<GetRequestResponse> => {
    const { data, aborted } = await fetchWithAbort<GetRequestResponse>('/requests', { signal });
    if (aborted) {
        console.info('Fetch cases request aborted');
        throw new DOMException('AbortError');
    }
    if (!data) throw new Error('No data returned from fetchCases');
    return data;
};

export const updateCases = async (body: UpdateCasesRequest, signal?: AbortSignal): Promise<UpdateCasesResponse> => {
    const { data, aborted } = await fetchWithAbort<UpdateCasesResponse>('/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
    });
    if (aborted) {
        console.info('Update cases request aborted');
        throw new DOMException('AbortError');
    }
    if (!data) throw new Error('No data returned from updateCases');
    return data;
};

export const mapDTOToCase = (dto: CaseDTO): Case => ({
    caseName: dto.caseName,
    priority: dto.priority === 'High' ? 1 : 0, // Adjust as needed
    assignee: dto.assignee,
    description: dto.description,
    status: dto.status === 'In Progress' ? CaseStatus.InProgress :
        dto.status === 'Accepted' ? CaseStatus.Accepted : CaseStatus.Rejected,
    type: dto.type,
    dateCreated: new Date(dto.dateCreated),
    lastUpdated: dto.lastUpdated ? new Date(dto.lastUpdated) : null,
});

export const normalizeCases = (data: CaseDTO[]) => {
    const normalizedCases: Record<string, Case> = {};
    const pendingIds = new Set<string>();
    const acceptedIds = new Set<string>();
    const rejectedIds = new Set<string>();

    for (const dto of data) {
        const mappedCase: Case = {
            caseName: dto.caseName,
            priority: dto.priority === 'High' ? 1 : 0,
            assignee: dto.assignee,
            description: dto.description,
            status:
                dto.status === 'In Progress'
                    ? CaseStatus.InProgress
                    : dto.status === 'Accepted'
                        ? CaseStatus.Accepted
                        : CaseStatus.Rejected,
            type: dto.type,
            dateCreated: new Date(dto.dateCreated),
            lastUpdated: dto.lastUpdated ? new Date(dto.lastUpdated) : null,
        };

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

    return { normalizedCases, pendingIds, acceptedIds, rejectedIds };
};