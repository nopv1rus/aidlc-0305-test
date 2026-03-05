import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';

@ApiTags('매장')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiOperation({ summary: '매장 등록' })
  create(@Body() dto: CreateStoreDto) {
    return this.storeService.create(dto);
  }

  @Get(':storeCode')
  @ApiOperation({ summary: '매장 조회 (코드)' })
  findByCode(@Param('storeCode') storeCode: string) {
    return this.storeService.findByCode(storeCode);
  }
}
