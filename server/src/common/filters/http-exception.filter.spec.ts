import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODES, SERVER_ERROR_TEXT } from '../constants/errors';

jest.mock('../utils/validation-error-formatter', () => ({
    formatValidationErrors: () => [
        { field: 'email', errorCode: 'INVALID_EMAIL' },
    ],
}));

describe('HttpExceptionFilter', () => {
    let filter: HttpExceptionFilter;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [HttpExceptionFilter],
        }).compile();

        filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
        jest.spyOn(filter['logger'], 'error').mockImplementation(() => {});
        jest.spyOn(filter['logger'], 'warn').mockImplementation(() => {});
    });

    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    const createHost = (url = '/test'): ArgumentsHost =>
        ({
            switchToHttp: () => ({
                getResponse: () => ({ status: mockStatus }),
                getRequest: () => ({ url }),
            }),
        }) as unknown as ArgumentsHost;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('handles HttpException with errorCode and message', () => {
        const message = 'Resource not found';
        const exception = new HttpException(
            { errorCode: ERROR_CODES.NOT_FOUND, message },
            HttpStatus.NOT_FOUND,
        );

        const host = createHost();
        filter.catch(exception, host);

        expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
        expect(mockJson).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 404,
                errorCode: ERROR_CODES.NOT_FOUND,
                message: 'Resource not found',
                error: 'NOT_FOUND',
                path: '/test',
                timestamp: expect.any(String),
            }),
        );
    });

    it('handles HttpException with validation errors', () => {
        const validationErrors = [
            {
                property: 'email',
                constraints: { isEmail: 'Invalid email' },
            },
        ];

        const exception = new HttpException({ message: validationErrors }, HttpStatus.BAD_REQUEST);
        const host = createHost();
        filter.catch(exception, host);

        expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockJson).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 400,
                error: 'BAD_REQUEST',
                path: '/test',
                timestamp: expect.any(String),
                validationErrors: expect.arrayContaining([
                    expect.objectContaining({
                        field: 'email',
                        errorCode: 'INVALID_EMAIL',
                    }),
                ]),
            }),
        );
    });

    it('handles generic Error', () => {
        const exception = new Error('Something went wrong');
        const host = createHost();
        filter.catch(exception, host);

        expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(mockJson).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 500,
                errorCode: ERROR_CODES.UNKNOWN_ERROR,
                message: 'Something went wrong',
                error: 'INTERNAL_SERVER_ERROR',
                path: '/test',
                timestamp: expect.any(String),
            }),
        );
    });

    it('handles plain object with errorCode and message', () => {
        const exception = { errorCode: ERROR_CODES.NOT_FOUND, message: 'Custom error' };
        const host = createHost();
        filter.catch(exception, host);

        expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(mockJson).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 500,
                errorCode: ERROR_CODES.NOT_FOUND,
                message: 'Custom error',
                error: 'INTERNAL_SERVER_ERROR',
                path: '/test',
                timestamp: expect.any(String),
            }),
        );
    });

    it('handles completely unknown input', () => {
        const exception = 12345 as any;
        const host = createHost();
        filter.catch(exception, host);

        expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(mockJson).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 500,
                errorCode: ERROR_CODES.UNKNOWN_ERROR,
                message: SERVER_ERROR_TEXT.UNKNOWN_ERROR,
                error: 'INTERNAL_SERVER_ERROR',
                path: '/test',
                timestamp: expect.any(String),
            }),
        );
    });
});
