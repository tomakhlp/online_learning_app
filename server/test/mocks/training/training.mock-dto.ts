import {TrainingResponseDto} from "../../../src/training/dto/training.response.dto";
import {TrainerDetailsResponseDto} from "../../../src/user/dto/user.trainer-details-response.dto";
import {CreateTrainingDto} from "../../../src/training/dto/training.create.dto";
import {TrainingTypeEntity} from "../../../src/entities/trainingType.entity";
import {SearchTrainingDto} from "../../../src/training/dto/training.search.dto";
import {mockTraining, mockTraining2, mockTraining3} from "./training.mock-entity";
import {
    mockSpecializationEntity, mockSpecializationEntity2,
    mockTrainerEntity,
    mockTrainerEntity2,
    mockUserEntity, mockUserEntity2, mockUserEntity3, mockUserEntity4
} from "../user/user.mock-entity";

export const mockTrainingInfo: TrainingResponseDto = {
    id: mockTraining.id,
    studentId: mockTraining.studentId,
    studentFirstName: mockUserEntity2.firstName,
    studentLastName: mockUserEntity2.lastName,
    trainerId: mockTraining.trainerId,
    trainerFirstName: mockUserEntity.firstName,
    trainerLastName: mockUserEntity.lastName,
    name: mockTraining.name,
    date: mockTraining.date,
    duration: mockTraining.duration,
    description: mockTraining.description,
    type: mockTraining.type,
}

export const mockTrainingInfo2: TrainingResponseDto = {
    id: mockTraining2.id,
    studentId: mockTraining2.studentId,
    studentFirstName: mockUserEntity2.firstName,
    studentLastName: mockUserEntity2.lastName,
    trainerId: mockTraining2.trainerId,
    trainerFirstName: mockUserEntity3.firstName,
    trainerLastName: mockUserEntity3.lastName,
    name: mockTraining2.name,
    date: mockTraining2.date,
    duration: mockTraining2.duration,
    description: mockTraining2.description,
    type: mockTraining2.type,
}

export const mockTrainingInfo3: TrainingResponseDto = {
    id: mockTraining3.id,
    studentId: mockTraining3.studentId,
    studentFirstName: mockUserEntity4.firstName,
    studentLastName: mockUserEntity4.lastName,
    trainerId: mockTraining3.trainerId,
    trainerFirstName: mockUserEntity.firstName,
    trainerLastName: mockUserEntity.lastName,
    name: mockTraining3.name,
    date: mockTraining3.date,
    duration: mockTraining3.duration,
    description: mockTraining3.description,
    type: mockTraining3.type,
}

export const mockTrainerDetails: TrainerDetailsResponseDto = {
    id: mockTrainerEntity.id,
    userId: mockTrainerEntity.userId,
    specialization: mockSpecializationEntity.specialization,
    firstName: mockUserEntity.firstName,
    lastName: mockUserEntity.lastName,
}

export const mockTrainerDetails2: TrainerDetailsResponseDto = {
    id: mockTrainerEntity2.id,
    userId: mockTrainerEntity2.userId,
    specialization: mockSpecializationEntity2.specialization,
    firstName: mockUserEntity3.firstName,
    lastName: mockUserEntity3.lastName,
}

export const mockCreateTrainingDto: CreateTrainingDto = {
    studentId: 'mockStudentId',
    trainerId: mockTrainerEntity.id,
    name: 'Training',
    date: mockTraining.date,
    duration: 3,
    description: 'description',
    type: { id: 'mockTypeId', trainingType: 'test' } as TrainingTypeEntity
};

export const baseMockSearchTrainingDtoByTrainer: SearchTrainingDto = {
    trainerName: 'John_Doe',
    specialization: 'specialization1',
    startDate: 1748476780,
    endDate: 1749945589
}

export const baseMockSearchTrainingDtoByStudent: SearchTrainingDto = {
    studentName: 'Marta_Black',
    startDate: 1748476008,
    endDate: 1750408255
}
