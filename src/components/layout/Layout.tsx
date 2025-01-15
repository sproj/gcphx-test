import { PropsWithChildren } from "react";
import styled from "styled-components";
import NavSideBar from "./NavSideBar/NavSideBar";
import TopSection from "./TopSection/TopSection";
import TableSection from "./TableSection/TableSection";
import FooterSection from "./FooterSection/FooterSection";
import MainSection from "./MainSection/MainSection";

const LayoutContainer = styled.div`
    display: grid;
    grid-template-columns: 216px 1fr;
    height: 100vh;
`;

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <LayoutContainer>
            <NavSideBar>nav</NavSideBar>
            <MainSection>
                <TopSection>top section</TopSection>
                <TableSection>{children}</TableSection>
                <FooterSection>footer</FooterSection>
            </MainSection>
        </LayoutContainer>
    )
}

export default Layout