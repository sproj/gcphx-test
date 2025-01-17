import { HasId } from "./HasId";

export interface Case extends HasId<string> {
    id: string;
    caseName: string;
    priority: CasePriority;
    assignee: string;
    description: string;
    status: CaseStatus;
    type: string;
    dateCreated: Date;
    lastUpdated: Date | null;
}

export enum CaseStatus {
    InProgress = "In Progress",
    Accepted = "Accepted",
    Rejected = "Rejected"
}

export enum CasePriority {
    Low,
    High
}

export interface CaseDTO {
    caseName: string;
    priority: string;
    assignee: string;
    description: string;
    status: string;
    type: string;
    dateCreated: string;
    lastUpdated: string | null;
}

export interface GetRequestResponse {
    total: number;
    page: number;
    limit: number;
    data: CaseDTO[];
}

export interface UpdateCasesRequest {
    ids: string[];
    status: string;
}

export interface UpdateCasesResponse {
    message: string;
    updatedCount: number;
}

