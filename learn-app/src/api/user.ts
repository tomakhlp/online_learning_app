import {FullUser, UserAccountData, UserUpdatePassword, UserUpdatePhoto} from "../types/user.ts";
import {apiRequest} from "./apiRequest.ts";

export async function getUserInfo(): Promise<FullUser> {
    return apiRequest<FullUser>('users/me', 'GET', undefined, true);
}

export async function updateUser(user: UserAccountData): Promise<null> {
    return apiRequest<null>('users/me', 'PATCH', user, true);
}

export async function deleteUser(): Promise<void> {
    await apiRequest<null>('users/me', 'DELETE', undefined, true);
}

export async function uploadPhoto(photo: UserUpdatePhoto): Promise<null> {
    return apiRequest<null>('users/upload-photo', 'POST', photo, true);
}

export async function updatePassword(passwords: UserUpdatePassword): Promise<null> {
    return apiRequest<null>('users/update-password', 'PUT', passwords, true);
}
