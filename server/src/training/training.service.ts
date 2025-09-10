import {BadRequestException, Injectable} from '@nestjs/common';
import {TrainingEntity} from "../entities/training.entity";
import {CreateTrainingDto} from "./dto/training.create.dto";
import {v4 as uuidv4} from "uuid";
import {ERROR_CODES, formatErrorMessage} from "../common/constants/errors";
import {TrainingTypeEntity} from "../entities/trainingType.entity";
import {SearchTrainingDto} from "./dto/training.search.dto";
import {UserService} from "../user/user.service";
import {DynamoDBService} from "../database/dynamoDB.service";
import {TrainerEntity} from "../entities/trainer.entity";
import {TrainingResponseDto} from "./dto/training.response.dto";
import {Role} from "../common/enums/role.enum";
import {TrainerDetailsResponseDto} from "../user/dto/user.trainer-details-response.dto";
import {UserEntity} from "../entities/user.entity";
import {SpecializationEntity} from "../entities/specialization.entity";
import {StudentDetailsResponseDto} from "../user/dto/user.student-details-response.dto";
import {StudentEntity} from "../entities/student.entity";

@Injectable()
export class TrainingService {
    private readonly trainingTable = 'TrainingTable';
    private readonly trainingTypeTable = 'TrainingTypeTable'

    constructor(
        private readonly dbService: DynamoDBService,
        private readonly userService: UserService,
    ) {}

    private async toTrainingResponseDto(entity: TrainingEntity): Promise<TrainingResponseDto> {
        const student = await this.userService.getStudentById(entity.studentId);
        const studentName = student ? await this.userService.getUserById(student.userId) : null;

        const trainer = await this.userService.getTrainerById(entity.trainerId);
        const trainerName = trainer ? await this.userService.getUserById(trainer.userId) : null;

        return {
            id: entity.id,
            name: entity.name,
            type: entity.type,
            date: entity.date,
            duration: entity.duration,
            description: entity.description,
            studentId: entity.studentId,
            studentFirstName: studentName?.firstName || null,
            studentLastName: studentName?.lastName || null,
            trainerId: entity.trainerId,
            trainerFirstName: trainerName?.firstName || null,
            trainerLastName: trainerName?.lastName || null,
        };
    }

    private async formatTrainings(
        fetchFn: () => Promise<TrainingEntity[]>,
    ): Promise<TrainingResponseDto[]> {
        const trainings = await fetchFn();

        if (trainings.length === 0) {
            return [];
        }

        return Promise.all(trainings.map(training => this.toTrainingResponseDto(training)));
    }


    private toTrainerDetailsResponseDTO(
        trainer: TrainerEntity,
        user: UserEntity | null,
        specialization: SpecializationEntity | null,
    ): TrainerDetailsResponseDto {
        return {
            id: trainer.id,
            userId: trainer.userId,
            firstName: user?.firstName || 'N/A',
            lastName: user?.lastName || 'N/A',
            specialization: specialization?.specialization || 'N/A',
        };
    }

    private toStudentDetailsResponseDTO(
        student: StudentEntity,
        user: UserEntity | null,
    ): StudentDetailsResponseDto {
        return {
            id: student.id,
            userId: student.userId,
            firstName: user?.firstName || 'N/A',
            lastName: user?.lastName || 'N/A',
            isActive: user?.isActive || false,
        };
    }

    private createTrainingEntity(data: CreateTrainingDto, trainingType: TrainingTypeEntity): TrainingEntity {
        return {
            id: uuidv4(),
            studentId: data.studentId,
            trainerId: data.trainerId,
            name: data.name,
            date: data.date,
            duration: data.duration,
            description: data.description,
            type: trainingType,
            staticPartition: 'all'
        };
    }

    private async validateTrainingType(type: { id: string; trainingType: string }): Promise<TrainingTypeEntity> {
        const trainingTypeFromDb = await this.dbService.getDataById<TrainingTypeEntity>(this.trainingTypeTable, type.id);

        if (!trainingTypeFromDb) {
            const message = formatErrorMessage(ERROR_CODES.INVALID_TRAINING_TYPE_ID, { typeId: type.id });
            throw new BadRequestException({
                errorCode: ERROR_CODES.INVALID_TRAINING_TYPE_ID,
                message: message
            });
        }

        if (trainingTypeFromDb.trainingType !== type.trainingType.toLowerCase()) {
            const message = formatErrorMessage(ERROR_CODES.MISMATCH_TRAINING_TYPE, {
                typeId: type.id,
                expectedTrainingType: trainingTypeFromDb.trainingType,
                providedTrainingType: type.trainingType,
            });
            throw new BadRequestException({
                errorCode: ERROR_CODES.MISMATCH_TRAINING_TYPE,
                message: message
            });
        }

        return trainingTypeFromDb;
    }

    private validateDateRange(
        startDate?: number,
        endDate?: number
    ): void {
        if ((startDate && !endDate) || (!startDate && endDate)) {
            throw new BadRequestException({errorCode: ERROR_CODES.PARTIAL_DATE_PARAMETERS});
        }

        if (startDate && endDate && startDate > endDate) {
            throw new BadRequestException({errorCode: ERROR_CODES.INVALID_DATE_RANGE});
        }
    }

    private async filterByStudentName(
        trainerId: string,
        studentName: string,
        dateFrom?: number,
        dateTo?: number
    ): Promise<TrainingEntity[]> {
        const students = await this.userService.getStudentsByName(studentName);
        if (students.length === 0) return [];

        const studentIds = students.map((s) => s.id);

        const trainings = await this.dbService.getDataByPartitionValues<TrainingEntity>(
            this.trainingTable,
            'StudentIdDateIndex',
            'studentId',
            studentIds,
            dateFrom,
            dateTo
        );

        return trainings.filter((training) => training.trainerId === trainerId);
    }

    private async getTrainersByFilters(
        trainerName?: string,
        specialization?: string
    ): Promise<TrainerEntity[]> {
        let trainersBySpec: TrainerEntity[] = [];

        if (specialization) {
            const specializationId = await this.userService.getSpecializationIdByName(specialization);
            if (!specializationId) return [];

            trainersBySpec = await this.userService.getTrainersBySpecializationId(specializationId);
        }

        if (trainerName && trainersBySpec.length > 0) {
            const trainersByName = await this.userService.getTrainersByName(trainerName);
            const specTrainerIds = new Set(trainersBySpec.map(t => t.id));
            return trainersByName.filter(t => specTrainerIds.has(t.id));
        }

        if (specialization) {
            return trainersBySpec;
        }

        if (trainerName) {
            return this.userService.getTrainersByName(trainerName);
        }

        return [];
    }

    private async filterByTrainerNameAndSpecialization(
        studentId: string,
        trainerName?: string,
        specialization?: string,
        dateFrom?: number,
        dateTo?: number,
    ): Promise<TrainingEntity[]> {
        const trainers = await this.getTrainersByFilters(trainerName, specialization);
        if (trainers.length === 0) return [];

        const trainerIds = trainers.map(t => t.id);

        const trainings = await this.dbService.getDataByPartitionValues<TrainingEntity>(
            this.trainingTable,
            'TrainerIdDateIndex',
            'trainerId',
            trainerIds,
            dateFrom,
            dateTo
        );

        return trainings.filter((training) => training.studentId === studentId);
    }

    private async filterByDateRange(
        role: Role,
        roleId: string,
        dateFrom: number,
        dateTo: number
    ): Promise<TrainingEntity[]> {
        const trainings = await this.dbService.getDataByPartitionValues<TrainingEntity>(
            this.trainingTable,
            'DateIndex',
            'staticPartition',
            ['all'],
            dateFrom,
            dateTo
        );

        if (role === Role.TRAINER) {
            return trainings.filter((training) => training.trainerId === roleId);
        } else if (role === Role.STUDENT) {
            return trainings.filter((training) => training.studentId === roleId);
        }

        return []
    }

    private async getTrainingsByStudentId(studentId: string): Promise<TrainingEntity[]> {
        return await this.dbService.getDataByPartitionValue<TrainingEntity>(
            this.trainingTable,
            'StudentIdDateIndex',
            'studentId',
            studentId,
        );
    }

    private async getTrainingsByTrainerId(trainerId: string): Promise<TrainingEntity[]> {
        return await this.dbService.getDataByPartitionValue<TrainingEntity>(
            this.trainingTable,
            'TrainerIdDateIndex',
            'trainerId',
            trainerId,
        );
    }

    private async getTrainingsByRole(role: Role, roleId: string): Promise<TrainingEntity[]> {
        switch (role) {
            case Role.STUDENT:
                return await this.getTrainingsByStudentId(roleId);

            case Role.TRAINER:
                return await this.getTrainingsByTrainerId(roleId);

            default:
                throw new BadRequestException({ errorCode: ERROR_CODES.INVALID_ROLE });
        }
    }

    private async getTrainerDetails(trainer: TrainerEntity): Promise<TrainerDetailsResponseDto> {
        const user = await this.userService.getUserById(trainer.userId);
        const specialization = await this.userService.getSpecializationById(trainer.specializationId);

        return this.toTrainerDetailsResponseDTO(trainer, user, specialization);
    }

    private async getStudentDetails(student: StudentEntity): Promise<StudentDetailsResponseDto> {
        const user = await this.userService.getUserById(student.userId);

        return this.toStudentDetailsResponseDTO(student, user);
    }

    async getAllTrainings(): Promise<TrainingResponseDto[]> {
        const trainings = await this.dbService.getAllItems<TrainingEntity>(this.trainingTable)
        return Promise.all(trainings.map(training => this.toTrainingResponseDto(training)));
    }

    async getUserTrainings(userId: string): Promise<TrainingResponseDto[]> {
        await this.userService.validateUser(userId);

        const { role, roleData } = await this.userService.getRoleData(userId);

        const trainings = await this.getTrainingsByRole(role, roleData.id);
        return Promise.all(trainings.map(training => this.toTrainingResponseDto(training)));
    }

    async getAllTrainers(): Promise<TrainerDetailsResponseDto[]> {
        const trainers = await this.dbService.getAllItems<TrainerEntity>(this.userService.trainerTable);
        return await Promise.all(trainers.map((trainer) => this.getTrainerDetails(trainer)));
    }

    async getStudentTrainers(userId: string): Promise<TrainerDetailsResponseDto[]> {
        await this.userService.validateUser(userId);

        const { role, roleData } = await this.userService.getRoleData(userId);

        if (role !== Role.STUDENT) {
            throw new BadRequestException({errorCode: ERROR_CODES.INVALID_ROLE});
        }

        const trainings = await this.getTrainingsByRole(role, roleData.id);

        const uniqueTrainerIds = [...new Set(trainings.map(training => training.trainerId))];

        if (uniqueTrainerIds.length === 0) {
            return [];
        }

        const trainers = await this.userService.getTrainersByIds(uniqueTrainerIds);

        return await Promise.all(trainers.map((trainer) => this.getTrainerDetails(trainer)));
    }

    async getTrainerStudents(userId: string): Promise<StudentDetailsResponseDto[]> {
        await this.userService.validateUser(userId);

        const { role, roleData } = await this.userService.getRoleData(userId);

        if (role !== Role.TRAINER) {
            throw new BadRequestException({errorCode: ERROR_CODES.INVALID_ROLE});
        }

        const trainings = await this.getTrainingsByRole(role, roleData.id);

        const uniqueStudentIds = [...new Set(trainings.map(training => training.studentId))]

        if (uniqueStudentIds.length === 0) {
            return [];
        }

        const students = await this.userService.getStudentsByIds(uniqueStudentIds);

        return await Promise.all(students.map((student) => this.getStudentDetails(student)));
    }

    async createTraining(userId: string, trainingDto: CreateTrainingDto): Promise<TrainingResponseDto> {
        await this.userService.validateUser(userId);

        const validatedTrainingType = await this.validateTrainingType(trainingDto.type);

        const newTraining = this.createTrainingEntity(trainingDto, validatedTrainingType);
        const savedTraining = await this.dbService.saveEntity<TrainingEntity>(this.trainingTable, newTraining);
        return this.toTrainingResponseDto(savedTraining);
    }

    async searchTrainings(userId: string, searchTrainingDto: SearchTrainingDto): Promise<TrainingResponseDto[]> {
        await this.userService.validateUser(userId);

        const { trainerName, studentName, specialization, startDate, endDate } = searchTrainingDto;
        this.validateDateRange(startDate, endDate);

        if (studentName && (trainerName || specialization)) {
            throw new BadRequestException({errorCode: ERROR_CODES.INVALID_FILTER_COMBINATION});
        }

        const { role, roleData } = await this.userService.getRoleData(userId);

        if (role === Role.TRAINER && studentName) {
            return this.formatTrainings(() => this.filterByStudentName(roleData.id, studentName, startDate, endDate));
        }

        if (role === Role.STUDENT && (trainerName || specialization)) {
            return this.formatTrainings(() => this.filterByTrainerNameAndSpecialization(
                roleData.id,
                trainerName,
                specialization,
                startDate,
                endDate
            ));
        }

        if (startDate && endDate) {
            return this.formatTrainings(() => this.filterByDateRange(role, roleData.id, startDate, endDate));
        }

        return []
    }
}
