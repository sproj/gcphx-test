import React, { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledMainSection = styled.main`
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100%;
    margin-left:1rem;
`

export const MainSection: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <StyledMainSection>{children}</StyledMainSection>
    )
}

export default MainSection