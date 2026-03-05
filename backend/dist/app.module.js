"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const store_module_1 = require("./modules/store/store.module");
const auth_module_1 = require("./modules/auth/auth.module");
const menu_module_1 = require("./modules/menu/menu.module");
const order_module_1 = require("./modules/order/order.module");
const table_module_1 = require("./modules/table/table.module");
const sse_module_1 = require("./modules/sse/sse.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST', 'localhost'),
                    port: config.get('DB_PORT', 5432),
                    username: config.get('DB_USERNAME', 'postgres'),
                    password: config.get('DB_PASSWORD', 'postgres'),
                    database: config.get('DB_DATABASE', 'table_order'),
                    autoLoadEntities: true,
                    synchronize: true,
                }),
            }),
            store_module_1.StoreModule,
            auth_module_1.AuthModule,
            menu_module_1.MenuModule,
            order_module_1.OrderModule,
            table_module_1.TableModule,
            sse_module_1.SseModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map