import styled from "styled-components";
import FooterSection from "./components/layout/FooterSection/FooterSection";
import MainSection from "./components/layout/MainSection/MainSection";
import NavSideBar from "./components/layout/NavSideBar/NavSideBar";
import TableSection from "./components/layout/TableSection/TableSection";
import TopSection from "./components/layout/TopSection/TopSection";
import { ROUTES } from "./routes";
import { NavItem } from "./components/NavItem/NavItem";
import { TableContainer } from "./components/Table/TableContainer";

const LayoutContainer = styled.div`
    display: grid;
    grid-template-columns: 14.5rem 1fr;
    height: 100vh;
`;
function App() {
  return (
    <LayoutContainer>
      <NavSideBar>{ROUTES.map(({ path, icon, name }) => <NavItem path={path} icon={icon} name={name} />)}</NavSideBar>
      <MainSection>
        <TopSection>top section</TopSection>
        <TableSection>
          <TableContainer />
        </TableSection>
        <FooterSection>footer</FooterSection>
      </MainSection>
    </LayoutContainer>
  )
}

export default App
