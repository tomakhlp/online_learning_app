import {ROLES} from "../constants/roles.ts";

export interface BaseRegistrationErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export interface StudentRegistrationErrors extends BaseRegistrationErrors {
    dateOfBirth?: string;
    address?: string;
}

export interface TrainerRegistrationErrors extends BaseRegistrationErrors {
    specializationId?: string;
}

export type RegistrationErrors = {
    [ROLES.STUDENT]: StudentRegistrationErrors;
    [ROLES.TRAINER]: TrainerRegistrationErrors;
};
