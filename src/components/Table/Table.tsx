import { HeaderRow } from './HeaderRow';
import { TableRow } from './TableRow';
import styled from 'styled-components';
import { TableProps } from './TableWrapper';
import { HasId } from '../../types/HasId';

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    z-index: 1;
    position: relative;
`;

export const Table = <T extends HasId<string>,>({ data, columns, selectedRowIds }: TableProps<T>) => {
    return (
        <StyledTable>
            <thead>
                <HeaderRow columns={columns} />
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <TableRow key={index} row={row} columns={columns} selectedRowIds={selectedRowIds}/>
                ))}
            </tbody>
        </StyledTable>
    );
};
