import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Admin, StoreTable, Store } from '../../entities';
import { AdminLoginDto, AdminRegisterDto, TableLoginDto } from './dto/admin-login.dto';
export declare class AuthService {
    private readonly adminRepo;
    private readonly tableRepo;
    private readonly storeRepo;
    private readonly jwtService;
    constructor(adminRepo: Repository<Admin>, tableRepo: Repository<StoreTable>, storeRepo: Repository<Store>, jwtService: JwtService);
    registerAdmin(dto: AdminRegisterDto): Promise<{
        message: string;
    }>;
    adminLogin(dto: AdminLoginDto): Promise<{
        accessToken: string;
    }>;
    tableLogin(dto: TableLoginDto): Promise<{
        accessToken: string;
    }>;
}
