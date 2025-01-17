import React from 'react';
import { useCases } from '../../contexts/CasesContext';
import { TableWrapper } from './TableWrapper';

export const TableContainer: React.FC<{}> = () => {
    const { loading, error, casesById, columns, selectedCases } = useCases();

    if (loading) return <p>Loading cases...</p>; // Placeholder text (no loaders as per requirement)
    if (error) return <p>Failed to load cases: {error.message}</p>;
    if (!casesById || Object.keys(casesById).length === 0) return <p>No cases available.</p>;

    const caseList = Object.values(casesById)

    return <TableWrapper data={caseList} columns={columns} selectedRowIds={selectedCases} />;
};
