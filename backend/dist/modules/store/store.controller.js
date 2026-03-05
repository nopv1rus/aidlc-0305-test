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
exports.StoreController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const store_service_1 = require("./store.service");
const create_store_dto_1 = require("./dto/create-store.dto");
let StoreController = class StoreController {
    storeService;
    constructor(storeService) {
        this.storeService = storeService;
    }
    create(dto) {
        return this.storeService.create(dto);
    }
    findByCode(storeCode) {
        return this.storeService.findByCode(storeCode);
    }
};
exports.StoreController = StoreController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '매장 등록' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_store_dto_1.CreateStoreDto]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':storeCode'),
    (0, swagger_1.ApiOperation)({ summary: '매장 조회 (코드)' }),
    __param(0, (0, common_1.Param)('storeCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoreController.prototype, "findByCode", null);
exports.StoreController = StoreController = __decorate([
    (0, swagger_1.ApiTags)('매장'),
    (0, common_1.Controller)('stores'),
    __metadata("design:paramtypes", [store_service_1.StoreService])
], StoreController);
//# sourceMappingURL=store.controller.js.map