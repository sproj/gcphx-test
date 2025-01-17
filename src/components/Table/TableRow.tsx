import styled from 'styled-components';
import { TableProps } from './TableWrapper';
import { Checkbox } from '../Checkbox/Checkbox';
import { HasId } from '../../types/HasId';
import { useCases } from '../../contexts/CasesContext';
import DropdownButton from '../Buttons/DropdownButton';
import { TbDots } from 'react-icons/tb';
import IconButton from '../Buttons/IconButton';
import { CaseStatus } from '../../types/Case';

export const StyledRow = styled.tr<{ $columnWidths: string }>`
    display: grid;
    width: 100%;
    grid-template-columns: ${(props) => props.$columnWidths};
    vertical-align: middle;
    
    &:nth-child(even) {
        background: #F4F7FC;
    }

    &:hover {
        background-color: #F4F7FC;
    }
`;

export const StyledCell = styled.td`
    padding: 8px;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export type TableRowProps<T> = {
    row: T;
} & Omit<TableProps<T>, 'data'>

export const TableRow = <T extends HasId<string>,>({ row, columns }: TableRowProps<T>) => {
    const { isCaseSelected, toggleCaseSelection, updateCases } = useCases()
    const columnWidths = columns.map((col) => `${col.colWidth || 2}fr`).join(' ');

    return (
        <StyledRow $columnWidths={`1fr ${columnWidths} 1fr`}>
            <StyledCell><Checkbox checked={isCaseSelected(row.id)} onChange={() => toggleCaseSelection(row.id)} indeterminate={false} /></StyledCell>
            {columns.map((column) => <StyledCell key={String(column.key)}>{`${row[column.key] as any}`}</StyledCell>)}
            <StyledCell style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'visible' }}>
                <DropdownButton
                    buttonType='icon'
                    label={<IconButton><TbDots color='black' /></IconButton>}
                >
                    <div onClick={() => updateCases([row.id], CaseStatus.Accepted)} style={{width: '100%'}}>Accept case</div>
                    <div onClick={() => updateCases([row.id], CaseStatus.Rejected)}>Reject case</div>
                </DropdownButton>
            </StyledCell>
        </StyledRow >
    );
};

