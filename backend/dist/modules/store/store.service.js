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
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let StoreService = class StoreService {
    storeRepo;
    constructor(storeRepo) {
        this.storeRepo = storeRepo;
    }
    async create(dto) {
        const exists = await this.storeRepo.findOne({ where: { storeCode: dto.storeCode } });
        if (exists)
            throw new common_1.ConflictException('이미 존재하는 매장 코드입니다.');
        const store = this.storeRepo.create(dto);
        return this.storeRepo.save(store);
    }
    async findByCode(storeCode) {
        const store = await this.storeRepo.findOne({ where: { storeCode } });
        if (!store)
            throw new common_1.NotFoundException('매장을 찾을 수 없습니다.');
        return store;
    }
    async findById(id) {
        const store = await this.storeRepo.findOne({ where: { id } });
        if (!store)
            throw new common_1.NotFoundException('매장을 찾을 수 없습니다.');
        return store;
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StoreService);
//# sourceMappingURL=store.service.js.map