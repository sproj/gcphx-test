import DropdownButton from "../../Buttons/DropdownButton"


export const ColumnsButton: React.FC<{}> = () => {
    return (
        <DropdownButton buttonType="primary" label="Columns" openIcon={null} closeIcon={null}>Columns</DropdownButton>
    )
}

export default ColumnsButton