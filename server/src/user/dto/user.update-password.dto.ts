import {IsNotEmpty, IsString} from "class-validator";
import {ERROR_CODES} from "../../common/constants/errors";

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty({ message: ERROR_CODES.PASSWORD_REQUIRED })
    currentPassword: string;

    @IsString()
    @IsNotEmpty({ message: ERROR_CODES.NEW_PASSWORD_REQUIRED })
    newPassword: string;

    @IsString()
    @IsNotEmpty({ message: ERROR_CODES.NEW_PASSWORD_REQUIRED })
    confirmPassword: string;
}
