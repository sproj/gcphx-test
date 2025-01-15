import React, { useState, useRef, PropsWithChildren } from 'react';
import styled from 'styled-components';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";

interface DropdownButtonProps {
    buttonType: 'primary' | 'secondary';
    label: React.ReactNode;
    openIcon?: React.ReactNode;
    closeIcon?: React.ReactNode;
}

const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Dropdown = styled.div<{ isVisible: boolean }>`
    position: absolute;
    top: calc(100% + 2px); 
    right: 0; 

    display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
    flex-direction: column;

    gap: 0.25rem;

    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;

    box-shadow: 0px 3px 6px 0px #4B515B26;
    box-shadow: 0px 1px 3px 0px #00000026;

    z-index: 1000;
    min-width: 200px; 
    padding: 4px 0px;
`;

const DropdownButton: React.FC<PropsWithChildren<DropdownButtonProps>> = ({
    buttonType,
    label,
    children,
    openIcon = <TbCaretUpFilled size={16} />,
    closeIcon = <TbCaretDownFilled size={16} /> }) => {
    const [isVisible, setIsVisible] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsVisible((prev) => !prev);
    };

    const closeDropdown = () => {
        setIsVisible(false);
    };

    const ButtonComponent = buttonType === 'primary' ? PrimaryButton : SecondaryButton;

    return (
        <ButtonContainer ref={buttonRef}>
            <ButtonComponent onClick={toggleDropdown}>
                {label}
                {isVisible ? openIcon : closeIcon}
            </ButtonComponent>
            <Dropdown isVisible={isVisible} onMouseLeave={closeDropdown}>
                {React.Children.map(children, child => <DropdownItem>{child}</DropdownItem>)}
            </Dropdown>
        </ButtonContainer>
    );
};

export default DropdownButton;

const DropdownItem = styled.div`
    padding: 0.5rem;
    cursor: pointer;

    &:hover {
        background: #EBF2FF; 
  }
`;
