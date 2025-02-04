import styled from "styled-components";
import { Navigate, Route, Routes } from 'react-router';
import FooterSection from "./components/layout/FooterSection/FooterSection";
import MainSection from "./components/layout/MainSection/MainSection";
import NavSideBar from "./components/layout/NavSideBar/NavSideBar";
import MainViewport from "./components/layout/MainViewport/MainViewport";
import TopSection from "./components/layout/TopSection/TopSection";
import { ROUTES } from "./routes";
import { NavItem } from "./components/NavItem/NavItem";
import { TableContainer } from "./components/Table/TableContainer";
import TopSectionContentContainer from "./components/TopSectionContent/TopSectionContentContainer";
import { Title } from "./components/TopSectionContent/Title";
import UserInputs from "./components/TopSectionContent/UserInputs";
import { CasesProvider } from "./contexts/CasesContext";
import { CaseCounter } from "./components/FooterContent/CaseCounter";
import { PageControls } from "./components/FooterContent/PageControls";

const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 14.5rem 1fr;
  height: 100vh;
`;

function App() {
  return (
    <LayoutContainer>
      <NavSideBar>{ROUTES.map(({ path, icon, name }) => <NavItem key={path} path={path} icon={icon} name={name} />)}</NavSideBar>
      <CasesProvider>
        <MainSection>
          <TopSection>
            <TopSectionContentContainer>
              <Title />
              <UserInputs />
            </TopSectionContentContainer>
          </TopSection>
          <MainViewport>
            <Routes>
              <Route index element={<Navigate to="/pending" />} />
              <Route path="all" element={<TableContainer />} />
              <Route path="pending" element={<TableContainer />} />
              <Route path="accepted" element={<TableContainer />} />
              <Route path="rejected" element={<TableContainer />} />
            </Routes>
          </MainViewport>
          <FooterSection>
            <CaseCounter />
            <PageControls />
          </FooterSection>
        </MainSection>
      </CasesProvider>
    </LayoutContainer >
  )
}

export default App
