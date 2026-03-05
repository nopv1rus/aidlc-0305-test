import { Repository } from 'typeorm';
import { Order, OrderItem, StoreTable, OrderHistory } from '../../entities';
import { SseService } from '../sse/sse.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
export declare class OrderService {
    private readonly orderRepo;
    private readonly itemRepo;
    private readonly tableRepo;
    private readonly historyRepo;
    private readonly sseService;
    constructor(orderRepo: Repository<Order>, itemRepo: Repository<OrderItem>, tableRepo: Repository<StoreTable>, historyRepo: Repository<OrderHistory>, sseService: SseService);
    create(tableId: string, storeId: string, dto: CreateOrderDto): Promise<Order>;
    findBySession(sessionId: string): Promise<Order[]>;
    findByStore(storeId: string): Promise<Order[]>;
    updateStatus(orderId: string, storeId: string, dto: UpdateOrderStatusDto): Promise<Order>;
    deleteOrder(orderId: string, storeId: string): Promise<void>;
}
