import React, { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledFooterSection = styled.footer`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
`

export const FooterSection: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <StyledFooterSection>{children}</StyledFooterSection>
    )
}

export default FooterSection