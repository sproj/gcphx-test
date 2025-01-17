import styled from "styled-components"
import { useCases } from "../../../contexts/CasesContext"
import DropdownButton from "../../Buttons/DropdownButton"
import { Checkbox } from "../../Checkbox/Checkbox"

const StyledItem = styled.div`
    display: flex;
    gap: 4px;
    flex-direction: row;
    align-items: center;
`

export const ColumnsButton: React.FC<{}> = () => {

    const { columns, toggleColumnVisible, } = useCases()
    return (
        <DropdownButton buttonType="primary" label="Columns" openIcon={null} closeIcon={null}>
            {columns.map(({ key, label, visible }) => {
                return (
                    <StyledItem key={key}>
                        <Checkbox
                            checked={visible}
                            indeterminate={false}
                            onChange={() => toggleColumnVisible(key)}
                        />
                        <div onClick={() => toggleColumnVisible(key)} style={{display: 'inline'}}>{label}</div>
                    </StyledItem>)
            })}
        </DropdownButton>
    )
}

export default ColumnsButton