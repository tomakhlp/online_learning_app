import {Test, TestingModule} from "@nestjs/testing";
import {UserService} from './user.service';
import {BadRequestException, ConflictException, UnauthorizedException} from "@nestjs/common";
import {Role} from "../common/enums/role.enum";
import bcrypt from 'bcrypt';
import {DynamoDBService} from "../database/dynamoDB.service";
import {S3Service} from "../s3/s3.service";
import {JwtService} from "@nestjs/jwt";
import {
  mockAccessToken,
  mockHashedPassword,
  mockRawPassword,
  mockStudentEntity,
  mockTrainerEntity,
  mockUserEntity,
  mockUserId
} from "../../test/mocks/user/user.mock-entity";
import {
  mockCreateUserDto,
  mockFullStudentInfo,
  mockFullTrainerInfo, mockLoginResponseDto, mockLoginUserDto,
  mockRegistrationResponseDto, mockUpdatePasswordDto, mockUpdateUserDto, mockUploadPhotoDto
} from "../../test/mocks/user/user.mock-dto";

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => mockRawPassword),
}));

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(() => 'mockSalt'),
  hash: jest.fn(() => mockHashedPassword),
  compare: jest.fn(() => Promise.resolve(true)),
}));

describe('UserService', () => {
  let userService: UserService;

  const mockDynamoDBService = {
    getOneByPartitionValue: jest.fn(),
    getDataById: jest.fn(),
    saveEntity: jest.fn(),
    deleteEntity: jest.fn(),
    updateData: jest.fn(),
    getDataByPartitionValue: jest.fn(),
  };

  const mockS3Service = {
    uploadFile: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(() => Promise.resolve(mockAccessToken)),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DynamoDBService,
          useValue: mockDynamoDBService,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(mockDynamoDBService).toBeDefined();
    expect(mockS3Service).toBeDefined();
    expect(mockJwtService).toBeDefined();
  });

  describe('registerUser', () => {

    it('should successfully register a student', async () => {
      mockDynamoDBService.getOneByPartitionValue
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null);

      mockDynamoDBService.saveEntity
          .mockResolvedValueOnce(mockUserEntity)
          .mockResolvedValueOnce(mockStudentEntity);

      const result = await userService.registerUser(mockCreateUserDto)

      expect(result).not.toBeNull();

      expect(result.user).not.toBeNull();
      expect(result).toEqual(mockRegistrationResponseDto);

      expect(mockDynamoDBService.getDataById).not.toHaveBeenCalled();
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(2);
      expect(mockDynamoDBService.saveEntity).toHaveBeenCalledTimes(2);
    });

    it('should successfully register a trainer with specializationId', async () => {
      mockDynamoDBService.getOneByPartitionValue
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null);

      mockDynamoDBService.saveEntity
          .mockResolvedValueOnce(mockUserEntity)
          .mockResolvedValueOnce(mockTrainerEntity);

      mockDynamoDBService.getDataById.mockResolvedValue({})

      const trainerDto = {
        ...mockCreateUserDto,
        role: Role.TRAINER,
        specializationId: 'validId'
      }

      const result = await userService.registerUser(trainerDto)

      expect(result).not.toBeNull();

      expect(result.user).not.toBeNull();
      expect(result).toEqual(mockRegistrationResponseDto);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(2);
      expect(mockDynamoDBService.saveEntity).toHaveBeenCalledTimes(2);
    });

    it('should throw ConflictException for duplicate email during registration', async () => {
      mockDynamoDBService.getOneByPartitionValue
          .mockResolvedValueOnce({});

      await expect(userService.registerUser(mockCreateUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if specializationId is missing for a trainer', async () => {
      const trainerDto = {
        ...mockCreateUserDto,
        role: Role.TRAINER
      }

      await expect(userService.registerUser(trainerDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if specializationId is invalid', async () => {
      mockDynamoDBService.getDataById.mockResolvedValue(null)

      const trainerDto = {
        ...mockCreateUserDto,
        role: Role.TRAINER,
        specializationId: 'invalidId'
      }

      await expect(userService.registerUser(trainerDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if role is invalid', async () => {
      const invalidDto = {
        ...mockCreateUserDto,
        role: 'INVALID_ROLE' as Role
      };

      await expect(userService.registerUser(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('loginUser', () => {
    it('should successfully login user', async () => {
      mockDynamoDBService.getOneByPartitionValue.mockResolvedValue(mockUserEntity)

      const result = await userService.loginUser(mockLoginUserDto);

      expect(result).not.toBeNull();
      expect(result.user).not.toBeNull();
      expect(result).toEqual(mockLoginResponseDto);

      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(1);
    })

    it('should throw UnauthorizedException if user not found', async () => {
      mockDynamoDBService.getOneByPartitionValue.mockResolvedValue(null)

      await expect(userService.loginUser(mockLoginUserDto)).rejects.toThrow(UnauthorizedException);
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    })

    it('should throw UnauthorizedException if password is invalid', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      mockDynamoDBService.getOneByPartitionValue
          .mockResolvedValueOnce(mockUserEntity)

      const invalidLoginUserDto = {
        ...mockLoginUserDto,
        password: 'invalid_password'
      }

      await expect(userService.loginUser(invalidLoginUserDto)).rejects.toThrow(UnauthorizedException);
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    })
  });

  describe('getFullUserInfo', () => {
    it('should successfully return full user info for student', async () => {
      mockDynamoDBService.getDataById.mockResolvedValue(mockUserEntity);
      mockDynamoDBService.getOneByPartitionValue.mockResolvedValue(mockStudentEntity);

      const result = await userService.getFullUserInfo(mockUserId)

      expect(result).not.toBeNull();

      expect(result).toEqual(mockFullStudentInfo);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(1);
    });

    it('should successfully return full user info for trainer', async () => {
      mockDynamoDBService.getDataById.mockResolvedValue(mockUserEntity);
      mockDynamoDBService.getOneByPartitionValue
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(mockTrainerEntity);

      const result = await userService.getFullUserInfo(mockUserId)

      expect(result).not.toBeNull();

      expect(result).toEqual(mockFullTrainerInfo);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(2);
    })

    it('should throw UnauthorizedException if user not found', async () => {
      mockDynamoDBService.getDataById.mockResolvedValue(null);

      await expect(userService.getFullUserInfo('invalidId')).rejects.toThrow(UnauthorizedException);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).not.toHaveBeenCalled();

    })

    it('should throw BadRequestException if role data not found', async () => {
      mockDynamoDBService.getDataById.mockResolvedValue(mockUserEntity);
      mockDynamoDBService.getOneByPartitionValue
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null);

      await expect(userService.getFullUserInfo(mockUserId)).rejects.toThrow(BadRequestException);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(2);
    })
  });

  describe('updateUserInfo', () => {

    it('should successfully update user info for student', async () => {
      const updateUserDto = {
        ...mockUpdateUserDto,
        address: 'address',
        dateOfBirth: '01.01.2000'
      };

      mockDynamoDBService.getDataById.mockResolvedValue({ ...mockUserEntity });

      mockDynamoDBService.getOneByPartitionValue
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({ ...mockStudentEntity })

      mockDynamoDBService.updateData
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined);

      await userService.updateUserInfo(mockUserId, updateUserDto)

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(3);

      expect(mockDynamoDBService.updateData).toHaveBeenCalledWith(
          'UserTable',
          { id: mockUserId },
          expect.objectContaining({ firstName: updateUserDto.firstName })
      );

      expect(mockDynamoDBService.updateData).toHaveBeenCalledWith(
          'StudentTable',
          { id: 'mockStudentId' },
          expect.objectContaining({ address: updateUserDto.address, dateOfBirth: updateUserDto.dateOfBirth })
      );
    });

    it('should successfully update user info for trainer', async () => {
      const updateUserDto = {
        ...mockUpdateUserDto,
        specializationId: 'validId_upd'
      };

      mockDynamoDBService.getDataById
          .mockResolvedValueOnce({ ...mockUserEntity })
          .mockResolvedValueOnce({})

      mockDynamoDBService.getOneByPartitionValue
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({ ...mockTrainerEntity })

      mockDynamoDBService.updateData
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined);

      await userService.updateUserInfo(mockUserId, updateUserDto)

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(2)
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(4);

      expect(mockDynamoDBService.updateData).toHaveBeenCalledWith(
          'UserTable',
          { id: mockUserId },
          expect.objectContaining({ firstName: updateUserDto.firstName })
      );

      expect(mockDynamoDBService.updateData).toHaveBeenCalledWith(
          'TrainerTable',
          { id: 'mockTrainerId' },
          expect.objectContaining({ specializationId: updateUserDto.specializationId })
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const updateUserDto = {
        ...mockUpdateUserDto,
        specializationId: 'validId_upd'
      };

      mockDynamoDBService.getDataById.mockResolvedValue(null);

      await expect(userService.updateUserInfo('invalidId', updateUserDto)).rejects.toThrow(UnauthorizedException);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).not.toHaveBeenCalled();
    });

    it('should throw ConflictException for duplicate email during update', async () => {
      const updateUserDto = {
        ...mockUpdateUserDto,
        specializationId: 'validId_upd'
      };

      mockDynamoDBService.getDataById.mockResolvedValue({ ...mockUserEntity })

      mockDynamoDBService.getOneByPartitionValue.mockResolvedValue({});

      await expect(userService.updateUserInfo(mockUserId, updateUserDto)).rejects.toThrow(ConflictException);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException for duplicate username during update', async () => {
      const updateUserDto = {
        ...mockUpdateUserDto,
        specializationId: 'validId_upd'
      };

      mockDynamoDBService.getDataById.mockResolvedValue({ ...mockUserEntity })

      mockDynamoDBService.getOneByPartitionValue
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({});

      await expect(userService.updateUserInfo(mockUserId, updateUserDto)).rejects.toThrow(ConflictException);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException if role data not found', async () => {
      const updateUserDto = {
        ...mockUpdateUserDto,
        specializationId: 'validId_upd'
      };

      mockDynamoDBService.getDataById.mockResolvedValue({ ...mockUserEntity })

      mockDynamoDBService.getOneByPartitionValue
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null);

      await expect(userService.updateUserInfo(mockUserId, updateUserDto)).rejects.toThrow(BadRequestException);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(4);
    })

    it('should throw BadRequestException if specializationId is invalid', async () => {
      const updateUserDto = {
        ...mockUpdateUserDto,
        specializationId: 'invalidId'
      };

      mockDynamoDBService.getDataById
          .mockResolvedValueOnce({ ...mockUserEntity })
          .mockResolvedValueOnce(null);

      mockDynamoDBService.getOneByPartitionValue
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({ ...mockTrainerEntity });

      await expect(userService.updateUserInfo(mockUserId, updateUserDto)).rejects.toThrow(BadRequestException);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(2)
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(4);
    })
  });

  describe('deleteUser', () => {
    it('should successfully delete student', async () => {
      mockDynamoDBService.getDataById.mockResolvedValue({ ...mockUserEntity })

      mockDynamoDBService.getOneByPartitionValue.mockResolvedValue({ ...mockStudentEntity })

      mockDynamoDBService.deleteEntity
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined);

      await userService.deleteUser(mockUserId)

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(1);

      expect(mockDynamoDBService.deleteEntity).toHaveBeenCalledWith(
          'UserTable',
          { id: mockUserId }
      );

      expect(mockDynamoDBService.deleteEntity).toHaveBeenCalledWith(
          'StudentTable',
          { id: 'mockStudentId' }
      );
    });

    it('should successfully delete trainer', async () => {
      mockDynamoDBService.getDataById.mockResolvedValue({ ...mockUserEntity })

      mockDynamoDBService.getOneByPartitionValue
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({ ...mockTrainerEntity })

      mockDynamoDBService.deleteEntity
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined);

      await userService.deleteUser(mockUserId)

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(2);

      expect(mockDynamoDBService.deleteEntity).toHaveBeenCalledWith(
          'UserTable',
          { id: mockUserId }
      );

      expect(mockDynamoDBService.deleteEntity).toHaveBeenCalledWith(
          'TrainerTable',
          { id: 'mockTrainerId' }
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockDynamoDBService.getDataById.mockResolvedValue(null);

      await expect(userService.deleteUser('invalidId')).rejects.toThrow(UnauthorizedException);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if role data not found', async () => {
      mockDynamoDBService.getDataById.mockResolvedValue({ ...mockUserEntity })

      mockDynamoDBService.getOneByPartitionValue
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null);

      await expect(userService.deleteUser(mockUserId)).rejects.toThrow(BadRequestException);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getOneByPartitionValue).toHaveBeenCalledTimes(2);
    });
  });

  describe('uploadPhoto', () => {
    const mockUrl = 'https://bucket/photos/mock-user-id-123456.jpg';

    it('should successfully upload user photo', async () => {
      mockDynamoDBService.getDataById.mockResolvedValue({ ...mockUserEntity })

      mockS3Service.uploadFile.mockResolvedValue(mockUrl);
      mockDynamoDBService.updateData.mockResolvedValue(undefined);

      await userService.uploadPhoto(mockUserId, mockUploadPhotoDto);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1)
      expect(mockS3Service.uploadFile).toHaveBeenCalledWith(
          userService['s3Bucket'],
          expect.stringMatching(new RegExp(`^photos/${mockUserId}-\\d+\\.jpg$`)),
          expect.any(Buffer),
          expect.any(String)
      );

      expect(mockDynamoDBService.updateData).toHaveBeenCalledWith(
          'UserTable',
          { id: mockUserId },
          { photo: mockUrl }
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockDynamoDBService.getDataById.mockResolvedValue(null);

      await expect(userService.uploadPhoto('invalidId', mockUploadPhotoDto)).rejects.toThrow(UnauthorizedException);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1);
      expect(mockS3Service.uploadFile).not.toHaveBeenCalled();
      expect(mockDynamoDBService.updateData).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if data format is invalid', async () => {
      const invalidUploadPhotoDto = { data: 'invalid-string' };

      mockDynamoDBService.getDataById.mockResolvedValue({ ...mockUserEntity });

      await expect(userService.uploadPhoto(mockUserId, invalidUploadPhotoDto)).rejects.toThrow();

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1);
      expect(mockS3Service.uploadFile).not.toHaveBeenCalled();
      expect(mockDynamoDBService.updateData).not.toHaveBeenCalled();
    });
  });

  describe('updatePassword', () => {
    it('should successfully update password', async () => {
      mockDynamoDBService.getDataById.mockResolvedValue({ ...mockUserEntity });
      mockDynamoDBService.updateData.mockResolvedValue(undefined);

      await userService.updatePassword(mockUserId, mockUpdatePasswordDto);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1);
      expect(mockDynamoDBService.updateData).toHaveBeenCalledWith(
          'UserTable',
          { id: mockUserId },
          { password: mockHashedPassword }
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockDynamoDBService.getDataById.mockResolvedValue(null);

      await expect(userService.updatePassword('invalidId', mockUpdatePasswordDto)).rejects.toThrow(UnauthorizedException);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1);
      expect(mockDynamoDBService.updateData).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if newPassword and confirmPassword do not match', async () => {
      const invalidUpdatePasswordDto = {
        ...mockUpdatePasswordDto,
        confirmPassword: 'different_password',
      };

      mockDynamoDBService.getDataById.mockResolvedValue({ ...mockUserEntity });

      await expect(userService.updatePassword(mockUserId, invalidUpdatePasswordDto)).rejects.toThrow(BadRequestException);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1);
      expect(mockDynamoDBService.updateData).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if current password is incorrect', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      mockDynamoDBService.getDataById.mockResolvedValue({ ...mockUserEntity });

      await expect(userService.updatePassword(mockUserId, mockUpdatePasswordDto)).rejects.toThrow(UnauthorizedException);

      expect(mockDynamoDBService.getDataById).toHaveBeenCalledTimes(1);
      expect(mockDynamoDBService.updateData).not.toHaveBeenCalled();
    });
  });
});
