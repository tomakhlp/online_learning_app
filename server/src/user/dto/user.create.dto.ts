import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import {ERROR_CODES} from "../../common/constants/errors";

export class CreateUserDto {
    @IsString({ message: ERROR_CODES.FIRSTNAME_REQUIRED })
    @IsNotEmpty({ message: ERROR_CODES.FIRSTNAME_REQUIRED })
    firstName: string;

    @IsString({ message: ERROR_CODES.LASTNAME_REQUIRED })
    @IsNotEmpty({ message: ERROR_CODES.LASTNAME_REQUIRED })
    lastName: string;

    @IsEmail({}, { message: ERROR_CODES.EMAIL_REQUIRED})
    @IsNotEmpty({ message: ERROR_CODES.EMAIL_REQUIRED })
    email: string;

    @IsEnum(Role, { message: ERROR_CODES.INVALID_ROLE })
    @IsNotEmpty({ message: ERROR_CODES.INVALID_ROLE })
    role: Role;

    @IsOptional()
    @IsString()
    dateOfBirth?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    specializationId?: string;
}
