export const ROLES = {
    STUDENT: "student",
    TRAINER: "trainer",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ALL_ROLES: Role[] = [ROLES.STUDENT, ROLES.TRAINER];

