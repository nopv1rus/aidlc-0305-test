import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('주문')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '주문 생성 (테이블)' })
  create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.orderService.create(req.user.id, req.user.storeId, dto);
  }

  @Get('session/:sessionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '세션별 주문 내역 조회' })
  findBySession(@Param('sessionId') sessionId: string) {
    return this.orderService.findBySession(sessionId);
  }

  @Get('store')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '매장 전체 주문 조회 (관리자)' })
  findByStore(@Request() req) {
    return this.orderService.findByStore(req.user.storeId);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '주문 상태 변경 (관리자)' })
  updateStatus(@Request() req, @Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, req.user.storeId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '주문 삭제 (관리자)' })
  deleteOrder(@Request() req, @Param('id') id: string) {
    return this.orderService.deleteOrder(id, req.user.storeId);
  }
}
