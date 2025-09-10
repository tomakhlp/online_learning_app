import {Role, ROLES} from "../constants/roles.ts";

export const getSearchFieldsByRole = (role: Role) => {
    switch (role) {
        case ROLES.STUDENT:
            return [
                {
                    label: "input:LABELS.TRAINER_NAME",
                    name: "trainerName",
                    placeholder: "input:PLACEHOLDERS.TRAINER_NAME",
                    value: ""
                },
                {
                    label: "input:LABELS.SPECIALIZATION",
                    name: "specialization",
                    placeholder: "input:PLACEHOLDERS.SPECIALIZATION",
                    value: ""
                },
            ];
        case ROLES.TRAINER:
            return [
                {
                    label: "input:LABELS.STUDENT_NAME",
                    name: "studentName",
                    placeholder: "input:PLACEHOLDERS.STUDENT_NAME",
                    value: ""
                },
            ];
        default:
            return [];
    }
};
