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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const entities_1 = require("../../entities");
let AuthService = class AuthService {
    adminRepo;
    tableRepo;
    storeRepo;
    jwtService;
    constructor(adminRepo, tableRepo, storeRepo, jwtService) {
        this.adminRepo = adminRepo;
        this.tableRepo = tableRepo;
        this.storeRepo = storeRepo;
        this.jwtService = jwtService;
    }
    async registerAdmin(dto) {
        const store = await this.storeRepo.findOne({ where: { storeCode: dto.storeCode } });
        if (!store)
            throw new common_1.UnauthorizedException('매장을 찾을 수 없습니다.');
        const hashed = await bcrypt.hash(dto.password, 10);
        const admin = this.adminRepo.create({
            username: dto.username,
            password: hashed,
            storeId: store.id,
        });
        await this.adminRepo.save(admin);
        return { message: '관리자 등록 완료' };
    }
    async adminLogin(dto) {
        const store = await this.storeRepo.findOne({ where: { storeCode: dto.storeCode } });
        if (!store)
            throw new common_1.UnauthorizedException('매장 또는 인증 정보가 올바르지 않습니다.');
        const admin = await this.adminRepo.findOne({
            where: { username: dto.username, storeId: store.id },
        });
        if (!admin)
            throw new common_1.UnauthorizedException('매장 또는 인증 정보가 올바르지 않습니다.');
        if (admin.lockedUntil && admin.lockedUntil > new Date()) {
            throw new common_1.ForbiddenException('로그인 시도 횟수 초과. 잠시 후 다시 시도해주세요.');
        }
        const isValid = await bcrypt.compare(dto.password, admin.password);
        if (!isValid) {
            admin.loginAttempts += 1;
            if (admin.loginAttempts >= 5) {
                admin.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
                admin.loginAttempts = 0;
            }
            await this.adminRepo.save(admin);
            throw new common_1.UnauthorizedException('매장 또는 인증 정보가 올바르지 않습니다.');
        }
        admin.loginAttempts = 0;
        admin.lockedUntil = null;
        await this.adminRepo.save(admin);
        const payload = { sub: admin.id, storeId: store.id, role: 'admin' };
        return { accessToken: this.jwtService.sign(payload) };
    }
    async tableLogin(dto) {
        const store = await this.storeRepo.findOne({ where: { storeCode: dto.storeCode } });
        if (!store)
            throw new common_1.UnauthorizedException('매장 또는 테이블 정보가 올바르지 않습니다.');
        const table = await this.tableRepo.findOne({
            where: { tableNumber: dto.tableNumber, storeId: store.id },
        });
        if (!table)
            throw new common_1.UnauthorizedException('매장 또는 테이블 정보가 올바르지 않습니다.');
        const isValid = await bcrypt.compare(dto.password, table.password);
        if (!isValid)
            throw new common_1.UnauthorizedException('매장 또는 테이블 정보가 올바르지 않습니다.');
        const payload = {
            sub: table.id,
            storeId: store.id,
            tableNumber: table.tableNumber,
            sessionId: table.sessionId,
            role: 'table',
        };
        return { accessToken: this.jwtService.sign(payload) };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Admin)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.StoreTable)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map