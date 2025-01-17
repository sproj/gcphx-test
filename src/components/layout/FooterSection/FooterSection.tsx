import React, { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledFooterSection = styled.footer`
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    padding: 1rem;
    justify-content: space-between;
    align-items: center;

    font-size: 12px;
    font-weight: 600;
    line-height: 14.52px;
    letter-spacing: 0.05em;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;

    color: #606F89;
`

export const FooterSection: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <StyledFooterSection>{children}</StyledFooterSection>
    )
}

export default FooterSection