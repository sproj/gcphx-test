import { TbSearch } from "react-icons/tb";
import styled from "styled-components"
import PrimaryButton from '../../Buttons/PrimaryButton'

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
`

const StyledSearchInput = styled.input`
  flex: 1;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  outline: none;

  &::placeholder {
    color: #aaa;
  }
`

const IconWrapper = styled.span`
  position: relative;
  top: 40%;
  right: -0.25rem;
  transform: translateY(-50%);
  color: #aaa;
  pointer-events: none;
`;

const StyledSearchButton = styled(PrimaryButton)`
    height: 100%;
    padding: 0 1rem;
    background-color: #2264E5;
    outline: none;
`

export const SearchInput: React.FC<{}> = () => {
    return (
        <InputWrapper>
            <IconWrapper>
                <TbSearch size={20} />
            </IconWrapper>
            <StyledSearchInput placeholder="Search..." />
            <StyledSearchButton>Search</StyledSearchButton>
        </InputWrapper>
    )
}

export default SearchInput