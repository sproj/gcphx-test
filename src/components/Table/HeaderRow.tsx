import { useCallback } from 'react';
import { TableColumn } from './TableWrapper';
import { Checkbox } from '../Checkbox/Checkbox';
import { useCases } from '../../contexts/CasesContext';
import { StyledCell, StyledRow } from './TableRow';
import styled from 'styled-components';

const StyledHeaderRow = styled(StyledRow)`

    text-transform: uppercase;

    font-size: 12px;
    font-weight: 600;
    line-height: 14.52px;
    letter-spacing: 0.05em;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;

    color: #606F89;
`;

const StyledHeaderCell = styled(StyledCell)`
    background-color: #F4F7FC;
    max-height: 40px;
    margin: 4px 0px;
`;

export const HeaderRow = <T,>({ columns }: { columns: Array<TableColumn<T>> }) => {
    const { selectAllCases, clearAllSelections, areAllCasesSelected, areAnyCasesSelected } = useCases()

    const toggleAll = useCallback(() => {
        if (areAllCasesSelected()) {
            return clearAllSelections()
        }
        else {
            return selectAllCases()
        }
    }, [areAllCasesSelected, areAnyCasesSelected])

    const columnWidths = columns.map((col) => `${col.colWidth || 2}fr`).join(' ');

    return (
        <StyledHeaderRow $columnWidths={`1fr ${columnWidths} 1fr`}>
            <StyledHeaderCell><Checkbox checked={areAllCasesSelected()} onChange={() => toggleAll()} indeterminate={areAnyCasesSelected()} /></StyledHeaderCell>
            {columns.map((column) => (
                <StyledHeaderCell key={String(column.key)}>{column.label}</StyledHeaderCell>
            ))}
            <StyledHeaderCell>Actions</StyledHeaderCell>
        </StyledHeaderRow>
    );
};
