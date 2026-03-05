export declare class OrderItemDto {
    menuName: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
}
export declare class UpdateOrderStatusDto {
    status: string;
}
