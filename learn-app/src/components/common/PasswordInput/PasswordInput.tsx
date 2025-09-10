import {ChangeEvent, ReactNode, useState} from "react";
import Input from "../../ui/Input/Input.tsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {useTranslation} from "react-i18next";

type PasswordInputProps = {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    id?: string;
    name?: string;
    placeholder?: string;
    label?: string;
    icon?: ReactNode;
};

function PasswordInput({
    value,
    onChange,
    error,
    id = "password-input",
    name = "password",
    placeholder,
    label,
    icon,
}: PasswordInputProps) {
    const { t } = useTranslation(['input', 'ariaLabel']);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <Input
            id={id}
            label={label || t('input:LABELS.PASSWORD')}
            name={name}
            value={value}
            type={showPassword ? "text" : "password"}
            onChange={onChange}
            placeholder={placeholder || t('input:PLACEHOLDERS.PASSWORD')}
            error={error}
            icon={icon}
            endIcon={
                <button
                    type="button"
                    aria-label={t('ariaLabel:TOGGLE_PASSWORD_VISIBILITY')}
                    onClick={togglePasswordVisibility}
                    className="align-middle focus:outline-none"
                >
                    {showPassword ? <AiOutlineEye/> : <AiOutlineEyeInvisible/>}
                </button>
            }
        />
    );
}

export default PasswordInput;
