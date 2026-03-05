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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreTable = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const store_entity_1 = require("./store.entity");
const order_entity_1 = require("./order.entity");
let StoreTable = class StoreTable {
    id;
    tableNumber;
    password;
    sessionId;
    sessionStartedAt;
    store;
    storeId;
    orders;
    createdAt;
};
exports.StoreTable = StoreTable;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StoreTable.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], StoreTable.prototype, "tableNumber", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ select: false }),
    __metadata("design:type", String)
], StoreTable.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], StoreTable.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], StoreTable.prototype, "sessionStartedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, (store) => store.tables),
    __metadata("design:type", store_entity_1.Store)
], StoreTable.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StoreTable.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.table),
    __metadata("design:type", Array)
], StoreTable.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StoreTable.prototype, "createdAt", void 0);
exports.StoreTable = StoreTable = __decorate([
    (0, typeorm_1.Entity)('store_tables')
], StoreTable);
//# sourceMappingURL=table.entity.js.map