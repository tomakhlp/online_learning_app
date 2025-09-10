import {Role} from "../constants/roles.ts";

export interface StudentEntity {
    id: string;
    userId: string;
    dateOfBirth?: string;
    address?: string;
}

export interface TrainerEntity {
    id: string;
    userId: string;
    specializationId: string;
}

export interface BaseUser {
    id: string;
    username: string;
    email: string;
    photo: string;
}

export interface FullUser extends BaseUser {
    firstName: string;
    lastName: string;
    isActive: boolean;
    role: Role;
    roleData: StudentEntity | TrainerEntity;
}

export interface UserAccountData {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    isActive?: boolean;
    dateOfBirth?: string;
    address?: string;
    specializationId?: string;
}

export interface UserUpdatePhoto {
    data: string
}

export interface UserUpdatePassword {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
