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
exports.Admin = void 0;
const typeorm_1 = require("typeorm");
const store_entity_1 = require("./store.entity");
let Admin = class Admin {
    id;
    username;
    password;
    loginAttempts;
    lockedUntil;
    store;
    storeId;
    createdAt;
};
exports.Admin = Admin;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Admin.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Admin.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Admin.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Admin.prototype, "loginAttempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Admin.prototype, "lockedUntil", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, (store) => store.admins),
    __metadata("design:type", store_entity_1.Store)
], Admin.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Admin.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Admin.prototype, "createdAt", void 0);
exports.Admin = Admin = __decorate([
    (0, typeorm_1.Entity)('admins')
], Admin);
//# sourceMappingURL=admin.entity.js.map