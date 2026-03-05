import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../../entities';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
