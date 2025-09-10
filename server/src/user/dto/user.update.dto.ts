import {IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {ERROR_CODES} from "../../common/constants/errors";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: ERROR_CODES.FIRSTNAME_REQUIRED })
    firstName?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: ERROR_CODES.LASTNAME_REQUIRED })
    lastName?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: ERROR_CODES.USERNAME_REQUIRED })
    username?: string;

    @IsOptional()
    @IsEmail({}, { message: ERROR_CODES.EMAIL_REQUIRED})
    @IsNotEmpty({ message: ERROR_CODES.EMAIL_REQUIRED })
    email?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    dateOfBirth?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: ERROR_CODES.SPECIALIZATION_REQUIRED })
    specializationId?: string;
}
