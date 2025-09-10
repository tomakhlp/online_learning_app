import { Request } from 'express';
import {UnauthorizedException} from "@nestjs/common";
import {ERROR_CODES} from "../constants/errors";

export function extractUserId(req: Request): string {
    const userId = req.user?.sub;
    if (!userId) {
        throw new UnauthorizedException({ errorCode: ERROR_CODES.USER_NOT_FOUND });
    }
    return userId;
}
