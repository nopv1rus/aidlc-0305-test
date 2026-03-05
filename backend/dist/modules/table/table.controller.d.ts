import { TableService } from './table.service';
import { CreateTableDto } from './dto/table.dto';
export declare class TableController {
    private readonly tableService;
    constructor(tableService: TableService);
    create(req: any, dto: CreateTableDto): Promise<import("../../entities").StoreTable>;
    findByStore(req: any): Promise<import("../../entities").StoreTable[]>;
    completeSession(req: any, id: string): Promise<void>;
    getDashboard(req: any): Promise<{
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
    getHistory(req: any, tableNumber?: number, date?: string): Promise<import("../../entities").OrderHistory[]>;
}
