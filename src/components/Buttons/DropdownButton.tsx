import React, { useState, useRef, PropsWithChildren, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import IconButton from './IconButton';
import TertiaryButton from './TertiaryButton';
import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";

interface DropdownButtonProps {
    buttonType: 'primary' | 'secondary' | 'tertiary' | 'icon';
    label?: React.ReactNode;
    openIcon?: React.ReactNode;
    closeIcon?: React.ReactNode;
}

export const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownDiv = styled.div<{ $isVisible: boolean; $top: number; $left: number }>`
    position: absolute;
    top: ${({ $top }) => `${$top}px`};
    left: ${({ $left }) => `${$left}px`};

    display: ${({ $isVisible }) => ($isVisible ? 'flex' : 'none')};
    flex-direction: column;

    gap: 0.25rem;

    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;

    box-shadow: 0px 3px 6px 0px #4B515B26;
    z-index: 1000;
    min-width: 200px; 
    padding: 4px 0px;
`;

interface DropdownProps {
    children: React.ReactNode;
    isVisible: boolean;
    triggerRef: React.RefObject<HTMLElement>;
}

export const Dropdown = ({ children, isVisible, triggerRef }: DropdownProps) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
            });
        }
    }, [isVisible, triggerRef]);

    if (!isVisible) return null;

    return ReactDOM.createPortal(
        <DropdownDiv $isVisible={isVisible} $top={position.top} $left={position.left}>
            {children}
        </DropdownDiv>,
        document.body
    );
};

const DropdownButton: React.FC<PropsWithChildren<DropdownButtonProps>> = ({
    buttonType,
    label,
    children,
    openIcon,
    closeIcon
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsVisible((prev) => !prev);
    };

    const closeDropdown = () => {
        setIsVisible(false);
    };

    const ButtonComponent = buttonComponentFromType(buttonType) as React.ComponentType<{
        onClick: () => void;
        children?: React.ReactNode;
    }>;

    return (
        <ButtonContainer ref={buttonRef}>
            <ButtonComponent onClick={toggleDropdown}>
                {label && label}
                {isVisible ? openIcon : closeIcon}
            </ButtonComponent>
            <Dropdown isVisible={isVisible} triggerRef={buttonRef}>
                {React.Children.map(children, (child) => (
                    <DropdownItem onClick={closeDropdown}>{child}</DropdownItem>
                ))}
            </Dropdown>
        </ButtonContainer>
    );
};

type ButtonComponentType =
    | typeof PrimaryButton
    | typeof SecondaryButton
    | typeof TertiaryButton
    | typeof IconButton;

const buttonComponentFromType = (buttonType: 'primary' | 'secondary' | 'tertiary' | 'icon'): ButtonComponentType => {
    switch (buttonType) {
        case 'primary':
            return PrimaryButton;
        case 'secondary':
            return SecondaryButton;
        case 'tertiary':
            return TertiaryButton;
        case 'icon':
            return IconButton;
        default:
            return SecondaryButton;
    }
};

export default DropdownButton;

const DropdownItem = styled.div`
    padding: 0.5rem;
    cursor: pointer;

    &:hover {
        background: #EBF2FF;
    }
`;
