import {ChangeEvent, ReactNode} from "react";
import styles from './input.module.css'
import {BiError} from "react-icons/bi";
import clsx from "clsx";
import {getBorderClass, getLabelClass} from "../../../utils/getValidationStyles.ts";

interface InputProps {
    label?: string;
    className?: string;
    showValidation?: boolean;
    inputFieldClassName?: string;
    labelClassName?: string;
    placeholder?: string;
    icon?: ReactNode;
    endIcon?: ReactNode;
    disabled?: boolean;
    type?: 'text' | 'password';
    value?: string | number;
    name?: string;
    id?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

function Input({label, className, showValidation = true, inputFieldClassName, labelClassName, icon, placeholder, endIcon, error, disabled = false, ...props}: InputProps) {

    const borderClass = getBorderClass(error, !!props.value, true, showValidation, disabled);
    const labelClass = getLabelClass(error, !!props.value, showValidation, disabled)

    return (
        <div className={clsx(styles.inputWrapper, className, 'textbox')}>
            {label &&
                <label className={clsx(styles.label, labelClass, labelClassName)} htmlFor={props.id}>
                    {label}
                </label>
            }
            <div className={clsx(styles.input, borderClass, inputFieldClassName)}>
                {icon && <div className={styles.inputIcon}>{icon}</div>}
                <input
                    className={styles.inputField}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...props}
                />
                {endIcon && <div className={styles.inputEndIcon}>{endIcon}</div>}
            </div>
            {error && (
                <div className={styles.inputTextError}>
                    <BiError />
                    {error}
                </div>
            )}
        </div>
    )
}
export default Input;
