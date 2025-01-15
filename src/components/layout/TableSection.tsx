import React, { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledTableSection = styled.section`
    overflow-y: auto;
    padding: 1rem;
`

export const TableSection: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <StyledTableSection>{children}</StyledTableSection>
    )
}

export default TableSection