import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";
import DropdownButton from "../../Buttons/DropdownButton";
import { useCases } from "../../../contexts/CasesContext";
import { CaseStatus } from "../../../types/Case";
import { useCallback } from "react";

export const BatchActionButton: React.FC<{}> = () => {
    const { updateCases, selectedCases } = useCases()

    const handleClick = useCallback((status: CaseStatus.Accepted | CaseStatus.Rejected) => {
        if (selectedCases.size === 0) return
        updateCases(Array.from(selectedCases), status)
    }, [selectedCases])
    return (
        <DropdownButton
            buttonType="secondary"
            label='Batch action'
            openIcon={<TbCaretUpFilled size={16} />}
            closeIcon={<TbCaretDownFilled size={16} />}
        >
            <span onClick={() => handleClick(CaseStatus.Accepted)}>Accept cases</span>
            <span onClick={() => handleClick(CaseStatus.Rejected)}>Reject cases</span>
        </DropdownButton>
    )
}

export default BatchActionButton