import {ROLES} from "./roles.ts";
import {UserAccountData} from "../types/user.ts";

export interface Field {
    key: keyof UserAccountData;
    label: string;
    placeholder: string;
    defaultValue?: string;
}

export const USER_ACCOUNT_FIELDS = {
    general: [
        { key: "firstName", label: "input:LABELS.FIRST_NAME", placeholder: "input:PLACEHOLDERS.FIRST_NAME" },
        { key: "lastName", label: "input:LABELS.LAST_NAME", placeholder: "input:PLACEHOLDERS.LAST_NAME" },
        { key: "username", label: "input:LABELS.USERNAME", placeholder: "input:PLACEHOLDERS.USERNAME" },
        { key: "email", label: "input:LABELS.EMAIL", placeholder: "input:PLACEHOLDERS.EMAIL" },
    ] as Field[],
    roles: {
        [ROLES.STUDENT]: [
            { key: "dateOfBirth", label: "input:LABELS.DATE_OF_BIRTH",  defaultValue: "—", placeholder: "input:PLACEHOLDERS.DATE_OF_BIRTH"},
            { key: "address", label: "input:LABELS.ADDRESS", defaultValue: "—", placeholder: "input:PLACEHOLDERS.ADDRESS"},
        ] as Field[],
        [ROLES.TRAINER]: [
            { key: "specializationId", label: "input:LABELS.SPECIALIZATION", defaultValue: "—" },
        ] as Field[],
    },
};

