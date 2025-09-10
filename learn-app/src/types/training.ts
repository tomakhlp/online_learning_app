export interface TrainerDetailsResponse {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    specialization: string;
}

export interface TrainerData {
    name: string;
    specialization: string;
}

export interface StudentDetailsResponse {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
}

export interface StudentData {
    name: string;
    isActive: boolean;
}

export interface TrainingTypeEntity {
    id: string;
    trainingType: string;
}

export interface TrainingResponse {
    id: string;
    studentId: string;
    studentFirstName: string | null,
    studentLastName: string | null,
    trainerId: string;
    trainerFirstName: string | null,
    trainerLastName: string | null,
    name: string;
    type: TrainingTypeEntity;
    date: number;
    duration: number;
    description: string;
}

export interface TrainingData {
    date: string;
    studentName: string | undefined,
    trainerName: string | undefined,
    name: string;
    type: string;
    duration: string;
}

export interface SearchTraining {
    trainerName?: string;
    studentName?: string;
    specialization?: string;
    startDate?: number;
    endDate?: number;
}

export interface CreateTraining {
    studentId: string;
    trainerId: string;
    name: string;
    date: number;
    duration: number;
    description: string;
    type: TrainingTypeEntity;
}

export type CreateNewTraining = Omit<CreateTraining, 'studentId' | 'type' | 'duration'>& {
    typeId: string;
    duration: string;
};
