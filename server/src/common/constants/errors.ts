export const ERROR_CODES = {
    USERNAME_REQUIRED: 'USERNAME_REQUIRED',
    PASSWORD_REQUIRED: 'PASSWORD_REQUIRED',
    INVALID_PASSWORD: 'INVALID_PASSWORD',
    FIRSTNAME_REQUIRED: 'FIRSTNAME_REQUIRED',
    LASTNAME_REQUIRED: 'LASTNAME_REQUIRED',
    EMAIL_REQUIRED: 'EMAIL_REQUIRED',
    INVALID_ROLE: 'INVALID_ROLE',
    INVALID_USER_ID: 'INVALID_USER_ID',
    SPECIALIZATION_REQUIRED: 'SPECIALIZATION_REQUIRED',
    CAPTCHA_REQUIRED: 'CAPTCHA_REQUIRED',
    NEW_PASSWORD_REQUIRED: 'NEW_PASSWORD_REQUIRED',
    CONFIRMED_REQUIRED: 'CONFIRMED_REQUIRED',
    CONFIRMED_MATCH: 'CONFIRMED_MATCH',
    EMAIL_IS_ALREADY_TAKEN: 'EMAIL_IS_ALREADY_TAKEN',
    USERNAME_IS_ALREADY_TAKEN: 'USERNAME_IS_ALREADY_TAKEN',
    UNSUPPORTED_FILE_FORMAT: 'UNSUPPORTED_FILE_FORMAT',
    NOT_FOUND: 'NOT_FOUND',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    TOKEN_REQUIRED: 'TOKEN_REQUIRED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    INVALID_TRAINING_TYPE_ID: 'INVALID_TRAINING_TYPE_ID',
    MISMATCH_TRAINING_TYPE: 'MISMATCH_TRAINING_TYPE',
    SPECIALIZATION_NOT_FOUND: 'SPECIALIZATION_NOT_FOUND',
    INVALID_DATE_RANGE: 'INVALID_DATE_RANGE',
    PARTIAL_DATE_PARAMETERS: 'PARTIAL_DATE_PARAMETERS',
    INVALID_FILTER_COMBINATION: 'INVALID_FILTER_COMBINATION',
    PHOTO_REQUIRED: 'PHOTO_REQUIRED',
    TRAINER_REQUIRED: 'TRAINER_REQUIRED',
    STUDENT_REQUIRED: 'STUDENT_REQUIRED',
    TRAINING_NAME_REQUIRED: 'TRAINING_NAME_REQUIRED',
    DATE_REQUIRED: 'DATE_REQUIRED',
    DURATION_REQUIRED: 'DURATION_REQUIRED',
    INVALID_DURATION: 'INVALID_DURATION',
    DESCRIPTION_REQUIRED: 'DESCRIPTION_REQUIRED',
    TYPE_REQUIRED: 'TYPE_REQUIRED',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export const SERVER_ERROR_TEXT: Record<ErrorCode, string> = {
    [ERROR_CODES.USERNAME_REQUIRED]: 'Username is required',
    [ERROR_CODES.PASSWORD_REQUIRED]: 'Password is required',
    [ERROR_CODES.INVALID_PASSWORD]: 'Invalid password',
    [ERROR_CODES.FIRSTNAME_REQUIRED]: 'First name is required',
    [ERROR_CODES.LASTNAME_REQUIRED]: 'Last name is required',
    [ERROR_CODES.EMAIL_REQUIRED]: 'Email address is required',
    [ERROR_CODES.INVALID_ROLE]: 'Invalid user role provided',
    [ERROR_CODES.INVALID_USER_ID]: 'No associated role data found for userId',
    [ERROR_CODES.SPECIALIZATION_REQUIRED]: 'Specialization is required',
    [ERROR_CODES.CAPTCHA_REQUIRED]: 'Captcha validation is required',
    [ERROR_CODES.NEW_PASSWORD_REQUIRED]: 'New password is required',
    [ERROR_CODES.CONFIRMED_REQUIRED]: 'Password confirmation is required',
    [ERROR_CODES.CONFIRMED_MATCH]: 'Passwords do not match',
    [ERROR_CODES.EMAIL_IS_ALREADY_TAKEN]: 'The provided email address is already taken',
    [ERROR_CODES.USERNAME_IS_ALREADY_TAKEN]: 'The provided username is already taken',
    [ERROR_CODES.UNSUPPORTED_FILE_FORMAT]: 'The file format is not supported',
    [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found',
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Internal server error',
    [ERROR_CODES.UNKNOWN_ERROR]: 'An unknown error occurred',
    [ERROR_CODES.TOKEN_REQUIRED]: 'Authorization token is missing',
    [ERROR_CODES.INVALID_TOKEN]: 'Invalid or expired token',
    [ERROR_CODES.USER_NOT_FOUND]: 'User not found',
    [ERROR_CODES.INVALID_TRAINING_TYPE_ID]: 'Training type with ID {typeId} does not exist',
    [ERROR_CODES.MISMATCH_TRAINING_TYPE]: 'Mismatch between trainingType for ID {typeId}: expected {expectedTrainingType}, but got {providedTrainingType}',
    [ERROR_CODES.SPECIALIZATION_NOT_FOUND]: 'Specialization not found',
    [ERROR_CODES.INVALID_DATE_RANGE]: 'The start date cannot be greater than the end date',
    [ERROR_CODES.PARTIAL_DATE_PARAMETERS]: 'Both start date and end date must be provided together',
    [ERROR_CODES.INVALID_FILTER_COMBINATION]: 'You cannot search by student and trainer/specialization at the same time',
    [ERROR_CODES.PHOTO_REQUIRED]: 'Photo is required',
    [ERROR_CODES.TRAINER_REQUIRED]: 'Trainer is required',
    [ERROR_CODES.STUDENT_REQUIRED]: 'Student is required',
    [ERROR_CODES.TRAINING_NAME_REQUIRED]: 'Training name is required',
    [ERROR_CODES.DATE_REQUIRED]: 'Date is required',
    [ERROR_CODES.DURATION_REQUIRED]: 'Duration is required and must be a number',
    [ERROR_CODES.INVALID_DURATION]: 'Duration must be an integer greater than 0',
    [ERROR_CODES.DESCRIPTION_REQUIRED]: 'Description is required',
    [ERROR_CODES.TYPE_REQUIRED]: 'Type is required',
};

export function formatErrorMessage(
    errorCode: ErrorCode,
    dynamicValues: Record<string, string>
): string {
    let errorMessage = SERVER_ERROR_TEXT[errorCode];

    for (const key in dynamicValues) {
        errorMessage = errorMessage.replace(`{${key}}`, dynamicValues[key]);
    }

    return errorMessage;
}
