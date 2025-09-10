import { Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {DynamoDBService} from "./dynamoDB.service";

@Module({
    providers: [
        {
            provide: DynamoDBDocumentClient,
            useFactory: () => {
                const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
                return DynamoDBDocumentClient.from(dynamoDbClient, {
                    marshallOptions: {
                        removeUndefinedValues: true,
                        convertClassInstanceToMap: true,
                    },
                });
            },
        },
        DynamoDBService,
    ],
    exports: [DynamoDBDocumentClient, DynamoDBService],
})
export class DynamoDBModule {}
