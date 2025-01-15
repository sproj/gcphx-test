import React, { PropsWithChildren } from "react";
import styled from "styled-components";

const SideNav = styled.aside`
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    background: #F4F7FC;
    box-shadow: 0px 6px 3px 0px #4B515B26;
    box-shadow: 0px 1px 3px 0px #00000026;


`

export const NavSideBar: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <SideNav>{children}</SideNav>
    )
}

export default NavSideBar