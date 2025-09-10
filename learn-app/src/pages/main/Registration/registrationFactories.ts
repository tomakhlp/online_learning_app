import { RegistrationUser} from '../../../types/auth.ts';
import {Role, ROLES} from "../../../constants/roles.ts";
import {RegistrationErrors} from "../../../types/errors.ts";

export function createInitialUser(role: Role): RegistrationUser[Role] {
    switch (role) {
        case ROLES.STUDENT:
            return {
                role: ROLES.STUDENT,
                firstName: "",
                lastName: "",
                email: "",
                dateOfBirth: "",
                address: "",
            } as RegistrationUser[Role];
        case ROLES.TRAINER:
            return {
                role: ROLES.TRAINER,
                firstName: "",
                lastName: "",
                email: "",
                specializationId: "",
            } as RegistrationUser[Role];
        default:
            throw new Error(`Unsupported role: ${role}`);
    }
}

export function createInitialErrors(role: Role): RegistrationErrors[Role] {
    switch (role) {
        case ROLES.STUDENT:
            return {} as RegistrationErrors[Role];
        case ROLES.TRAINER:
            return {} as RegistrationErrors[Role];
        default:
            throw new Error(`Unsupported role: ${role}`);
    }
}
