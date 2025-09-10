import {BaseUser} from "./user.ts";
import {ROLES} from "../constants/roles.ts";

export type LoginUser = {
    username: string;
    password: string;
}

export interface BaseRegistrationData {
    firstName: string;
    lastName: string;
    email: string;
}

export interface StudentRegistrationData extends BaseRegistrationData {
    role: typeof ROLES.STUDENT;
    dateOfBirth?: string;
    address?: string;
}

export interface TrainerRegistrationData extends BaseRegistrationData {
    role: typeof ROLES.TRAINER;
    specializationId: string;
}

export type RegistrationUser = {
    [ROLES.STUDENT]: StudentRegistrationData;
    [ROLES.TRAINER]: TrainerRegistrationData;
};

export interface RegistrationResponse {
    accessToken: string;
    password: string;
    user: BaseUser;
}

export interface LoginResponse {
    accessToken: string;
    user: BaseUser;
}
