import {Body, Controller, Get, Post, Query, Req, UseGuards} from '@nestjs/common';
import {TrainingService} from "./training.service";
import {CreateTrainingDto} from "./dto/training.create.dto";
import {SearchTrainingDto} from "./dto/training.search.dto";
import {TrainingResponseDto} from "./dto/training.response.dto";
import {AuthGuard} from "../auth/auth.guard";
import {Request} from "express";
import {extractUserId} from "../common/utils/extract-user-id";
import {TrainerDetailsResponseDto} from "../user/dto/user.trainer-details-response.dto";
import {StudentDetailsResponseDto} from "../user/dto/user.student-details-response.dto";

@Controller('trainings')
export class TrainingController {
    constructor(private readonly trainingService: TrainingService) {}

    @Get()
    async getAllTrainings(): Promise<{data: TrainingResponseDto[]}> {
        const result  = await this.trainingService.getAllTrainings();
        return {
            data: result
        }
    }

    @Get('my')
    @UseGuards(AuthGuard)
    async getMyTrainings(@Req() req: Request): Promise<{ data: TrainingResponseDto[] }> {
        const userId = extractUserId(req);

        const result = await this.trainingService.getUserTrainings(userId);

        return {
            data: result
        }
    }

    @Get('trainers')
    async getAllTrainers(): Promise<{ data: TrainerDetailsResponseDto[] }> {
        const result  = await this.trainingService.getAllTrainers();

        return {
            data: result,
        }
    }

    @Get('my-trainers')
    @UseGuards(AuthGuard)
    async getMyTrainers(@Req() req: Request): Promise<{ data: TrainerDetailsResponseDto[] }> {
        const userId = extractUserId(req);

        const result  = await this.trainingService.getStudentTrainers(userId);

        return {
            data: result,
        };
    }

    @Get('my-students')
    @UseGuards(AuthGuard)
    async getMyStudents(@Req() req: Request): Promise<{ data: StudentDetailsResponseDto[] }> {
        const userId = extractUserId(req);

        const result  = await this.trainingService.getTrainerStudents(userId);

        return {
            data: result,
        };
    }

    @Post()
    @UseGuards(AuthGuard)
    async createTraining(@Req() req: Request, @Body() createTrainingDto: CreateTrainingDto): Promise<{data: TrainingResponseDto}> {
        const userId = extractUserId(req);

        const result = await this.trainingService.createTraining(userId, createTrainingDto);
        return {
            data: result
        }
    }

    @Get('search')
    @UseGuards(AuthGuard)
    async searchTrainings(@Req() req: Request, @Query() searchTrainingDto: SearchTrainingDto): Promise<{data: TrainingResponseDto[]}>  {
        const userId = extractUserId(req);

        const result = await this.trainingService.searchTrainings(userId, searchTrainingDto);
        return {
            data: result
        };
    }
}
