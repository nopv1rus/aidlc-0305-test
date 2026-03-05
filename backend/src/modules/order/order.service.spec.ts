import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order, OrderStatus, OrderItem, StoreTable, OrderHistory } from '../../entities';
import { SseService } from '../sse/sse.service';

const mockTable: Partial<StoreTable> = {
  id: 'table-uuid',
  tableNumber: 1,
  storeId: 'store-uuid',
  sessionId: 'session-123',
  sessionStartedAt: new Date(),
};

const mockOrder: Partial<Order> = {
  id: 'order-uuid',
  orderNumber: 1,
  status: OrderStatus.PENDING,
  totalAmount: 18000,
  sessionId: 'session-123',
  tableId: 'table-uuid',
  storeId: 'store-uuid',
  items: [],
  orderedAt: new Date(),
  table: mockTable as StoreTable,
};

const mockOrderRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  count: jest.fn(),
};
const mockItemRepo = {};
const mockTableRepo = { findOne: jest.fn(), save: jest.fn() };
const mockHistoryRepo = {};
const mockSseService = { emit: jest.fn() };

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: getRepositoryToken(OrderItem), useValue: mockItemRepo },
        { provide: getRepositoryToken(StoreTable), useValue: mockTableRepo },
        { provide: getRepositoryToken(OrderHistory), useValue: mockHistoryRepo },
        { provide: SseService, useValue: mockSseService },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order with items', async () => {
      mockTableRepo.findOne.mockResolvedValue({ ...mockTable });
      mockOrderRepo.count.mockResolvedValue(0);
      mockOrderRepo.create.mockReturnValue(mockOrder);
      mockOrderRepo.save.mockResolvedValue({
        ...mockOrder,
        items: [{ menuName: '김치찌개', quantity: 2, unitPrice: 9000, subtotal: 18000 }],
      });

      const result = await service.create('table-uuid', 'store-uuid', {
        items: [{ menuName: '김치찌개', quantity: 2, unitPrice: 9000 }],
      });

      expect(result.items).toHaveLength(1);
      expect(mockSseService.emit).toHaveBeenCalledWith(
        expect.objectContaining({ storeId: 'store-uuid', type: 'new_order' }),
      );
    });

    it('should throw NotFoundException if table not found', async () => {
      mockTableRepo.findOne.mockResolvedValue(null);
      await expect(
        service.create('invalid', 'store-uuid', { items: [] }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create new session if table has no sessionId', async () => {
      const tableNoSession = { ...mockTable, sessionId: null };
      mockTableRepo.findOne.mockResolvedValue(tableNoSession);
      mockTableRepo.save.mockResolvedValue(tableNoSession);
      mockOrderRepo.count.mockResolvedValue(0);
      mockOrderRepo.create.mockReturnValue(mockOrder);
      mockOrderRepo.save.mockResolvedValue(mockOrder);

      await service.create('table-uuid', 'store-uuid', {
        items: [{ menuName: '김치찌개', quantity: 1, unitPrice: 9000 }],
      });

      expect(tableNoSession.sessionId).toBeTruthy();
      expect(mockTableRepo.save).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update order status and emit SSE event', async () => {
      const order = { ...mockOrder, table: { tableNumber: 1 } };
      mockOrderRepo.findOne.mockResolvedValue(order);
      mockOrderRepo.save.mockResolvedValue({ ...order, status: OrderStatus.PREPARING });

      await service.updateStatus('order-uuid', 'store-uuid', { status: 'preparing' });
      expect(mockSseService.emit).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'order_status_changed' }),
      );
    });

    it('should throw NotFoundException if order not found', async () => {
      mockOrderRepo.findOne.mockResolvedValue(null);
      await expect(
        service.updateStatus('invalid', 'store-uuid', { status: 'preparing' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteOrder', () => {
    it('should delete order and emit SSE event', async () => {
      mockOrderRepo.findOne.mockResolvedValue({ ...mockOrder, table: { tableNumber: 1 } });
      mockOrderRepo.remove.mockResolvedValue(undefined);

      await service.deleteOrder('order-uuid', 'store-uuid');
      expect(mockOrderRepo.remove).toHaveBeenCalled();
      expect(mockSseService.emit).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'order_deleted' }),
      );
    });
  });
});
