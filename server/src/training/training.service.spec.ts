import { Test, TestingModule } from '@nestjs/testing';
import { TrainingService } from './training.service';
import {DynamoDBService} from "../database/dynamoDB.service";
import {UserService} from "../user/user.service";
import {TrainingEntity} from "../entities/training.entity";
import {TrainingResponseDto} from "./dto/training.response.dto";
import {Role} from "../common/enums/role.enum";
import {TrainerEntity} from "../entities/trainer.entity";
import {BadRequestException} from "@nestjs/common";
import {TrainerDetailsResponseDto} from "../user/dto/user.trainer-details-response.dto";
import {TrainingTypeEntity} from "../entities/trainingType.entity";
import {
  mockRoleId,
  mockSpecializationEntity,
  mockSpecializationEntity2,
  mockStudentEntity, mockStudentEntity2,
  mockTrainerEntity,
  mockTrainerEntity2,
  mockUserEntity,
  mockUserEntity2, mockUserEntity3, mockUserEntity4,
  mockUserId
} from "../../test/mocks/user/user.mock-entity";
import {
  mockTraining,
  mockTraining2,
  mockTraining3,
  mockTrainingTypeEntity
} from "../../test/mocks/training/training.mock-entity";
import {
  baseMockSearchTrainingDtoByStudent,
  baseMockSearchTrainingDtoByTrainer,
  mockCreateTrainingDto,
  mockTrainerDetails,
  mockTrainerDetails2,
  mockTrainingInfo,
  mockTrainingInfo2, mockTrainingInfo3
} from "../../test/mocks/training/training.mock-dto";

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mockTrainingId'),
}));

describe('TrainingService', () => {
  let trainingService: TrainingService;

  const mockDynamoDBService = {
    getDataById: jest.fn(),
    getAllItems: jest.fn(),
    saveEntity: jest.fn(),
    getDataByPartitionValues: jest.fn(),
    getDataByPartitionValue: jest.fn(),
  };

  const mockUserService = {
    getRoleData: jest.fn(),
    validateUser: jest.fn(),
    getStudentsByName: jest.fn(),
    getSpecializationById: jest.fn(),
    getTrainersByName: jest.fn(),
    getTrainersBySpecializationId: jest.fn(),
    getTrainersByIds: jest.fn(),
    getUserById: jest.fn(),
    getSpecializationIdByName: jest.fn(),
    getStudentById: jest.fn(),
    getTrainerById: jest.fn(),
  }

  const mockTrainingTable = 'TrainingTable';

  const mockTrainings: TrainingEntity[] = [mockTraining, mockTraining2];
  const mockTrainers: TrainerEntity[] = [mockTrainerEntity, mockTrainerEntity2];
  const mockTrainingResponseDto: TrainingResponseDto[] = [mockTrainingInfo, mockTrainingInfo2];
  const mockTrainerDetailsResponseDto: TrainerDetailsResponseDto[] = [mockTrainerDetails, mockTrainerDetails2]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingService,
        {
          provide: DynamoDBService,
          useValue: mockDynamoDBService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    trainingService = module.get<TrainingService>(TrainingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(trainingService).toBeDefined();
    expect(mockDynamoDBService).toBeDefined();
    expect(mockUserService).toBeDefined();
  });

  describe('getAllTrainings', () => {
    it('should return an array of all trainings', async () => {
      mockDynamoDBService.getAllItems.mockResolvedValue(mockTrainings);

      mockUserService.getStudentById
          .mockResolvedValue(mockStudentEntity)
          .mockResolvedValue(mockStudentEntity)

      mockUserService.getTrainerById
          .mockResolvedValueOnce(mockTrainerEntity)
          .mockResolvedValueOnce(mockTrainerEntity2)

      mockUserService.getUserById
          .mockResolvedValueOnce(mockUserEntity2)
          .mockResolvedValueOnce(mockUserEntity2)
          .mockResolvedValueOnce(mockUserEntity)
          .mockResolvedValueOnce(mockUserEntity3)

      const result = await trainingService.getAllTrainings()

      expect(result).not.toBeNull();
      expect(result).toEqual(mockTrainingResponseDto);
      expect(mockDynamoDBService.getAllItems).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no trainings found', async () => {
      mockDynamoDBService.getAllItems.mockResolvedValue([]);

      const result = await trainingService.getAllTrainings()

      expect(result).not.toBeNull();
      expect(result).toEqual([]);
      expect(mockDynamoDBService.getAllItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserTrainings', () => {
    it('should return an array of student trainings ', async () => {
      mockUserService.validateUser.mockResolvedValue({})

      const role = Role.STUDENT;
      const roleData = mockStudentEntity

      mockUserService.getRoleData.mockResolvedValue({ role, roleData });
      mockDynamoDBService.getDataByPartitionValue.mockResolvedValue(mockTrainings)

      mockUserService.getStudentById
          .mockResolvedValue(mockStudentEntity)
          .mockResolvedValue(mockStudentEntity)

      mockUserService.getTrainerById
          .mockResolvedValueOnce(mockTrainerEntity)
          .mockResolvedValueOnce(mockTrainerEntity2)

      mockUserService.getUserById
          .mockResolvedValueOnce(mockUserEntity2)
          .mockResolvedValueOnce(mockUserEntity2)
          .mockResolvedValueOnce(mockUserEntity)
          .mockResolvedValueOnce(mockUserEntity3)

      const result = await trainingService.getUserTrainings(mockUserId)

      expect(result).not.toBeNull();
      expect(result).toEqual(mockTrainingResponseDto);
      expect(mockUserService.validateUser).toHaveBeenCalledWith(mockUserId);
      expect(mockUserService.getRoleData).toHaveBeenCalledWith(mockUserId);
      expect(mockUserService.validateUser).toHaveBeenCalledTimes(1);
      expect(mockUserService.getRoleData).toHaveBeenCalledTimes(1);
      expect(mockDynamoDBService.getDataByPartitionValue).toHaveBeenCalledTimes(1)
      expect(mockDynamoDBService.getDataByPartitionValue).toHaveBeenCalledWith(
          mockTrainingTable, 'StudentIdDateIndex', 'studentId', 'mockStudentId'
      );
    });

    it('should return an array of trainer trainings ', async () => {
      mockUserService.validateUser.mockResolvedValue({})

      const role = Role.TRAINER;
      const roleData = mockTrainerEntity

      mockUserService.getRoleData.mockResolvedValue({ role, roleData });
      mockDynamoDBService.getDataByPartitionValue.mockResolvedValue(mockTrainings)

      mockUserService.getStudentById
          .mockResolvedValue(mockStudentEntity)
          .mockResolvedValue(mockStudentEntity)

      mockUserService.getTrainerById
          .mockResolvedValueOnce(mockTrainerEntity)
          .mockResolvedValueOnce(mockTrainerEntity2)

      mockUserService.getUserById
          .mockResolvedValueOnce(mockUserEntity2)
          .mockResolvedValueOnce(mockUserEntity2)
          .mockResolvedValueOnce(mockUserEntity)
          .mockResolvedValueOnce(mockUserEntity3)

      const result = await trainingService.getUserTrainings(mockUserId)

      expect(result).not.toBeNull();
      expect(result).toEqual(mockTrainingResponseDto);
      expect(mockUserService.validateUser).toHaveBeenCalledWith(mockUserId);
      expect(mockUserService.getRoleData).toHaveBeenCalledWith(mockUserId);
      expect(mockUserService.validateUser).toHaveBeenCalledTimes(1);
      expect(mockUserService.getRoleData).toHaveBeenCalledTimes(1);
      expect(mockDynamoDBService.getDataByPartitionValue).toHaveBeenCalledTimes(1);
      expect(mockDynamoDBService.getDataByPartitionValue).toHaveBeenCalledWith(
          mockTrainingTable, 'TrainerIdDateIndex', 'trainerId', 'mockTrainerId'
      );
    });

    it('should throw BadRequestException if role is invalid', async () => {
      mockUserService.validateUser.mockResolvedValue({})

      const role = 'INVALID_ROLE' as Role;
      const roleData = {};

      mockUserService.getRoleData.mockResolvedValue({ role, roleData });

      await expect(trainingService.getUserTrainings(mockUserId)).rejects.toThrow(BadRequestException)

      expect(mockUserService.validateUser).toHaveBeenCalledWith(mockUserId);
      expect(mockUserService.getRoleData).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('getAllTrainers', () => {
    it('should return an array of all trainers', async () => {
      mockDynamoDBService.getAllItems.mockResolvedValue(mockTrainers);

      mockUserService.getUserById
          .mockResolvedValueOnce(mockUserEntity)
          .mockResolvedValueOnce(mockUserEntity3)

      mockUserService.getSpecializationById
          .mockResolvedValueOnce(mockSpecializationEntity)
          .mockResolvedValueOnce(mockSpecializationEntity2)

      const result = await trainingService.getAllTrainers()

      expect(result).not.toBeNull();
      expect(result).toEqual(mockTrainerDetailsResponseDto);
      expect(mockDynamoDBService.getAllItems).toHaveBeenCalledTimes(1);
      expect(mockUserService.getUserById).toHaveBeenCalledTimes(2);
      expect(mockUserService.getSpecializationById).toHaveBeenCalledTimes(2);
    });

    it('should return an empty array if no trainers found', async () => {
      mockDynamoDBService.getAllItems.mockResolvedValue([]);

      const result = await trainingService.getAllTrainers()

      expect(result).not.toBeNull();
      expect(result).toEqual([]);
      expect(mockDynamoDBService.getAllItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('getStudentTrainers', () => {
    it('should return an array of student trainers ', async () => {
      mockUserService.validateUser.mockResolvedValue({})

      const role = Role.STUDENT;
      const roleData = mockStudentEntity

      mockUserService.getRoleData.mockResolvedValue({ role, roleData });
      mockDynamoDBService.getDataByPartitionValue.mockResolvedValue(mockTrainings)

      mockUserService.getTrainersByIds.mockResolvedValue(mockTrainers);

      mockUserService.getUserById
          .mockResolvedValueOnce(mockUserEntity)
          .mockResolvedValueOnce(mockUserEntity3)

      mockUserService.getSpecializationById
          .mockResolvedValueOnce(mockSpecializationEntity)
          .mockResolvedValueOnce(mockSpecializationEntity2)

      const result = await trainingService.getStudentTrainers(mockUserId)

      expect(result).not.toBeNull();
      expect(result).toEqual(mockTrainerDetailsResponseDto);
      expect(mockUserService.validateUser).toHaveBeenCalledTimes(1);
      expect(mockUserService.getRoleData).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array of student trainers if trainers not found', async () => {
      mockUserService.validateUser.mockResolvedValue({})

      const role = Role.STUDENT;
      const roleData = mockStudentEntity

      mockUserService.getRoleData.mockResolvedValue({ role, roleData });
      mockDynamoDBService.getDataByPartitionValue.mockResolvedValue([])

      mockUserService.getTrainersByIds.mockResolvedValue([]);

      const result = await trainingService.getStudentTrainers(mockUserId)

      expect(result).not.toBeNull();
      expect(result).toEqual([]);
      expect(mockUserService.validateUser).toHaveBeenCalledTimes(1);
      expect(mockUserService.getRoleData).toHaveBeenCalledTimes(1);
    });
  });

  it('should throw BadRequestException if role is not student', async () => {
    mockUserService.validateUser.mockResolvedValue({})

    const role = Role.TRAINER;
    const roleData = mockTrainerEntity

    mockUserService.getRoleData.mockResolvedValue({ role, roleData });

    await expect(trainingService.getStudentTrainers(mockUserId)).rejects.toThrow(BadRequestException)

    expect(mockDynamoDBService.getDataByPartitionValue).not.toHaveBeenCalled()
  });

  describe('createTraining', () => {
    it('should create and return a new training entity', async () => {
      mockUserService.validateUser.mockResolvedValue({})

      mockDynamoDBService.getDataById.mockResolvedValue(mockTrainingTypeEntity)
      mockDynamoDBService.saveEntity.mockResolvedValue(mockTraining)
      mockUserService.getStudentById.mockResolvedValue(mockStudentEntity)
      mockUserService.getTrainerById.mockResolvedValue(mockTrainerEntity)

      mockUserService.getUserById
          .mockResolvedValueOnce(mockUserEntity2)
          .mockResolvedValueOnce(mockUserEntity)

      const result = await trainingService.createTraining(mockUserId, mockCreateTrainingDto)

      expect(result).not.toBeNull();
      expect(result).toEqual(mockTrainingInfo)
      expect(mockDynamoDBService.saveEntity).toHaveBeenCalledWith(
          mockTrainingTable,
          mockTraining,
      );
    });

    it('should throw BadRequestException if training type is not found', async () => {
      mockUserService.validateUser.mockResolvedValue({})
      mockDynamoDBService.getDataById.mockResolvedValue(null)
      await expect(trainingService.createTraining(mockUserId, mockCreateTrainingDto)).rejects.toThrow(BadRequestException)
    });

    it('should throw BadRequestException if training type is invalid', async () => {
      const invalidCreateTrainingDto = {
        ...mockCreateTrainingDto,
        type: { id: 'mockTypeId', trainingType: 'INVALID' } as TrainingTypeEntity
      }

      mockUserService.validateUser.mockResolvedValue({})
      mockDynamoDBService.getDataById.mockResolvedValue(mockTrainingTypeEntity)
      await expect(trainingService.createTraining(mockUserId, invalidCreateTrainingDto)).rejects.toThrow(BadRequestException)
    });
  });

  describe('searchTrainings', () => {
    it('should return trainings by trainerName, specialization and date', async () => {
      mockUserService.validateUser.mockResolvedValue({})

      const role = Role.STUDENT;
      const roleData = mockStudentEntity

      mockUserService.getRoleData.mockResolvedValue({ role, roleData });

      mockUserService.getSpecializationIdByName.mockResolvedValue(mockSpecializationEntity.specialization)
      mockUserService.getTrainersBySpecializationId.mockResolvedValue([mockTrainerEntity])

      mockUserService.getTrainersByName.mockResolvedValue([mockTrainerEntity])

      mockDynamoDBService.getDataByPartitionValues.mockResolvedValue([mockTraining])

      mockUserService.getStudentById.mockResolvedValue(mockStudentEntity)
      mockUserService.getTrainerById.mockResolvedValue(mockTrainerEntity)

      mockUserService.getUserById
          .mockResolvedValueOnce(mockUserEntity2)
          .mockResolvedValueOnce(mockUserEntity)

      const result = await trainingService.searchTrainings(mockUserId, baseMockSearchTrainingDtoByTrainer)

      expect(result).not.toBeNull()
      expect(result).toEqual([mockTrainingInfo])
      expect(mockUserService.getTrainersByName).toHaveBeenCalledWith(baseMockSearchTrainingDtoByTrainer.trainerName)
      expect(mockUserService.getSpecializationIdByName).toHaveBeenCalledWith(baseMockSearchTrainingDtoByTrainer.specialization)
      expect(mockUserService.getTrainersBySpecializationId).toHaveBeenCalledWith(mockSpecializationEntity.specialization)
      expect(mockDynamoDBService.getDataByPartitionValues).toHaveBeenCalledWith(
          mockTrainingTable,
          'TrainerIdDateIndex',
          'trainerId',
          [mockTrainerEntity.id],
          1748476780,
          1749945589
      )
    });

    it('should return trainings by trainerName and date', async () => {
      mockUserService.validateUser.mockResolvedValue({})

      const role = Role.STUDENT;
      const roleData = mockStudentEntity

      mockUserService.getRoleData.mockResolvedValue({ role, roleData });

      const { specialization, ...mockSearchTrainingDto } = baseMockSearchTrainingDtoByTrainer;

      mockUserService.getTrainersByName.mockResolvedValue([mockTrainerEntity])

      mockDynamoDBService.getDataByPartitionValues.mockResolvedValue([mockTraining])

      mockUserService.getStudentById.mockResolvedValue(mockStudentEntity)
      mockUserService.getTrainerById.mockResolvedValue(mockTrainerEntity)

      mockUserService.getUserById
          .mockResolvedValueOnce(mockUserEntity2)
          .mockResolvedValueOnce(mockUserEntity)

      const result = await trainingService.searchTrainings(mockUserId, mockSearchTrainingDto)

      expect(result).not.toBeNull()
      expect(result).toEqual([mockTrainingInfo])
      expect(mockUserService.getSpecializationIdByName).not.toHaveBeenCalled()
    });

    it('should return trainings by specialization and date', async () => {
      const { trainerName, ...mockSearchTrainingDto } = baseMockSearchTrainingDtoByTrainer;
      mockUserService.validateUser.mockResolvedValue({})

      const role = Role.STUDENT;
      const roleData = mockStudentEntity

      mockUserService.getRoleData.mockResolvedValue({ role, roleData });

      mockUserService.getSpecializationIdByName.mockResolvedValue(mockSpecializationEntity.specialization)
      mockUserService.getTrainersBySpecializationId.mockResolvedValue([mockTrainerEntity])

      mockDynamoDBService.getDataByPartitionValues.mockResolvedValue([mockTraining])

      mockUserService.getStudentById.mockResolvedValue(mockStudentEntity)
      mockUserService.getTrainerById.mockResolvedValue(mockTrainerEntity)

      mockUserService.getUserById
          .mockResolvedValueOnce(mockUserEntity2)
          .mockResolvedValueOnce(mockUserEntity)

      const result = await trainingService.searchTrainings(mockUserId, mockSearchTrainingDto)

      expect(result).not.toBeNull()
      expect(result).toEqual([mockTrainingInfo])
      expect(mockUserService.getTrainersByName).not.toHaveBeenCalled()
    });

    it('should return an empty array if specialization not found', async () => {
      mockUserService.getSpecializationIdByName.mockResolvedValue(null)
      mockUserService.validateUser.mockResolvedValue({})

      const result = await trainingService.searchTrainings(mockUserId, baseMockSearchTrainingDtoByTrainer)

      expect(result).not.toBeNull()
      expect(result).toEqual([])
      expect(mockUserService.getTrainersByName).not.toHaveBeenCalled()
    });

    it('should return trainings by studentName and date', async () => {
      mockUserService.validateUser.mockResolvedValue({})

      const role = Role.TRAINER;
      const roleData = mockTrainerEntity

      mockUserService.getRoleData.mockResolvedValue({ role, roleData });

      mockUserService.getStudentsByName.mockResolvedValue([mockStudentEntity2])
      mockDynamoDBService.getDataByPartitionValues.mockResolvedValue([mockTraining3])

      mockUserService.getStudentById.mockResolvedValue(mockStudentEntity2)
      mockUserService.getTrainerById.mockResolvedValue(mockTrainerEntity)

      mockUserService.getUserById
          .mockResolvedValueOnce(mockUserEntity4)
          .mockResolvedValueOnce(mockUserEntity)

      const result = await trainingService.searchTrainings(mockUserId, baseMockSearchTrainingDtoByStudent)

      expect(result).not.toBeNull()
      expect(result).toEqual([mockTrainingInfo3])
      expect(mockDynamoDBService.getDataByPartitionValues).toHaveBeenCalledWith(
          mockTrainingTable,
          'StudentIdDateIndex',
          'studentId',
          [mockStudentEntity2.id],
          1748476008,
          1750408255
      )
    });

    it('should return trainings by date', async () => {
      const { studentName, ...mockSearchTrainingDto } = baseMockSearchTrainingDtoByStudent;
      mockUserService.validateUser.mockResolvedValue({})

      const role = Role.STUDENT;
      const roleData = mockStudentEntity

      mockUserService.getRoleData.mockResolvedValue({ role, roleData });

      mockDynamoDBService.getDataByPartitionValues.mockResolvedValue([mockTraining])

      mockUserService.getStudentById.mockResolvedValue(mockStudentEntity)
      mockUserService.getTrainerById.mockResolvedValue(mockTrainerEntity)

      mockUserService.getUserById
          .mockResolvedValueOnce(mockUserEntity2)
          .mockResolvedValueOnce(mockUserEntity)
      const result = await trainingService.searchTrainings(mockUserId, mockSearchTrainingDto)

      expect(result).not.toBeNull()
      expect(result).toEqual([mockTrainingInfo])
      expect(mockDynamoDBService.getDataByPartitionValues).toHaveBeenCalledWith(
          mockTrainingTable,
          'DateIndex',
          'staticPartition',
          ['all'],
          1748476008,
          1750408255
      )
    });

    it('should return an empty array if SearchTrainingDto is empty', async () => {
      mockUserService.validateUser.mockResolvedValue({})

      const result = await trainingService.searchTrainings(mockUserId, {})

      expect(result).not.toBeNull()
      expect(result).toEqual([])
    });

    it('should throw BadRequestException if studentName is combined with trainerName or specialization', async () => {
      const invalidSearchTrainingDto = {
        ...baseMockSearchTrainingDtoByTrainer,
        studentName: 'Marta',
      }
      mockUserService.validateUser.mockResolvedValue({})

      await expect(trainingService.searchTrainings(mockUserId, invalidSearchTrainingDto)).rejects.toThrow(BadRequestException)
    });

    it('should throw BadRequestException if only one of startDate or endDate is provided', async () => {
      const { startDate, ...invalidSearchTrainingDto } = baseMockSearchTrainingDtoByTrainer
      mockUserService.validateUser.mockResolvedValue({})

      await expect(trainingService.searchTrainings(mockUserId, invalidSearchTrainingDto)).rejects.toThrow(BadRequestException)
    });

    it('should throw BadRequestException if startDate is after endDate', async () => {
      const invalidSearchTrainingDto = {
        startDate: 1750000000,
        endDate: 1740000000,
      };
      mockUserService.validateUser.mockResolvedValue({})

      await expect(trainingService.searchTrainings(mockUserId, invalidSearchTrainingDto)).rejects.toThrow(BadRequestException)
    });
  });

});
