import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { UserService } from '../user/user.service';

describe('AuthGuard', () => {
    let authGuard: AuthGuard;
    let userService: Partial<UserService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthGuard,
                {
                    provide: UserService,
                    useValue: {
                        verifyToken: jest.fn(),
                    },
                },
            ],
        }).compile();

        authGuard = module.get<AuthGuard>(AuthGuard);
        userService = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    function createMockExecutionContext(authHeader?: string): ExecutionContext {
        const request = { headers: { authorization: authHeader }, user: undefined };

        return {
            switchToHttp: () => ({
                getRequest: () => request,
            }),
            getClass: jest.fn(),
            getHandler: jest.fn(),
            switchToRpc: jest.fn(),
            switchToWs: jest.fn(),
            getArgs: jest.fn(),
            getArgByIndex: jest.fn(),
        } as any;
    }

    it('should throw UnauthorizedException if Authorization header is missing', async () => {
        const context = createMockExecutionContext();

        await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if Authorization header is not Bearer', async () => {
        const context = createMockExecutionContext('Basic sometoken');

        await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should call userService.verifyToken with token and allow access', async () => {
        const fakeUser = { id: 'user1' };
        (userService.verifyToken as jest.Mock).mockResolvedValue(fakeUser);

        const context = createMockExecutionContext('Bearer validtoken');
        const request = context.switchToHttp().getRequest();

        const result = await authGuard.canActivate(context);

        expect(userService.verifyToken).toHaveBeenCalledWith('validtoken');
        expect(request.user).toBe(fakeUser);
        expect(result).toBe(true);
    });

    it('should propagate errors from userService.verifyToken', async () => {
        (userService.verifyToken as jest.Mock).mockRejectedValue(new UnauthorizedException());

        const context = createMockExecutionContext('Bearer invalidtoken');

        await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });
});
