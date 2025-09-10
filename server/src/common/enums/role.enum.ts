export enum Role {
    STUDENT = 'student',
    TRAINER = 'trainer',
}

export const ROLE_SHORTCUTS: { [key in Role]: string } = {
    [Role.STUDENT]: 'st',
    [Role.TRAINER]: 'tr',
};
