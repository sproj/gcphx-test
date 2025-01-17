import styled from 'styled-components';
import { Table } from './Table';
import { HasId } from '../../types/HasId';

export type TableProps<T> = {
    data: T[];
    columns: Array<TableColumn<T>>;
    selectedRowIds: Set<string>;
};

export type TableColumn<T> = {
    key: keyof T;
    label: string;
    colWidth: number
};

const Wrapper = styled.div`
    overflow-x: auto; /* Enable horizontal scrolling for narrow screens */
    max-width: 100%;
`;

export const TableWrapper = <T extends HasId<string>,>({ data, columns, selectedRowIds }: TableProps<T>) => {
    return (
        <Wrapper>
            <Table data={data} columns={columns} selectedRowIds={selectedRowIds} />
        </Wrapper>
    );
};
