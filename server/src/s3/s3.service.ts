import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
    private readonly cloudfrontDomain: string;

    constructor(private readonly s3Client: S3Client) {
        this.cloudfrontDomain = process.env.USER_PHOTO_CLOUDFRONT_DOMAIN!;
        if (!this.cloudfrontDomain) {
            throw new Error('USER_PHOTO_CLOUDFRONT_DOMAIN env variable is not set');
        }
    }

    async uploadFile(bucket: string, key: string, body: Buffer, contentType: string): Promise<string> {
        const params = {
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
        };

        await this.s3Client.send(new PutObjectCommand(params));
        return `https://${this.cloudfrontDomain}/${key}`;
    }

    async getFile(bucket: string, key: string): Promise<Buffer> {
        const params = {
            Bucket: bucket,
            Key: key,
        };

        const response = await this.s3Client.send(new GetObjectCommand(params));
        const stream = response.Body as Readable;

        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            stream
                .on('data', (chunk) => chunks.push(chunk))
                .on('end', () => resolve(Buffer.concat(chunks)))
                .on('error', reject);
        });
    }
}
