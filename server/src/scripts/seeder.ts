import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {SPECIALIZATIONS} from "../data/specializations.data";
import {TRAINING_TYPES} from "../data/trainingTypes.data";
import {Logger} from "@nestjs/common";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);
const logger = new Logger('Seeder');

async function seedTable(tableName: string, items: any[]) {
    for (const item of items) {
        try {
            const params = { TableName: tableName, Item: item };
            await docClient.send(new PutCommand(params));
        } catch (error) {
            logger.error(`Failed to add to ${tableName}: ${JSON.stringify(item)}, Error: ${error.message}`);
        }
    }
}

async function seedDatabase(): Promise<void> {
    logger.log('Starting database seeding...');
    try {
        await seedTable('SpecializationTable', SPECIALIZATIONS);
        await seedTable('TrainingTypeTable', TRAINING_TYPES);

        logger.log('Database seeding successfully completed!');
    } catch (error) {
        logger.error('Seeder failed during execution.', error.message);
    }
}

seedDatabase();
