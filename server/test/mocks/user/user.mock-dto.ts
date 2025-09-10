import {BaseUserResponseDto} from "../../../src/user/dto/user.base-response.dto";
import {FullUserResponseDto} from "../../../src/user/dto/user.full-response.dto";
import {Role} from "../../../src/common/enums/role.enum";
import {
    mockAccessToken,
    mockRawPassword,
    mockStudentEntity,
    mockTrainerEntity,
    mockUserEntity,
    mockUserId
} from "./user.mock-entity";
import {CreateUserDto} from "../../../src/user/dto/user.create.dto";
import {RegistrationResponseDto} from "../../../src/user/dto/user.registration-response.dto";
import {LoginResponseDto} from "../../../src/user/dto/user.login-response.dto";
import {LoginUserDto} from "../../../src/user/dto/user.login.dto";
import {UpdateUserDto} from "../../../src/user/dto/user.update.dto";
import {UpdatePasswordDto} from "../../../src/user/dto/user.update-password.dto";
import {UploadPhotoDto} from "../../../src/user/dto/user.upload-photo.dto";

export const mockBaseUserInfo: BaseUserResponseDto = {
    id: mockUserId,
    username: mockUserEntity.username,
    email: mockUserEntity.email,
    photo: mockUserEntity.photo,
}

export const mockFullStudentInfo: FullUserResponseDto = {
    id: mockUserEntity.id,
    username: mockUserEntity.username,
    email: mockUserEntity.email,
    photo: mockUserEntity.photo,
    firstName: mockUserEntity.firstName,
    lastName: mockUserEntity.lastName,
    isActive: mockUserEntity.isActive,
    role: Role.STUDENT,
    roleData: {
        id: mockStudentEntity.id,
        userId: mockStudentEntity.userId,
        address: mockStudentEntity.address,
        dateOfBirth: mockStudentEntity.dateOfBirth,
    }
};

export const mockFullTrainerInfo: FullUserResponseDto = {
    id: mockUserEntity.id,
    username: mockUserEntity.username,
    email: mockUserEntity.email,
    photo: mockUserEntity.photo,
    firstName: mockUserEntity.firstName,
    lastName: mockUserEntity.lastName,
    isActive: mockUserEntity.isActive,
    role: Role.TRAINER,
    roleData: {
        id: mockTrainerEntity.id,
        userId: mockTrainerEntity.userId,
        specializationId: mockTrainerEntity.specializationId,
    }
};

export const mockCreateUserDto: CreateUserDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'example@example.com',
    role: Role.STUDENT,
    address: 'address',
    dateOfBirth: '01.01.2000',
}

export const mockLoginUserDto: LoginUserDto = {
    username: mockUserEntity.username,
    password: mockRawPassword,
}

export const mockUpdateUserDto: UpdateUserDto = {
    firstName: 'John_upd',
    lastName: 'Doe_upd',
    username: 'test_upd',
    email: 'example_upd@example.com',
    isActive: false
}

export const mockUploadPhotoDto: UploadPhotoDto = {
    data: 'data:image/jpeg;base64,dGVzdA=='
}

export const mockUpdatePasswordDto: UpdatePasswordDto = {
    currentPassword: mockRawPassword,
    newPassword: 'mockRawPassword_upd',
    confirmPassword: 'mockRawPassword_upd'
}

export const mockRegistrationResponseDto: RegistrationResponseDto = {
    accessToken: mockAccessToken,
    password: mockRawPassword,
    user: mockBaseUserInfo
}

export const mockLoginResponseDto: LoginResponseDto = {
    accessToken: mockAccessToken,
    user: mockBaseUserInfo
}
