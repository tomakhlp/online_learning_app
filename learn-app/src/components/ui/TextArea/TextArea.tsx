import { ChangeEvent } from "react";
import { BiError } from "react-icons/bi";
import clsx from "clsx";
import { getBorderClass, getLabelClass } from "../../../utils/getValidationStyles.ts";

interface TextAreaProps {
    label?: string;
    className?: string;
    showValidation?: boolean;
    textAreaFieldClassName?: string;
    labelClassName?: string;
    placeholder?: string;
    disabled?: boolean;
    value?: string;
    name?: string;
    id?: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
}

function TextArea({
      label,
      className,
      showValidation = true,
      textAreaFieldClassName,
      labelClassName,
      placeholder,
      error,
      disabled = false,
      ...props
}: TextAreaProps) {
    const borderClass = getBorderClass(error, !!props.value, true, showValidation, disabled);
    const labelClass = getLabelClass(error, !!props.value, showValidation, disabled);

    return (
        <div className={clsx('flex flex-col w-full', className)}>
            {label && (
                <label className={clsx('font-bold leading-7', labelClass, labelClassName)} htmlFor={props.id}>
                    {label}
                </label>
            )}
            <div className={clsx('leading-7 flex items-center border px-[16px] rounded-md w-full', borderClass, textAreaFieldClassName)}>
                <textarea
                    className={clsx('w-full bg-transparent outline-none resize-none min-w-0 placeholder-[var(--color-basic-350)] disabled:cursor-not-allowed')}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...props}
                />
            </div>
            {error && (
                <div className={'text-(--color-important-150) text-sm mt-1 flex flex-row items-center gap-1'}>
                    <BiError />
                    {error}
                </div>
            )}
        </div>
    );
}

export default TextArea;
