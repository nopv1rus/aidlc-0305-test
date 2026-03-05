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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let MenuService = class MenuService {
    menuRepo;
    constructor(menuRepo) {
        this.menuRepo = menuRepo;
    }
    async create(storeId, dto) {
        const menu = this.menuRepo.create({ ...dto, storeId });
        return this.menuRepo.save(menu);
    }
    async findByStore(storeId, category) {
        const query = this.menuRepo
            .createQueryBuilder('menu')
            .where('menu.storeId = :storeId', { storeId })
            .andWhere('menu.isAvailable = :available', { available: true })
            .orderBy('menu.category', 'ASC')
            .addOrderBy('menu.sortOrder', 'ASC');
        if (category) {
            query.andWhere('menu.category = :category', { category });
        }
        return query.getMany();
    }
    async update(id, storeId, dto) {
        const menu = await this.menuRepo.findOne({ where: { id, storeId } });
        if (!menu)
            throw new common_1.NotFoundException('메뉴를 찾을 수 없습니다.');
        Object.assign(menu, dto);
        return this.menuRepo.save(menu);
    }
    async remove(id, storeId) {
        const menu = await this.menuRepo.findOne({ where: { id, storeId } });
        if (!menu)
            throw new common_1.NotFoundException('메뉴를 찾을 수 없습니다.');
        await this.menuRepo.remove(menu);
    }
    async updateSortOrder(storeId, items) {
        for (const item of items) {
            await this.menuRepo.update({ id: item.id, storeId }, { sortOrder: item.sortOrder });
        }
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Menu)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MenuService);
//# sourceMappingURL=menu.service.js.map