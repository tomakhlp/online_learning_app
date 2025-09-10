import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDBService } from './dynamoDB.service';
import {
    GetCommand,
    QueryCommand,
    ScanCommand,
    PutCommand,
    DeleteCommand,
    UpdateCommand, DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

describe('DynamoDBService', () => {
    let dynamoDBService: DynamoDBService;

    const mockDocClient = {
        send: jest.fn(),
    };

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DynamoDBService,
                {
                    provide: DynamoDBDocumentClient,
                    useValue: mockDocClient,
                },
            ],
        }).compile();

        dynamoDBService = module.get<DynamoDBService>(DynamoDBService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getDataById', () => {
        it('should return data for the given ID', async () => {
            const tableName = 'TestTable';
            const id = '123';
            const mockItem = { id, name: 'Test Item' };
            mockDocClient.send.mockResolvedValueOnce({ Item: mockItem });

            const result = await dynamoDBService.getDataById(tableName, id);

            expect(mockDocClient.send).toHaveBeenCalledTimes(1);
            expect(mockDocClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
            expect(result).toEqual(mockItem);
        });

        it('should return null if no item is found', async () => {
            mockDocClient.send.mockResolvedValueOnce({ Item: null });

            const result = await dynamoDBService.getDataById('TestTable', '123');

            expect(result).toBeNull();
        });
    });

    describe('getDataByPartitionValue', () => {
        it('should return items matching partition key and value', async () => {
            const tableName = 'TestTable';
            const indexName = 'TestIndex';
            const partitionKey = 'testKey';
            const partitionValue = 'testValue';
            const mockItems = [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }];

            mockDocClient.send.mockResolvedValueOnce({ Items: mockItems });

            const result = await dynamoDBService.getDataByPartitionValue(
                tableName,
                indexName,
                partitionKey,
                partitionValue,
            );

            expect(mockDocClient.send).toHaveBeenCalledTimes(1);
            expect(mockDocClient.send).toHaveBeenCalledWith(expect.any(QueryCommand));
            expect(result).toEqual(mockItems);
        });

        it('should return an empty array if no items are found', async () => {
            mockDocClient.send.mockResolvedValueOnce({ Items: [] });

            const result = await dynamoDBService.getDataByPartitionValue(
                'TestTable',
                'TestIndex',
                'testKey',
                'testValue',
            );

            expect(result).toEqual([]);
        });

        it('should include date range in query when startDate and endDate provided', async () => {
            const tableName = 'TestTable';
            const indexName = 'TestIndex';
            const partitionKey = 'testKey';
            const partitionValue = 'testValue';
            const startDate = 1749945600;
            const endDate = 1750636800;
            const mockItems = [{ id: '1', name: 'Item 1' }];

            mockDocClient.send.mockResolvedValueOnce({ Items: mockItems });

            const result = await dynamoDBService.getDataByPartitionValue(
                tableName,
                indexName,
                partitionKey,
                partitionValue,
                startDate,
                endDate
            );

            expect(mockDocClient.send).toHaveBeenCalledTimes(1);
            expect(mockDocClient.send).toHaveBeenCalledWith(expect.any(QueryCommand));

            const callArg = mockDocClient.send.mock.calls[0][0] as QueryCommand;
            const input = (callArg as any).input || callArg['input'] || callArg;

            expect(input.ExpressionAttributeNames).toHaveProperty('#date', 'date');
            expect(input.ExpressionAttributeValues).toHaveProperty(':start', startDate);
            expect(input.ExpressionAttributeValues).toHaveProperty(':end', endDate);

            expect(result).toEqual(mockItems);
        });
    });

    describe('getOneByPartitionValue', () => {
        it('should return the first item from partition results', async () => {
            const mockItems = [{ id: '1' }, { id: '2' }];
            mockDocClient.send.mockResolvedValueOnce({ Items: mockItems });

            const result = await dynamoDBService.getOneByPartitionValue(
                'TestTable',
                'TestIndex',
                'testKey',
                'testValue',
            );

            expect(result).toEqual(mockItems[0]);
        });

        it('should return null if no items found', async () => {
            mockDocClient.send.mockResolvedValueOnce({ Items: [] });

            const result = await dynamoDBService.getOneByPartitionValue(
                'TestTable',
                'TestIndex',
                'testKey',
                'testValue',
            );

            expect(result).toBeNull();
        });
    });

    describe('getDataByPartitionValues', () => {
        it('should return flattened array of results', async () => {
            mockDocClient.send
                .mockResolvedValueOnce({ Items: [{ id: '1' }] })
                .mockResolvedValueOnce({ Items: [{ id: '2' }] });

            const result = await dynamoDBService.getDataByPartitionValues(
                'TestTable',
                'TestIndex',
                'key',
                ['val1', 'val2'],
            );

            expect(result).toEqual([{ id: '1' }, { id: '2' }]);
            expect(mockDocClient.send).toHaveBeenCalledTimes(2);
        });

        it('should return empty array for empty input list', async () => {
            const result = await dynamoDBService.getDataByPartitionValues(
                'TestTable',
                'TestIndex',
                'key',
                [],
            );

            expect(result).toEqual([]);
            expect(mockDocClient.send).not.toHaveBeenCalled();
        });
    });

    describe('getAllItems', () => {
        it('should return all items from the table', async () => {
            const tableName = 'TestTable';
            const mockItems = [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }];

            mockDocClient.send.mockResolvedValueOnce({ Items: mockItems });

            const result = await dynamoDBService.getAllItems(tableName);

            expect(mockDocClient.send).toHaveBeenCalledTimes(1);
            expect(mockDocClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
            expect(result).toEqual(mockItems);
        });

        it('should return an empty array if no items are found', async () => {
            mockDocClient.send.mockResolvedValueOnce({ Items: [] });

            const result = await dynamoDBService.getAllItems('TestTable');

            expect(result).toEqual([]);
        });
    });

    describe('saveEntity', () => {
        it('should save an entity and return it', async () => {
            const tableName = 'TestTable';
            const item = { id: '123', name: 'New Item' };

            mockDocClient.send.mockResolvedValueOnce({});

            const result = await dynamoDBService.saveEntity(tableName, item);

            expect(mockDocClient.send).toHaveBeenCalledTimes(1);
            expect(mockDocClient.send).toHaveBeenCalledWith(expect.any(PutCommand));
            expect(result).toEqual(item);
        });
    });

    describe('deleteEntity', () => {
        it('should delete an entity by its key', async () => {
            const tableName = 'TestTable';
            const key = { id: '123' };

            mockDocClient.send.mockResolvedValueOnce({});

            await dynamoDBService.deleteEntity(tableName, key);

            expect(mockDocClient.send).toHaveBeenCalledTimes(1);
            expect(mockDocClient.send).toHaveBeenCalledWith(expect.any(DeleteCommand));
        });
    });

    describe('updateData', () => {
        it('should update data for the given key', async () => {
            const tableName = 'TestTable';
            const key = { id: '123' };
            const updates = { name: 'Updated Item' };

            mockDocClient.send.mockResolvedValueOnce({});

            await dynamoDBService.updateData(tableName, key, updates);

            expect(mockDocClient.send).toHaveBeenCalledTimes(1);
            expect(mockDocClient.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
        });
    });
});
