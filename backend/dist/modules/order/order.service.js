"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const entities_1 = require("../../entities");
const sse_service_1 = require("../sse/sse.service");
let OrderService = class OrderService {
    orderRepo;
    itemRepo;
    tableRepo;
    historyRepo;
    sseService;
    constructor(orderRepo, itemRepo, tableRepo, historyRepo, sseService) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.tableRepo = tableRepo;
        this.historyRepo = historyRepo;
        this.sseService = sseService;
    }
    async create(tableId, storeId, dto) {
        const table = await this.tableRepo.findOne({ where: { id: tableId } });
        if (!table)
            throw new common_1.NotFoundException('테이블을 찾을 수 없습니다.');
        if (!table.sessionId) {
            table.sessionId = (0, uuid_1.v4)();
            table.sessionStartedAt = new Date();
            await this.tableRepo.save(table);
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const count = await this.orderRepo.count({
            where: { storeId },
        });
        const items = dto.items.map((item) => {
            const orderItem = new entities_1.OrderItem();
            orderItem.menuName = item.menuName;
            orderItem.quantity = item.quantity;
            orderItem.unitPrice = item.unitPrice;
            orderItem.subtotal = item.quantity * item.unitPrice;
            return orderItem;
        });
        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
        const order = this.orderRepo.create({
            orderNumber: count + 1,
            status: entities_1.OrderStatus.PENDING,
            totalAmount,
            sessionId: table.sessionId,
            tableId: table.id,
            storeId,
            items,
        });
        const saved = await this.orderRepo.save(order);
        this.sseService.emit({
            storeId,
            type: 'new_order',
            data: {
                orderId: saved.id,
                orderNumber: saved.orderNumber,
                tableNumber: table.tableNumber,
                totalAmount: saved.totalAmount,
                items: saved.items,
                orderedAt: saved.orderedAt,
            },
        });
        return saved;
    }
    async findBySession(sessionId) {
        return this.orderRepo.find({
            where: { sessionId },
            relations: ['items'],
            order: { orderedAt: 'DESC' },
        });
    }
    async findByStore(storeId) {
        return this.orderRepo.find({
            where: { storeId },
            relations: ['items', 'table'],
            order: { orderedAt: 'DESC' },
        });
    }
    async updateStatus(orderId, storeId, dto) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId, storeId },
            relations: ['items', 'table'],
        });
        if (!order)
            throw new common_1.NotFoundException('주문을 찾을 수 없습니다.');
        order.status = dto.status;
        const saved = await this.orderRepo.save(order);
        this.sseService.emit({
            storeId,
            type: 'order_status_changed',
            data: {
                orderId: saved.id,
                orderNumber: saved.orderNumber,
                tableNumber: order.table.tableNumber,
                status: saved.status,
            },
        });
        return saved;
    }
    async deleteOrder(orderId, storeId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId, storeId },
            relations: ['items', 'table'],
        });
        if (!order)
            throw new common_1.NotFoundException('주문을 찾을 수 없습니다.');
        const tableNumber = order.table.tableNumber;
        await this.orderRepo.remove(order);
        this.sseService.emit({
            storeId,
            type: 'order_deleted',
            data: { orderId, tableNumber },
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.StoreTable)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.OrderHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        sse_service_1.SseService])
], OrderService);
//# sourceMappingURL=order.service.js.map