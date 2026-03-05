import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreModule } from './modules/store/store.module';
import { AuthModule } from './modules/auth/auth.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrderModule } from './modules/order/order.module';
import { TableModule } from './modules/table/table.module';
import { SseModule } from './modules/sse/sse.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_DATABASE', 'table_order'),
        autoLoadEntities: true,
        synchronize: true, // dev only
      }),
    }),
    StoreModule,
    AuthModule,
    MenuModule,
    OrderModule,
    TableModule,
    SseModule,
  ],
})
export class AppModule {}
