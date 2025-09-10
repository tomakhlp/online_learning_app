import { Injectable } from '@nestjs/common';
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    QueryCommandInput,
    ScanCommand,
    UpdateCommand
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoDBService {
    constructor(private readonly docClient: DynamoDBDocumentClient) {}

    async getDataById<T>(tableName: string, id: string): Promise<T | null> {
        const params = {
            TableName: tableName,
            Key: { id },
        };
        const result = await this.docClient.send(new GetCommand(params));
        return (result.Item || null) as T | null;
    }

    async getDataByPartitionValue<T>(
        tableName: string,
        indexName: string,
        partitionKey: string,
        partitionValue: string,
        startDate?: number,
        endDate?: number
    ): Promise<T[]> {
        const expressionNames: Record<string, string> = {
            '#pk': partitionKey,
        };

        const expressionValues: Record<string, any> = {
            ':value': partitionValue.toLowerCase(),
        };

        let keyCondition = '#pk = :value';

        if (startDate && endDate) {
            expressionNames['#date'] = 'date';
            expressionValues[':start'] = startDate;
            expressionValues[':end'] = endDate;
            keyCondition += ' AND #date BETWEEN :start AND :end';
        }

        const params: QueryCommandInput = {
            TableName: tableName,
            IndexName: indexName,
            KeyConditionExpression: keyCondition,
            ExpressionAttributeNames: expressionNames,
            ExpressionAttributeValues: expressionValues,
        };

        const result = await this.docClient.send(new QueryCommand(params));
        return (result.Items || []) as T[];
    }

    async getOneByPartitionValue<T>(
        tableName: string,
        indexName: string,
        partitionKey: string,
        partitionValue: string,
        startDate?: number,
        endDate?: number
    ): Promise<T | null> {
        const data = await this.getDataByPartitionValue<T>(
            tableName,
            indexName,
            partitionKey,
            partitionValue,
            startDate,
            endDate
        );
        return data.length > 0 ? data[0] : null;
    }

    async getDataByPartitionValues<T>(
        tableName: string,
        indexName: string,
        partitionKey: string,
        partitionValues: string[],
        dateFrom?: number,
        dateTo?: number
    ): Promise<T[]> {
        if (partitionValues.length === 0) return [];

        const results = await Promise.all(
            partitionValues.map(value =>
                this.getDataByPartitionValue<T>(
                    tableName,
                    indexName,
                    partitionKey,
                    value,
                    dateFrom,
                    dateTo
                )
            )
        );

        return results.flat();
    }

    async getAllItems<T = Record<string, any>>(tableName: string): Promise<T[]> {
        const params = {
            TableName: tableName,
        };

        const result = await this.docClient.send(new ScanCommand(params));
        return (result.Items || []) as T[];
    }

    async saveEntity<T extends Record<string, any>>(
        tableName: string,
        item: T
    ): Promise<T> {
        const createCommand = new PutCommand({
            TableName: tableName,
            Item: item,
        });

        await this.docClient.send(createCommand);
        return item;
    }

    async deleteEntity(
        tableName: string,
        key: Record<string, any>
    ): Promise<void> {
        const deleteCommand = new DeleteCommand({
            TableName: tableName,
            Key: key,
        });

        await this.docClient.send(deleteCommand);
    }

    async updateData<T>(
        tableName: string,
        key: Record<string, any>,
        updates: Partial<T>
    ): Promise<void> {
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, value]) => value !== undefined)
        );

        if (Object.keys(filteredUpdates).length === 0) {
            return;
        }

        const updateExpression = `SET ${Object.keys(filteredUpdates)
            .map((field, index) => `#${field} = :value${index}`)
            .join(', ')}`;

        const expressionAttributeNames = Object.keys(filteredUpdates).reduce(
            (acc, field) => {
                acc[`#${field}`] = field;
                return acc;
            },
            {} as Record<string, string>
        );

        const expressionAttributeValues = Object.keys(filteredUpdates).reduce(
            (acc, field, index) => {
                acc[`:value${index}`] = filteredUpdates[field];
                return acc;
            },
            {} as Record<string, any>
        );

        const params = {
            TableName: tableName,
            Key: key,
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
        };

        await this.docClient.send(new UpdateCommand(params));
    }
}
