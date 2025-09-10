import {LoginResponse, LoginUser, RegistrationResponse, RegistrationUser} from "../types/auth.ts";
import {Role} from "../constants/roles.ts";
import {apiRequest} from "./apiRequest.ts";

export async function registerUser(user: RegistrationUser[Role]): Promise<RegistrationResponse> {
    return apiRequest<RegistrationResponse>('auth/register', 'POST', user);
}

export async function loginUser(user: LoginUser): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('auth/login', 'POST', user);
}

export async function logoutUser(): Promise<void> {
    await apiRequest<null>('auth/logout', 'GET');
}
