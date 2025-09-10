import {Test, TestingModule} from '@nestjs/testing';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {AuthGuard} from '../auth/auth.guard';
import {Request} from 'express';
import {extractUserId} from '../common/utils/extract-user-id';
import {
  mockFullStudentInfo,
  mockUpdatePasswordDto,
  mockUpdateUserDto,
  mockUploadPhotoDto
} from "../../test/mocks/user/user.mock-dto";
import {mockUserId} from "../../test/mocks/user/user.mock-entity";

jest.mock('../common/utils/extract-user-id', () => ({
  extractUserId: jest.fn(() => mockUserId),
}));

describe('UserController', () => {
  let controller: UserController;

  const userId = mockUserId;

  const mockUserService = {
    getFullUserInfo: jest.fn(),
    updateUserInfo: jest.fn(),
    deleteUser: jest.fn(),
    uploadPhoto: jest.fn(),
    updatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockUserService).toBeDefined();
  });

  describe('getUserInfo', () => {
    it('should call UserService.getFullUserInfo and return the result', async () => {
      mockUserService.getFullUserInfo.mockResolvedValue(mockFullStudentInfo);

      const mockRequest = {} as Request;
      const result = await controller.getUserInfo(mockRequest);

      expect(extractUserId).toHaveBeenCalledWith(mockRequest);
      expect(mockUserService.getFullUserInfo).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ data: mockFullStudentInfo });
    });
  });

  describe('updateUser', () => {
    it('should call UserService.updateUserInfo and return null', async () => {
      const mockRequest = {} as Request;
      const result = await controller.updateUser(mockRequest, mockUpdateUserDto);

      expect(extractUserId).toHaveBeenCalledWith(mockRequest);
      expect(mockUserService.updateUserInfo).toHaveBeenCalledWith(userId, mockUpdateUserDto);
      expect(result).toEqual({ data: null });
    });
  });

  describe('deleteUser', () => {
    it('should call UserService.deleteUser and return undefined', async () => {
      const mockRequest = {} as Request;
      const result = await controller.deleteUser(mockRequest);

      expect(extractUserId).toHaveBeenCalledWith(mockRequest);
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(userId);
      expect(result).toBeUndefined();
    });
  });

  describe('uploadPhoto', () => {
    it('should call UserService.uploadPhoto and return null', async () => {
      const mockRequest = {} as Request;
      const result = await controller.uploadPhoto(mockRequest, mockUploadPhotoDto);

      expect(extractUserId).toHaveBeenCalledWith(mockRequest);
      expect(mockUserService.uploadPhoto).toHaveBeenCalledWith(userId, mockUploadPhotoDto);
      expect(result).toEqual({ data: null });
    });
  });

  describe('updatePassword', () => {
    it('should call UserService.updatePassword and return null', async () => {
      const mockRequest = {} as Request;
      const result = await controller.updatePassword(mockRequest, mockUpdatePasswordDto);

      expect(extractUserId).toHaveBeenCalledWith(mockRequest);
      expect(mockUserService.updatePassword).toHaveBeenCalledWith(userId, mockUpdatePasswordDto);
      expect(result).toEqual({ data: null });
    });
  });
});
