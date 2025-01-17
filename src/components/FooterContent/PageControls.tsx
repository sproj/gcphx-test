import styled from "styled-components"
import { useCases } from "../../contexts/CasesContext"
import TertiaryButton from "../Buttons/TertiaryButton"
import { TbChevronRight } from "react-icons/tb";

const PageButton = styled(TertiaryButton)`
    height: 40px;
    width: 40px;
`

const StyledButtonGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

export const PageControls = () => {
    const { nextPage, previousPage, totalRecordCount, pageSize, currentPage } = useCases()
    return (
        <StyledButtonGroup>
            <PageButton onClick={() => previousPage()} color='#606F89'>{currentPage}</PageButton>
            <span>{`/ ${Math.ceil(totalRecordCount / pageSize)}`}</span>
            <PageButton onClick={() => nextPage()}><TbChevronRight size={16} color='#606F89' /></PageButton>
        </StyledButtonGroup>
    )
}