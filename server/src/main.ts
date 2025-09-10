import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import { AppModule } from './app.module';
import {Logger, ValidationPipe} from "@nestjs/common";
import {HttpExceptionFilter} from "./common/filters/http-exception.filter";
import {validationExceptionFactory} from "./common/utils/validation-exception.factory";
import {Callback, Context, Handler} from "aws-lambda";

let server: Handler;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });

    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:5174', 'https://d2l137q0bywlg4.cloudfront.net'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    app.useGlobalFilters(new HttpExceptionFilter());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            forbidUnknownValues: true,
            exceptionFactory: validationExceptionFactory,
        }),
    );

    await app.init();

    const logger = new Logger('Bootstrap');
    logger.log(`NestJS application successfully initialized!`);

    const expressApp = app.getHttpAdapter().getInstance();

    return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
