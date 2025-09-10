import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode, Patch,
    Post,
    Put,
    Req,
    UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import {AuthGuard} from "../auth/auth.guard";
import { Request } from 'express';
import {UpdatePasswordDto} from "./dto/user.update-password.dto";
import {FullUserResponseDto} from "./dto/user.full-response.dto";
import {UploadPhotoDto} from "./dto/user.upload-photo.dto";
import {UpdateUserDto} from "./dto/user.update.dto";
import {extractUserId} from "../common/utils/extract-user-id";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    @UseGuards(AuthGuard)
    async getUserInfo(@Req() req: Request): Promise<{ data: FullUserResponseDto }> {
        const userId = extractUserId(req);

        const result  = await this.userService.getFullUserInfo(userId);

        return {
            data: result,
        };
    }

    @Patch('me')
    @UseGuards(AuthGuard)
    async updateUser(@Req() req: Request, @Body() updateUserDto: UpdateUserDto): Promise<{ data: null }> {
        const userId = extractUserId(req);

        await this.userService.updateUserInfo(userId, updateUserDto);

        return {
            data: null,
        };
    }

    @Delete('me')
    @UseGuards(AuthGuard)
    @HttpCode(204)
    async deleteUser(@Req() req: Request): Promise<void> {
        const userId = extractUserId(req);

        await this.userService.deleteUser(userId);
    }

    @Post('upload-photo')
    @UseGuards(AuthGuard)
    async uploadPhoto(@Req() req: Request, @Body() uploadPhotoDto: UploadPhotoDto): Promise<{ data: null }> {
        const userId = extractUserId(req);

        await this.userService.uploadPhoto(userId, uploadPhotoDto)

        return {
            data: null,
        }
    }

    @Put('update-password')
    @UseGuards(AuthGuard)
    async updatePassword(@Req() req: Request, @Body() updatePasswordDto: UpdatePasswordDto): Promise<{ data: null }> {
        const userId = extractUserId(req);

        await this.userService.updatePassword(userId, updatePasswordDto);

        return {
            data: null
        };
    }
}
