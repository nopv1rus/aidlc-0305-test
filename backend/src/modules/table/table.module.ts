import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreTable, Order, OrderHistory } from '../../entities';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreTable, Order, OrderHistory]), AuthModule],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
