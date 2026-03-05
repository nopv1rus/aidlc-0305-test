import { Store } from './store.entity';
import { Order } from './order.entity';
export declare class StoreTable {
    id: string;
    tableNumber: number;
    password: string;
    sessionId: string | null;
    sessionStartedAt: Date | null;
    store: Store;
    storeId: string;
    orders: Order[];
    createdAt: Date;
}
