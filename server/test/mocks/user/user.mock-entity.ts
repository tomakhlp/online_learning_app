import {UserEntity} from "../../../src/entities/user.entity";
import {StudentEntity} from "../../../src/entities/student.entity";
import {SpecializationEntity} from "../../../src/entities/specialization.entity";
import {TrainerEntity} from "../../../src/entities/trainer.entity";

export const mockUserId = 'mockUserId';
export const mockRoleId = 'mockRoleId';
export const mockHashedPassword = 'mockHashedPassword';
export const mockAccessToken = 'mockAccessToken';
export const mockRawPassword = 'mockRawPassword';

export const mockSpecializationEntity: SpecializationEntity = {
    id: 'validId',
    specialization: 'specialization1',
}

export const mockSpecializationEntity2: SpecializationEntity = {
    id: 'validId2',
    specialization: 'specialization2',
}

export const mockUserEntity: UserEntity = {
    id: mockUserId,
    firstName: 'John',
    firstName_ls: 'john',
    lastName: 'Doe',
    lastName_ls: 'doe',
    email: 'john@example.com',
    password: mockHashedPassword,
    username: 'test',
    photo: 'https://final-project-users-photo-storage.s3.us-east-1.amazonaws.com/photos/userDefaultPhoto.png',
    isActive: true,
};

export const mockTrainerEntity: TrainerEntity = {
    id: 'mockTrainerId',
    userId: mockUserEntity.id,
    specializationId: mockSpecializationEntity.id,
};

export const mockUserEntity2: UserEntity = {
    id: 'mockUserId2',
    firstName: 'Marta',
    firstName_ls: 'marta',
    lastName: 'Black',
    lastName_ls: 'black',
    email: 'marta@example.com',
    password: mockHashedPassword,
    username: 'test2',
    photo: 'https://final-project-users-photo-storage.s3.us-east-1.amazonaws.com/photos/userDefaultPhoto.png',
    isActive: true,
};

export const mockStudentEntity: StudentEntity = {
    id: 'mockStudentId',
    userId: mockUserEntity2.id,
    address: 'address',
    dateOfBirth: '01.01.2000',
};

export const mockUserEntity3: UserEntity = {
    id: 'mockUserId3',
    firstName: 'Den',
    firstName_ls: 'den',
    lastName: 'Brown',
    lastName_ls: 'brown',
    email: 'den@example.com',
    password: mockHashedPassword,
    username: 'test3',
    photo: 'https://final-project-users-photo-storage.s3.us-east-1.amazonaws.com/photos/userDefaultPhoto.png',
    isActive: true,
};

export const mockTrainerEntity2: TrainerEntity = {
    id: 'mockTrainerId2',
    userId: mockUserEntity3.id,
    specializationId: mockSpecializationEntity2.id,
}

export const mockUserEntity4: UserEntity = {
    id: 'mockUserId4',
    firstName: 'Alice',
    firstName_ls: 'alice',
    lastName: 'Red',
    lastName_ls: 'red',
    email: 'alice@example.com',
    password: mockHashedPassword,
    username: 'test4',
    photo: 'https://final-project-users-photo-storage.s3.us-east-1.amazonaws.com/photos/userDefaultPhoto.png',
    isActive: true,
};

export const mockStudentEntity2: StudentEntity = {
    id: 'mockStudentId2',
    userId: mockUserEntity4.id,
    address: 'address',
    dateOfBirth: '01.01.2000',
};
