import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin, StoreTable, Store } from '../../entities';
import { AdminLoginDto, AdminRegisterDto, TableLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    @InjectRepository(StoreTable) private readonly tableRepo: Repository<StoreTable>,
    @InjectRepository(Store) private readonly storeRepo: Repository<Store>,
    private readonly jwtService: JwtService,
  ) {}

  async registerAdmin(dto: AdminRegisterDto) {
    const store = await this.storeRepo.findOne({ where: { storeCode: dto.storeCode } });
    if (!store) throw new UnauthorizedException('매장을 찾을 수 없습니다.');

    const hashed = await bcrypt.hash(dto.password, 10);
    const admin = this.adminRepo.create({
      username: dto.username,
      password: hashed,
      storeId: store.id,
    });
    await this.adminRepo.save(admin);
    return { message: '관리자 등록 완료' };
  }

  async adminLogin(dto: AdminLoginDto) {
    const store = await this.storeRepo.findOne({ where: { storeCode: dto.storeCode } });
    if (!store) throw new UnauthorizedException('매장 또는 인증 정보가 올바르지 않습니다.');

    const admin = await this.adminRepo
      .createQueryBuilder('admin')
      .addSelect('admin.password')
      .where('admin.username = :username', { username: dto.username })
      .andWhere('admin.storeId = :storeId', { storeId: store.id })
      .getOne();
    if (!admin) throw new UnauthorizedException('매장 또는 인증 정보가 올바르지 않습니다.');

    // 잠금 확인
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      throw new ForbiddenException('로그인 시도 횟수 초과. 잠시 후 다시 시도해주세요.');
    }

    const isValid = await bcrypt.compare(dto.password, admin.password);
    if (!isValid) {
      admin.loginAttempts += 1;
      if (admin.loginAttempts >= 5) {
        admin.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15분 잠금
        admin.loginAttempts = 0;
      }
      await this.adminRepo.save(admin);
      throw new UnauthorizedException('매장 또는 인증 정보가 올바르지 않습니다.');
    }

    // 성공 시 초기화
    admin.loginAttempts = 0;
    admin.lockedUntil = null;
    await this.adminRepo.save(admin);

    const payload = { sub: admin.id, storeId: store.id, role: 'admin' };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async tableLogin(dto: TableLoginDto) {
    const store = await this.storeRepo.findOne({ where: { storeCode: dto.storeCode } });
    if (!store) throw new UnauthorizedException('매장 또는 테이블 정보가 올바르지 않습니다.');

    const table = await this.tableRepo
      .createQueryBuilder('table')
      .addSelect('table.password')
      .where('table.tableNumber = :tableNumber', { tableNumber: dto.tableNumber })
      .andWhere('table.storeId = :storeId', { storeId: store.id })
      .getOne();
    if (!table) throw new UnauthorizedException('매장 또는 테이블 정보가 올바르지 않습니다.');

    const isValid = await bcrypt.compare(dto.password, table.password);
    if (!isValid) throw new UnauthorizedException('매장 또는 테이블 정보가 올바르지 않습니다.');

    const payload = {
      sub: table.id,
      storeId: store.id,
      tableNumber: table.tableNumber,
      sessionId: table.sessionId,
      role: 'table',
    };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
