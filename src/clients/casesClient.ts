import { fetchWithAbort } from '../utils/fetchWithAbort';
import { CaseDTO, GetRequestResponse, UpdateCasesRequest, UpdateCasesResponse, CaseStatus, Case } from '../types/Case';

const ENDPOINTS = {
    cases: {
        uri: `/api`,
        port: 3000,
        endpoints: {
            fetchCases: { endpoint: 'requests', verb: 'GET', contentType: 'application/json' },
            updateCases: { endpoint: 'update-status', verb: 'PUT', contentType: 'application/json' }
        }
    }
}

export const fetchCases = async (signal?: AbortSignal): Promise<GetRequestResponse> => {
    const { uri } = ENDPOINTS.cases;
    const { endpoint } = ENDPOINTS.cases.endpoints.fetchCases;

    const { data, aborted } = await fetchWithAbort<GetRequestResponse>(`${uri}/${endpoint}`, { signal });
    if (aborted) {
        console.info('Fetch cases request aborted');
        throw new DOMException('AbortError');
    }
    if (!data) throw new Error('No data returned from fetchCases');
    return data;
};

export const updateCases = async (body: UpdateCasesRequest, signal?: AbortSignal): Promise<UpdateCasesResponse> => {
    const { uri } = ENDPOINTS.cases;
    const { endpoint, verb, contentType } = ENDPOINTS.cases.endpoints.updateCases;

    const { data, aborted } = await fetchWithAbort<UpdateCasesResponse>(`${uri}/${endpoint}`, {
        method: `${verb}`,
        headers: { 'Content-Type': `${contentType}` },
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

export const mapStatusToSet = (status: string, caseName: string, statusSets: { [key: string]: Set<string> }) => {
    switch (status) {
        case 'In Progress':
            statusSets.pending.add(caseName);
            break;
        case 'Accepted':
            statusSets.accepted.add(caseName);
            break;
        case 'Rejected':
            statusSets.rejected.add(caseName);
            break;
    }
};
