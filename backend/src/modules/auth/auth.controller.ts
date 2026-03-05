import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminLoginDto, AdminRegisterDto, TableLoginDto } from './dto/admin-login.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/register')
  @ApiOperation({ summary: '관리자 등록' })
  registerAdmin(@Body() dto: AdminRegisterDto) {
    return this.authService.registerAdmin(dto);
  }

  @Post('admin/login')
  @ApiOperation({ summary: '관리자 로그인' })
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  @Post('table/login')
  @ApiOperation({ summary: '테이블 태블릿 로그인' })
  tableLogin(@Body() dto: TableLoginDto) {
    return this.authService.tableLogin(dto);
  }
}
