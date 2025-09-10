import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    Logger,
    HttpException,
    HttpStatus
} from "@nestjs/common";
import {ERROR_CODES, ErrorCode, SERVER_ERROR_TEXT} from "../constants/errors";
import {
    formatValidationErrors,
    ValidationError,
    ValidationErrorResponse
} from "../utils/validation-error-formatter";

interface ExceptionResponse {
    errorCode: ErrorCode;
    message: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const httpStatus = this.getHttpStatus(exception);
        const exceptionResponse = this.parseException(exception);
        const errorResponse = this.formatErrorResponse(exceptionResponse, httpStatus);

        this.logException(httpStatus, errorResponse, exception);

        response.status(httpStatus).json(this.buildJsonResponse(httpStatus, errorResponse, request));
    }

    private getHttpStatus(exception: any): number {
        if (exception instanceof HttpException) {
            return exception.getStatus();
        }

        const status = exception?.status;
        return typeof status === 'number' ? status : HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private parseException(exception: unknown): Partial<ExceptionResponse> | { message: ValidationError[] } {
        if (exception instanceof HttpException) {
            return this.handleHttpException(exception);
        }

        if (exception instanceof Error) {
            return this.handleError(exception);
        }

        if (this.isPlainObject(exception)) {
            return this.handleCustomError(exception);
        }

        return {
            errorCode: ERROR_CODES.UNKNOWN_ERROR,
            message: SERVER_ERROR_TEXT.UNKNOWN_ERROR,
        };
    }

    private handleHttpException(exception: HttpException): any {
        const exceptionResponse = exception.getResponse();

        if (this.isValidationError(exceptionResponse)) {
            return { message: exceptionResponse.message };
        }

        if (typeof exceptionResponse === 'string') {
            return { message: exceptionResponse };
        }

        if (this.isPlainObject(exceptionResponse)) {
            return exceptionResponse;
        }

        return { message: 'Unexpected HttpException error' };
    }

    private handleError(exception: Error): Partial<ExceptionResponse> {
        return {
            errorCode: ERROR_CODES.UNKNOWN_ERROR,
            message: exception.message || SERVER_ERROR_TEXT.UNKNOWN_ERROR,
        };
    }

    private handleCustomError(exception: any): Partial<ExceptionResponse> {
        const message = exception.message || exception.detail || SERVER_ERROR_TEXT[ERROR_CODES.UNKNOWN_ERROR];
        const errorCode = exception.errorCode || ERROR_CODES.UNKNOWN_ERROR;
        return {
            errorCode,
            message,
        };
    }

    private isValidationError(response: any): response is { message: ValidationError[] } {
        return this.isPlainObject(response) && Array.isArray(response?.message);
    }

    private isPlainObject(value: any): boolean {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }

    private formatErrorResponse(
        exceptionResponse: Partial<ExceptionResponse> | { message: ValidationError[] | ValidationErrorResponse[] },
        httpStatus: number,
    ): ExceptionResponse | { validationErrors: ValidationErrorResponse[] } {
        if (Array.isArray(exceptionResponse?.message) && exceptionResponse.message.length > 0) {
            if ('constraints' in exceptionResponse.message[0]) {
                const validationErrors = formatValidationErrors(exceptionResponse.message as ValidationError[]);
                return { validationErrors: validationErrors };
            }

            if ('field' in exceptionResponse.message[0] && 'errorCode' in exceptionResponse.message[0]) {
                return { validationErrors: exceptionResponse.message as ValidationErrorResponse[] };
            }
        }

        const errorCode: ErrorCode = this.getErrorCode(exceptionResponse, httpStatus);
        const message: string = this.getErrorMessage(exceptionResponse, errorCode, httpStatus);

        return { errorCode, message };
    }

    private getErrorCode(exceptionResponse: Partial<ExceptionResponse> | { message: any }, httpStatus: number): ErrorCode {
        if ('errorCode' in exceptionResponse && exceptionResponse.errorCode) {
            return exceptionResponse.errorCode;
        }
        return this.getDefaultErrorCode(httpStatus);
    }

    private getDefaultErrorCode(httpStatus: number): ErrorCode {
        switch (httpStatus) {
            case HttpStatus.NOT_FOUND:
                return ERROR_CODES.NOT_FOUND;
            case HttpStatus.INTERNAL_SERVER_ERROR:
                return ERROR_CODES.INTERNAL_SERVER_ERROR;
            default:
                return ERROR_CODES.UNKNOWN_ERROR;
        }
    }

    private getErrorMessage(
        exceptionResponse: Partial<ExceptionResponse> | { message: any },
        errorCode: ErrorCode,
        httpStatus: number
    ): string {
        return (
            exceptionResponse?.message ||
            SERVER_ERROR_TEXT[errorCode] ||
            HttpStatus[httpStatus] ||
            SERVER_ERROR_TEXT.UNKNOWN_ERROR
        );
    }

    private logException(
        httpStatus: number,
        errorResponse: ExceptionResponse | { validationErrors: ValidationErrorResponse[] },
        exception: any
    ): void {
        if ('validationErrors' in errorResponse) {
            this.logger.warn(`Validation Error: ${JSON.stringify(errorResponse.validationErrors)}`);
            return
        }

        if (httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                `${errorResponse.errorCode}: ${errorResponse.message}`,
                exception?.stack || 'No stack trace available',
            );
        } else {
            this.logger.warn(
                `${errorResponse.errorCode}: ${errorResponse.message}`
            );
        }
    }

    private buildJsonResponse(
        httpStatus: number,
        errorResponse: ExceptionResponse | { validationErrors: ValidationErrorResponse[] },
        request: any
    ) {
        return {
            statusCode: httpStatus,
            ...errorResponse,
            error: HttpStatus[httpStatus],
            timestamp: new Date().toISOString(),
            path: request.url,
        };
    }
}
