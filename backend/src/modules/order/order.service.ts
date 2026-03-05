import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderStatus, OrderItem, StoreTable, OrderHistory } from '../../entities';
import { SseService } from '../sse/sse.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(StoreTable) private readonly tableRepo: Repository<StoreTable>,
    @InjectRepository(OrderHistory) private readonly historyRepo: Repository<OrderHistory>,
    private readonly sseService: SseService,
  ) {}

  async create(tableId: string, storeId: string, dto: CreateOrderDto): Promise<Order> {
    const table = await this.tableRepo.findOne({ where: { id: tableId } });
    if (!table) throw new NotFoundException('테이블을 찾을 수 없습니다.');

    // 세션이 없으면 새 세션 시작 (첫 주문)
    if (!table.sessionId) {
      table.sessionId = uuidv4();
      table.sessionStartedAt = new Date();
      await this.tableRepo.save(table);
    }

    // 당일 주문 번호 생성
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await this.orderRepo.count({
      where: { storeId },
      // 당일 기준
    });

    const items = dto.items.map((item) => {
      const orderItem = new OrderItem();
      orderItem.menuName = item.menuName;
      orderItem.quantity = item.quantity;
      orderItem.unitPrice = item.unitPrice;
      orderItem.subtotal = item.quantity * item.unitPrice;
      return orderItem;
    });

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    const order = this.orderRepo.create({
      orderNumber: count + 1,
      status: OrderStatus.PENDING,
      totalAmount,
      sessionId: table.sessionId,
      tableId: table.id,
      storeId,
      items,
    });

    const saved = await this.orderRepo.save(order);

    // SSE 이벤트 발행
    this.sseService.emit({
      storeId,
      type: 'new_order',
      data: {
        orderId: saved.id,
        orderNumber: saved.orderNumber,
        tableNumber: table.tableNumber,
        totalAmount: saved.totalAmount,
        items: saved.items,
        orderedAt: saved.orderedAt,
      },
    });

    return saved;
  }

  async findBySession(sessionId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { sessionId },
      relations: ['items'],
      order: { orderedAt: 'DESC' },
    });
  }

  async findByStore(storeId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { storeId },
      relations: ['items', 'table'],
      order: { orderedAt: 'DESC' },
    });
  }

  async updateStatus(orderId: string, storeId: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, storeId },
      relations: ['items', 'table'],
    });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');

    order.status = dto.status as OrderStatus;
    const saved = await this.orderRepo.save(order);

    this.sseService.emit({
      storeId,
      type: 'order_status_changed',
      data: {
        orderId: saved.id,
        orderNumber: saved.orderNumber,
        tableNumber: order.table.tableNumber,
        status: saved.status,
      },
    });

    return saved;
  }

  async deleteOrder(orderId: string, storeId: string): Promise<void> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, storeId },
      relations: ['items', 'table'],
    });
    if (!order) throw new NotFoundException('주문을 찾을 수 없습니다.');

    const tableNumber = order.table.tableNumber;
    await this.orderRepo.remove(order);

    this.sseService.emit({
      storeId,
      type: 'order_deleted',
      data: { orderId, tableNumber },
    });
  }
}
