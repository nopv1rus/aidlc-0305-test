export declare class OrderHistory {
    id: string;
    orderNumber: number;
    sessionId: string;
    storeId: string;
    tableNumber: number;
    totalAmount: number;
    items: {
        menuName: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
    }[];
    status: string;
    orderedAt: Date;
    completedAt: Date;
}
