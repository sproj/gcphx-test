import { useCases } from "../../../contexts/CasesContext"
import DropdownButton from "../../Buttons/DropdownButton"


export const ColumnsButton: React.FC<{}> = () => {

    const { columns } = useCases()
    return (
        <DropdownButton buttonType="primary" label="Columns" openIcon={null} closeIcon={null}>
            {columns.map(({label}) => {
                return label
            })}
        </DropdownButton>
    )
}

export default ColumnsButton