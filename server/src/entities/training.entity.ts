import {TrainingTypeEntity} from "./trainingType.entity";

export interface TrainingEntity {
    id: string;
    studentId: string;
    trainerId: string;
    name: string;
    type: TrainingTypeEntity;
    date: number;
    duration: number;
    description: string;
    staticPartition: string;
}
