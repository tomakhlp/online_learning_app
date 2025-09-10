import {TrainingTypeEntity} from "../../../src/entities/trainingType.entity";
import {TrainingEntity} from "../../../src/entities/training.entity";

export const mockTrainingTypeEntity: TrainingTypeEntity = {
    id: 'mockTypeId',
    trainingType: 'test'
}

export const mockTraining: TrainingEntity = {
    id: 'mockTrainingId',
    studentId: 'mockStudentId',
    trainerId: 'mockTrainerId',
    name: 'Training',
    date: 1748476800,
    duration: 3,
    description: 'description',
    type: mockTrainingTypeEntity,
    staticPartition: 'all',
};

export const mockTraining2: TrainingEntity = {
    id: 'mockTrainingId2',
    studentId: 'mockStudentId2',
    trainerId: 'mockTrainerId2',
    name: 'Training 2',
    date: 1749340800,
    duration: 1,
    description: 'description2',
    type: mockTrainingTypeEntity,
    staticPartition: 'all',
};

export const mockTraining3: TrainingEntity = {
    id: 'mockTrainingId3',
    studentId: 'mockStudentId2',
    trainerId: 'mockTrainerId',
    name: 'Training 3',
    date: 1749945600,
    duration: 5,
    description: 'description2',
    type: mockTrainingTypeEntity,
    staticPartition: 'all',
};
