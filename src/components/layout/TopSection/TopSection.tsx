import React, { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledTopSection = styled.section`
    padding: 1rem;
`

export const TopSection: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <StyledTopSection>{children}</StyledTopSection>
    )
}

export default TopSection