import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from '../../entities';

const mockStore: Partial<Store> = {
  id: 'store-uuid',
  storeCode: 'STORE001',
  name: '맛있는 식당',
  createdAt: new Date(),
};

const mockRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('StoreService', () => {
  let service: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        { provide: getRepositoryToken(Store), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a store successfully', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue(mockStore);
      mockRepo.save.mockResolvedValue(mockStore);

      const result = await service.create({ storeCode: 'STORE001', name: '맛있는 식당' });
      expect(result).toEqual(mockStore);
      expect(mockRepo.create).toHaveBeenCalledWith({ storeCode: 'STORE001', name: '맛있는 식당' });
    });

    it('should throw ConflictException if storeCode already exists', async () => {
      mockRepo.findOne.mockResolvedValue(mockStore);
      await expect(service.create({ storeCode: 'STORE001', name: '식당' }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('findByCode', () => {
    it('should return a store by code', async () => {
      mockRepo.findOne.mockResolvedValue(mockStore);
      const result = await service.findByCode('STORE001');
      expect(result).toEqual(mockStore);
    });

    it('should throw NotFoundException if store not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findByCode('INVALID')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return a store by id', async () => {
      mockRepo.findOne.mockResolvedValue(mockStore);
      const result = await service.findById('store-uuid');
      expect(result).toEqual(mockStore);
    });

    it('should throw NotFoundException if store not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findById('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
