import {BaseUserResponseDto} from "./user.base-response.dto";

export class RegistrationResponseDto {
    accessToken: string;
    password: string;
    user: BaseUserResponseDto;
}
