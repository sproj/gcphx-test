import { PropsWithChildren } from "react";
import styled from "styled-components";
import NavSideBar from "./components/layout/NavSideBar";
import TopSection from "./components/layout/TopSection";
import TableSection from "./components/layout/TableSection";
import FooterSection from "./components/layout/FooterSection";
import MainSection from "./components/layout/MainSection";

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