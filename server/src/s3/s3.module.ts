import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import {S3Client} from "@aws-sdk/client-s3";

@Module({
    providers: [
        S3Service,
        {
            provide: S3Client,
            useFactory: () => new S3Client({ region: 'us-east-1' }),
        },
    ],
    exports: [S3Service],
})
export class S3Module {}
