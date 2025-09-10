import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

describe('S3Service', () => {
    let s3Service: S3Service;

    const mockS3Client = {
        send: jest.fn(),
    };

    beforeEach(async () => {
        process.env.USER_PHOTO_CLOUDFRONT_DOMAIN = 'test-cloudfront-domain.com';

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                S3Service,
                {
                    provide: S3Client,
                    useValue: mockS3Client,
                },
            ],
        }).compile();

        s3Service = module.get<S3Service>(S3Service);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadFile', () => {
        it('should upload a file to S3 and return a public URL', async () => {
            const bucket = 'test-bucket';
            const key = 'test-key';
            const body = Buffer.from('test-data');
            const contentType = 'application/json';

            mockS3Client.send.mockResolvedValueOnce(undefined);

            const result = await s3Service.uploadFile(bucket, key, body, contentType);

            expect(mockS3Client.send).toHaveBeenCalledTimes(1);
            expect(mockS3Client.send).toHaveBeenCalledWith(
                expect.any(PutObjectCommand),
            );

            expect(result).toBe(`https://test-cloudfront-domain.com/${key}`);
        });

        it('should throw an error if S3 throws an exception', async () => {
            const bucket = 'test-bucket';
            const key = 'test-key';
            const body = Buffer.from('test-data');
            const contentType = 'application/json';

            mockS3Client.send.mockRejectedValueOnce(new Error('AWS error'));

            await expect(
                s3Service.uploadFile(bucket, key, body, contentType),
            ).rejects.toThrow('AWS error');

            expect(mockS3Client.send).toHaveBeenCalledTimes(1);
        });
    });

    describe('getFile', () => {
        it('should retrieve a file from S3 and return its buffer', async () => {
            const bucket = 'test-bucket';
            const key = 'test-key';
            const fileContent = Buffer.from('file-content');

            const stream = new Readable();
            stream.push(fileContent);
            stream.push(null);

            mockS3Client.send.mockResolvedValueOnce({
                Body: stream,
            });

            const result = await s3Service.getFile(bucket, key);

            expect(mockS3Client.send).toHaveBeenCalledTimes(1);
            expect(mockS3Client.send).toHaveBeenCalledWith(
                expect.any(GetObjectCommand),
            );

            expect(result).toEqual(fileContent);
        });

        it('should handle errors from S3 and throw an exception', async () => {
            const bucket = 'test-bucket';
            const key = 'test-key';

            mockS3Client.send.mockRejectedValueOnce(new Error('AWS error'));

            await expect(s3Service.getFile(bucket, key)).rejects.toThrow('AWS error');

            expect(mockS3Client.send).toHaveBeenCalledTimes(1);
        });

        it('should handle stream errors and throw an exception', async () => {
            const bucket = 'test-bucket';
            const key = 'test-key';

            const stream = new Readable();
            stream._read = () => {
                stream.emit('error', new Error('Stream error'));
            };

            mockS3Client.send.mockResolvedValueOnce({
                Body: stream,
            });

            await expect(s3Service.getFile(bucket, key)).rejects.toThrow('Stream error');

            expect(mockS3Client.send).toHaveBeenCalledTimes(1);
        });
    });
});
