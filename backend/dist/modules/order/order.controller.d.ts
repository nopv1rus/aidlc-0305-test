import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(req: any, dto: CreateOrderDto): Promise<import("../../entities").Order>;
    findBySession(sessionId: string): Promise<import("../../entities").Order[]>;
    findByStore(req: any): Promise<import("../../entities").Order[]>;
    updateStatus(req: any, id: string, dto: UpdateOrderStatusDto): Promise<import("../../entities").Order>;
    deleteOrder(req: any, id: string): Promise<void>;
}
