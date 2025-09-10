import {RegistrationUser, StudentRegistrationData, TrainerRegistrationData} from "../../../types/auth.ts";
import {RegistrationErrors, StudentRegistrationErrors, TrainerRegistrationErrors} from "../../../types/errors.ts";
import {Role, ROLES} from "../../../constants/roles.ts";

export type RegistrationContext = {
    user: RegistrationUser[Role];
    errors: RegistrationErrors[Role];
};

export function isStudentContext(_context: RegistrationContext, role: Role): _context is RegistrationContext & {
    user: StudentRegistrationData;
    errors: StudentRegistrationErrors;
} {
    return role === ROLES.STUDENT;
}

export function isTrainerContext(_context: RegistrationContext, role: Role): _context is RegistrationContext & {
    user: TrainerRegistrationData;
    errors: TrainerRegistrationErrors;
} {
    return role === ROLES.TRAINER;
}
