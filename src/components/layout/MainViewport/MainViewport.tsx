import React, { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledMainViewport = styled.section`
    overflow-y: auto;
    padding: 1rem;
`

export const MainViewport: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <StyledMainViewport>{children}</StyledMainViewport>
    )
}

export default MainViewport