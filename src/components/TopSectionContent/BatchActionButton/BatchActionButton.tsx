import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";
import DropdownButton from "../../Buttons/DropdownButton";

export const BatchActionButton: React.FC<{}> = () => {
    return (
        <DropdownButton
            buttonType="secondary"
            label='Batch action'
            openIcon={<TbCaretUpFilled size={16} />}
            closeIcon={<TbCaretDownFilled size={16} />}
        >
            <span>Accept cases</span>
            <span>Reject cases</span>
        </DropdownButton>
    )
}

export default BatchActionButton