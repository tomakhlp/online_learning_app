import {Module} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {AuthModule} from "./auth/auth.module";
import {TrainingModule} from './training/training.module';
import {DynamoDBModule} from "./database/dynamoDB.module";

@Module({
    imports: [
        DynamoDBModule,
        UserModule,
        AuthModule,
        TrainingModule,
    ],
})
export class AppModule {}
