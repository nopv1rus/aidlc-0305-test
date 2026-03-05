import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Admin, StoreTable, Store } from '../../entities';

jest.mock('bcrypt');

const mockStore: Partial<Store> = { id: 'store-uuid', storeCode: 'STORE001', name: '식당' };

const mockAdmin: Partial<Admin> = {
  id: 'admin-uuid',
  username: 'admin',
  password: 'hashed-pw',
  storeId: 'store-uuid',
  loginAttempts: 0,
  lockedUntil: null,
};

const mockTable: Partial<StoreTable> = {
  id: 'table-uuid',
  tableNumber: 1,
  password: 'hashed-table-pw',
  storeId: 'store-uuid',
  sessionId: 'session-123',
};

const mockAdminRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
const mockTableRepo = { findOne: jest.fn() };
const mockStoreRepo = { findOne: jest.fn() };
const mockJwtService = { sign: jest.fn().mockReturnValue('jwt-token') };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Admin), useValue: mockAdminRepo },
        { provide: getRepositoryToken(StoreTable), useValue: mockTableRepo },
        { provide: getRepositoryToken(Store), useValue: mockStoreRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    mockJwtService.sign.mockReturnValue('jwt-token');
  });

  describe('registerAdmin', () => {
    it('should register an admin successfully', async () => {
      mockStoreRepo.findOne.mockResolvedValue(mockStore);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      mockAdminRepo.create.mockReturnValue(mockAdmin);
      mockAdminRepo.save.mockResolvedValue(mockAdmin);

      const result = await service.registerAdmin({
        storeCode: 'STORE001', username: 'admin', password: 'pass123',
      });
      expect(result).toEqual({ message: '관리자 등록 완료' });
    });

    it('should throw UnauthorizedException if store not found', async () => {
      mockStoreRepo.findOne.mockResolvedValue(null);
      await expect(service.registerAdmin({
        storeCode: 'INVALID', username: 'admin', password: 'pass',
      })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('adminLogin', () => {
    it('should return accessToken on valid credentials', async () => {
      mockStoreRepo.findOne.mockResolvedValue(mockStore);
      mockAdminRepo.findOne.mockResolvedValue({ ...mockAdmin });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockAdminRepo.save.mockResolvedValue(mockAdmin);

      const result = await service.adminLogin({
        storeCode: 'STORE001', username: 'admin', password: 'pass123',
      });
      expect(result).toEqual({ accessToken: 'jwt-token' });
    });

    it('should throw UnauthorizedException if store not found', async () => {
      mockStoreRepo.findOne.mockResolvedValue(null);
      await expect(service.adminLogin({
        storeCode: 'INVALID', username: 'admin', password: 'pass',
      })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if admin not found', async () => {
      mockStoreRepo.findOne.mockResolvedValue(mockStore);
      mockAdminRepo.findOne.mockResolvedValue(null);
      await expect(service.adminLogin({
        storeCode: 'STORE001', username: 'wrong', password: 'pass',
      })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException if account is locked', async () => {
      mockStoreRepo.findOne.mockResolvedValue(mockStore);
      mockAdminRepo.findOne.mockResolvedValue({
        ...mockAdmin,
        lockedUntil: new Date(Date.now() + 60000),
      });
      await expect(service.adminLogin({
        storeCode: 'STORE001', username: 'admin', password: 'pass',
      })).rejects.toThrow(ForbiddenException);
    });

    it('should increment loginAttempts on wrong password', async () => {
      const admin = { ...mockAdmin, loginAttempts: 0 };
      mockStoreRepo.findOne.mockResolvedValue(mockStore);
      mockAdminRepo.findOne.mockResolvedValue(admin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockAdminRepo.save.mockResolvedValue(admin);

      await expect(service.adminLogin({
        storeCode: 'STORE001', username: 'admin', password: 'wrong',
      })).rejects.toThrow(UnauthorizedException);
      expect(admin.loginAttempts).toBe(1);
    });

    it('should lock account after 5 failed attempts', async () => {
      const admin = { ...mockAdmin, loginAttempts: 4 };
      mockStoreRepo.findOne.mockResolvedValue(mockStore);
      mockAdminRepo.findOne.mockResolvedValue(admin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockAdminRepo.save.mockResolvedValue(admin);

      await expect(service.adminLogin({
        storeCode: 'STORE001', username: 'admin', password: 'wrong',
      })).rejects.toThrow(UnauthorizedException);
      expect(admin.lockedUntil).toBeTruthy();
      expect(admin.loginAttempts).toBe(0);
    });
  });

  describe('tableLogin', () => {
    it('should return accessToken on valid table credentials', async () => {
      mockStoreRepo.findOne.mockResolvedValue(mockStore);
      mockTableRepo.findOne.mockResolvedValue(mockTable);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.tableLogin({
        storeCode: 'STORE001', tableNumber: 1, password: 'table-pass',
      });
      expect(result).toEqual({ accessToken: 'jwt-token' });
    });

    it('should throw UnauthorizedException if store not found', async () => {
      mockStoreRepo.findOne.mockResolvedValue(null);
      await expect(service.tableLogin({
        storeCode: 'INVALID', tableNumber: 1, password: 'pass',
      })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if table not found', async () => {
      mockStoreRepo.findOne.mockResolvedValue(mockStore);
      mockTableRepo.findOne.mockResolvedValue(null);
      await expect(service.tableLogin({
        storeCode: 'STORE001', tableNumber: 99, password: 'pass',
      })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      mockStoreRepo.findOne.mockResolvedValue(mockStore);
      mockTableRepo.findOne.mockResolvedValue(mockTable);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.tableLogin({
        storeCode: 'STORE001', tableNumber: 1, password: 'wrong',
      })).rejects.toThrow(UnauthorizedException);
    });
  });
});
