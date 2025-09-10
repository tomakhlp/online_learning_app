export function getBorderClass(
    error?: string,
    hasValue = false,
    showInteractions = true,
    showValidation = true,
    disabled = false
) {
    const defaultBase = 'border-[var(--color-basic-350)] bg-[var(--color-basic-150)]';
    const errorBase = 'border-[var(--color-important-150)] bg-bg';
    const validBase = 'border-[var(--color-secondary-100)] bg-bg';
    const interactions = `hover:border-[var(--color-primary-150)]
                          focus-within:border-[var(--color-primary-100)]
                          focus-within:bg-bg
                          hover:bg-bg`
    ;
    const disabledBase = 'bg-[var(--color-basic-100] border-[var(--color-basic-250)] cursor-not-allowed';

    if (disabled) return disabledBase;

    if (error) return errorBase;
    const result = (hasValue && showValidation) ? validBase : defaultBase;

    return showInteractions ? `${result} ${interactions}` : result;
}

export function getLabelClass(
    error?: string,
    hasValue = false,
    showValidation = true,
    disabled = false
) {
    if (disabled) return 'text-[var(--color-basic-350)]';
    if (error) return 'text-[var(--color-important-150)]';
    return (hasValue && showValidation) ? 'text-[var(--color-secondary-100)]' : 'text-[var(--color-body-100)]';
}
