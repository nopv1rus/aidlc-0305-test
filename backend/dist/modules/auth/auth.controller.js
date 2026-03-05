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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const admin_login_dto_1 = require("./dto/admin-login.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    registerAdmin(dto) {
        return this.authService.registerAdmin(dto);
    }
    adminLogin(dto) {
        return this.authService.adminLogin(dto);
    }
    tableLogin(dto) {
        return this.authService.tableLogin(dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('admin/register'),
    (0, swagger_1.ApiOperation)({ summary: '관리자 등록' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.AdminRegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerAdmin", null);
__decorate([
    (0, common_1.Post)('admin/login'),
    (0, swagger_1.ApiOperation)({ summary: '관리자 로그인' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.AdminLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "adminLogin", null);
__decorate([
    (0, common_1.Post)('table/login'),
    (0, swagger_1.ApiOperation)({ summary: '테이블 태블릿 로그인' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.TableLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "tableLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('인증'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map