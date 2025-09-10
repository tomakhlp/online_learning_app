import Joi from 'joi';

export function validateForm<T extends object>(
    data: T,
    schema: Joi.ObjectSchema<T>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } {
    const { error } = schema.validate(data, { abortEarly: false, stripUnknown: true, });

    if (!error) {
        return { isValid: true, errors: {} };
    }

    const errors = Object.fromEntries(
        error.details.map(({ path, message }) => [path[0] as keyof T, message])
    ) as Partial<Record<keyof T, string>>;

    return { isValid: false, errors };
}
