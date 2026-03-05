import { Controller, Get, Post, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/table.dto';
import { Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('테이블')
@Controller('tables')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @ApiOperation({ summary: '테이블 등록 (관리자)' })
  create(@Request() req, @Body() dto: CreateTableDto) {
    return this.tableService.createTable(req.user.storeId, dto);
  }

  @Get()
  @ApiOperation({ summary: '매장 테이블 목록 조회' })
  findByStore(@Request() req) {
    return this.tableService.findByStore(req.user.storeId);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: '테이블 이용 완료 (세션 종료)' })
  completeSession(@Request() req, @Param('id') id: string) {
    return this.tableService.completeSession(id, req.user.storeId);
  }

  @Get('dashboard')
  @ApiOperation({ summary: '테이블별 주문 대시보드 (관리자)' })
  getDashboard(@Request() req) {
    return this.tableService.getDashboard(req.user.storeId);
  }

  @Get('history')
  @ApiOperation({ summary: '과거 주문 내역 조회' })
  getHistory(
    @Request() req,
    @Query('tableNumber') tableNumber?: number,
    @Query('date') date?: string,
  ) {
    return this.tableService.getOrderHistory(req.user.storeId, tableNumber, date);
  }
}
