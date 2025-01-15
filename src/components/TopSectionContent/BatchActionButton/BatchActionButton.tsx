import DropdownButton from "../../Buttons/DropdownButton";

export const BatchActionButton: React.FC<{}> = () => {
    return (
        <DropdownButton buttonType="secondary" label='Batch action'>
            <text>Accept cases</text>
            <text>Reject cases</text>
        </DropdownButton>
    )
}

export default BatchActionButton