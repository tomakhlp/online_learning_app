import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../user/user.service";
import {Request} from 'express';
import {ERROR_CODES} from "../common/constants/errors";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException({errorCode: ERROR_CODES.TOKEN_REQUIRED});
        }

        request.user = await this.userService.verifyToken(token);
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
