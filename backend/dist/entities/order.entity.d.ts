import { StoreTable } from './table.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    PREPARING = "preparing",
    COMPLETED = "completed"
}
export declare class Order {
    id: string;
    orderNumber: number;
    status: OrderStatus;
    totalAmount: number;
    sessionId: string;
    table: StoreTable;
    tableId: string;
    storeId: string;
    items: OrderItem[];
    orderedAt: Date;
}
