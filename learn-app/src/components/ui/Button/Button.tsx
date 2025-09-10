import { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './button.module.css'

type ButtonProps = {
    children?: ReactNode;
    icon?: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    className?: string;
    disabled?: boolean;
    variant?: keyof typeof styles;
};

function Button({
    children,
    icon,
    onClick,
    type = 'button',
    className = '',
    disabled = false,
    variant,
}: ButtonProps) {
    const buttonClasses = clsx(
        styles.btn,
        variant && styles[variant],
        className
    )

    return (
        <button
            type={type}
            onClick={onClick}
            className={buttonClasses}
            disabled={disabled}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
}
export default Button;
