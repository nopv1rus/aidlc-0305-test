import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem, StoreTable, OrderHistory } from '../../entities';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, StoreTable, OrderHistory]), AuthModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
