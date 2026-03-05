"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const entities_1 = require("../../entities");
const sse_service_1 = require("../sse/sse.service");
let TableService = class TableService {
    tableRepo;
    orderRepo;
    historyRepo;
    sseService;
    constructor(tableRepo, orderRepo, historyRepo, sseService) {
        this.tableRepo = tableRepo;
        this.orderRepo = orderRepo;
        this.historyRepo = historyRepo;
        this.sseService = sseService;
    }
    async createTable(storeId, dto) {
        const exists = await this.tableRepo.findOne({
            where: { tableNumber: dto.tableNumber, storeId },
        });
        if (exists)
            throw new common_1.ConflictException('이미 존재하는 테이블 번호입니다.');
        const hashed = await bcrypt.hash(dto.password, 10);
        const table = this.tableRepo.create({
            tableNumber: dto.tableNumber,
            password: hashed,
            storeId,
        });
        return this.tableRepo.save(table);
    }
    async findByStore(storeId) {
        return this.tableRepo.find({
            where: { storeId },
            order: { tableNumber: 'ASC' },
        });
    }
    async completeSession(tableId, storeId) {
        const table = await this.tableRepo.findOne({ where: { id: tableId, storeId } });
        if (!table)
            throw new common_1.NotFoundException('테이블을 찾을 수 없습니다.');
        if (!table.sessionId)
            throw new common_1.NotFoundException('활성 세션이 없습니다.');
        const orders = await this.orderRepo.find({
            where: { sessionId: table.sessionId },
            relations: ['items'],
        });
        const now = new Date();
        const histories = orders.map((order) => this.historyRepo.create({
            orderNumber: order.orderNumber,
            sessionId: order.sessionId,
            storeId: order.storeId,
            tableNumber: table.tableNumber,
            totalAmount: order.totalAmount,
            items: order.items.map((i) => ({
                menuName: i.menuName,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                subtotal: i.subtotal,
            })),
            status: order.status,
            orderedAt: order.orderedAt,
            completedAt: now,
        }));
        await this.historyRepo.save(histories);
        await this.orderRepo.remove(orders);
        table.sessionId = null;
        table.sessionStartedAt = null;
        await this.tableRepo.save(table);
        this.sseService.emit({
            storeId,
            type: 'session_completed',
            data: { tableNumber: table.tableNumber },
        });
    }
    async getOrderHistory(storeId, tableNumber, date) {
        const query = this.historyRepo
            .createQueryBuilder('h')
            .where('h.storeId = :storeId', { storeId })
            .orderBy('h.completedAt', 'DESC');
        if (tableNumber) {
            query.andWhere('h.tableNumber = :tableNumber', { tableNumber });
        }
        if (date) {
            query.andWhere('DATE(h.completedAt) = :date', { date });
        }
        return query.getMany();
    }
    async getDashboard(storeId) {
        const tables = await this.tableRepo.find({
            where: { storeId },
            order: { tableNumber: 'ASC' },
        });
        const result = await Promise.all(tables.map(async (table) => {
            let orders = [];
            let totalAmount = 0;
            if (table.sessionId) {
                orders = await this.orderRepo.find({
                    where: { sessionId: table.sessionId },
                    relations: ['items'],
                    order: { orderedAt: 'DESC' },
                });
                totalAmount = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
            }
            return {
                tableId: table.id,
                tableNumber: table.tableNumber,
                sessionId: table.sessionId,
                sessionStartedAt: table.sessionStartedAt,
                totalAmount,
                orderCount: orders.length,
                recentOrders: orders.slice(0, 3).map((o) => ({
                    orderId: o.id,
                    orderNumber: o.orderNumber,
                    status: o.status,
                    totalAmount: o.totalAmount,
                    orderedAt: o.orderedAt,
                    items: o.items.map((i) => ({ menuName: i.menuName, quantity: i.quantity })),
                })),
            };
        }));
        return result;
    }
};
exports.TableService = TableService;
exports.TableService = TableService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.StoreTable)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.OrderHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        sse_service_1.SseService])
], TableService);
//# sourceMappingURL=table.service.js.map