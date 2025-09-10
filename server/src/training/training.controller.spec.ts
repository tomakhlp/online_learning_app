import { Test, TestingModule } from '@nestjs/testing';
import { TrainingController } from './training.controller';
import {TrainingService} from "./training.service";
import {AuthGuard} from "../auth/auth.guard";
import {Request} from 'express';
import {extractUserId} from '../common/utils/extract-user-id';
import {
  baseMockSearchTrainingDtoByTrainer,
  mockCreateTrainingDto,
  mockTrainerDetails,
  mockTrainingInfo
} from "../../test/mocks/training/training.mock-dto";
import {mockUserId} from "../../test/mocks/user/user.mock-entity";

jest.mock('../common/utils/extract-user-id', () => ({
  extractUserId: jest.fn(() => mockUserId),
}));

describe('TrainingController', () => {
  let controller: TrainingController;

  const userId = mockUserId;

  const mockTrainingService = {
    getAllTrainings: jest.fn(),
    getUserTrainings: jest.fn(),
    getAllTrainers: jest.fn(),
    getStudentTrainers: jest.fn(),
    createTraining: jest.fn(),
    searchTrainings: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingController],
      providers: [
        {
          provide: TrainingService,
          useValue: mockTrainingService,
        },
      ],
    }).overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<TrainingController>(TrainingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockTrainingService).toBeDefined()
  });

  describe('getAllTrainings', () => {
    it('should call TrainingService.getAllTrainings and return all trainings', async () => {
      mockTrainingService.getAllTrainings.mockResolvedValue([mockTrainingInfo]);

      const result = await controller.getAllTrainings();

      expect(result).toEqual({ data: [mockTrainingInfo] });
      expect(mockTrainingService.getAllTrainings).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMyTrainings', () => {
    it('should call TrainingService.getMyTrainings and return user trainings', async () => {
      const mockRequest = {} as Request;

      mockTrainingService.getUserTrainings.mockResolvedValue([mockTrainingInfo]);

      const result = await controller.getMyTrainings(mockRequest);

      expect(result).toEqual({ data: [mockTrainingInfo] });
      expect(extractUserId).toHaveBeenCalledWith(mockRequest);
      expect(mockTrainingService.getUserTrainings).toHaveBeenCalledWith(userId);
    });
  });

  describe('getAllTrainers', () => {
    it('should call TrainingService.getAllTrainers and return an array of all trainers', async () => {
      mockTrainingService.getAllTrainers.mockResolvedValue([mockTrainerDetails]);

      const result = await controller.getAllTrainers();

      expect(result).toEqual({ data: [mockTrainerDetails] });
      expect(mockTrainingService.getAllTrainers).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMyTrainers', () => {
    it('should call TrainingService.getMyTrainers and return an array of user trainers', async () => {
      const mockRequest = {} as Request;

      mockTrainingService.getStudentTrainers.mockResolvedValue([mockTrainerDetails]);

      const result = await controller.getMyTrainers(mockRequest);

      expect(result).toEqual({ data: [mockTrainerDetails] });
      expect(extractUserId).toHaveBeenCalledWith(mockRequest);
      expect(mockTrainingService.getStudentTrainers).toHaveBeenCalledWith(userId);
    });
  });

  describe('createTraining', () => {
    it('should call TrainingService.createTraining and return a created training', async () => {
      const mockRequest = {} as Request;
      mockTrainingService.createTraining.mockResolvedValue(mockTrainingInfo);

      const result = await controller.createTraining(mockRequest, mockCreateTrainingDto);

      expect(result).toEqual({ data: mockTrainingInfo });
      expect(mockTrainingService.createTraining).toHaveBeenCalledWith(userId, mockCreateTrainingDto);
    });
  });

  describe('searchTrainings', () => {
    it('should call TrainingService.searchTrainings and return an array of trainings', async () => {
      const mockRequest = {} as Request;
      mockTrainingService.searchTrainings.mockResolvedValue([mockTrainingInfo]);

      const result = await controller.searchTrainings(mockRequest, baseMockSearchTrainingDtoByTrainer);

      expect(result).toEqual({ data: [mockTrainingInfo] });
      expect(mockTrainingService.searchTrainings).toHaveBeenCalledWith(userId, baseMockSearchTrainingDtoByTrainer);
    });
  });
});
