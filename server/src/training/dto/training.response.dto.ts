import {TrainingTypeEntity} from "../../entities/trainingType.entity";

export class TrainingResponseDto {
    id: string;
    studentId: string;
    studentFirstName: string | null;
    studentLastName: string | null;
    trainerId: string;
    trainerFirstName: string | null;
    trainerLastName: string | null;
    name: string;
    type: TrainingTypeEntity;
    date: number;
    duration: number;
    description: string;
}
