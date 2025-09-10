import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import {UserService} from "../user/user.service";
import {AuthGuard} from "./auth.guard";
import {LoginUserDto} from "../user/dto/user.login.dto";
import {
    mockCreateUserDto,
    mockLoginResponseDto, mockLoginUserDto,
    mockRegistrationResponseDto
} from "../../test/mocks/user/user.mock-dto";

describe('AuthController', () => {
    let controller: AuthController;

    const mockUserService = {
        registerUser: jest.fn(),
        loginUser: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        }).overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn().mockReturnValue(true) })
            .compile();

        controller = module.get<AuthController>(AuthController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(mockUserService).toBeDefined();
    });

    describe('registerUser', () => {
        it('should call userService.registerUser with correct data and return the result', async () => {
            mockUserService.registerUser.mockResolvedValueOnce(mockRegistrationResponseDto);

            const result = await controller.registerUser(mockCreateUserDto);

            expect(result).toEqual({ data: mockRegistrationResponseDto });
            expect(mockUserService.registerUser).toHaveBeenCalledTimes(1);
            expect(mockUserService.registerUser).toHaveBeenCalledWith(mockCreateUserDto);
        });
    });

    describe('loginUser', () => {
        it('should call userService.loginUser with correct data and return the result', async () => {
            mockUserService.loginUser.mockResolvedValueOnce(mockLoginResponseDto);

            const result = await controller.loginUser(mockLoginUserDto);

            expect(result).toEqual({ data: mockLoginResponseDto });
            expect(mockUserService.loginUser).toHaveBeenCalledTimes(1);
            expect(mockUserService.loginUser).toHaveBeenCalledWith(mockLoginUserDto);
        });
    });

    describe('logout', () => {
        it('should not throw an error and return 204', async () => {
            await expect(controller.logout()).resolves.toBeUndefined();
        });
    });
});
