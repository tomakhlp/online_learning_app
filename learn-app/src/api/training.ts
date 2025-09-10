import {
    CreateTraining,
    SearchTraining,
    StudentDetailsResponse,
    TrainerDetailsResponse,
    TrainingResponse
} from "../types/training.ts";
import {apiRequest} from "./apiRequest.ts";

export async function getAllTrainings(): Promise<TrainingResponse[]> {
    return apiRequest<TrainingResponse[]>('trainings', 'GET');
}

export async function getMyTrainings(): Promise<TrainingResponse[]> {
    return apiRequest<TrainingResponse[]>('trainings/my', 'GET', undefined, true);
}

export async function getAllTrainers(): Promise<TrainerDetailsResponse[]> {
    return apiRequest<TrainerDetailsResponse[]>('trainings/trainers', 'GET');
}

export async function getMyTrainers(): Promise<TrainerDetailsResponse[]> {
    return apiRequest<TrainerDetailsResponse[]>('trainings/my-trainers', 'GET', undefined, true);
}

export async function getMyStudents(): Promise<StudentDetailsResponse[]> {
    return apiRequest<StudentDetailsResponse[]>('trainings/my-students', 'GET', undefined, true);
}

export async function createTraining(training: CreateTraining): Promise<TrainingResponse> {
    return apiRequest<TrainingResponse>('trainings', 'POST', training, true);
}

export async function searchTrainings(searchParams: SearchTraining): Promise<TrainingResponse[]> {
    const queryString = new URLSearchParams(
        Object.entries(searchParams).reduce((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
        }, {} as Record<string, string>)
    ).toString();

    return apiRequest<TrainingResponse[]>(`trainings/search?${queryString}`, 'GET', undefined, true);
}
