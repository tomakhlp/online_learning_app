import {TFunction} from "i18next";

interface ValidationError {
    field: string;
    errorCode: string;
}

interface ServerError {
    errorCode?: string;
    message?: string;
    validationErrors?: ValidationError[];
}

export function isServerError(err: any): err is ServerError {
    return err && typeof err === 'object' && ('errorCode' in err || 'validationErrors' in err);
}

export function parseApiErrors(
    err: ServerError,
    tError: TFunction<'error'>
): Record<string, string> {
    const result: Record<string, string> = {};

    if (Array.isArray(err.validationErrors)) {
        for (const { field, errorCode } of err.validationErrors) {
            const translation = tError(errorCode);
            result[field] = translation !== errorCode ? translation : tError('UNKNOWN_ERROR');
        }
        return result;
    }

    if (err.errorCode) {
        const translation = tError(err.errorCode);

        result.global = translation !== err.errorCode ? translation : tError('UNKNOWN_ERROR');
        return result;
    }

    result.global = tError('UNKNOWN_ERROR');
    return result;
}

export function handleApiError(err: unknown, tError: TFunction<'error'>) {
    if (isServerError(err)) {
        return parseApiErrors(err, tError);
    }
    return { global: tError('UNKNOWN_ERROR') };
}
