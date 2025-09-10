import {
    Controller,
    Post,
    Body,
    Get,
    Req, HttpCode,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/user.create.dto';
import {LoginUserDto} from "../user/dto/user.login.dto";
import {LoginResponseDto} from "../user/dto/user.login-response.dto";
import {RegistrationResponseDto} from "../user/dto/user.registration-response.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async registerUser(@Body() createUserDto: CreateUserDto): Promise<{ data: RegistrationResponseDto }> {
        const result = await this.userService.registerUser(createUserDto);
        return {
            data: result,
        };
    }

    @Post('login')
    async loginUser(@Body() loginUserDto: LoginUserDto): Promise<{ data: LoginResponseDto }> {
        const result  = await this.userService.loginUser(loginUserDto);
        return {
            data: result,
        };
    }

    @Get('logout')
    @HttpCode(204)
    async logout(): Promise<void> {}
}
