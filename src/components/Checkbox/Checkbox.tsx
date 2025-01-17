import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const StyledCheckbox = styled.div`
    display: inline-block;
    width: 16px;
    height: 16px;
    position: relative;
    border: 2px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
    background-color: #fff;
    transition: background-color 0.2s, border-color 0.2s;

    /* Background and border color for checked/indeterminate states */
    &[data-checked='true'],
    &[data-indeterminate='true'] {
        background-color: #007bff;
        border-color: #007bff;
    }

    /* Tick for checked state */
    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 4px;
        height: 8px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: translate(-50%, -50%) rotate(45deg);
        opacity: 0;
        transition: opacity 0.2s;
    }

    /* Horizontal bar for indeterminate state */
    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 10px;
        height: 2px;
        background-color: white;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.2s;
    }

    /* Show tick when checked */
    &[data-checked='true']::before {
        opacity: 1;
    }

    /* Show horizontal bar when indeterminate */
    &[data-indeterminate='true']::after {
        opacity: 1;
    }
`;


export interface CheckboxProps {
    checked: boolean;
    indeterminate: boolean;
    onChange: (checked: boolean) => void;
}

export const Checkbox = ({
    checked = false,
    indeterminate = false,
    onChange,
}: CheckboxProps) => {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    const handleClick = () => {
        if (!indeterminate) {
            onChange(!checked);
        } else {
            // Reset to checked when clicking an indeterminate checkbox
            onChange(true);
        }
    };

    return (
        <StyledCheckbox
            role="checkbox"
            aria-checked={indeterminate ? 'mixed' : checked}
            data-checked={checked}
            data-indeterminate={indeterminate}
            onClick={handleClick}
        />
    );
};
