import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { StoreTable, Order, OrderHistory } from '../../entities';
import { SseService } from '../sse/sse.service';
import { CreateTableDto } from './dto/table.dto';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(StoreTable) private readonly tableRepo: Repository<StoreTable>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderHistory) private readonly historyRepo: Repository<OrderHistory>,
    private readonly sseService: SseService,
  ) {}

  async createTable(storeId: string, dto: CreateTableDto): Promise<StoreTable> {
    const exists = await this.tableRepo.findOne({
      where: { tableNumber: dto.tableNumber, storeId },
    });
    if (exists) throw new ConflictException('이미 존재하는 테이블 번호입니다.');

    const hashed = await bcrypt.hash(dto.password, 10);
    const table = this.tableRepo.create({
      tableNumber: dto.tableNumber,
      password: hashed,
      storeId,
    });
    return this.tableRepo.save(table);
  }

  async findByStore(storeId: string): Promise<StoreTable[]> {
    return this.tableRepo.find({
      where: { storeId },
      order: { tableNumber: 'ASC' },
    });
  }

  async completeSession(tableId: string, storeId: string): Promise<void> {
    const table = await this.tableRepo.findOne({ where: { id: tableId, storeId } });
    if (!table) throw new NotFoundException('테이블을 찾을 수 없습니다.');
    if (!table.sessionId) throw new NotFoundException('활성 세션이 없습니다.');

    // 현재 세션의 주문들을 히스토리로 이동
    const orders = await this.orderRepo.find({
      where: { sessionId: table.sessionId },
      relations: ['items'],
    });

    const now = new Date();
    const histories = orders.map((order) =>
      this.historyRepo.create({
        orderNumber: order.orderNumber,
        sessionId: order.sessionId,
        storeId: order.storeId,
        tableNumber: table.tableNumber,
        totalAmount: order.totalAmount,
        items: order.items.map((i) => ({
          menuName: i.menuName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          subtotal: i.subtotal,
        })),
        status: order.status,
        orderedAt: order.orderedAt,
        completedAt: now,
      }),
    );

    await this.historyRepo.save(histories);
    await this.orderRepo.remove(orders);

    // 세션 리셋
    table.sessionId = null;
    table.sessionStartedAt = null;
    await this.tableRepo.save(table);

    this.sseService.emit({
      storeId,
      type: 'session_completed',
      data: { tableNumber: table.tableNumber },
    });
  }

  async getOrderHistory(
    storeId: string,
    tableNumber?: number,
    date?: string,
  ): Promise<OrderHistory[]> {
    const query = this.historyRepo
      .createQueryBuilder('h')
      .where('h.storeId = :storeId', { storeId })
      .orderBy('h.completedAt', 'DESC');

    if (tableNumber) {
      query.andWhere('h.tableNumber = :tableNumber', { tableNumber });
    }
    if (date) {
      query.andWhere('DATE(h.completedAt) = :date', { date });
    }
    return query.getMany();
  }

  async getDashboard(storeId: string) {
    const tables = await this.tableRepo.find({
      where: { storeId },
      order: { tableNumber: 'ASC' },
    });

    const result = await Promise.all(
      tables.map(async (table) => {
        let orders: Order[] = [];
        let totalAmount = 0;

        if (table.sessionId) {
          orders = await this.orderRepo.find({
            where: { sessionId: table.sessionId },
            relations: ['items'],
            order: { orderedAt: 'DESC' },
          });
          totalAmount = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        }

        return {
          tableId: table.id,
          tableNumber: table.tableNumber,
          sessionId: table.sessionId,
          sessionStartedAt: table.sessionStartedAt,
          totalAmount,
          orderCount: orders.length,
          recentOrders: orders.slice(0, 3).map((o) => ({
            orderId: o.id,
            orderNumber: o.orderNumber,
            status: o.status,
            totalAmount: o.totalAmount,
            orderedAt: o.orderedAt,
            items: o.items.map((i) => ({ menuName: i.menuName, quantity: i.quantity })),
          })),
        };
      }),
    );

    return result;
  }

}
