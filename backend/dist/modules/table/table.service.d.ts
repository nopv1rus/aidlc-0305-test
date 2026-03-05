import { Repository } from 'typeorm';
import { StoreTable, Order, OrderHistory } from '../../entities';
import { SseService } from '../sse/sse.service';
import { CreateTableDto } from './dto/table.dto';
export declare class TableService {
    private readonly tableRepo;
    private readonly orderRepo;
    private readonly historyRepo;
    private readonly sseService;
    constructor(tableRepo: Repository<StoreTable>, orderRepo: Repository<Order>, historyRepo: Repository<OrderHistory>, sseService: SseService);
    createTable(storeId: string, dto: CreateTableDto): Promise<StoreTable>;
    findByStore(storeId: string): Promise<StoreTable[]>;
    completeSession(tableId: string, storeId: string): Promise<void>;
    getOrderHistory(storeId: string, tableNumber?: number, date?: string): Promise<OrderHistory[]>;
    getDashboard(storeId: string): Promise<{
        tableId: string;
        tableNumber: number;
        sessionId: string | null;
        sessionStartedAt: Date | null;
        totalAmount: number;
        orderCount: number;
        recentOrders: {
            orderId: string;
            orderNumber: number;
            status: import("../../entities").OrderStatus;
            totalAmount: number;
            orderedAt: Date;
            items: {
                menuName: string;
                quantity: number;
            }[];
        }[];
    }[]>;
}
