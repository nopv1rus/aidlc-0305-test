import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto, UpdateMenuSortDto } from './dto/menu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('메뉴')
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('store/:storeId')
  @ApiOperation({ summary: '매장 메뉴 조회 (공개)' })
  findByStore(@Param('storeId') storeId: string, @Query('category') category?: string) {
    return this.menuService.findByStore(storeId, category);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '메뉴 등록 (관리자)' })
  create(@Request() req, @Body() dto: CreateMenuDto) {
    return this.menuService.create(req.user.storeId, dto);
  }

  @Put('sort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '메뉴 노출 순서 일괄 변경 (관리자)' })
  updateSort(@Request() req, @Body() dto: UpdateMenuSortDto) {
    return this.menuService.updateSortOrder(req.user.storeId, dto.items);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '메뉴 수정 (관리자)' })
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return this.menuService.update(id, req.user.storeId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '메뉴 삭제 (관리자)' })
  remove(@Request() req, @Param('id') id: string) {
    return this.menuService.remove(id, req.user.storeId);
  }
}
