import styled from "styled-components"
import { useCases } from "../../contexts/CasesContext"

const StyledCounter = styled.span`
`

export const CaseCounter = () => {
    const { currentPage, totalRecordCount, pageSize } = useCases()
    const firstVisibleRecordIndex = (currentPage - 1) * pageSize  + 1
    const lastVisibleRecordIndex = Math.min(currentPage * pageSize, totalRecordCount);
    return (
        <StyledCounter>{`${firstVisibleRecordIndex} - ${lastVisibleRecordIndex} of ${totalRecordCount} cases`}</StyledCounter>
    )
}

export default CaseCounter