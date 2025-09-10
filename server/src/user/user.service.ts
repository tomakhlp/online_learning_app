import {BadRequestException, ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';
import {Role, ROLE_SHORTCUTS} from "../common/enums/role.enum";
import * as bcrypt from 'bcrypt';
import {randomBytes} from 'crypto';
import {ERROR_CODES} from "../common/constants/errors";
import {UserEntity} from "../entities/user.entity";
import {StudentEntity} from "../entities/student.entity";
import {TrainerEntity} from "../entities/trainer.entity";
import {JwtService} from '@nestjs/jwt';
import {LoginUserDto} from "./dto/user.login.dto";
import {CreateUserDto} from "./dto/user.create.dto";
import {SpecializationEntity} from "../entities/specialization.entity";
import {DynamoDBService} from "../database/dynamoDB.service";
import {BaseUserResponseDto} from "./dto/user.base-response.dto";
import {FullUserResponseDto} from "./dto/user.full-response.dto";
import {LoginResponseDto} from "./dto/user.login-response.dto";
import {RegistrationResponseDto} from "./dto/user.registration-response.dto";
import {UpdatePasswordDto} from "./dto/user.update-password.dto";
import {UploadPhotoDto} from "./dto/user.upload-photo.dto";
import {S3Service} from "../s3/s3.service";
import {UpdateUserDto} from "./dto/user.update.dto";

@Injectable()
export class UserService {
    constructor(
        private readonly dbService: DynamoDBService,
        private readonly s3Service: S3Service,
        private readonly jwtService: JwtService,
    ) {}

    private readonly userTable = 'UserTable';
    private readonly studentTable = 'StudentTable';
    readonly trainerTable = 'TrainerTable';
    private readonly specializationTable = 'SpecializationTable';

    private readonly s3Bucket = 'final-project-users-photo-storage';

    private toBaseUserResponseDto(user: UserEntity): BaseUserResponseDto {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            photo: user.photo,
        };
    }

    private toFullUserResponseDto(
        user: UserEntity,
        role: Role,
        roleData: StudentEntity | TrainerEntity,
    ): FullUserResponseDto {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            photo: user.photo,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            role,
            roleData,
        };
    }

    private async getUserByUsername(username: string): Promise<UserEntity | null> {
        return await this.dbService.getOneByPartitionValue<UserEntity>(
            this.userTable,
            'UsernameIndex',
            'username',
            username
        );
    }

    private async usernameExists(username: string): Promise<void>  {
        const existingUser = await this.getUserByUsername(username);

        if (existingUser) {
            throw new ConflictException({
                message: [
                    {
                        field: 'username',
                        errorCode: ERROR_CODES.USERNAME_IS_ALREADY_TAKEN
                    },
                ],
            });

        }
    }

    private async getUserByEmail(email: string): Promise<UserEntity | null> {
        return await this.dbService.getOneByPartitionValue<UserEntity>(
            this.userTable,
            'EmailIndex',
            'email',
            email
        );
    }

    private async emailExists(email: string): Promise<void> {
        const existingUser = await this.getUserByEmail(email);

        if (existingUser) {
            throw new ConflictException({
                message: [
                    {
                        field: 'email',
                        errorCode: ERROR_CODES.EMAIL_IS_ALREADY_TAKEN
                    },
                ],
            });
        }
    }

    async getUserById(userId: string): Promise<UserEntity | null> {
        return await this.dbService.getDataById<UserEntity>(this.userTable, userId)
    }

    async getUsersByName(name: string): Promise<UserEntity[]> {
        let users: UserEntity[];

        const parts = name.trim().split(/\s+/);

        if (parts.length >= 2) {
            const firstName = parts[0].toLowerCase();
            const lastName = parts[1].toLowerCase();

            const [usersByFirstName1, usersByFirstName2] = await Promise.all([
                this.dbService.getDataByPartitionValue<UserEntity>(this.userTable, 'FirstNameLSIndex', 'firstName_ls', firstName),
                this.dbService.getDataByPartitionValue<UserEntity>(this.userTable, 'FirstNameLSIndex', 'firstName_ls', lastName),
            ]);

            users = [...usersByFirstName1, ...usersByFirstName2].filter(user =>
                (user.firstName?.toLowerCase() === firstName.toLowerCase() &&
                    user.lastName?.toLowerCase() === lastName.toLowerCase()) ||
                (user.firstName?.toLowerCase() === lastName.toLowerCase() &&
                    user.lastName?.toLowerCase() === firstName.toLowerCase())
            );
        } else {
            const word = parts[0].toLowerCase();

            const [usersByFirstName, usersByLastName] = await Promise.all([
                this.dbService.getDataByPartitionValue<UserEntity>(this.userTable, 'FirstNameLSIndex', 'firstName_ls', word),
                this.dbService.getDataByPartitionValue<UserEntity>(this.userTable, 'LastNameLSIndex', 'lastName_ls', word),
            ]);

            users = [...usersByFirstName, ...usersByLastName];
        }

        return Array.from(new Map(users.map(user => [user.id, user])).values());
    }

    private async getEntitiesByName<T>(
        name: string,
        getEntityByUserId: (userId: string) => Promise<T | null>
    ): Promise<T[]> {
        const matchedUsers = await this.getUsersByName(name);

        if (matchedUsers.length === 0) {
            return [];
        }

        const entityPromises = matchedUsers.map(user =>
            getEntityByUserId(user.id)
        );

        const matchedEntities = await Promise.all(entityPromises);

        return matchedEntities.filter(Boolean) as T[];
    }

    private async getStudentByUserId(userId: string): Promise<StudentEntity | null> {
        return this.dbService.getOneByPartitionValue<StudentEntity>(
            this.studentTable,
            'UserIdIndex',
            'userId',
            userId
        );
    }

    async getStudentsByName(studentName: string): Promise<StudentEntity[]> {
        return this.getEntitiesByName(studentName, this.getStudentByUserId.bind(this));
    }

    async getStudentById(studentId: string): Promise<StudentEntity | null> {
        return await this.dbService.getDataById<StudentEntity>(this.studentTable, studentId)
    }

    async getStudentsByIds(studentIds: string[]): Promise<StudentEntity[]> {
        const students = await Promise.all(
            studentIds.map(async (id) =>
                await this.getStudentById(id)
            )
        );

        return students.filter(Boolean) as StudentEntity[];
    }

    private async getTrainerByUserId(userId: string): Promise<TrainerEntity | null> {
        return this.dbService.getOneByPartitionValue<TrainerEntity>(
            this.trainerTable,
            'UserIdIndex',
            'userId',
            userId
        );
    }

    async getTrainerById(trainerId: string): Promise<TrainerEntity | null> {
        return await this.dbService.getDataById<TrainerEntity>(this.trainerTable, trainerId)
    }

    async getTrainersByName(trainerName: string): Promise<TrainerEntity[]> {
        return this.getEntitiesByName(trainerName, this.getTrainerByUserId.bind(this));
    }

    async getTrainersByIds(trainerIds: string[]): Promise<TrainerEntity[]> {
        const trainers = await Promise.all(
            trainerIds.map(async (id) =>
                await this.getTrainerById(id)
            )
        );

        return trainers.filter(Boolean) as TrainerEntity[];
    }

    async getSpecializationById(specializationId: string): Promise<SpecializationEntity | null> {
        return await this.dbService.getDataById<SpecializationEntity>(
            this.specializationTable,
            specializationId
        );
    }

    private async specializationExistsById(specializationId: string): Promise<boolean> {
        const specialization = await this.getSpecializationById(specializationId);
        return !!specialization;
    }

    async getSpecializationIdByName(specializationName: string): Promise<string | null> {
        const specialization = await this.dbService.getOneByPartitionValue<SpecializationEntity>(
            this.specializationTable,
            'SpecializationIndex',
            'specialization',
            specializationName
        );

        return specialization ? specialization.id : null;
    }

    async getTrainersBySpecializationId(specializationId: string): Promise<TrainerEntity[]> {
        return this.dbService.getDataByPartitionValue<TrainerEntity>(
            this.trainerTable,
            'SpecializationIdIndex',
            'specializationId',
            specializationId
        );
    }

    private async generateUsername(firstName: string, role: Role): Promise<string> {
        const baseUsername = `${firstName.toLowerCase()}_${ROLE_SHORTCUTS[role]}`;
        let username = baseUsername;
        let counter = 1;

        while (await this.getUserByUsername(username)) {
            username = `${baseUsername}${counter}`;
            counter++;
        }

        return username;
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    private async generatePassword(): Promise<{ rawPassword: string; hashedPassword: string }> {
        const rawPassword = randomBytes(8).toString('hex');
        const hashedPassword = await this.hashPassword(rawPassword);

        return { rawPassword, hashedPassword };
    }

    private async comparePassword(
        plainPassword: string,
        hashedPassword: string
    ): Promise<void> {
        const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);

        if (!isPasswordValid) {
            throw new UnauthorizedException({
                message: [
                    {
                        field: 'password',
                        errorCode: ERROR_CODES.INVALID_PASSWORD
                    },
                ],
            });
        }
    }

    private createUserEntity(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        hashedPassword: string,
        username: string
    ): UserEntity {
        const defaultPhotoUrl = `https://${process.env.USER_PHOTO_CLOUDFRONT_DOMAIN}/photos/userDefaultPhoto.png`;

        return {
            id,
            firstName,
            firstName_ls: firstName.toLowerCase(),
            lastName,
            lastName_ls: lastName.toLowerCase(),
            email,
            password: hashedPassword,
            username,
            photo: defaultPhotoUrl,
            isActive: true,
        };
    }

    private createStudentEntity(
        userId: string,
        dateOfBirth?: string,
        address?: string
    ): StudentEntity {
        return {
            id: uuidv4(),
            userId,
            dateOfBirth: dateOfBirth || null,
            address: address || null,
        };
    }

    private createTrainerEntity(
        userId: string,
        specializationId: string,
    ): TrainerEntity {
        return {
            id: uuidv4(),
            userId,
            specializationId
        };
    }

    private async saveUserEntity(user: UserEntity): Promise<UserEntity> {
        return this.dbService.saveEntity<UserEntity>(this.userTable, user);
    }

    private async deleteUserEntity(userId: string): Promise<void> {
        await this.dbService.deleteEntity(this.userTable, { id: userId });
    }

    private async saveStudentEntity(student: StudentEntity): Promise<StudentEntity> {
        return this.dbService.saveEntity<StudentEntity>(this.studentTable, student);
    }

    private async deleteStudentEntity(studentId: string): Promise<void> {
        await this.dbService.deleteEntity(this.studentTable, { id: studentId });
    }

    private async saveTrainerEntity(trainer: TrainerEntity): Promise<TrainerEntity> {
        return this.dbService.saveEntity<TrainerEntity>(this.trainerTable, trainer);
    }

    private async deleteTrainerEntity(trainerId: string): Promise<void> {
        await this.dbService.deleteEntity(this.trainerTable, { id: trainerId });
    }

    private async saveUserData(
        userId: string,
        firstName: string,
        lastName: string,
        email: string,
        hashedPassword: string,
        username: string
    ): Promise<UserEntity> {
        const newUser = this.createUserEntity(
            userId,
            firstName,
            lastName,
            email,
            hashedPassword,
            username
        );

        return await this.saveUserEntity(newUser);
    }

    private async updateUserData(userId: string, userEntityData: Partial<UserEntity>): Promise<void> {
        await this.dbService.updateData<UserEntity>(
            this.userTable,
            { id: userId },
            userEntityData
        );
    }

    private async saveStudentData(userId: string, dateOfBirth?: string, address?: string): Promise<StudentEntity> {
        const student = this.createStudentEntity(userId, dateOfBirth, address);
        return await this.saveStudentEntity(student);
    }

    private async updateStudentData(roleId: string, dateOfBirth?: string, address?: string): Promise<void> {
        await this.dbService.updateData<StudentEntity>(
            this.studentTable,
            { id: roleId },
            {
                dateOfBirth: dateOfBirth,
                address: address,
            }
        );
    }

    private async saveTrainerData(userId: string, specializationId?: string): Promise<TrainerEntity> {
        if (!specializationId) {
            throw new BadRequestException({
                errorCode: ERROR_CODES.SPECIALIZATION_REQUIRED,
            });
        }
        const trainer = this.createTrainerEntity(userId, specializationId);
        return await this.saveTrainerEntity(trainer);
    }

    private async updateTrainerData(roleId: string, specializationId?: string): Promise<void> {
        await this.dbService.updateData<TrainerEntity>(
            this.trainerTable,
            { id: roleId },
            { specializationId: specializationId }
        );
    }

    private async validateRoleData(
        role: Role,
        user: { dateOfBirth?: string; address?: string; specializationId?: string },
        isUpdate: boolean = false
    ): Promise<void> {
        switch (role) {
            case Role.TRAINER:
                if (!isUpdate && !user.specializationId) {
                    throw new BadRequestException({
                        errorCode: ERROR_CODES.SPECIALIZATION_REQUIRED,
                    });
                }

                if (user.specializationId) {
                    const exists = await this.specializationExistsById(user.specializationId);
                    if (!exists) {
                        throw new BadRequestException({
                            errorCode: ERROR_CODES.SPECIALIZATION_NOT_FOUND,
                        });
                    }
                }
                break;

            case Role.STUDENT:
                break;

            default:
                throw new BadRequestException({
                    errorCode: ERROR_CODES.INVALID_ROLE,
                    message: `${ERROR_CODES.INVALID_ROLE}: ${role}`,
                });
        }
    }

    private async saveRoleData(
        role: Role,
        userId: string,
        user: { dateOfBirth?: string; address?: string; specializationId?: string }
    ): Promise<StudentEntity | TrainerEntity> {
        switch (role) {
            case Role.STUDENT:
                return await this.saveStudentData(userId, user.dateOfBirth, user.address);

            case Role.TRAINER:
                return await this.saveTrainerData(userId, user.specializationId);

            default:
                throw new BadRequestException({
                    errorCode: ERROR_CODES.INVALID_ROLE,
                    message: `${ERROR_CODES.INVALID_ROLE}: ${role}`,
                });
        }
    }

    private async updateRoleData(
        role: Role,
        roleId: string,
        roleData: { dateOfBirth?: string; address?: string; specializationId?: string }
    ): Promise<void> {
        switch (role) {
            case Role.STUDENT:
                return await this.updateStudentData(roleId, roleData.dateOfBirth, roleData.address);

            case Role.TRAINER:
                return await this.updateTrainerData(roleId, roleData.specializationId);

            default:
                throw new BadRequestException({
                    errorCode: ERROR_CODES.INVALID_ROLE,
                    message: `${ERROR_CODES.INVALID_ROLE}: ${role}`,
                });
        }
    }

    private async deleteRoleData(
        role: Role,
        roleId: string,
    ): Promise<void> {
        switch (role) {
            case Role.STUDENT:
                return await this.deleteStudentEntity(roleId);

            case Role.TRAINER:
                return await this.deleteTrainerEntity(roleId);

            default:
                throw new BadRequestException({
                    errorCode: ERROR_CODES.INVALID_ROLE,
                    message: `${ERROR_CODES.INVALID_ROLE}: ${role}`,
                });
        }
    }

    async getRoleData(userId: string): Promise<{ role: Role; roleData: StudentEntity | TrainerEntity }> {
        const student = await this.getStudentByUserId(userId);
        if (student) {
            return { role: Role.STUDENT, roleData: student };
        }

        const trainer = await this.getTrainerByUserId(userId);
        if (trainer) {
            return { role: Role.TRAINER, roleData: trainer };
        }

        throw new BadRequestException({
            errorCode: ERROR_CODES.INVALID_USER_ID,
        });
    }

    async generateToken(payload: { sub: string; username: string}): Promise<string> {
        return await this.jwtService.signAsync(payload, { expiresIn: '12h' });
    }

    async verifyToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (error) {
            throw new UnauthorizedException({errorCode: ERROR_CODES.INVALID_TOKEN});
        }
    }

    async validateUser(userId: string): Promise<UserEntity> {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new UnauthorizedException({ errorCode: ERROR_CODES.USER_NOT_FOUND });
        }

        return user;
    }

    private validateMimeType(data: string): string {
        const mimeMatch = data.match(/^data:(image\/jpeg|image\/png);base64,/);
        if (!mimeMatch) {
            throw new BadRequestException({ errorCode: ERROR_CODES.UNSUPPORTED_FILE_FORMAT });
        }
        return mimeMatch[1];
    }

    private parseBase64Data(data: string): Buffer {
        const base64Data = data.split(',')[1];
        return Buffer.from(base64Data, 'base64');
    }

    private async uploadToS3(bucket: string, key: string, contentType: string, fileContent: Buffer): Promise<string> {
        return await this.s3Service.uploadFile(bucket, key, fileContent, contentType);
    }

    private async validateUpdateUserData(userId: string, updateUserDto: UpdateUserDto): Promise<void> {
        await this.validateUser(userId);

        if (updateUserDto.email) {
            await this.emailExists(updateUserDto.email);
        }

        if (updateUserDto.username) {
            await this.usernameExists(updateUserDto.username);
        }
    }

    private extractUserAndRoleData(updateUserDto: UpdateUserDto, role: Role): {
        userEntityData: Partial<UserEntity>,
        roleEntityData: { specializationId?: string } | { dateOfBirth?: string; address?: string }
    } {
        const sanitizedData: Partial<UpdateUserDto> = Object.entries(updateUserDto).reduce((acc, [key, value]) => {
            if (value === '') {
                acc[key] = null;
            } else if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {} as Partial<UpdateUserDto>);

        const userFields = ['firstName', 'lastName', 'username', 'email', 'isActive'];

        const roleFields = role === Role.STUDENT
            ? ['dateOfBirth', 'address']
            : ['specializationId'];

        const userEntityData = Object.fromEntries(
            Object.entries(sanitizedData).filter(([key]) => userFields.includes(key))
        );

        const roleEntityData = Object.fromEntries(
            Object.entries(sanitizedData).filter(([key]) => roleFields.includes(key))
        );

        return { userEntityData, roleEntityData };
    }

    async registerUser(user: CreateUserDto): Promise<RegistrationResponseDto> {
        const email = user.email.trim().toLowerCase();
        const firstName = user.firstName.trim();
        const lastName = user.lastName.trim();

        await this.emailExists(email);
        await this.validateRoleData(user.role, user)

        const userId = uuidv4();
        const username = await this.generateUsername(firstName, user.role);
        const { rawPassword, hashedPassword } = await this.generatePassword();

        const savedUser = await this.saveUserData(
            userId,
            firstName,
            lastName,
            email,
            hashedPassword,
            username
        );

        await this.saveRoleData(user.role, userId, user)

        const accessToken = await this.generateToken({
            sub: savedUser.id,
            username: savedUser.username,
        });

        const userResponseDto = this.toBaseUserResponseDto(savedUser);

        return {
            accessToken,
            user: userResponseDto,
            password: rawPassword,
        };
    };

    async loginUser(loginUser: LoginUserDto): Promise<LoginResponseDto> {
        const user = await this.getUserByUsername(loginUser.username);

        if (!user) {
            throw new UnauthorizedException({
                errorCode: ERROR_CODES.USER_NOT_FOUND,
            });
        }

        await this.comparePassword(loginUser.password, user.password);

        const accessToken = await this.generateToken({
            sub: user.id,
            username: user.username,
        });

        const userResponseDto = this.toBaseUserResponseDto(user);

        return {
            accessToken,
            user: userResponseDto,
        };
    }

    async getFullUserInfo(userId: string): Promise<FullUserResponseDto> {
        const user = await this.validateUser(userId);

        const { role, roleData } = await this.getRoleData(userId);

        return this.toFullUserResponseDto(user, role, roleData);
    }

    async updateUserInfo(userId: string, updateUserDto: UpdateUserDto): Promise<void> {
        await this.validateUpdateUserData(userId, updateUserDto);

        const { role, roleData } = await this.getRoleData(userId);

        const { userEntityData, roleEntityData } = this.extractUserAndRoleData(updateUserDto, role);

        await this.validateRoleData(role, roleEntityData, true);

        if (Object.keys(userEntityData).length > 0) {
            await this.updateUserData(userId, userEntityData)
        }

        if (Object.keys(roleEntityData).length > 0) {
            await this.updateRoleData(role, roleData.id, roleEntityData);
        }
    }

    async deleteUser(userId: string): Promise<void> {
        await this.validateUser(userId)
        const { role, roleData } = await this.getRoleData(userId);

        await this.deleteUserEntity(userId);
        await this.deleteRoleData(role, roleData.id)
    }

    async uploadPhoto(userId: string, uploadPhotoDto: UploadPhotoDto): Promise<void> {
        await this.validateUser(userId);
        const { data } = uploadPhotoDto;

        const contentType = this.validateMimeType(data);
        const fileContent = this.parseBase64Data(data);

        const key = `photos/${userId}-${Date.now()}${contentType === 'image/png' ? '.png' : '.jpg'}`;

        const url = await this.uploadToS3(this.s3Bucket, key, contentType, fileContent);

        await this.updateUserData(userId, { photo: url });
    }

    async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<void> {
        const user = await this.validateUser(userId);

        const { currentPassword, newPassword, confirmPassword } = updatePasswordDto;

        if (newPassword !== confirmPassword) {
            throw new BadRequestException({
                message: [
                    {
                        field: 'confirmPassword',
                        errorCode: ERROR_CODES.CONFIRMED_MATCH
                    },
                ],
            });
        }

        await this.comparePassword(currentPassword, user.password);

        const hashedPassword = await this.hashPassword(newPassword);
        await this.updateUserData(userId, { password: hashedPassword });
    }
}
