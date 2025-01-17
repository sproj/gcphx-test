import DropdownButton from "../../Buttons/DropdownButton";

export const BatchActionButton: React.FC<{}> = () => {
    return (
        <DropdownButton buttonType="secondary" label='Batch action'>
            <span>Accept cases</span>
            <span>Reject cases</span>
        </DropdownButton>
    )
}

export default BatchActionButton