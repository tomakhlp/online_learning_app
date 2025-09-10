import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import {DynamoDBModule} from "../database/dynamoDB.module";
import {UserModule} from "../user/user.module";

@Module({
  imports: [DynamoDBModule, UserModule],
  controllers: [TrainingController],
  providers: [TrainingService]
})
export class TrainingModule {}
