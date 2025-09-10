import {IsNotEmpty, IsString} from "class-validator";
import {ERROR_CODES} from "../../common/constants/errors";

export class LoginUserDto {
    @IsString({ message: ERROR_CODES.USERNAME_REQUIRED })
    @IsNotEmpty({ message: ERROR_CODES.USERNAME_REQUIRED })
    username: string;

    @IsString({ message: ERROR_CODES.PASSWORD_REQUIRED })
    @IsNotEmpty({ message: ERROR_CODES.PASSWORD_REQUIRED })
    password: string;
}
