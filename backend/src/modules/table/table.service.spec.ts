import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TableService } from './table.service';
import { StoreTable, Order, OrderHistory, OrderStatus } from '../../entities';
import { SseService } from '../sse/sse.service';

jest.mock('bcrypt');

const mockTable: Partial<StoreTable> = {
  id: 'table-uuid',
  tableNumber: 1,
  password: 'hashed-pw',
  storeId: 'store-uuid',
  sessionId: 'session-123',
  sessionStartedAt: new Date(),
};

const mockOrder: Partial<Order> = {
  id: 'order-uuid',
  orderNumber: 1,
  status: OrderStatus.COMPLETED,
  totalAmount: 18000,
  sessionId: 'session-123',
  storeId: 'store-uuid',
  orderedAt: new Date(),
  items: [{ id: 'item-uuid', menuName: '김치찌개', quantity: 2, unitPrice: 9000, subtotal: 18000, orderId: 'order-uuid' } as any],
};

const mockTableRepo = { findOne: jest.fn(), find: jest.fn(), create: jest.fn(), save: jest.fn() };
const mockOrderRepo = { find: jest.fn(), remove: jest.fn() };
const mockHistoryRepo: Record<string, jest.Mock> = { create: jest.fn(), save: jest.fn() };
const mockSseService = { emit: jest.fn() };

describe('TableService', () => {
  let service: TableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableService,
        { provide: getRepositoryToken(StoreTable), useValue: mockTableRepo },
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: getRepositoryToken(OrderHistory), useValue: mockHistoryRepo },
        { provide: SseService, useValue: mockSseService },
      ],
    }).compile();

    service = module.get<TableService>(TableService);
    jest.clearAllMocks();
  });

  describe('createTable', () => {
    it('should create a table successfully', async () => {
      mockTableRepo.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      mockTableRepo.create.mockReturnValue(mockTable);
      mockTableRepo.save.mockResolvedValue(mockTable);

      const result = await service.createTable('store-uuid', { tableNumber: 1, password: 'pass' });
      expect(result).toEqual(mockTable);
    });

    it('should throw ConflictException if table number already exists', async () => {
      mockTableRepo.findOne.mockResolvedValue(mockTable);
      await expect(service.createTable('store-uuid', { tableNumber: 1, password: 'pass' }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('findByStore', () => {
    it('should return tables for a store', async () => {
      mockTableRepo.find.mockResolvedValue([mockTable]);
      const result = await service.findByStore('store-uuid');
      expect(result).toEqual([mockTable]);
    });
  });

  describe('completeSession', () => {
    it('should move orders to history and reset session', async () => {
      mockTableRepo.findOne.mockResolvedValue({ ...mockTable });
      mockOrderRepo.find.mockResolvedValue([mockOrder]);
      mockHistoryRepo.create.mockReturnValue({});
      mockHistoryRepo.save.mockResolvedValue([]);
      mockOrderRepo.remove.mockResolvedValue(undefined);
      mockTableRepo.save.mockResolvedValue(mockTable);

      await service.completeSession('table-uuid', 'store-uuid');

      expect(mockHistoryRepo.create).toHaveBeenCalled();
      expect(mockHistoryRepo.save).toHaveBeenCalled();
      expect(mockOrderRepo.remove).toHaveBeenCalledWith([mockOrder]);
      expect(mockSseService.emit).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'session_completed' }),
      );
    });

    it('should throw NotFoundException if table not found', async () => {
      mockTableRepo.findOne.mockResolvedValue(null);
      await expect(service.completeSession('invalid', 'store-uuid'))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if no active session', async () => {
      mockTableRepo.findOne.mockResolvedValue({ ...mockTable, sessionId: null });
      await expect(service.completeSession('table-uuid', 'store-uuid'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('getOrderHistory', () => {
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };

    beforeEach(() => {
      mockHistoryRepo.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder);
    });

    it('should return order history for a store', async () => {
      const result = await service.getOrderHistory('store-uuid');
      expect(result).toEqual([]);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
    });

    it('should filter by tableNumber when provided', async () => {
      await service.getOrderHistory('store-uuid', 1);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'h.tableNumber = :tableNumber', { tableNumber: 1 },
      );
    });

    it('should filter by date when provided', async () => {
      await service.getOrderHistory('store-uuid', undefined, '2025-01-01');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'DATE(h.completedAt) = :date', { date: '2025-01-01' },
      );
    });
  });
});
