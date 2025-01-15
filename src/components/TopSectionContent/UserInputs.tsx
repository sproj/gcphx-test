import React from "react";
import styled from "styled-components";
import { SearchInput } from "./SearchInput";
import BatchActionButton from "./BatchActionButton/BatchActionButton";
import ColumnsButton from "./ColumnsButton/ColumnsButton";

const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchGroup = styled.div`
    display: flex;
    gap: 0.5rem
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem; /* Space between buttons */
`;

export const UserInputs: React.FC<{}> = () => {
    return (
        <ControlsRow>
            <SearchGroup>
                <SearchInput />
            </SearchGroup>
            <ButtonGroup>
                <BatchActionButton />
                <ColumnsButton />
            </ButtonGroup>
        </ControlsRow>
    )
}

export default UserInputs