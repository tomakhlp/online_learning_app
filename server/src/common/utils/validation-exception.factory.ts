import { BadRequestException } from '@nestjs/common';
import { ValidationError as ClassValidatorError } from 'class-validator';
import {ValidationError} from "./validation-error-formatter";

function transformErrors(error: ClassValidatorError, parentField?: string): ValidationError {
    const fieldPath = parentField ? `${parentField}.${error.property}` : error.property;

    return {
        field: fieldPath,
        constraints: error.constraints || null,
        children: error.children
            ? error.children.map((child) => transformErrors(child, fieldPath))
            : [],
    };
}

export function validationExceptionFactory(errors: ClassValidatorError[]): BadRequestException {
    const transformedErrors = errors.map((err) => transformErrors(err));
    return new BadRequestException(transformedErrors);
}
