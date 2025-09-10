import {BaseUserResponseDto} from "./user.base-response.dto";

export class LoginResponseDto {
    accessToken: string;
    user: BaseUserResponseDto;
}
