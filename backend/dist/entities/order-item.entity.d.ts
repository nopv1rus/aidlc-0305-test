import { Order } from './order.entity';
export declare class OrderItem {
    id: string;
    menuName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    order: Order;
    orderId: string;
}
