export interface ValidationError {
    field: string;
    constraints: { [type: string]: string } | null;
    children?: ValidationError[];
}

export interface ValidationErrorResponse {
    field: string;
    errorCode: string;
}

export function formatValidationErrors(errors: ValidationError[]): ValidationErrorResponse[] {
    const formattedErrors: ValidationErrorResponse[] = [];


    function processError(error: ValidationError) {
        if (error.constraints) {
            const constraintKey = Object.keys(error.constraints)[0];
            formattedErrors.push({
                field: error.field,
                errorCode: error.constraints[constraintKey],
            });
        }

        if (error.children && error.children.length > 0) {
            error.children.forEach((childError) => processError(childError));
        }
    }

    errors.forEach((error) => processError(error));

    return formattedErrors;
}
