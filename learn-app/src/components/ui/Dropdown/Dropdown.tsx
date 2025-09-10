import { AiOutlineDown } from 'react-icons/ai';
import clsx from 'clsx';
import { useMenuAutoClose } from '../../../hooks/useMenuAutoClose.tsx';
import {getBorderClass, getLabelClass} from "../../../utils/getValidationStyles.ts";
import {BiError} from "react-icons/bi";
import Button from "../Button/Button.tsx";

type DropdownProps = {
    options: { id: string; label: string }[];
    id?: string;
    onChange: (id: string) => void;
    label?: string;
    wrapperStyles?: string;
    labelStyles?: string;
    dropdownStyles?: string;
    buttonStyles?: string;
    optionStyles?: string;
    defaultValue?: string;
    error?: string;
    showValidation?: boolean;
    showInteractions?: boolean;
    showRadio?: boolean;
};

export function Dropdown({
     options,
     id,
     onChange,
     label,
     wrapperStyles,
     labelStyles,
     dropdownStyles,
     buttonStyles,
     optionStyles,
     defaultValue,
     error,
     showValidation,
     showInteractions = false,
     showRadio = false,
}: DropdownProps) {
    const { isOpen, toggleOpen, elementRef } = useMenuAutoClose();

    const borderClass = getBorderClass(error, !!id, showInteractions, showValidation);
    const labelClass = getLabelClass(error, !!id, showValidation)

    const handleSelect = (value: string) => {
        onChange(value);
        toggleOpen();
    };

    const displayOption = id
        ? options.find((option) => option.id === id)?.label
        : defaultValue || options[0]?.label;

    return (
        <div ref={elementRef} className={clsx("relative text-left", wrapperStyles)}>
            {label && <label className={clsx(labelStyles, labelClass, 'flex leading-7')}>{label}</label>}
            <Button
                type={'button'}
                onClick={toggleOpen}
                className={clsx(
                    'flex justify-between items-center px-4 h-[44px] gap-3 border rounded-md hover:bg-bg hover:cursor-pointer',
                    borderClass,
                    buttonStyles,
                    id || !defaultValue ? 'text-body-100' : 'text-[var(--color-basic-350)]'
                )}
            >
                {displayOption}
                <AiOutlineDown className="w-4 h-4 text-[var(--color-body-100)]" />
            </Button>

            <div
                className={clsx(
                    'absolute min-w-full shadow-(--box-shadow-card-100) z-20 bg-(--color-bg) rounded-md transform transition-all duration-200 overflow-y-auto',
                    isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none',
                    dropdownStyles
                )}
            >
                <div className="py-1 flex flex-col">
                    {options.map((option) => (
                        <button
                            type={'button'}
                            key={option.id}
                            onClick={() => handleSelect(option.id)}
                            className={clsx(
                                'flex items-center px-4 py-2 hover:bg-basic-100 cursor-pointer transition text-left gap-4',
                                optionStyles,
                                option.id === id && 'font-semibold'
                            )}
                        >
                            {showRadio && (
                                <div className={clsx(
                                        "flex items-center justify-center w-4 h-4 mr-3 rounded-full",
                                        option.id === id ? "border-primary-100" : "border-body-100",
                                        "border"
                                    )}
                                >
                                    {option.id === id && (
                                        <div className="w-2 h-2 bg-primary-100 rounded-full"></div>
                                    )}
                                </div>
                            )}
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
            {error && (
                <div className={'text-(--color-important-150) text-sm mt-1 flex flex-row items-center gap-1'}>
                    <BiError/>
                    {error}
                </div>
            )}
        </div>
    );
}
